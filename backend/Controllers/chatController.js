const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat = expressAsyncHandler(async (req, res) => {
  //user Id of the person you want to chat with
  const { userId } = req.body;

  if (!userId) {
    console.log("userId Params not sent");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    //to find out whether its single chat or group
    isGroupChat: false,
    $and: [
      //elemMatch to find all instances where both of these are present
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    //populate the users field in chat model with new stuff about the chat person except password
    .populate("users", "-password")
    .populate("latestMessage");

  //chat model has latest message, which is a ref to the message model, which is a ref to the user model
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  // If a chat already exists, we just return that
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //otherwise we create new Chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = expressAsyncHandler(async (req, res) => {
  try {
    //elematch finds all instances where your specified parameter is present
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })

      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = { accessChat, fetchChats };
