import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Message", messageSchema);

// it is making for Chating purpose
