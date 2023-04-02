import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
  title: {type: String, required: true},
})

const Role = mongoose.models.roles || mongoose.model("roles", roleSchema)

export default Role
