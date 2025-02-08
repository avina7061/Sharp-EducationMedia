import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode, Send, Smile, Search } from "lucide-react";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { setRealTimeMessage } from "@/redux/rtnMessage";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState(""); // For text input
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Toggle emoji picker
  const [searchQuery, setSearchQuery] = useState(""); // For search bar
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const RealTimeMessage = useSelector((store) => store.rtnMessage);

  const dispatch = useDispatch();

  // Handle emoji click
  const handleEmojiClick = (emojiData) => {
    setTextMessage((prev) => prev + emojiData.emoji); // Append emoji to input
    setShowEmojiPicker(false); // Close emoji picker
  };

  // Function to send messages
  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8003/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage(""); // Clear input after sending
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen flex-col md:flex-row bg-gray-50">
      {selectedUser ? null : (
        <section className="w-full md:w-1/4 my-8">
          <h1 className="font-bold mb-4 px-3 text-xl text-gray-800">
            {user?.username}
          </h1>
          <div className="px-3 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 focus-visible:ring-transparent"
              />
            </div>
          </div>
          <hr className="mb-4 border-gray-300" />
          <div className="overflow-y-auto h-[80vh] px-3">
            {suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                  key={suggestedUser._id}
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className={`flex gap-3 items-center p-3 cursor-pointer w-full bg-white hover:bg-gray-100 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${
                    RealTimeMessage.receiverId == suggestedUser?._id
                  } & bg-blue-500`}
                >
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>
                      <img
                        src="https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png"
                        alt="Error"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {suggestedUser?.username}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col bg-white">
          <div className="flex gap-3 items-center px-6 py-4 border-b border-gray-300 sticky top-0 bg-white z-10 shadow-sm">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {selectedUser?.username}
              </span>
              <span className="text-xs font-bold">
                {onlineUsers.includes(selectedUser._id) ? (
                  <span className="text-green-600">Online</span>
                ) : (
                  <span className="text-red-600">Offline</span>
                )}
              </span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="relative flex items-center p-4 border-t border-t-gray-300 bg-gray-50">
            {/* Emoji Picker Toggle Button */}
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-4 z-50 bg-white shadow-lg rounded-lg p-2">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent rounded-full"
              placeholder="Type a message..."
            />
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="rounded-full p-2"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto py-8 px-4 md:px-0">
          <MessageCircleCode className="w-32 h-32 my-4 text-gray-400" />
          <h1 className="font-medium text-gray-800">Your messages</h1>
          <span className="text-gray-500">Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
