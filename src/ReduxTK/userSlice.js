import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
      userId: null,
      loggedIn : null,
      showLoginModal : false
    },

    reducers: {
      setUserId: (state, action) => {
        state.userId = action.payload;
      },
      setLoggedIn: (state, action) => {
        state.loggedIn = action.payload;
      },
      setShowLoginModal: (state, action) => {
        state.showLoginModal = action.payload;
      },
    },
  });


// For User
export const { setUserId } = userSlice.actions;
export const { setLoggedIn } = userSlice.actions;
export const { setShowLoginModal } = userSlice.actions;




export const selectUserId = (state) => state.user.userId;
export const selectLoggedIn = (state) => state.user.loggedIn;
export const selectShowLoginModal = (state) => state.user.showLoginModal;


export default userSlice.reducer;