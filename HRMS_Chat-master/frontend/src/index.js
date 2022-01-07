import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import ChatProvider from './Context/chatProvider'

ReactDOM.render(
  <ChatProvider>
    <Router>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Router>
  </ChatProvider>,
  document.getElementById('root')
)
