import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagtype: { type: mongoose.Types.ObjectId, required: true, ref: 'tagtypes' },
});

const Tag = mongoose.models.tags || mongoose.model('tags', tagSchema);

export default Tag;
