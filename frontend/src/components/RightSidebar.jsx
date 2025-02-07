import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import { Button } from "./ui/button";
import axios from "axios";
import {
  FaUserPlus,
  FaPaperPlane,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa"; // Add search icon
import EditProfile from "./EditProfile";

const RightSidebar = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false); // To handle the toggle of the sidebar
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search input

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditProfileClick = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    } // Set state to show the EditProfile component
  };
  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className="lg:hidden absolute top-4 right-4 z-50">
        <Button
          onClick={toggleSidebar}
          className="bg-teal-500 text-white p-2 rounded-full shadow-lg hover:bg-teal-600"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`w-full lg:w-[350px] bg-white shadow-lg rounded-lg p-4 my-10 mx-auto transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 fixed top-0 right-0 h-full z-40 lg:relative`}
      >
        {/* Search Bar */}
        <div className="flex items-center border-b pb-4 mb-4">
          <FaSearch size={20} className="text-teal-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="ml-3 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center gap-3 border-b pb-6">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="w-20 h-20 border-2 border-teal-500">
              <AvatarImage src={user?.profilePicture} alt="profile_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-center">
            <h2 className="font-semibold text-xl">{user?.username}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <p className="text-gray-600 text-sm mt-2">
              {user?.bio || "Bio here..."}
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-4 w-full">
            <Link to={`/profile/${user?._id}`}>
              <Button
                variant="outline"
                className="text-teal-600 hover:bg-teal-50 w-full"
              >
                View Profile
              </Button>
            </Link>
            {/* Edit Profile Button */}
            <Button
              onClick={handleEditProfileClick} // This triggers the state change to show the EditProfile component
              variant="outline"
              className="text-teal-600 hover:bg-teal-50 w-full"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Conditionally render EditProfile component */}
        {isEditing && <EditProfile />}

        {/* Scrollable Content */}
        <div className="mt-6 h-[calc(100vh-200px)] overflow-y-auto">
          {/* Suggested Users */}
          <h3 className="font-semibold text-lg">Suggested Users</h3>
          <SuggestedUsers />

          {/* Additional Suggested Users with Actions */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-3 bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3"></div>
            </div>
          </div>

          {/* Links or Actions */}
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/explore">
              <Button
                variant="ghost"
                className="text-teal-600 hover:bg-teal-50"
              >
                Explore
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                variant="ghost"
                className="text-teal-600 hover:bg-teal-50"
              >
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
