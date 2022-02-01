const expressAsyncHandler = require('express-async-handler')
const generateToken = require('../config/generateToken')
const User = require('../Models/userModel')

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please Enter all the Fields')
  }

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
    pic
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Failed to create User')
  }
})
//Login auth functionality
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? //Or takes in two objects and if either one true, returns true
      {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {}
  //ne means not equal to
  //   //the second find excludes the user currently signed in
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
  res.send(users)
})
module.exports = { registerUser, authUser, allUsers }
