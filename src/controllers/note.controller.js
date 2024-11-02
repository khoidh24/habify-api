import Note from '../models/note.model.js'
import User from '../models/user.model.js'
import createError from 'http-errors'

const NoteController = {
  // Get all notes for a user
  getNoteList: async (req, res, next) => {
    try {
      const userId = req.payload.userId
      const notes = await Note.find({ user: userId })
      res.json(notes)
    } catch (error) {
      next(error)
    }
  },

  // Get a specific note by ID
  getSpecificNote: async (req, res, next) => {
    try {
      const { noteId } = req.params
      const userId = req.payload.userId
      const note = await Note.findOne({ _id: noteId, user: userId })
      if (!note) {
        throw createError(404, 'Note not found')
      }
      res.json(note)
    } catch (error) {
      next(error)
    }
  },

  // Create a new note
  createNote: async (req, res, next) => {
    try {
      const { title, content } = req.body
      const userId = req.payload.userId

      const newNote = new Note({
        title,
        content,
        user: userId
      })

      const savedNote = await newNote.save()

      // Add note to user's noteList
      await User.findByIdAndUpdate(userId, {
        $push: { noteList: savedNote._id }
      })

      res.status(201).json(savedNote)
    } catch (error) {
      next(error)
    }
  },

  // Update an existing note
  updateNote: async (req, res, next) => {
    try {
      const { noteId } = req.params
      const { title, content } = req.body
      const userId = req.payload.userId

      const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId, user: userId },
        { title, content },
        { new: true }
      )

      if (!updatedNote) {
        throw createError(404, 'Note not found')
      }

      res.json(updatedNote)
    } catch (error) {
      next(error)
    }
  },

  // Delete a note
  deleteNote: async (req, res, next) => {
    try {
      const { noteId } = req.params
      const userId = req.payload.userId

      const deletedNote = await Note.findOneAndDelete({
        _id: noteId,
        user: userId
      })

      if (!deletedNote) {
        throw createError(404, 'Note not found')
      }

      // Remove note from user's noteList
      await User.findByIdAndUpdate(userId, { $pull: { noteList: noteId } })

      res.json({ message: 'Note deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export default NoteController
