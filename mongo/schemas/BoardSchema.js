import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  project: { type: mongoose.Types.ObjectId, required: false, ref: 'projects' },
});

const Board = mongoose.models.boards || mongoose.model('boards', boardSchema);

export default Board;
