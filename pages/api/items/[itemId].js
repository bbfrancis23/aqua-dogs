import db from "/mongo/db"
import Item from "/mongo/schemas/ItemSchema"
import Tag from "/mongo/schemas/TagSchema"
import Section from "/mongo/schemas/SectionSchema"
import {getSession} from "next-auth/react"
import {ObjectId} from "mongodb"

import mongoose from "mongoose"
import {getItem} from "../../../mongo/controllers/itemOld"

export default async function handler(req, res) {
  const {itemId} = req.query

  if (req.method === "PATCH" || req.method === "DELETE") {
    let status = 200
    let message = ""

    await db.connect()

    let item

    try {
      item = await Item.findById(itemId)
        .populate({path: "tags", model: Tag})
        .populate({path: "sections", model: Section})
    } catch (e) {
      message = `Error finding Item: ${e}`
      status = 500
    }

    if (status === 200) {
      if (item) {
        if (req.method === "PATCH" || req.method === "DELETE") {
          const session = await getSession({req: req})

          const isSiteAdmin = session?.user.roles.includes("SiteAdmin")

          if (isSiteAdmin) {
            if (req.method === "PATCH") {
              const {title, tags} = req.body

              if (title) {
                item.title = title
              }

              if (tags) {
                item.tags = tags
              }

              try {
                await item.save()
                item = await Item.findById(itemId)
                  .populate({path: "tags", model: Tag})
                  .populate({path: "sections", model: Section})
              } catch (e) {
                status = 500
                message = `Updating Item failed: ${e}`
              }
            } else if (req.method === "DELETE") {
              const session = await mongoose.startSession()

              try {
                session.startTransaction()

                await item.sections.forEach((s) => {
                  Section.deleteOne({_id: s._id.toString()})
                })

                await Item.deleteOne({_id: ObjectId(itemId.toString())})
                session.endSession()
              } catch (e) {
                await session.abortTransaction()
                session.endSession()

                status = 500
                message: `Error deleting Item: ${e}`
              }
            }
          } else {
            status = 401
            message = "Not Authenticated."
          }
        }
      } else {
        status === 404
        message = `Item: ${itemId} not found.`
      }
    }

    await db.disconnect()
    res.status(status).json({
      message: message,
      item: item ? item.toObject({getters: true}) : undefined,
    })
    return
  } else if (req.method === "GET") {
    const result = await getItem(itemId)

    res.status(result.status).json({
      message: result.message,
      item: result.item,
    })
    return
  }
  return
}
