import mongoose from 'mongoose'

const checkboxSchema = new mongoose.Schema({
  label: {type: String, required: true},
  value: {type: Boolean, default: false},
  order: {type: Number},
})

const Checkbox = mongoose.models.checkboxes || mongoose.model('checkboxes', checkboxSchema)

export default Checkbox
