import React, { useState } from 'react';
import LeftSideBar from './LeftSideBar';
import ChangeProfile from './ChangeProfile';
import ChangePassword from './ChangePassword';

function ProfilePage({ toggleMenuSidebar, isDarkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState('notification');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'changeProfile':
        return <ChangeProfile userName="user1" email="user1@gmail.com" />;
      case 'changePassword':
        return <ChangePassword />;
      default:
        return <div>Chọn một mục để xem nội dung.</div>;
    }
  };

  return (
    <>
      {/* Left Sidebar */}
      <LeftSideBar
        toggleMenuSidebar={toggleMenuSidebar}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      
      {/* Main Content */}
      <div className="w-full space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg" style={{ margin: 'auto', width: '400px' }}>
        {renderTabContent()}
      </div>  
    </>
  );
}

export default ProfilePage;
