import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger'
// import counterReducer from '../features/counter/counterSlice';
import toolReducer from "../features/drawer/tool/toolSlice";


export default configureStore({
  reducer: {
    tool: toolReducer,
  },
  middleware:[...getDefaultMiddleware(), logger]
});
