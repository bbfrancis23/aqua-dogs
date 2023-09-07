import db from '@/mongo/db'
import Item from '@/mongo/schemas/ItemSchema'
import Section from '@/mongo/schemas/SectionSchema'

export const findItem = async (itemId: string) => {
  await db.connect()

  let item: any = undefined

  try {
    console.log('itemId', itemId)
    item = await Item.findById(itemId).populate({
      path: 'sections',
      model: Section,
    })
    await db.disconnect()

    console.log('item', item)
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
