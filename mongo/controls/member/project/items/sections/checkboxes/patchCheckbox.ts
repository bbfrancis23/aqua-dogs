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

  const authSession = await getServerSession(req, res, authOptions)
  await db.connect()
  // if (!authSession) {
  //   unauthorizedResponse(res, 'You have not been Authenticated')
  //   return
  // }

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

  // if (!item) {
  //   return notFoundResponse(res, 'Item not found')
  // }

  //if (!projectId) return notFoundResponse(res, 'Project not found')

  const project = await findProject(projectId as string)

  //if (!project) return notFoundResponse(res, 'Project not found')

  let feItem: any = JSON.stringify(item)
  feItem = await JSON.parse(feItem)
  let feProject: any = JSON.stringify(project)
  feProject = await JSON.parse(feProject)
  let hasPermission = false

  if (label) {
    hasPermission = permission({
      code: PermissionCodes.ITEM_OWNER,
      member: {id: authSession.user.id, email: 'grot@grot.com'},
      item: feItem,
    })
  }

  if (value === true || value === false) {
    hasPermission = permission({
      code: PermissionCodes.PROJECT_MEMBER,
      member: {id: authSession.user.id, email: 'grot@grot.com'},
      project,
    })
  }
  let section = null
  try {
    //await db.connect()
    console.log('sectionID', sectionId)

    section = await Section.findById(sectionId).populate({
      path: 'sectiontype',
      model: SectionType,
    })
  } catch (e) {
    console.log('error: ', e)
    return serverErrRes(res, 'Error finding section')
  }

  const {CHECKLIST} = SectionTypes

  if (!section || section.sectiontype.id !== CHECKLIST)
    return notFoundResponse(res, 'Section is not a checklist')

  if (!hasPermission) return unauthorizedResponse(res, 'You do not have permission to edit this ')

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
