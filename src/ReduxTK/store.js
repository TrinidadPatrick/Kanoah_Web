import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import serviceReducer from './serviceSlice';
import chatReducer from './chatSlice';
import bookingReducer from './BookingSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    service : serviceReducer,
    chat : chatReducer,
    booking_Information : bookingReducer
    // Add other reducers here if needed
  },
});

export default store;