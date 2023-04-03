import db from '/mongo/db';
import Member from '/mongo/schemas/MemberSchema';
import Role from '/mongo/schemas/RoleSchema';

export function flattenMember(member) {
  delete member._id;
  member.roles = member.roles.map((r) => {
    delete r._id;
    return r;
  });

  return member;
}

export async function getMember(email) {
  let status = 200;
  let message = 'found member';
  let member;

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
}
