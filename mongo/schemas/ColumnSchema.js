import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Column =
  mongoose.models.columns || mongoose.model('columns', columnSchema);

export default Column;
