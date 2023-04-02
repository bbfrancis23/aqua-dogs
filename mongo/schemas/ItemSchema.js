import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
  title: {type: String},
  tags: [{type: mongoose.Types.ObjectId, required: false, ref: "Tag"}],
  sections: [
    {type: mongoose.Types.ObjectId, required: false, ref: "sections"},
  ],
  upvotes: [{type: String, required: false}],
  downvotes: [{type: String, required: false}],
})

const Item = mongoose.models.items || mongoose.model("items", itemSchema)

export default Item
