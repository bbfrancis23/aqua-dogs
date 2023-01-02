import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagtype: { type: mongoose.Schema.Types.ObjectId, ref: "tagtypes" },
});

export default mongoose.models.tags || mongoose.model("tags", TagsSchema);
