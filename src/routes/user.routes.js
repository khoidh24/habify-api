import express, { Router } from 'express'
import UserController from '../controllers/user.controller.js'

const router = express.Router()

// REGISTER
router.post('/register', UserController.register)

// LOGIN
router.post('/login', UserController.login)

// LOGOUT
router.delete('/logout', UserController.logout)

// REFRESH TOKEN
router.post('/refresh-token', UserController.refreshToken)

export default router
