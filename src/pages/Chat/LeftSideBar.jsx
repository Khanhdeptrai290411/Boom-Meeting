import React, { useState } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Search,
  Archive,
  Users,
  MessageCircle,
  Plus
} from 'lucide-react';
import GroupCreation from './GroupCreation'; // Import GroupCreation

function LeftSideBar({ 
  isDarkMode, 
  toggleDarkMode, 
  toggleMenuSidebar, 
  setActiveTab, 
  activeTab, 
  friendRequests, 
  renderTabContent,
  title='Chats' ,
  searchQuery,
  setSearchQuery,
  sendFriendRequest,
  socketServerURL,
  socket // Thêm socket vào danh sách props
}) {
  const [showGroupCreation, setShowGroupCreation] = useState(false);

  return (
    <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 flex flex-col">
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

      {/* Search Section */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Thanh tìm kiếm */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật giá trị tìm kiếm
            />
          </div>

          {/* Nút thêm mới */}
          <button
            onClick={() => setShowGroupCreation(true)} // Show GroupCreation component
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Footer Section (Tab Switchers) */}
      <div className="flex justify-around p-4 border-t border-gray-300 dark:border-gray-700">
        {/* Archive Tab */}
        <div
          onClick={() => setActiveTab('archive')}
          className={`cursor-pointer ${
            activeTab === 'archive' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
          } hover:text-blue-600 dark:hover:text-gray-300 transition-colors`}
        >
          <Archive className="w-6 h-6" />
        </div>
        {/* Friend Requests Tab */}
        <div
          onClick={() => setActiveTab('users')}
          className={`relative cursor-pointer ${
            activeTab === 'users' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
          } hover:text-blue-600 dark:hover:text-gray-300 transition-colors`}
        >
          <Users className="w-6 h-6" />
          {friendRequests > 0 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {friendRequests}
            </div>
          )}
        </div>
        {/* Messages Tab */}
        <div
          onClick={() => setActiveTab('messages')}
          className={`cursor-pointer ${
            activeTab === 'messages' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
          } hover:text-blue-600 dark:hover:text-gray-300 transition-colors`}
        >
          <MessageCircle className="w-6 h-6" />
        </div>
      </div>

      {/* Group Creation Overlay */}
      {showGroupCreation && (
        <GroupCreation
          socketServerURL={socketServerURL}
          socket={socket} // Truyền socket vào GroupCreation
          onClose={() => setShowGroupCreation(false)}
        />
      )}
    </div>
  );
}

export default LeftSideBar;
