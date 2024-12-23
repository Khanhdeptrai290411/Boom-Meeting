import React from 'react';
import { Menu, Sun, Moon, User, Key } from 'lucide-react';

function LeftSideBar({ toggleMenuSidebar, title = "Profile", isDarkMode, toggleDarkMode, setActiveTab, activeTab }) {
  const getTabClass = (tab) =>
    `flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all ${
      activeTab === tab
        ? 'bg-gray-100 dark:bg-gray-800'  // Màu nền khi được chọn
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

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

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-4">
        {/* Thay đổi thông tin cá nhân */}
        <div className={getTabClass('changeProfile')} 
          onClick={() => setActiveTab('changeProfile')}
        >
          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-800 dark:text-gray-200">Thay đổi thông tin</span>
        </div>

        {/* Đổi mật khẩu */}
        <div className={getTabClass('changePassword')}
          onClick={() => setActiveTab('changePassword')}
        >
          <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-800 dark:text-gray-200">Đổi mật khẩu</span>
        </div>
      </div>
    </div>
  );
}

export default LeftSideBar;
