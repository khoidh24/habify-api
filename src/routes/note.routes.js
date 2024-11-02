import express, { Router } from 'express'
import { verifyAccessToken } from '../helpers/protect_route.js'
import NoteController from '../controllers/note.controller.js'

const router = express.Router()

// GET NOTE
router.get('/', verifyAccessToken, NoteController.getNoteList)

// GET NOTE BY ID
router.get('/:noteId', verifyAccessToken, NoteController.getSpecificNote)

// CREATE NOTE
router.post('/create', verifyAccessToken, NoteController.createNote)

// UPDATE NOTE
router.put('/update/:noteId', verifyAccessToken, NoteController.updateNote)

// DELETE NOTE
router.delete('/delete/:noteId', verifyAccessToken, NoteController.deleteNote)

export default router
