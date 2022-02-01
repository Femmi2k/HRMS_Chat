import { useToast } from '@chakra-ui/toast'
import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [selectedChat, setSelectedChat] = useState()
  const [chats, setChats] = useState([])
  const [notifications, setNotifications] = useState([])
  const [chatUser, setChatUser] = useState()
  //to create chat when a message is sent to a user, create a global userObject state
  //

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')))
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chatUser,
        setChatUser,
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notifications,
        setNotifications
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
export const ChatState = () => {
  return useContext(ChatContext)
}
