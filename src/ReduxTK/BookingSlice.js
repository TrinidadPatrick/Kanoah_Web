import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking_Information',
    initialState: {
      service: null,
      schedule: null,
      contactAndAddress: null
    },
    reducers: {
      setService: (state, action) => {
        state.service = action.payload;
      },
      setSchedule: (state, action) => {
        state.schedule = action.payload;
      },
      setContactAndAddress: (state, action) => {
        state.contactAndAddress = action.payload;
      },
    },
  });
  export const { setService, setSchedule, setContactAndAddress } = bookingSlice.actions;

  export const selectService = (state) => state.booking_Information?.service;
  export const selectSchedule = (state) => state.booking_Information?.schedule;
  export const selectContactAndAddress = (state) => state.booking_Information?.contactAndAddress;

export default bookingSlice.reducer;