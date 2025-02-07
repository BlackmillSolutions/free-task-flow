import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaSearch, FaPlus, FaFilter } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="bg-white h-16 flex items-center justify-between px-4 shadow-sm border-b border-gray-200">
      {/* Left Side */}
      <div className="flex items-center flex-1">
        {/* Search Bar */}
        <div 
          className={`flex items-center flex-1 transition-all duration-200 ${
            isSearchFocused ? 'bg-white shadow-md' : 'bg-gray-100'
          } rounded-lg px-3 py-2 mr-4`}
        >
          <FaSearch className={`${isSearchFocused ? 'text-blue-500' : 'text-gray-400'} mr-2`} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent border-none outline-none placeholder-gray-400"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        {/* Quick Actions */}
        <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <FaPlus className="mr-2" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Filter Button */}
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <FaFilter />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <FaBell className="text-xl" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Profile Menu */}
        <button className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full transition-colors">
          <FaUserCircle className="text-gray-600 text-2xl" />
          <span className="hidden md:inline text-sm font-medium text-gray-700">John Doe</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
