import mongoose from 'mongoose';

const colSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const Column = mongoose.models.columns || mongoose.model('columns', tagSchema);

export default Column;
