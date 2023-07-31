import db from '@/mongo/db'

import Member from '@/mongo/schemas/MemberSchema'

export const findMember = async (email: string | null | undefined) => {
  await db.connect()
  let member = await Member.findOne({email})

  if (!member) {
    return false
  }

  await db.disconnect()
  member = await member.toObject({getters: true, flattenMaps: true})
  member = await JSON.stringify(member)
  member = await JSON.parse(member)

  return member
}
