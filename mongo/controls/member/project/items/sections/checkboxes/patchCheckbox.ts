import db from '@/mongo/db'
import {NextApiRequest, NextApiResponse} from 'next/types'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import {findItem} from '@/mongo/controls/member/project/items/findItem'
import axios from 'axios'
import {findProject} from '@/mongo/controls/member/project/projectControls'
import {
  internalServerErrorResponse,
  notFoundResponse,
  serverErrRes,
  unauthorizedResponse,
} from '@/mongo/controls/responses'
import Item from '@/mongo/schemas/ItemSchema'
import Comment from '@/mongo/schemas/CommentSchema'
import Section from '@/mongo/schemas/SectionSchema'
import SectionType from '@/mongo/schemas/SectionTypeSchema'
import Member from '@/mongo/schemas/MemberSchema'
import {PermissionCodes, permission} from 'fx/ui/PermissionComponent'
import {SectionTypes} from '@/react/section'
import Checkbox from '@/mongo/schemas/CheckboxSchema'

/*eslint-disable */
export const patchCheckbox = async (req: NextApiRequest, res: NextApiResponse) => {
  const {itemId, sectionId, projectId, checkboxId} = req.query
  const {value, label} = req.body

  console.log('patchCheckbox called')

  const authSession = await getServerSession(req, res, authOptions)
  await db.connect()
  // if (!authSession) {
  //   unauthorizedResponse(res, 'You have not been Authenticated')
  //   return
  // }

  console.log('valid authsession')

  let item = null
  try {
    item = await Item.findById(itemId).populate([
      {path: 'sections', model: Section},
      {path: 'comments', model: Comment, populate: {path: 'owner', model: Member}},
    ])
  } catch (e) {
    console.log(e)
    return serverErrRes(res, 'Error finding item')
  }

  if (!item) {
    console.log('item not found')
    return notFoundResponse(res, 'Item not found')
  }

  console.log('valid item')
  //console.log('item', item)
  if (!projectId) return notFoundResponse(res, 'Project not found')
  console.log('valid projectId')

  const project = await findProject(projectId as string)

  if (!project) return notFoundResponse(res, 'Project not found')

  console.log('valid project')
  //console.log('project', project)

  let feItem: any = JSON.stringify(item)
  feItem = await JSON.parse(feItem)
  let feProject: any = JSON.stringify(project)
  feProject = await JSON.parse(feProject)
  let hasPermission = false

  console.log('valid feItem')

  if (label) {
    hasPermission = permission({
      code: PermissionCodes.ITEM_OWNER,
      member: {id: authSession.user.id, email: 'grot@grot.com'},
      item: feItem,
    })
  }
  console.log('valid label')

  if (value === true || value === false) {
    hasPermission = permission({
      code: PermissionCodes.PROJECT_MEMBER,
      member: {id: authSession.user.id, email: 'grot@grot.com'},
      project,
    })
  }
  console.log('check permissions')

  let section = null
  try {
    section = await Section.findById(sectionId).populate({
      path: 'sectiontype',
      model: SectionType,
    })
  } catch (e) {
    console.log(e)
    return serverErrRes(res, 'Error finding section')
  }

  console.log('section', section)

  console.log('finding section')
  console.log('section', section)

  const {CHECKLIST} = SectionTypes

  if (!section || section.sectiontype.id !== CHECKLIST)
    return notFoundResponse(res, 'Section is not a checklist')

  console.log('valid section')

  if (!hasPermission) return unauthorizedResponse(res, 'You do not have permission to edit this ')

  console.log('has permission')
  let checkbox = await Checkbox.findById(checkboxId)
  if (!checkbox) notFoundResponse(res, 'Checkbox not found')

  if (label) checkbox.label = label

  if (value === true || value === false) checkbox.value = value

  try {
    await checkbox.save()
    item = await findItem(section.itemid)
  } catch (e) {
    console.log(e)
    internalServerErrorResponse(res, 'Error patching checkbox')
    return
  }

  await db.disconnect()
  res.status(axios.HttpStatusCode.Ok).json({
    message: 'Checkbox was updated was saved',
    item,
  })
}
