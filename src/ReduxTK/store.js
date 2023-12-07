import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import serviceReducer from './serviceSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    service : serviceReducer
    // Add other reducers here if needed
  },
});

export default store;