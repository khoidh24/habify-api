import express from 'express'
import createError from 'http-errors'
import UserRoute from './routes/user.routes.js'
import NoteRoute from './routes/note.routes.js'
const app = express()

app.get('/', (req, res, next) => {
  res.send('Hello World')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/note', NoteRoute)
app.use('/', UserRoute)

app.use((req, res, next) => {
  next(createError(404, 'This route does not exist.'))
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message
  })
})

export default app
