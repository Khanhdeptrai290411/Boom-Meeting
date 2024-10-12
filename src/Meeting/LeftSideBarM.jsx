import React from 'react';
import {
    Menu,
    Sun,
    Moon,
  } from 'lucide-react';

function LeftSideBar({ toggleMenuSidebar, title = "Meeting", isDarkMode, toggleDarkMode, userName = "User Name" }) {
  return (
    <div className="w-1/3 max-w-xs border-r border-gray-300 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 transition-colors h-full">
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 shadow-md dark:shadow-gray-700">
        <div className="flex items-center space-x-3">
          <Menu
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
            onClick={toggleMenuSidebar}
          />
          <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200 ">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center justify-center p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* User Info Section at the Bottom */}
      <div className="flex-1 flex flex-col justify-center items-center pb-6 space-y-4">
        {/* Optional Additional Info */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-4/5 text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Welcome back!</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ready for your next meeting?</p>
        </div>

        {/* User Information */}
        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-4/5">
          <div className="rounded-full h-12 w-12 bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {userName.charAt(0)}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 dark:text-white">{userName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSideBar;
