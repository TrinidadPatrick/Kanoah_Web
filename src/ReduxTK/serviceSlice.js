import { createSlice } from '@reduxjs/toolkit';


const serviceSlice = createSlice({
    name: 'service',
    initialState: {
      serviceData: {},
    },
    reducers: {
      setServiceData: (state, action) => {
        state.serviceData = action.payload;
      },
    },
  });

  export const { setServiceData } = serviceSlice.actions;
  export const selectServiceData = (state) => state.service.serviceData;

export default serviceSlice.reducer;