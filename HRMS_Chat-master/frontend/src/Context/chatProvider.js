import { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const history = useHistory()
  const [user, setUser] = useState()
  //to access this state globally
  //wrap the whole app index.js with <ChatProvider>
  // and giving this state into the provider as props

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userInfo)

    if (!userInfo) {
      history.pushState('/')
    }
  }, [history])

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  )
}
export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider
