import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const { userProfile, user } = useSelector((store) => store.auth);

  const toggle = userProfile?.followers?.includes(user?._id);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((User) => {
        const toggle = User.followers.includes(user._id);
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${User?._id}`}>
                <Avatar>
                  <AvatarImage src={User?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${User?._id}`}>{User?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {User?.bio || "Bio here..."}
                </span>
              </div>
            </div>

            {toggle ? (
              <Link to={`/profile/${User?._id}`}>
                <span className="text-[#4086b6] text-xs font-bold cursor-pointer hover:text-[#28a5f8] transition-colors duration-200">
                  Followed
                </span>
              </Link>
            ) : (
              <Link to={`/profile/${User?._id}`}>
                <span className="text-[#6B7280] text-xs font-bold cursor-pointer hover:text-[#404857] transition-colors duration-200">
                  Unfollowed
                </span>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
