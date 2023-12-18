import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import serviceReducer from './serviceSlice';
import chatReducer from './chatSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    service : serviceReducer,
    chat : chatReducer
    // Add other reducers here if needed
  },
});

export default store;