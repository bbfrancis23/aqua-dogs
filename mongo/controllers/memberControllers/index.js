import db from '/mongo/db'
import Member from '/mongo/schemas/MemberSchema'
import Role from '/mongo/schemas/RoleSchema'

import Organization from '/mongo/schemas/OrganizationSchema'

import Project from '/mongo/schemas/ProjectSchema'

import axios from 'axios'
import mongoose from 'mongoose'
import {ObjectId} from 'mongodb'
import {flattenOrg} from '../orgControllers'

export const getMemberOrgs = async (memberId) => {
  await db.connect()

  let orgs = []

  orgs = await Organization.find({
    $or: [{leader: memberId}, {members: memberId}],
  })

  await db.disconnect()

  orgs = orgs.map((o) => ({id: o._id.toString(), title: o.title}))

  return orgs
}

export const getMemberProjects = async (memberId) => {
  await db.connect()

  let projects = []

  projects = await Project.find({
    $and: [{archive: {$ne: true}}],
    $or: [{leader: memberId}, {admins: memberId}, {members: memberId}],
  })

  await db.disconnect()

  projects = projects.map((p) => ({id: p._id.toString(), title: p.title}))

  return projects
}

export const getMembers = async () => {
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

// QA this
export const getMember = async (email) => {
  let status = 200
  let message = 'found member'
  let member = null

  await db.connect()

  try {
    member = await Member.findOne({email}).populate({
      path: 'roles',
      model: Role,
    })
  } catch (e) {
    message = `Error finding Member: ${e}`
    status = 500
  }

  await db.disconnect()

  if (status === 200) {
    if (member) {
      member = await member.toObject({getters: true, flattenMaps: true})

      member = await JSON.stringify(member)
      member = await JSON.parse(member)
    } else {
      status = 404
      message = `Member: ${email} not found.`
    }
  }

  return {
    status,
    message,
    member: member ? member : undefined,
  }
}
