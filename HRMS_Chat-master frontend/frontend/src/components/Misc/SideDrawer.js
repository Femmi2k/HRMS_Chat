import React, { useContext } from 'react'
import { ChatContext } from '../../Context/chatProvider'
import SideDrawerSub from '../SubComponents/SideDrawerSub'

function SideDrawer() {
  const {
    chatUser,
    setChatUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    user,
    setUser,
    notifications,
    setNotifications
  } = useContext(ChatContext)

  const props = {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    user,
    setUser,
    notifications,
    setNotifications,
    chatUser,
    setChatUser
  }

  return user && chats ? (
    <SideDrawerSub props={props} />
  ) : (
    <div>SideDrawer Loading...</div>
  )
}
export default SideDrawer
