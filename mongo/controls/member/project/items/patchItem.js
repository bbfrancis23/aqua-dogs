import db from '/mongo/db'
import {ObjectId} from 'mongodb'
import {getSession} from 'next-auth/react'
import axios from 'axios'

import Item from '/mongo/schemas/ItemSchema'
import Tag from '/mongo/schemas/TagSchema'
import Section from '/mongo/schemas/SectionSchema'
import Project from '/mongo/schemas/ProjectSchema'

import {PermissionCodes, permission} from '/ui/PermissionComponent'

export const patchItem = async (req, res) => {
  const {itemId} = req.query
  let status = axios.HttpStatusCode.Ok
  let message = ''
  let item = undefined

  await db.connect()

  const authSession = await getSession({req})

  if (authSession) {
    try {
      item = await Item.findById(itemId).populate({
        path: 'sections',
        model: Section,
      })
    } catch (e) {
      message = e
      status = axios.HttpStatusCode.InternalServerError
    }

    if (item) {
      let feItem = await JSON.stringify(item)
      feItem = await JSON.parse(feItem)

      const hasPermission = permission({
        code: PermissionCodes.ITEM_OWNER,
        member: {id: authSession.user.id},
        item: feItem,
      })

      if (hasPermission) {
        const {title} = req.body

        if (req.method === 'DELETE') {
          item.archive = true
        } else if (title) {
          item.title = title
        }

        try {
          await item.save()
          item = await Item.findById(itemId).populate({
            path: 'sections',
            model: Section,
          })

          item = item.toObject({getters: true, flattenMaps: true})
        } catch (e) {
          console.log(e)
          status = axios.HttpStatusCode.InternalServerError
          message = e
        }
      } else {
        status = axios.HttpStatusCode.Unauthorized
        message = 'You do not have Authorization.'
      }
    } else {
      status = axios.HttpStatusCode.NotFound
      message = `Item ${itemId} not found`
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized
    message = 'Authentication Required.'
  }

  await db.disconnect()
  res.status(status).json({
    message,
    item,
  })
  return
}
