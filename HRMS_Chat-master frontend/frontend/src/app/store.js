import { configureStore } from '@reduxjs/toolkit'
import appReducer from '../Slice/appSlice'

export const store = configureStore({
  reducer: {
    app: appReducer
  }
})
