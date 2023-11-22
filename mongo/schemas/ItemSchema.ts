import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  title: {type: String},
  sections: [{type: mongoose.Types.ObjectId, required: false, ref: 'sections'}],
  upvotes: [{type: String, required: false}],
  downvotes: [{type: String, required: false}],
  owners: [{type: mongoose.Types.ObjectId, required: false, ref: 'members'}],
  scope: {type: String},
  worth: {type: String, required: false},
  complexity: {type: String, required: false},
  priority: {type: String, required: false},
  archive: {type: Boolean, required: true, default: false},
  comments: [{type: mongoose.Types.ObjectId, required: false, ref: 'comments'}],
})

const Item = mongoose.models.items || mongoose.model('items', itemSchema)

export default Item

// QA done
