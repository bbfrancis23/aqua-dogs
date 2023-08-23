import db from '/mongo/db'

import Item from '../schemas/ItemSchema'
import Section from '/mongo/schemas/SectionSchema'
import Member from '/mongo/schemas/MemberSchema'

import Organization from '/mongo/schemas/OrganizationSchema'
import {flattenMember} from './memberControllers'

import mongoose from 'mongoose'

export const getOrg = async (orgId) => {
  let org = null

  await db.connect()

  org = await Organization.findById(orgId)
    .populate({path: 'leader', model: Member})
    .populate({path: 'admins', model: Member})
    .populate({path: 'members', model: Member})

  org = await flattenOrg(org)

  await db.disconnect()

  return org
}
