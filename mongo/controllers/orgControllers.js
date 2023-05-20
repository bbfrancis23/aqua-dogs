import db from '/mongo/db';

import Item from '../schemas/ItemSchema';
import Tag from '/mongo/schemas/TagSchema';
import Section from '/mongo/schemas/SectionSchema';
import Member from '/mongo/schemas/MemberSchema';

import Organization from '/mongo/schemas/OrganizationSchema';
import { flattenMember } from './memberControllers';

import { flattenTag } from './tagsControllers';

import mongoose from 'mongoose';

export const flattenOrg = async (org) => {
  org = await org.toObject({ getters: true, flattenMaps: true });

  delete org._id;

  org.leader = await flattenMember(org.leader, true);

  let tempAdmins = [];

  for (let admin of org.admins) {
    admin = await flattenMember(admin, true);
    tempAdmins.push(admin);
  }

  org.admins = tempAdmins;

  let tempMembers = [];

  for (let member of org.members) {
    member = await flattenMember(member, true);
    tempMembers.push(member);
  }

  org.members = tempMembers;

  let tempTags = [];
  for (let tag of org.tags) {
    tag = await flattenTag(tag);
    tempTags.push(tag);
  }

  org.tags = tempTags;
  return org;
};

export const getOrg = async (orgId) => {
  let org = null;

  await db.connect();

  org = await Organization.findById(orgId)
    .populate({ path: 'leader', model: Member })
    .populate({ path: 'admins', model: Member })
    .populate({ path: 'tags', model: Tag })
    .populate({ path: 'members', model: Member });

  org = await flattenOrg(org);

  await db.disconnect();

  return org;
};

export const createOrgTag = async (org, title) => {
  await db.connect();

  if (org && title) {
    const dbSession = await mongoose.startSession();
    try {
      dbSession.startTransaction();

      const newTag = new Tag({ title });
      await newTag.save({ dbSession });

      await org.tags.push(newTag);

      await org.save({ dbSession });
      await dbSession.commitTransaction();
    } catch (e) {
      await dbSession.abortTransaction();
      dbSession.endSession();
      throw new Error({ message: `Error: ${e}` });
    }
  } else {
    throw new Error({ message: 'Missing Data' });
  }

  await db.disconnect();

  return org;
};
