import mongoose from 'mongoose'

const columnSchema = new mongoose.Schema({
  title: {type: String, required: true},
  items: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      default: [],
      ref: 'items',
    },
  ],

  archive: {type: Boolean, required: true, default: false},
})

const Column = mongoose.models.columns || mongoose.model('columns', columnSchema)

export default Column
