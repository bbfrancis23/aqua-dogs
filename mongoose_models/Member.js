import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Member =
  mongoose.models.members || mongoose.model('members', memberSchema);

export default Member;
