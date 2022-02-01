const mongoose = require('mongoose')

const notificationModel = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }
})

const Notification = mongoose.model('Notification', notificationModel)

module.exports = Notification
