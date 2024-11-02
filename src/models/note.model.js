import mongoose from 'mongoose'
import { userConnection } from '../helpers/db_connect.js'

const schema = mongoose.Schema
const NoteSchema = new schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
})

export default userConnection.model('notes', NoteSchema)
