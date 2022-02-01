const expressAsyncHandler = require('express-async-handler')
const Chat = require('../Models/chatModel')
const Message = require('../Models/messageModel')
const Notification = require('../Models/notificationModel')
const User = require('../Models/userModel')

const saveNotification = expressAsyncHandler(async (req, res) => {
  const { notifObject } = req.body

  if (!notifObject) {
    res.status(400)
    throw new Error('No Notification object')
  }

  if (!req.user) {
    res.status(400)
    throw new Error('No User Id Provided')
  }

  var newNotif = {
    user: req.user._id,
    message: notifObject,
    chat: notifObject.chat
  }

  try {
    var notif = await Notification.create(newNotif)

    notif = await notif.populate('message', 'sender content')
    notif = await notif.populate('chat', 'chatName isGroupChat')
    notif = await User.populate(notif, {
      path: 'message.sender',
      select: 'name pic'
    })

    res.json(notif)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const deleteNotification = expressAsyncHandler(async (req, res) => {
  const notificationId = req.params.notificationId

  if (!notificationId) {
    res.status(400)
    throw new Error('Params Not Supplied')
  }
  var removed = await Notification.deleteMany({ chat: notificationId })
    .populate('message', 'sender content')
    .populate('chat', 'chatName isGroupChat')
  removed = await User.populate(removed, {
    path: 'message.sender',
    select: 'name pic'
  })

  if (!removed) {
    res.status(404)
    throw new Error('The desired Notification does not exist')
  } else {
    message1: 'Redirected to origin chat'
    res.json(removed)
  }
})

const getAllNotifications = expressAsyncHandler(async (req, res) => {
  var allNotifs = Notification.find({ user: req.user._id })
    .populate('message', 'sender content')
    .populate('chat', 'chatName isGroupChat')

  allNotifs = await User.populate(allNotifs, {
    path: 'message.sender',
    select: 'name pic'
  })

  res.json(allNotifs)
})

module.exports = { saveNotification, deleteNotification, getAllNotifications }
