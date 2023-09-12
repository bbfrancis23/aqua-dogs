import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  content: {type: String},
  sectiontype: {
    type: mongoose.Types.ObjectId,
    ref: 'sectiontypes',
  },
  itemid: {type: mongoose.Types.ObjectId, required: true, ref: 'items'},
  owner: {type: mongoose.Types.ObjectId, required: false, ref: 'members'},
})

const Comment = mongoose.models.comments || mongoose.model('comments', commentSchema)

export default Comment
