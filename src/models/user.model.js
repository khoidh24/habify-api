import mongoose from 'mongoose'
import { userConnection } from '../helpers/db_connect.js'
import bcrypt from 'bcrypt'

const schema = mongoose.Schema
const UserSchema = new schema({
  username: {
    type: String
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  noteList: [
    {
      type: schema.Types.ObjectId,
      ref: 'notes',
      required: true
    }
  ]
})

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isCheckPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (err) {}
}

export default userConnection.model('users', UserSchema)
