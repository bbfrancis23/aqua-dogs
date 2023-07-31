import db from '/mongo/db'
import {ObjectId} from 'mongodb'
import {getSession} from 'next-auth/react'
import axios from 'axios'
import mongoose from 'mongoose'

import Item from 'mongo/schemas/ItemSchema'
import Section from '/mongo/schemas/SectionSchema'

import SectionType from '/mongo/schemas/SectionTypeSchema'
import Tag from '/mongo/schemas/TagSchema'

import {PermissionCodes, permission} from '/ui/PermissionComponent'

export const patchSection = async (req, res) => {
  const {sectionId} = req.query
  let status = axios.HttpStatusCode.Ok
  let message = ''
  let item = undefined
  let section = undefined

  await db.connect()

  const authSession = await getSession({req})

  if (authSession) {
    try {
      section = await Section.findById(sectionId).populate({
        path: 'sectiontype',
        model: SectionType,
      })
    } catch (e) {
      status = axios.HttpStatusCode.InternalServerError
      message = e
    }

    if (section) {
      try {
        item = await Item.findById(section.itemid)
      } catch (e) {
        status = axios.HttpStatusCode.InternalServerError
        message = e
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
          const {sectiontype, content} = req.body

          if (sectiontype) {
            section.sectiontype = sectiontype
          }
          if (content) {
            section.content = content
          }

          try {
            await section.save()
            item = await Item.findById(section.itemid).populate({
              path: 'sections',
              model: Section,
            })
          } catch (e) {
            status = axios.HttpStatusCode.InternalServerError
            message = e
          }
        } else {
          status = axios.HttpStatusCode.Unauthorized
          message = 'You do not have Authorization.'
        }
      }
    } else {
      status = axios.HttpStatusCode.NotFound
      message = 'Section Not found'
    }
  } else {
    status = axios.HttpStatusCode.Unauthorized
    message = 'Authentication Required.'
  }

  await db.disconnect()
  res.status(status).json({
    message,
    item: item ? item.toObject({getters: true}) : undefined,
  })
}
