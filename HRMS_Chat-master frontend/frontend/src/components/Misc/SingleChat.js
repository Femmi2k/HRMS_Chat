import React, { useContext } from 'react'
import { ChatContext } from '../../Context/chatProvider'
import SingleChatSub from '../SubComponents/SingleChatSub'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    user,
    notifications,
    setNotifications,
    chatUser,
    setChatUser
  } = useContext(ChatContext)

  const props = {
    chats,
    selectedChat,
    setSelectedChat,
    user,
    notifications,
    setNotifications,
    chatUser,
    setChatUser
  }

  return user && chats ? (
    <SingleChatSub props={props} />
  ) : (
    <div>SingleChat Loading...</div>
  )
}
export default SingleChat
