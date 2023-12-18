import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        newMessage: null,
        onlineUsers : []
    },
    reducers: {
      setNewMessage: (state, action) => {
        state.newMessage = action.payload;
      },
      setOnlineUsers: (state, action) => {
        state.onlineUsers = action.payload;
      },
    },
  });

  export const { setNewMessage } = chatSlice.actions;
  export const { setOnlineUsers } = chatSlice.actions;
  export const selectNewMessage = (state) => state.chat.newMessage;
  export const selectOnlineUsers = (state) => state.chat.onlineUsers;

export default chatSlice.reducer;