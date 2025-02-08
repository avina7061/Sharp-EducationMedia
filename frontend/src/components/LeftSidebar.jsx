import React, { useState, useEffect } from "react";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setLikeNotification } from "@/redux/rtnSlice";
import { setRealTimeFollow } from "@/redux/rtn";
import { setRealTimeMessage } from "@/redux/rtnMessage";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { RealTimeMessage } = useSelector((store) => store.rtnMessage);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const { RealTimeFollow } = useSelector((store) => store.realTime);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const logoutHandler = async () => {
    try {
<<<<<<< HEAD
      const res = await axios.get(
        "https://sharp-educationmedia.onrender.com/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
=======
      const res = await axios.get("sharp-educationmedia.onrender/api/v1/user/logout", {
        withCredentials: true,
      });
>>>>>>> 42380bd46cf133ebe2be4d1fb759f6efc7b16a50
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  let count = 0;
  const clearNotifications = () => {
    count++;
    if (count === 2) {
      dispatch(setLikeNotification([]));
      dispatch(setRealTimeFollow([]));

      count = 0;
    }
  };

  const msgNotification = () => {
    dispatch(setRealTimeMessage([]));
  };

  const getTotalNotifications = () => {
    return likeNotification.length + RealTimeFollow.length;
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    {
      icon: <MessageCircle />,
      text: "Messages",
      notificationCount: RealTimeMessage.length,
    },
    {
      icon: <Heart />,
      text: "Notifications",
      notificationContent: (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              onClick={clearNotifications}
              size="icon"
              className="rounded-full h-7 w-7 bg-red-500 hover:bg-red-800 absolute bottom-6 left-6 text-white"
              aria-label="Notifications"
            >
              {getTotalNotifications()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div aria-live="polite" role="status">
              {getTotalNotifications() === 0 ? (
                <p>No new notifications</p>
              ) : (
                <div className="space-y-2">
                  {/* Like Notifications */}
                  {likeNotification.map((notification) => (
                    <div
                      key={`like-${notification.userId}`}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                    >
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage
                            src={notification.userDetails?.profilePicture}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm">
                          <span className="font-bold">
                            {notification.userDetails?.username}
                          </span>{" "}
                          liked your post
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                    </div>
                  ))}

                  {/* Follow Notifications */}
                  {RealTimeFollow.map((notification) => (
                    <div
                      key={`follow-${notification.userId}`}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                    >
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage
                            src={notification.userDetails?.profilePicture}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm">
                          <span className="font-bold">
                            {notification.userDetails?.username}
                          </span>{" "}
                          started following you
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 z-10 h-screen bg-gradient-to-b from-blue-100 to-teal-100 shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-12" : "w-64"
      } lg:w-64`}
    >
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="lg:hidden absolute top-1 left-3 bg-teal-600 text-white p-2 rounded-full"
      >
        {isSidebarCollapsed ? "→" : "←"}
      </button>

      <div className="flex flex-col items-center gap-4 py-6">
        <h1
          className={`my-8 pl-3 font-extrabold text-4xl text-teal-600 ${
            isSidebarCollapsed && "hidden"
          }`}
        >
          Sharp
        </h1>

        <div>
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className={`flex items-center gap-4 relative hover:bg-teal-50 cursor-pointer rounded-lg p-3 my-3 text-gray-700 transition-all duration-200 ease-in-out ${
                isSidebarCollapsed && "justify-center"
              }`}
              aria-label={item.text}
            >
              <div className="text-xl relative">
                {item.icon}
                {item.notificationCount > 0 && (
                  <div
                    onClick={msgNotification}
                    className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {item.notificationCount}
                  </div>
                )}
              </div>
              <span className={`text-lg ${isSidebarCollapsed && "hidden"}`}>
                {item.text}
              </span>

              {item.text === "Notifications" &&
                getTotalNotifications() > 0 &&
                item.notificationContent}
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
