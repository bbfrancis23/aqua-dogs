import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema({
  title: {type: String, required: true},
  project: {type: mongoose.Types.ObjectId, required: false, ref: 'projects'},
  columns: [{type: mongoose.Types.ObjectId, required: false, ref: 'columns'}],
  archive: {type: Boolean, required: true, default: false},
  scope: {type: String, required: true, default: 'PRIVATE'},
})

const Board = mongoose.models.boards || mongoose.model('boards', boardSchema)

export default Board

// QA: Brian Francis 8-13-23
