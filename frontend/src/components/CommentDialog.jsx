import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setComment(selectedPost?.comments || []);
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    setText(e.target.value); // No `trim()` here to allow spaces in typing
  };

  const sendMessageHandler = async () => {
    if (!user?._id) {
      toast.error("Please login to comment");
      return;
    }

    if (!text.trim() || !selectedPost?._id) {
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8003/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setComment((prevComments) => [...prevComments, res.data.comment]);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: [...p.comments, res.data.comment] }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText(""); // Reset input field
      }
    } catch (error) {
      toast.error("Error posting comment");
    }
  };

  if (!selectedPost) {
    return null;
  }

  const safeAuthor = selectedPost.author || {};
  const username = safeAuthor.username || "Unknown User";
  const profilePicture = safeAuthor.profilePicture || "";
  const authorId = safeAuthor._id || "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-3xl min-h-96 p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            {selectedPost.image ? (
              <img
                src={selectedPost.image}
                alt="post_image"
                className="w-full h-full object-cover rounded-l-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-l-lg">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                {authorId && (
                  <Link to={`/profile/${authorId}`}>
                    <Avatar>
                      <AvatarImage src={profilePicture} alt={username} />
                      <AvatarFallback>
                        {username[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )}
                <div>
                  {authorId ? (
                    <Link
                      to={`/profile/${authorId}`}
                      className="font-semibold text-xs"
                    >
                      {username}
                    </Link>
                  ) : (
                    <span className="font-semibold text-xs">{username}</span>
                  )}
                </div>
              </div>

              {user?._id && user?._id !== authorId && (
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <Button
                      variant="ghost"
                      className="cursor-pointer w-full text-[#ED4956] font-bold"
                    >
                      Unfollow
                    </Button>
                    <Button variant="ghost" className="cursor-pointer w-full">
                      Add to favorites
                    </Button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.length > 0 ? (
                comment.map(
                  (commentItem) =>
                    commentItem?._id && (
                      <Comment key={commentItem._id} comment={commentItem} />
                    )
                )
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
