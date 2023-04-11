import mongoose, { mongo } from 'mongoose';

const orgSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  leader: { type: mongoose.Types.ObjectId, required: false, ref: 'members' },
  admins: [{ type: mongoose.Types.ObjectId, required: false, ref: 'members' }],
  members: [{ type: mongoose.Types.ObjectId, required: false, ref: 'members' }],
  tags: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Tag' }],
});

const Organization =
  mongoose.models.organizations || mongoose.model('organizations', orgSchema);

export default Organization;
