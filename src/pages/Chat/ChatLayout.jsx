// ChatLayout.jsx
import React from 'react';
import LeftSideBar from './LeftSideBar';
import MainChat from './MainChat';
import RightSidebar from './RightSideBar';

function ChatLayout({
  selectedChat,
  setSelectedChat,
  chats,
  isDarkMode,
  toggleDarkMode,
  toggleMenuSidebar,
  setActiveTab,
  activeTab,
  friendRequests,
  renderTabContent,
  showRightSidebar,
  toggleRightSidebar,
  searchQuery, // Nhận searchQuery từ props
  setSearchQuery,
  sendFriendRequest,
  socket,
  socketServerURL,
}) {
  return (
    <>
      {/* Left Sidebar */}
      <LeftSideBar
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          toggleMenuSidebar={toggleMenuSidebar}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          friendRequests={friendRequests}
          renderTabContent={renderTabContent}
          searchQuery={searchQuery} // Nhận searchQuery từ props// Nhận searchQuery từ props
          setSearchQuery={setSearchQuery} // Truyền setSearchQuery
          sendFriendRequest={sendFriendRequest}
          socketServerURL={socketServerURL}
          socket={socket}
        />

      {/* Main Chat Area */}
      <MainChat 
        selectedChat={selectedChat} 
        toggleRightSidebar={toggleRightSidebar} 
        socket={socket}
        socketServerURL={socketServerURL}
      />

      {/* Right Sidebar */}
      {showRightSidebar && (
        <RightSidebar
          selectedChat={selectedChat}
          
        />
      )}
    </>
  );
}

export default ChatLayout;
