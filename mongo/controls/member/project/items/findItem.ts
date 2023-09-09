import db from '@/mongo/db'
import Item from '@/mongo/schemas/ItemSchema'
import Section from '@/mongo/schemas/SectionSchema'
import Comment from '@/mongo/schemas/CommentSchema'

import Member from '@/mongo/schemas/MemberSchema'

export const findItem = async (itemId: string) => {
  await db.connect()

  let item: any = undefined

  try {
    item = await Item.findById(itemId).populate([
      {
        path: 'sections',
        model: Section,
      },
      {path: 'comments', model: Comment, populate: {path: 'owner', model: Member}},
    ])

    await db.disconnect()
  } catch (e) {
    return undefined
  }

  if (item) {
    item = await item.toObject({getters: true, flattenMaps: true})

    item = JSON.stringify(item)
    item = await JSON.parse(item)
  } else {
    item = undefined
  }

  return item
}
