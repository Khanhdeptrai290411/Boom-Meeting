import React, { useState } from 'react';
import LeftSideBar from './LeftSideBarM';
import MainMeeting from './MainMeeting';

function MeetingPage({ toggleMenuSidebar,isDarkMode,
    toggleDarkMode,userName,userId }) {
  // State để lưu trữ trạng thái của sidebar, sử dụng từ App
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  // Hàm này sẽ toggle trạng thái sidebar


  return (
    <>
      {/* Left Sidebar */}

        <LeftSideBar
          toggleMenuSidebar={toggleMenuSidebar} // Sử dụng hàm toggle của chính MeetingPage
          isDarkMode={isDarkMode} 
          toggleDarkMode={toggleDarkMode}// Tạm thời để false, nếu muốn bật chế độ tối
          title="Meeting" // Tiêu đề của sidebar là Meeting
          userName={userName}
        />

      {/* Main Meeting Area */}
      <MainMeeting 
      userId={userId}/>
    </>
  );
}

export default MeetingPage;