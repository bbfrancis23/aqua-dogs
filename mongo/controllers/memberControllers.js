import db from '/mongo/db';
import Member from '/mongo/schemas/MemberSchema';
import Role from '/mongo/schemas/RoleSchema';

import Organization from '/mongo/schemas/OrganizationSchema';

import axios from 'axios';
import mongoose from 'mongoose';

import { ObjectId } from 'mongodb';

export const flattenMember = (member, basic = false) => {
  delete member._id;

  if (member.roles) {
    member.roles = member.roles.map((r) => r.toString());
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

  let orgs = {};

  orgs = await Organization.find({
    $or: [{ leader: memberId }, { members: memberId }],
  });

  await db.disconnect();

  return orgs;
};

export const getMembers = async () => {
  await db.connect();

  let members = null;

  members = await Member.find();

  if (members) {
    members = await members.map((m) => {
      m = m.toObject({ getters: true });
      m = flattenMember(m, true);
      return m;
    });
  }

  await db.disconnect();

  return members;
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
