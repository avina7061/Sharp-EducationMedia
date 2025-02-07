import React from "react"; // Import React to use JSX syntax
import { Outlet } from "react-router-dom"; // Import the Outlet component from react-router-dom
import LeftSidebar from "./LeftSidebar"; // Import the LeftSidebar component

// MainLayout component defines the overall structure of the layout
const MainLayout = () => {
  return (
    <div>
      {/* The LeftSidebar component will be displayed on the left side of the layout */}
      <LeftSidebar />

      <div>
        {/* The <Outlet /> component is where child route components will be rendered */}
        {/* When a child route is matched, it will display inside this <div> */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
