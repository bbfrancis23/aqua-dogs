import db from '/mongo/db'
import {getSession} from 'next-auth/react'
import Member from '../../schemas/MemberSchema'

import mongoose from 'mongoose'

import {getMember} from '/mongo/controllers/memberControllers'

import axios from 'axios'

export const createMemberTag = async (req, res) => {
  const session = await getSession({req})

  let status = axios.HttpStatusCode.Ok
  let message = ''
  let member = undefined

  await db.connect()

  if (session) {
    if (req.body.addTag) {
      member = await Member.findOne({email: session?.user?.email})
      if (member) {
        const dbSession = await mongoose.startSession()
        try {
          dbSession.startTransaction()

          await newTag.save({dbSession})
          await member.tags.push(newTag)
          await member.save({dbSession})
          await dbSession.commitTransaction()
        } catch (e) {
          await dbSession.abortTransaction()
          dbSession.endSession()
          status = axios.HttpStatusCode.InternalServerError
          message = e

          console.log('error', e)
        }
        const result = await getMember(session.user.email)
        if (result.member) {
          member = {
            email: result.member.email,
            name: result.member.name ? result.member.name : '',
            roles: result.member.roles,
            tags: result.member.tags,
            id: result.member.id,
          }
        }
      } else {
        status = axios.HttpStatusCode.NotFound
      }
    } else {
      status = axios.HttpStatusCode.Unauthorized
    }
  }

  await db.disconnect()
  res.status(status).json({
    message,
    member,
  })
  return
}
