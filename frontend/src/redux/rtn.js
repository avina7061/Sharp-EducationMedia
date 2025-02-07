import { createSlice } from "@reduxjs/toolkit";

const rtn = createSlice({
  name: "realTime",
  initialState: {
    RealTimeFollow: [], // [1,2,3]
  },
  reducers: {
    setRealTimeFollow: (state, action) => {
      if (action.payload.type === "notSend") {
        state.RealTimeFollow.push(action.payload);
      } else if (action.payload.type === "Send") {
        state.RealTimeFollow = state.RealTimeFollow.filter(
          (item) => item.userId !== action.payload.userId
        );
      } else {
        state.RealTimeFollow = action.payload;
      }
    },
  },
});
export const { setRealTimeFollow } = rtn.actions;
export default rtn.reducer;
