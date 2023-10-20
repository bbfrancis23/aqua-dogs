import db from '@/mongo/db'

import Member from '@/mongo/schemas/MemberSchema'
import Project from '@/mongo/schemas/ProjectSchema'

import {Project as ProjectInterface} from '@/react/project/'
import {Member as MemberInterface} from '@/react/members/member-types'
import {NextApiRequest, NextApiResponse} from 'next'

import {getSession} from 'next-auth/react'

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

export const updateMember = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req})

  if (!session) {
    res.status(401).json({message: 'Not Authenticated'})
    return
  }

  await db.connect()
  let member = await Member.findOne({email: session?.user?.email})

  if (!member) {
    await db.disconnect()
    res.status(404).json({message: 'Member not found'})
    return
  }

  let updateOptions = undefined

  if (req.body.memberName) {
    updateOptions = {name: req.body.memberName}
  } else if (req.body.email) {
    const {email} = req.body

    if (!email || !email.includes('@')) {
      res.status(422).json({message: 'Invalid Input'})
      return
    }

    let existingUser: any = {}
    try {
      existingUser = await Member.findOne({email})
    } catch (error) {
      await db.disconnect()
      res.status(500).json({message: `Server Error:  ${error}`})
      return
    }

    if (existingUser) {
      await db.disconnect()
      res.status(422).json({
        message: 'Could not update email address. Member already exists.',
      })
      return
    }

    updateOptions = {email: req.body.email}
  }

  if (updateOptions) {
    try {
      member = await Member.updateOne({email: session?.user?.email}, {$set: updateOptions})
    } catch (e) {
      console.log(e)
    }
  }

  await db.disconnect()

  res.status(200).json({
    message: 'name updated',
    member,
  })
}

export const findMembers = async () => {
  await db.connect()

  let members = null

  members = await Member.find().select('_id email name')

  if (members) {
    members = await members.map((m) => {
      m = m.toObject({getters: true})
      return m
    })
  }

  await db.disconnect()

  return members
}

// QA: Brian Francis 8-10-23
