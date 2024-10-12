import React, { useState } from 'react';
import LeftSideBar from './LeftSideBarD';
import MainDocuments from './MainDocuments';

function DocumentsPage({ toggleMenuSidebar, isDarkMode, toggleDarkMode, selectedChat, setSelectedChat }) {
  return (
    <>
      {/* Left Sidebar */}
      <LeftSideBar
        toggleMenuSidebar={toggleMenuSidebar}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        title="Documents"
      />

      {/* Main Documents Area */}
      <MainDocuments selectedChat={selectedChat} />
    </>
  );
}

export default DocumentsPage;
