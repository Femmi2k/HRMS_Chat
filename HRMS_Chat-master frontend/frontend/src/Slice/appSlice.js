import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    user: {},
    selectedChat: '',
    chats: []
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setSelectedChat: (state, action) => {
      // state.selectedChat.push(action.payload)
      state.selectedChat = action.payload
    },
    setChats: (state, action) => {
      state.chats = action.payload
    }
  }
})

export const { setUser, setSelectedChat, setChats } = appSlice.actions

export const selectUser = (state) => state.app.user
export const selectSelectedChat = (state) => state.app.selectedChat
export const selectTotalChat = (state) => state.app.chats

export default appSlice.reducer
