import React, { useState } from 'react';
import LeftSideBar from './LeftSideBar';
import ChangeProfile from './ChangeProfile';
import ChangePassword from './ChangePassword';

function ProfilePage({ toggleMenuSidebar, isDarkMode, toggleDarkMode, user,socket, socketServerURL }) {
  const [activeTab, setActiveTab] = useState('changeProfile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'changeProfile':
        return (
          <ChangeProfile
            userName={user.username}
            email={user.email}
            userId={user.id}
            socketServerURL={socketServerURL}
            socket={socket}
          />
        );
      case 'changePassword':
        return (
          <ChangePassword
            userId={user.id}
            socketServerURL={socketServerURL}
            socket={socket}
          />
        );
      default:
        return (
          <ChangeProfile
            userName={user.username}
            email={user.email}
            userId={user.id}
            socket={socket}
            socketServerURL={socketServerURL}
          />
        );
    }
  };

  return (
    <>
      <LeftSideBar
        toggleMenuSidebar={toggleMenuSidebar}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      <div
        className="w-full space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
        style={{ margin: 'auto', width: '400px' }}
      >
        {renderTabContent()}
      </div>
    </>
  );
}

export default ProfilePage;
