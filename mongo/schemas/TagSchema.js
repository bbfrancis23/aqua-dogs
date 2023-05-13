import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
  scope: { type: String, required: true, default: 'private' },
  tagtype: { type: mongoose.Types.ObjectId, required: false, ref: 'tagtypes' },
  tagCols: [{ type: String, required: true, default: [] }],
});

const Tag = mongoose.models.tags || mongoose.model('tags', tagSchema);

export default Tag;
