import { Box } from '@chakra-ui/layout'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import ChatBox from '../components/Misc/ChatBox'
import MyChats from '../components/Misc/MyChats'
import SideDrawer from '../components/Misc/SideDrawer'
import { ChatContext } from '../Context/chatProvider'

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState()

  const { user, setUser } = useContext(ChatContext)

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')))
  }, [])

  //checking for user to be null because it takes the bitch ages to fetch the context state
  //
  return user !== null ? (
    <div style={{ width: '100%' }}>
      {<SideDrawer />}

      <Box
        d="flex"
        justifyContent="space-between"
        width="100%"
        h="91.5vh"
        p="10px"
      >
        {<MyChats fetchAgain={fetchAgain} />}
        {<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  ) : (
    <div>Loading All States</div>
  )
}

export default ChatPage
