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
        />

      {/* Main Chat Area */}
      <MainChat 
        selectedChat={selectedChat} 
        toggleRightSidebar={toggleRightSidebar} 
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
