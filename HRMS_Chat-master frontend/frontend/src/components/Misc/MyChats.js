import { ChatState } from '../../Context/chatProvider'
import { ChatLoading } from '../Misc/ChatLoading'
import MyChatsSub from '../SubComponents/MyChatsSub'

const MyChats = ({ fetchAgain }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    setNotifications,
    notifications,
    chats,
    chatUser,
    setChatUser
  } = ChatState()

  const props = {
    selectedChat,
    setSelectedChat,
    user,
    setNotifications,
    notifications,
    chats,
    chatUser,
    setChatUser
  }

  return user && chats ? (
    <MyChatsSub props={props} />
  ) : (
    <div>
      <ChatLoading />
    </div>
  )
}

export default MyChats
