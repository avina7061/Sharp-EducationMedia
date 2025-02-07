import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  RealTimeMessage: [],
};

const rtnMessageSlice = createSlice({
  name: "rtnMessage",
  initialState,
  reducers: {
    setRealTimeMessage: (state, action) => {
      // Ensure the state is fully reset
      if (Array.isArray(action.payload)) {
        state.RealTimeMessage = [...action.payload]; // Make sure it's not a reference
      } else {
        state.RealTimeMessage.push(action.payload);
      }
    },
  },
});

export const { setRealTimeMessage } = rtnMessageSlice.actions;
export default rtnMessageSlice.reducer;
