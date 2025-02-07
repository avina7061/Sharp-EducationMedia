import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
    RealTimeFollow: [], // [1,2,3]
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      } else {
        state.likeNotification = action.payload;
      }
    },
    setRealTimeFollow: (state, action) => {
      if (action.payload.type === "Send") {
        state.RealTimeFollow.push(action.payload);
      } else if (action.payload.type === "notSend") {
        state.RealTimeFollow = state.RealTimeFollow.filter(
          (item) => item.userId !== action.payload.userId
        );
      } else {
        state.RealTimeFollow = action.payload;
      }
    },
  },
});
export const { setLikeNotification, setRealTimeFollow } = rtnSlice.actions;
export default rtnSlice.reducer;
