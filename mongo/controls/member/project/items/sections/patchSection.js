import db from '/mongo/db'
import {ObjectId} from 'mongodb'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'

import Checkbox from '/mongo/schemas/CheckboxSchema'
import axios from 'axios'
import mongoose from 'mongoose'

import Item from 'mongo/schemas/ItemSchema'
import Section from '/mongo/schemas/SectionSchema'

import SectionType from '/mongo/schemas/SectionTypeSchema'

import {PermissionCodes, permission} from 'fx/ui/PermissionComponent'

import {findItem} from '/mongo/controls/member/project/items/findItem'

import {SectionTypes} from '@/react/section'

/*eslint-disable */

export const patchSection = async (req, res) => {
  const {sectionId} = req.query
  let status = axios.HttpStatusCode.Ok
  let message = ''
  let item = undefined
  let section = undefined

  const authSession = await getServerSession(req, res, authOptions)
  await db.connect()

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
          const {sectiontype, content, label} = req.body

          if (sectiontype) {
            section.sectiontype = sectiontype
          }
          if (content) {
            section.content = content
          }

          const {CODE, TEXT, CHECKLIST} = SectionTypes
          if (sectiontype === CHECKLIST) {
            if (label) {
              const newCheckbox = new Checkbox({
                label,
                order: 1,
              })

              try {
                const dbSession = await mongoose.startSession()
                dbSession.startTransaction()
                await newCheckbox.save({dbSession})
                await section.checkboxes.push(newCheckbox)
                await section.save({dbSession})
                item = await findItem(section.itemid)
                await dbSession.commitTransaction()
              } catch (e) {
                status = axios.HttpStatusCode.InternalServerError
                message = e
                console.log('error', e)
              }
            }
          } else {
            try {
              await section.save()
              item = await findItem(section.itemid)
            } catch (e) {
              status = axios.HttpStatusCode.InternalServerError
              message = e
            }
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
    item,
  })
}
