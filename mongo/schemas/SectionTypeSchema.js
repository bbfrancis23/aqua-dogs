import mongoose from 'mongoose';

const sectionTypeSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

const SectionType =
  mongoose.models.sectiontypes ||
  mongoose.model('sectiontypes', sectionTypeSchema);

export default SectionType;
