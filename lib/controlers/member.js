import db from '/utils/db';
import Member from '/mongoose_models/Member';
import Role from '/mongoose_models/Role';
import { ObjectId } from 'mongodb';

export async function getMember(email) {
  let status = 200;
  let message = 'found member';
  let member;

  await db.connect();

  try {
    member = await Member.findOne({ email: email }).populate({
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
      status === 404;
      message = `Member: ${email} not found.`;
    }
  }

  return {
    status: status,
    message: message,
    member: member ? member : undefined,
  };
}

export function flattenMember(member) {
  delete member._id;
  member.roles = member.roles.map((r) => {
    delete r._id;
    return r;
  });

  return member;
}
