import db from '/mongo/db';
import Member from '/mongo/schemas/MemberSchema';
import Role from '/mongo/schemas/RoleSchema';

import Organization from '/mongo/schemas/OrganizationSchema';

import Project from '/mongo/schemas/ProjectSchema';

import Tag from '/mongo/schemas/TagSchema';

import axios from 'axios';
import mongoose from 'mongoose';

import { flattenTag } from '../tagsControllers';

import { ObjectId } from 'mongodb';
import { flattenOrg } from '../orgControllers';

export const flattenMember = async (member, basic = false) => {
  delete member._id;
  delete member.password;
  delete member.authTime;
  delete member.authCode;

  if (member.roles) {
    member.roles = member.roles.map((r) => r.toString());
  }

  let tempTags = [];
  for (let tag of member.tags) {
    tag = await flattenTag(tag);
    tempTags.push(tag);
  }

  if (basic) {
    member = {
      id: member.id,
      email: member.email,
      name: member.name ? member.name : '',
    };
  }

  return member;
};

export const getMemberOrgs = async (memberId) => {
  await db.connect();

  let orgs = [];

  orgs = await Organization.find({
    $or: [{ leader: memberId }, { members: memberId }],
  });

  await db.disconnect();

  orgs = orgs.map((o) => ({ id: o._id.toString(), title: o.title }));

  return orgs;
};

export const getMemberProjects = async (memberId) => {
  await db.connect();

  let projects = [];

  projects = await Project.find({
    $or: [{ leader: memberId }, { admins: memberId }, { members: memberId }],
  });

  await db.disconnect();

  projects = projects.map((p) => ({ id: p._id.toString(), title: p.title }));

  return projects;
};

export const getMembers = async () => {
  await db.connect();

  let members = null;

  members = await Member.find().select('_id email name');

  if (members) {
    members = await members.map((m) => {
      m = m.toObject({ getters: true });
      return m;
    });
  }

  await db.disconnect();

  return members;
};

export const createMemberTag = async (member, title) => {
  await db.connect();

  if (member && title) {
    const dbSession = await mongoose.startSession();

    try {
      dbSession.startTransaction();

      const newTag = new Tag({ title });
      await newTag.save({ dbSession });

      await member.tags.push(newTag);

      await member.save({ dbSession });
      await dbSession.commitTransaction();
    } catch (e) {
      console.log('there was an error', e);

      await dbSession.abortTransaction();
      dbSession.endSession();
      throw new Error({ message: `Error: ${e}` });
    }
  } else {
    throw new Error({ message: 'Missing Data' });
  }

  await db.disconnect();

  return member;
};

export const getMember = async (email) => {
  let status = 200;
  let message = 'found member';
  let member = null;

  await db.connect();

  try {
    member = await Member.findOne({ email }).populate({
      path: 'roles',
      model: Role,
    });
  } catch (e) {
    message = `Error finding Member: ${e}`;
    status = 500;
  }

  await db.disconnect();

  if (status === 200) {
    if (member) {
      member = await member.toObject({ getters: true, flattenMaps: true });
      member = await flattenMember(member);
    } else {
      status = 404;
      message = `Member: ${email} not found.`;
    }
  }

  return {
    status,
    message,
    member: member ? member : undefined,
  };
};
