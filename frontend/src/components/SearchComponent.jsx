import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchComponent = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value); // Pass search query to parent component
    }
  };

  return (
    <div className="flex items-center border-b pb-4 mb-4 w-72 relative left-24 mt-[60px] sm:w-[950px] sm:pl-[350px]  sm:mt-[30px]">
      {/* For mobile screens: width will be full (100%) */}
      {/* For larger screens: width set to 950px with left padding 450px */}
      <FaSearch size={20} className="text-teal-500" />
      <input
        type="text"
        placeholder="       Search posts..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="ml-3 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );
};

export default SearchComponent;
