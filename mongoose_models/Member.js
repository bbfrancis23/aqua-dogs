import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: false },
  phone: { type: String, required: false },
  emailAuth: { type: Boolean, required: false },
  phoneAuth: { type: Boolean, required: false },
  roles: [{ type: mongoose.Types.ObjectId, required: false, ref: 'roles' }],
});

const Member =
  mongoose.models.members || mongoose.model('members', memberSchema);

export default Member;
