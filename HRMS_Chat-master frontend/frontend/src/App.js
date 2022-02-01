import { Route } from 'react-router-dom'
import './App.css'
import ChatPage from './pages/ChatPage'
import Homepage from './pages/Homepage'

const App = () => {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={ChatPage} exact />
    </div>
  )
}

export default App
