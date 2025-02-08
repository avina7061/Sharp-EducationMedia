import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);
  const dispatch = useDispatch();

  const handleCommentDialogOpen = () => {
    // Ensure post data is valid before opening dialog
    if (post && post._id) {
      dispatch(
        setSelectedPost({
          ...post,
          author: post.author || { username: "Unknown" }, // Provide fallback for author
          comments: post.comments || [], // Ensure comments is always an array
        })
      );
      setOpen(true);
    } else {
      toast.error("Unable to load post details");
    }
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim());
  };

  const likeOrDislikeHandler = async () => {
    if (!user?._id) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8003/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // Update the post
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating like status");
    }
  };

  const commentHandler = async () => {
    if (!user?._id) {
      toast.error("Please login to comment");
      return;
    }

    if (text.trim() === "") return;

    try {
      const res = await axios.post(
        `http://localhost:8003/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error posting comment");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8003/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error deleting post");
    }
  };

  const bookmarkHandler = async () => {
    if (!user?._id) {
      toast.error("Please login to bookmark posts");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8003/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error bookmarking post");
    }
  };

  // Guard against null post
  if (!post) {
    return null;
  }

  return (
    <div className="my-8 w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback>
                {post.author?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">
              {post.author?.username || "Unknown"}
            </h1>
            {user?._id === post.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-gray-700" />
          </DialogTrigger>
          <DialogContent className="w-36 h-48 flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id && user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button
              onClick={bookmarkHandler}
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956]"
            >
              Add to favorites
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit text-red-500"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full object-cover aspect-square"
        src={post.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={24}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
            />
          )}

          <MessageCircle
            onClick={handleCommentDialogOpen}
            className="cursor-pointer text-gray-600 hover:text-gray-800"
          />
          <Send className="cursor-pointer text-gray-600 hover:text-gray-800" />
        </div>

        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer text-red-900 hover:text-gray-800"
        />
      </div>

      <div className="px-4 py-2">
        <span className="font-semibold block mb-2">{postLike} likes</span>
        <p className="text-sm">
          <span className="font-semibold">
            {post.author?.username || "Unknown"}
          </span>{" "}
          {post.caption}
        </p>

        {comment.length > 0 && (
          <span
            onClick={handleCommentDialogOpen}
            className="cursor-pointer text-sm text-gray-400 hover:text-gray-600"
          >
            View all {comment.length} comments
          </span>
        )}
      </div>

      <CommentDialog open={open} setOpen={setOpen} />

      <div className="px-4 py-2 border-t border-gray-200 flex items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full py-2 px-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-teal-500"
        />
        {text.trim() && (
          <span
            onClick={commentHandler}
            className="text-teal-500 cursor-pointer ml-2"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
