import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="flex-1 my-4 relative right-1 flex flex-col items-center pl-[12%]">
      <Posts />
    </div>
  );
};

export default Feed;
