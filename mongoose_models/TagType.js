import mongoose from 'mongoose';

const tagTypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const TagType =
  mongoose.models.tagtypes || mongoose.model('tagtypes', tagTypeSchema);

export default TagType;
