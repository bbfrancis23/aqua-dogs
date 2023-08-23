import db from '/mongo/db'
import Member from '/mongo/schemas/MemberSchema'

import Role from '/mongo/schemas/RoleSchema'

import {getMember} from '/mongo/controllers/memberControllers'

import {getSession} from 'next-auth/react'

export const handler = async (req, res) => {
  const {itemId} = req.query

  let status = 405
  let message = 'Invalid Method'
  let isFavorite = false
  let member = null

  await db.connect()

  if (req.method === 'PATCH') {
    const session = await getSession({req})

    if (session) {
      try {
        member = await Member.findById(session.user.id).populate({
          path: 'roles',
          model: Role,
        })
      } catch (e) {
        status = 500
        message = `Server Error: ${e}`
      }

      if (member) {
        if (member.favoriteItems) {
          const favFound = member.favoriteItems.filter((i) => i !== itemId)

          if (favFound.length > 0) {
            member.favoriteItems = member.favoriteItems.filter((i) => i === itemId)
            isFavorite = false
          } else {
            await member.favoriteItems.push(itemId)
            isFavorite = true
          }
        } else {
          await member.favoriteItems.push(itemId)
        }

        await member.save()

        member = await member.toObject({getters: true, flattenMaps: true})

        status = 200
        message = 'favorite action'
      }
    }
  } else if (req.method === 'GET') {
    const session = await getSession({req})

    if (session) {
      try {
        member = await Member.findById(session.user.id).populate({
          path: 'roles',
          model: Role,
        })
      } catch (e) {
        status = 500
        message = `Server Error: ${e}`
      }

      if (member) {
        if (member.favoriteItems) {
          const favoriteFound = member.favoriteItems.filter((i) => i.toString() === itemId)

          if (favoriteFound.length > 0) {
            isFavorite = true
          }
        }
        status = 200
        message = ''
      }
    }
  }
  await db.disconnect()
  res.status(status).json({
    message,
    isFavorite,
  })
}

export default handler
