import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  const { messages } = useSelector((store) => store.chat);
  useGetRTM();
  useGetAllMessage();

  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {/* User's Avatar and Info */}
      <div className="flex justify-center items-center mb-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="mt-2 text-lg font-medium">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            if (
              msg.senderId === selectedUser?._id ||
              msg.receiverId === selectedUser?._id
            ) {
              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderId === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      msg.senderId === user?._id
                        ? "bg-blue-300 text-white font-serif font-semibold"
                        : "bg-gray-200 text-black font-serif font-semibold"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
};

export default Messages;
