import { useEffect } from "react"; // Import useEffect for side-effects (like setting up socket connection)
import ChatPage from "./components/ChatPage"; // Import ChatPage component
import EditProfile from "./components/EditProfile"; // Import EditProfile component
import Home from "./components/Home"; // Import Home component
import Login from "./components/Login"; // Import Login component
import MainLayout from "./components/MainLayout"; // Import MainLayout component (for overall layout)
import Profile from "./components/Profile"; // Import Profile component
import Signup from "./components/Signup"; // Import Signup component
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Import routing components
import { io } from "socket.io-client"; // Import socket.io client to establish a WebSocket connection
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks for accessing and dispatching store actions
import { setSocket } from "./redux/socketSlice"; // Action to store socket connection in Redux store
import { setOnlineUsers } from "./redux/chatSlice"; // Action to store online users in Redux store
import { setLikeNotification } from "./redux/rtnSlice"; // Action to store like notifications in Redux store
import ProtectedRoutes from "./components/ProtectedRoutes"; // Component to protect certain routes that require authentication
import { setRealTimeFollow } from "./redux/rtn";
// Define the browser router with routes and their corresponding components
const browserRouter = createBrowserRouter([
  {
    path: "/", // The main route (the homepage) and in this main rout outlet is define means that left sidebar always present you use your space after left sidebar
    element: (
      <ProtectedRoutes>
        {" "}
        {/* Protect this route, ensuring only logged-in users can access it */}
        <MainLayout />{" "}
        {/* Main layout wrapper, includes elements like sidebar */}
      </ProtectedRoutes>
    ),
    children: [
      // Child routes for the layout
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home /> {/* The Home page component */}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile /> {/* Profile page, dynamic by user ID */}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile /> {/* Edit Profile page */}
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage /> {/* Chat page for real-time messaging */}
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login", // Route for the login page
    element: <Login />,
  },
  {
    path: "/signup", // Route for the signup page
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((store) => store.auth); // Access the user object from the Redux store
  const { socket } = useSelector((store) => store.socketio); // Access the socket instance from Redux store
  const dispatch = useDispatch(); // Access dispatch function to trigger Redux actions

  // This useEffect runs when the user object changes
  useEffect(() => {
    if (user) {
      // Check if there is a logged-in user
      // Establish socket connection to the server with the user's ID
      const socketio = io("http://localhost:8003", {
        query: { userId: user?._id }, // Pass the user's ID to the server via query params
        transports: ["websocket"], // Use WebSocket transport
      });

      dispatch(setSocket(socketio)); // Store the socket instance in Redux

      // Listen for real-time updates from the server
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers)); // Update Redux store with online users without refresh the server
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification)); // Update Redux store with like notifications without refresh the server
      });

      socketio.on("realNotification", (realNotification) => {
        //this for follow
        dispatch(setRealTimeFollow(realNotification));
      });

      // Cleanup function to close the socket connection when the component unmounts or user logs out
      return () => {
        socketio.close(); // Close the socket connection when user logs out or component unmounts
        dispatch(setSocket(null)); // Reset the socket state in Redux
      };
    } else if (socket) {
      // If no user is logged in, and a socket connection exists
      socket.close(); // Close the socket connection
      dispatch(setSocket(null)); // Reset the socket state in Redux
    }
  }, [user, dispatch]); // Run this effect when `user` or `dispatch` changes

  return (
    <>
      {/* RouterProvider sets up the routing system with the routes defined in `browserRouter` */}
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App; // Export the App component to be used in the app
