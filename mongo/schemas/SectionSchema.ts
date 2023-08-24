import mongoose from "mongoose"

const sectionSchema = new mongoose.Schema({
  content: {type: String},
  order: {type: Number},
  sectiontype: {
    type: mongoose.Types.ObjectId,
    ref: "sectiontypes",
  },
  itemid: {type: mongoose.Types.ObjectId, required: true, ref: "items"},
})

const Section =
  mongoose.models.sections || mongoose.model("sections", sectionSchema)

export default Section
