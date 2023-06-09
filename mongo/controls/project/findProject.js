import db from '/mongo/db';

import Member from '/mongo/schemas/MemberSchema';
import Project from '/mongo/schemas/ProjectSchema';

import { basicMemberFields } from '/mongo/controls/member/member.js';

import mongoose from 'mongoose';

export const findProject = async (id) => {
  let project = null;

  await db.connect();

  project = await Project.findOne({ _id: id })
    .populate('leader', '-password -authCode')
    .populate('admins', '-password -authCode')
    .populate('members', '-password -authCode');

  project = await project.toObject({
    getters: true,
  });
  project = await JSON.stringify(project);
  project = await JSON.parse(project);
  await db.disconnect();

  return project;
};
