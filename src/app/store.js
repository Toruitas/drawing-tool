import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger'
// import counterReducer from '../features/counter/counterSlice';
import toolReducer from "../features/drawer/tool/toolSlice";
import colorPickerReducer from "../features/drawer/colorPicker/colorPickerSlice";


export default configureStore({
  reducer: {
    tool: toolReducer,
    color: colorPickerReducer,
  },
  middleware:[...getDefaultMiddleware(), logger]
});
