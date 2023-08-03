import db from '@/mongo/db'

import Member from '@/mongo/schemas/MemberSchema'
import Project from '@/mongo/schemas/ProjectSchema'

import {Project as ProjectInterface} from '@/interfaces/ProjectInterface'
import {Member as MemberInterface} from '@/interfaces/MemberInterface'

export const findMember = async (email: string | null | undefined) => {
  await db.connect()
  let dbMember = await Member.findOne({email})

  if (!dbMember) {
    return false
  }

  await db.disconnect()
  dbMember = await dbMember.toObject({getters: true, flattenMaps: true})
  dbMember = JSON.stringify(dbMember)
  const member: MemberInterface = await JSON.parse(dbMember)

  return member
}

export const findMemberProjects = async (memberId: string) => {
  await db.connect()

  let dbProjects = await Project.find({
    $and: [{archive: {$ne: true}}],
    $or: [{leader: memberId}, {admins: memberId}, {members: memberId}],
  })

  await db.disconnect()

  dbProjects = dbProjects.map((p: any) => p.toObject({getters: true, flattenMaps: true}))
  const strProjects: string = JSON.stringify(dbProjects)
  const projects: ProjectInterface[] = await JSON.parse(strProjects)

  return projects
}

// QA done 8-1-23
