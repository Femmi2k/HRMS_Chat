import { IconButton } from '@chakra-ui/button'
import { FormControl } from '@chakra-ui/form-control'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/input'
import { Box } from '@chakra-ui/layout'
import { Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import React, { useContext, useEffect, useState } from 'react'

import { getSender, getSenderFull } from '../../config/ChatLogics'
import axios from 'axios'
import io from 'socket.io-client'
import ProfileModal from '../Misc/ProfileModal'
import UpdateGroupModal from '../Misc/UpdateGroupModal'
import { useToast } from '@chakra-ui/toast'
import ScrollableChat from '../Misc/ScrollableChat'

const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare

const SingleChatSub = ({ fetchAgain, setFetchAgain, props }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [document, setDocument] = useState('')
  const [image, setImage] = useState('')

  const {
    selectedChat,
    setSelectedChat,
    user,
    notifications,
    setNotifications,
    chatUser,
    setChatUser
  } = props
  const toast = useToast()

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])
  //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id)

      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }
        setNewMessage('')

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChatCompare._id,
            userInfo: chatUser
          },
          config
        )

        socket.emit('new message', data)
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: 'Error Ocurred!',
          description: 'Failed to send the Message',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        })
      }
    }
  }

  const convertBase64 = (file) => {
    return new Promise((res, rej) => {
      var reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onloadend = () => {
        res(reader.result)
      }
      reader.onerror = (error) => {
        rej(error)
      }
    })
  }

  const sendImage = async (event) => {
    setLoading(true)
    //file comes imn event
    var file = event
    if (!file) return

    if (!file.type.match('image.*')) {
      toast({
        title: 'Wrong file selected',
        description: 'Upload a valid image file',
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top'
      })
      setLoading(false)
      return
    } else {
      const base64 = await convertBase64(file)

      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }

        const { data } = await axios.post(
          '/api/message',
          {
            content: base64,
            chatId: selectedChatCompare._id
          },
          config
        )

        socket.emit('new message', data)
        setMessages([...messages, data])
        setImage('')
        setLoading(false)
      } catch (error) {
        toast({
          title: 'Error Ocurred!',
          description: 'Failed to send the Image',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        })
        setImage('')
        setLoading(false)
      }
    }
  }

  const sendDocument = async (event) => {
    setLoading(true)
    //file comes imn event
    console.log(event)
    var file = event
    if (!file) return
    //if invalid type
    else {
      const base64 = await convertBase64(file)
      console.log('Document 64', base64)

      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }

        const { data } = await axios.post(
          '/api/message',
          {
            content: base64,
            chatId: selectedChatCompare._id
          },
          config
        )

        socket.emit('new message', data)
        setMessages([...messages, data])
        setLoading(false)
      } catch (error) {
        toast({
          title: 'Error Ocurred!',
          description: 'Failed to send the Document',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'bottom'
        })
        setDocument('')
        setLoading(false)
      }
    }
  }

  //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChatCompare._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 2500
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChatCompare._id)
        setTyping(false)
      }
    }, timerLength)
  }
  //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

  const fetchMessages = async () => {
    if (!selectedChat) return
    if (selectedChat._id === 'random Bullshit') return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      setLoading(true)

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      )
      setMessages(data)
      setLoading(false)
      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      toast({
        title: 'Error Ocurred!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
      })
    }
  }

  const sendNotification = () => {
    socket.on('message received', async (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          try {
            const config = {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${user.token}`
              }
            }
            const { data } = await axios.post(
              '/api/notifs',
              {
                notifObject: newMessageReceived
              },
              config
            )
            setNotifications(data)
          } catch (error) {
            toast({
              title: 'An Error Ocurred!',
              description: 'Failed to Setup Notifications',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'bottom'
            })
          }
          setNotifications([newMessageReceived, ...notifications])
          setFetchAgain(!fetchAgain)
        }
        //notification
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  }

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  }, [selectedChat])

  useEffect(() => {
    sendNotification()
  }, [messages])

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton
              d={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {!selectedChat.isGroupChat && isTyping ? (
                <div>{getSender(user, selectedChat.users)} is typing...</div>
              ) : (
                <></>
              )}
              {selectedChat.isGroupChat && isTyping ? (
                <div>Someone is typing...</div>
              ) : (
                <></>
              )}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <span>
                <Input
                  type="file"
                  value={image}
                  p={1.5}
                  accept="image/*"
                  onChange={(e) => {
                    sendImage(e.target.files[0])
                  }}
                />

                <Input
                  type="file"
                  value={document}
                  p={1.5}
                  onChange={(e) => {
                    sendDocument(e.target.files[0])
                  }}
                />
              </span>
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChatSub
