import db from '@/mongo/db'
import mongoose from 'mongoose'
import {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import axios from 'axios'
import {serverErrRes, notFoundRes, unauthRes} from '@/mongo/controls/responses'
import Item from '@/mongo/schemas/ItemSchema'
import Section from '@/mongo/schemas/SectionSchema'
import Checkbox from '@/mongo/schemas/CheckboxSchema'
import {PermissionCodes, permission} from '@/fx/ui'
import {findItem} from '@/mongo/controls/member/project/items/findItem'

export const deleteCheckbox = async (req: NextApiRequest, res: NextApiResponse) => {
  const {itemId, checkboxId, sectionId} = req.query

  const authSession = await getServerSession(req, res, authOptions)
  await db.connect()
  if (!authSession) return unauthRes(res, 'You are not logged in')
  let item = await Item.findById(itemId)

  if (!item) return notFoundRes(res, 'Item not found')

  let feItem: any = await JSON.stringify(item)
  feItem = await JSON.parse(feItem)

  const hasPermission = permission({
    code: PermissionCodes.ITEM_OWNER,
    member: {id: authSession.user.id, email: 'grot@grot.com'},
    item: feItem,
  })

  if (!hasPermission) return unauthRes(res, 'You do not have permission to delete this checkbox')
  let checkbox = await Checkbox.findById(checkboxId)
  if (!checkbox) return notFoundRes(res, 'Checkbox not found')

  const section = await Section.findById(sectionId)
  if (!section) return notFoundRes(res, 'Section not found')
  const dbSession = await mongoose.startSession()

  try {
    dbSession.startTransaction()
    await Checkbox.deleteOne({_id: checkboxId})
    await section.checkboxes.pull(section)
    await item.save({dbSession})
    await dbSession.commitTransaction()
    item = await findItem(section.itemid)
    dbSession.endSession()
  } catch (e) {
    await dbSession.abortTransaction()
    dbSession.endSession()
    console.log(e)
    serverErrRes(res, 'Error deleting checkbox')
  }

  await db.disconnect()
  res.status(axios.HttpStatusCode.Ok).json({
    message: 'Checkbox was deleted',
    item,
  })
}
