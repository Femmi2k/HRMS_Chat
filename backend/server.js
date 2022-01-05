const express = require('express')
const { chats } = require('./data/data')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const app = express()
const colors = require('colors')
const userRoutes = require('./Routes/userRoutes')
const { errorHandler, notFound } = require('./Middleware/errorMiddleware')

dotenv.config()
connectDB()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('api is run')
})

app.use('/api/user', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(5000, () => {
  console.log(`Server Started Port ${PORT}`.america)
})
