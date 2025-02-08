import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle, X, Trash2 } from "lucide-react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const Profile = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);
  const [openImg, setOpenImg] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const { userProfile, user } = useSelector((store) => store.auth);
  const [profileImage, setProfileImage] = useState(null);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [userProfile, user]);

  const followSetup = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8003/api/v1/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing(!isFollowing);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDeleteClick = (e, post) => {
    e.stopPropagation(); // Prevent image modal from opening
    setPostToDelete(post);
    setOpenDeleteConfirm(true);
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://sharp-educationmedia.onrender.com/api/v1/post/delete/${postToDelete?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = userProfile.posts.filter(
          (postItem) => postItem?._id !== postToDelete?._id
        );
        // Update the UI - assuming you have access to dispatch and setPosts
        // If not, you'll need to implement a different way to update the UI
        window.location.reload(); // Temporary solution to refresh the data
        setOpenDeleteConfirm(false);
        setOpenImg(false);
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const displayedPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const handleImageClick = (post) => {
    setSelectedImage(post.image);
    setSelectedPost(post);
    setOpenImg(true);
  };

  const handleProfileClick = (img) => {
    setProfileImage(img);
    setOpenProfile(true);
    console.log(img);
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar
              onClick={() => handleProfileClick(userProfile?.profilePicture)}
              className="h-32 w-32"
            >
              <AvatarImage src={userProfile?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <Link to="/account/edit">
                    <Button variant="secondary" className="h-8">
                      Edit Profile
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={followSetup}
                    className={`h-8 ${
                      isFollowing ? "bg-gray-500" : "bg-[#0095F6]"
                    }`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </div>
              <div className="flex gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers?.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length}
                  </span>{" "}
                  following
                </p>
              </div>
              <Badge className="w-fit" variant="secondary">
                <AtSign /> <span className="pl-1">{userProfile?.username}</span>
              </Badge>
              <div>{userProfile?.bio}</div>
            </div>
          </section>
        </div>
        <div className="border-t border-gray-200">
          <div className="flex justify-center gap-10 text-sm">
            {["posts", "saved"].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer ${
                  activeTab === tab ? "font-bold" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPosts?.map((post) => (
              <div
                key={post?._id}
                className="relative group cursor-pointer"
                onClick={() => handleImageClick(post)}
              >
                <img
                  src={post.image}
                  alt="post"
                  className="rounded-sm w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex text-white space-x-4">
                    <button className="flex items-center gap-2">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                    {isLoggedInUserProfile && (
                      <button
                        onClick={(e) => handleDeleteClick(e, post)}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog open={openImg} onOpenChange={setOpenImg}>
        <DialogContent
          onInteractOutside={() => setOpenImg(false)}
          className="sm:max-w-2xl p-0 bg-transparent border-none"
        >
          <div className="relative">
            <button
              onClick={() => setOpenImg(false)}
              className="absolute top-2 right-2 z-50 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            <img
              src={selectedImage}
              alt="Full View"
              className="w-full max-h-[80vh] object-cover rounded-lg"
            />

            {selectedPost && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>{selectedPost?.likes?.length} Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>{selectedPost?.comments?.length} Comments</span>
                    </div>
                  </div>
                  {isLoggedInUserProfile && (
                    <button
                      onClick={(e) => handleDeleteClick(e, selectedPost)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setOpenDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deletePostHandler}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Image Dialog */}
      <Dialog open={openProfile}>
        <DialogContent
          onInteractOutside={() => setOpenProfile(false)}
          className="sm:max-w-2xl p-0 bg-transparent border-none mx-4 my-20"
        >
          <div className="relative flex flex-col items-center bottom-80 right-20">
            <button
              onClick={() => setOpenProfile(false)}
              className="absolute top-2 right-2 z-50 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            <img
              src={profileImage}
              alt="Full View"
              className="w-52 h-52 sm:w-64 sm:h-64 object-cover rounded-full border-2 border-white"
            />

            <div className="mt-4 text-center">
              <p className="text-lg font-semibold">{userProfile?.username}</p>
              <p className="text-sm text-gray-600">{userProfile?.bio}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
