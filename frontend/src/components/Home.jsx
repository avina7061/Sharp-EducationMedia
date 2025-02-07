import React from "react"; // Import React to use JSX syntax
import Feed from "./Feed"; // Import the Feed component to show posts
import { Outlet } from "react-router-dom"; // Import Outlet to render child route components
import RightSidebar from "./RightSidebar"; // Import the RightSidebar component
import useGetAllPost from "@/hooks/useGetAllPost"; // Custom hook to fetch all posts
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"; // Custom hook to fetch suggested users
import { useSelector } from "react-redux"; // Hook to access Redux store
import SearchComponent from "./SearchComponent"; // Import SearchComponent to allow users to search

// Home component that displays the main page layout
const Home = () => {
  const { posts } = useSelector((store) => store.post); // Access posts from Redux store

  useGetAllPost(); // Fetch all posts using the custom hook
  useGetSuggestedUsers(); // Fetch suggested users using the custom hook

  return (
    <div className="flex">
      {" "}
      {/* Use flexbox to display the layout */}
      <div className="flex-grow">
        {" "}
        {/* The main content area takes up remaining space */}
        <SearchComponent /> {/* Search bar component */}
        <Feed /> {/* The Feed component will display the posts */}
        {/* The <Outlet /> will render any child routes here it means now middle space is available for other child routing*/}
      </div>
      <RightSidebar />{" "}
      {/* The RightSidebar component stays on the right side of the layout */}
    </div>
  );
};

export default Home; // Export the Home component so it can be used in other parts of the app
