const express = require('express')
// const { chats } = require('./data/data')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const app = express()
const colors = require('colors')
const userRoutes = require('./Routes/userRoutes')
const chatRoutes = require('./Routes/chatRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const notificationRoutes = require('./Routes/notificationRoutes')
const { errorHandler, notFound } = require('./Middleware/errorMiddleware')

dotenv.config()
connectDB()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('api is run')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/notifs', notificationRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(5000, () => {
  console.log(`Server Started Port ${PORT}`.bgGreen.america)
})

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  //to shutdown socket if user dont be sending message for a minute
  cors: { origin: 'http://localhost:3000' }
  //proxy alternative
})

io.on('connection', (socket) => {
  const globalRoom = 'gay'
  console.log('Connected to Socket.io'.bgBlack.cyan)
  // ^ connecting to socket
  // .on does that basically initialization

  //now creating personal socket for each user
  socket.on('setup', (userData) => {
    socket.join(userData._id) //adds sockets to the given room
    socket.emit('connected')
    //socket.emit allows you to emit custom events on the server to client a nnd vice versa
    socket.join(globalRoom) //every user joins the gay
    console.log(userData._id + ' JOINED : ' + globalRoom)
  })

  socket.on('join chat', (room) => {
    socket.join(room)
  })

  socket.on('typing', (room) => {
    socket.in(room).emit('typing')
  })

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing')
  })

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat
    //taking out chat id from the message data
    if (!chat.users) return console.log('chat.users not defined')
    //gay

    chat.users.forEach((user) => {
      //update real time message for everyone in chat except for us
      if (user._id == newMessageReceived.sender._id) return

      socket.in(user._id).emit('message received', newMessageReceived)
      //socket.in is really fucking stupid
      // nvm it only sends message to users in a certain room
    })
  })

  socket.on('get chat', (newChatReceived) => {
    console.log('New Chat Reeived sockket', newChatReceived)
    if (!newChatReceived.users) return console.log('Users Not Defined')
    socket.broadcast.to(globalRoom).emit('new chats', newChatReceived)
    // io.in(globalRoom).emit('new chats', newChatReceived)
  })

  socket.off('setup', () => {
    console.log('User Disconnected')
    socket.leave(userData._id)
  })
})
