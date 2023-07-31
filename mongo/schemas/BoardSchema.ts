import mongoose from 'mongoose'

const boardSchema = new mongoose.Schema({
  title: {type: String, required: true},
  project: {type: mongoose.Types.ObjectId, required: false, ref: 'projects'},
  columns: [{type: mongoose.Types.ObjectId, required: false, ref: 'columns'}],
})

const Board = mongoose.models.boards || mongoose.model('boards', boardSchema)

export default Board

// QA done
