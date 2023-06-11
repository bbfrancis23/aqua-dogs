import mongoose, { mongo } from 'mongoose';

const projSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  leader: { type: mongoose.Types.ObjectId, required: true, ref: 'members' },
  admins: [{ type: mongoose.Types.ObjectId, required: false, ref: 'members' }],
  members: [{ type: mongoose.Types.ObjectId, required: false, ref: 'members' }],
});

const Project =
  mongoose.models.projects || mongoose.model('projects', projSchema);

export default Project;
