import mongoose from "mongoose";

const TagTypesSchema = new mongoose.Schema({
  title: { type: String, required: true },
});

export default mongoose.models.tagtypes ||
  mongoose.model("tagtypes", TagTypesSchema);
