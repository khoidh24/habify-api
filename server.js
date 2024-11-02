import dotenv from 'dotenv'
dotenv.config()

import app from './src/app.js'

const PORT = parseInt(process.env.PORT || '3001', 10)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
