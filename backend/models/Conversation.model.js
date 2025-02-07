import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  message: [
    {
      type: mongoose.Types.ObjectId, // it is use for storig the data into array
      ref: "Message", //we point to the message model
    },
  ],
});
export default mongoose.model("Conversation", conversationSchema);

//this model use for the chat purpose
