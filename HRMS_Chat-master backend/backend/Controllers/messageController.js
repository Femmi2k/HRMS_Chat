const expressAsyncHandler = require('express-async-handler')
const Message = require('../Models/messageModel')
const User = require('../Models/userModel')
const Chat = require('../Models/chatModel')

const messageCreation = async (reqId, content, chatId) => {
  console.log('MASSAGE CREATEIONSA', reqId)
  // try {
  //   var newMessage = {
  //     sender: reqId,
  //     content: content,
  //     chat: chatId
  //   }
  //   var message = await Message.create(newMessage)
  //   message = await message.populate('sender', 'name pic')
  //   message = await message.populate('chat')
  //   message = await User.populate(message, {
  //     //path is nested objects path
  //     //for objects that are not in this schema wll be updated from their own schema
  //     path: 'chat.users',
  //     select: 'name pic email'
  //   })

  //   await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })

  //   res.status(200)
  //   res.json( message)
  // } catch (error) {
  //    res.status(400)
  //   throw new Error(error.message)

  // }
}

const sendMessage = expressAsyncHandler(async (req, res) => {
  console.log('MEssage Sending')
  const { content, chatId, userInfo } = req.body
  if (!content || !chatId) {
    console.log('Invalid data passed into request')
    return res.sendStatus(400)
  }

  //check if currentChat exists
  var isChat = await Chat.findOne({
    isGroupChat: false, //to find out whether its single chat or group
    chatId
  })
    .populate('users', '-password')
    .populate('latestMessage')
  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email'
  })
  //if it exists send message, otherwise create it
  if (isChat) {
    console.log('Chat Exists')
    try {
      var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
      }
      var message = await Message.create(newMessage)
      message = await message.populate('sender', 'name pic')
      message = await message.populate('chat')
      message = await User.populate(message, {
        //path is nested objects path
        //for objects that are not in this schema wll be updated from their own schema
        path: 'chat.users',
        select: 'name pic email'
      })

      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })

      res.status(200)
      res.json(message)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  } else {
    console.log('Chat Does Not Exist')
    var chatData = {
      chatName: `${req.user.name}/${userInfo.name}`,
      isGroupChat: false,
      users: [req.user._id, userInfo._id]
    }
    try {
      const createdChat = await Chat.create(chatData)
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-password'
      )
      res.status(200).send(fullChat)

      var newMessage = {
        sender: req.user._id,
        content: content,
        chat: createdChat._id
      }
      var message = await Message.create(newMessage)
      message = await message.populate('sender', 'name pic')
      message = await message.populate('chat')
      message = await User.populate(message, {
        //path is nested objects path
        //for objects that are not in this schema wll be updated from their own schema
        path: 'chat.users',
        select: 'name pic email'
      })

      await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message
      })

      res.status(200)
      res.json(message)
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }
})

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat')

    res.json(messages)
  } catch (error) {
    res.status(400)
    return new Error(error.message)
  }
})

module.exports = { sendMessage, allMessages }
