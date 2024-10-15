import React, { useState } from 'react';
import LeftSideBar from './LeftSideBarD';
import MainDocuments from './MainDocuments';

function DocumentsPage({ toggleMenuSidebar, isDarkMode, toggleDarkMode,  }) {
  const [activeTab, setActiveTab] = useState('notification');
  return (
    <>
      {/* Left Sidebar */}
      <LeftSideBar
        toggleMenuSidebar={toggleMenuSidebar}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        title="Documents"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Documents Area */}
      <MainDocuments activeTab={activeTab} />
    </>
  );
}

export default DocumentsPage;
