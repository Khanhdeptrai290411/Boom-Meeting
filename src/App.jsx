import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Phone,
  Video,
  Info,
  Search,
  Archive,
  Users,
  MessageCircle,
  Send,
  Menu,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavBar from './NavigationBar';
import ChatLayout from './pages/Chat/ChatLayout';

import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Đảm bảo có Navigate

import {user,messages} from './Mockdata';
import VideoCall from './pages/Call/VideoCall';
import MeetingRoom from './pages/Meeting/MeetingRoom';
import MeetingPage from './pages/Meeting/MeetingPage';
import ReactLogo from './assets/ok.jpg'; // Đảm bảo đường dẫn chính xác
import DocumentsPage from './pages/Documents/DocumentsPage';
import Auth from './pages/Login/Auth';
import io from 'socket.io-client'; // Import socket.io-client

const socketServerURL = 'http://localhost:3009'; // Địa chỉ server Socket.io
export default function MessengerInterface() {
  const [chats, setChats] = useState([
    { id: 1, name: 'Kailey', lastMessage: 'Say My Name', time: '9:36', unread: false,status:'0' },
    { id: 2, name: 'Maryjane', lastMessage: 'Check On It', time: '12:02', unread: true,status:'1' },
    { id: 3, name: 'Niko', lastMessage: 'You Send Me', time: '10:35', unread: true,status:'1' },
    { id: 4, name: 'Agustin', lastMessage: 'The Tide is High', time: '04:00', unread: false,status:'0' },
    { id: 5, name: 'Manuel', lastMessage: 'I Will Always Love Y...', time: '08:42', unread: false,status:'0' },
    { id: 6, name: 'Treva', lastMessage: 'There goes my baby', time: '08:42', unread: false,status:'1' },
  ]);
  
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // Default tab is 'messages'
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [socket, setSocket] = useState(null); // State để lưu socket instance
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ local storage
  const userName = user ? user.username : "Guest"; // Lấy tên người dùng hoặc hiển thị "Guest"
  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Lưu token vào Local Storage
    setIsAuthenticated(true); // Cập nhật trạng thái xác thực
    const socketConnection = io(socketServerURL, {
      auth: { token }, // Gửi token khi kết nối
    });

    socketConnection.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    setSocket(socketConnection); // Lưu socket instance
  };
  useEffect(() => {
    // Đếm số phần tử có status là '0' và cập nhật friendRequests
    const countStatusZero = chats.filter((chat) => chat.status === '0').length;
    setFriendRequests(countStatusZero);
  }, [chats]);
  const [friendRequests, setFriendRequests] = useState(); // Number of friend requests
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };
  const handleAccept = (id) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, status: '1' } : chat
      )
    );
  };
  
  const handleDecline = (id) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
  };
  
  const toggleMenuSidebar = () => {
    setShowMenuSidebar(!showMenuSidebar);
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'archive':
        return (
          <div className="overflow-y-auto flex-1 p-4">
            {/* Archive messages content */}
            <p className="text-gray-600 dark:text-gray-400">These are archived messages from people who haven’t added you as a friend yet.</p>
          </div>
        );
        case 'users':
          return (
            <div className="overflow-y-auto flex-1 p-4">
              <h2 className="text-2xl font-semibold text-center dark:text-white mb-6">
                Friend Requests
              </h2>
          
              {/* Lọc và hiển thị những người có status = '0' */}
              {chats
                .filter((chat) => chat.status === '0')
                .map((chat) => (
                  <div
                    key={chat.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start p-6 bg-white dark:bg-gray-800 rounded-xl mb-5 shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 space-y-4 sm:space-y-0 sm:space-x-6"
                  >
                    {/* Avatar */}
                    <Avatar className="w-20 h-20 rounded-full shadow-md flex-shrink-0">
                      <AvatarImage src={ReactLogo} alt={chat.name} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
          
                    {/* Nội dung yêu cầu */}
                    <div className="flex-1 text-center sm:text-left">
                      {/* Tên người gửi */}
                      <span className="text-xl font-medium dark:text-white block mb-2">
                        {chat.name}
                      </span>
          
                      {/* Nút Accept và Decline */}
                      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-2">
                        <button
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all text-sm w-full sm:w-auto"
                          onClick={() => handleAccept(chat.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all text-sm w-full sm:w-auto"
                          onClick={() => handleDecline(chat.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          );
          case 'messages':
            default:
              return (
                <div className="overflow-y-auto flex-1">
                  {/* Lọc và hiển thị những người có status = '1' (đã được accept) */}
                  {chats
                    .filter((chat) => chat.status === '1')
                    .map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-center p-4 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 cursor-pointer transition-all ${
                          selectedChat && selectedChat.id === chat.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                        }`}
                        onClick={() => setSelectedChat(chat)}
                      >
                        <Avatar className="w-12 h-12 mr-4 shadow-md dark:shadow-gray-700">
                          <AvatarImage src={ReactLogo} alt={chat.name} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h2 className="font-semibold dark:text-white">{chat.name}</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{chat.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
                        </div>
                        {chat.unread && <div className="w-3 h-3 bg-blue-500 rounded-full self-center"></div>}
                      </div>
                    ))}
                </div>
              );
    }
  };
  return (
    <Router>
      <div className="flex h-screen bg-white dark:bg-gray-900 transition-colors  duration-200">
          {/* Menu Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-64 z-50 bg-gray-100 dark:bg-gray-800 shadow-lg border-r border-gray-300 dark:border-gray-700 transition-transform transform ${
              showMenuSidebar ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <NavBar toggleMenuSidebar={toggleMenuSidebar} />
          </div>
          {showMenuSidebar && (
          <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenuSidebar}
        ></div>
          )}
        {/*RouterPage*/}

          

          <Routes>
            <Route path='/' element={<Auth onLogin={handleLogin} />} />
            <Route
              path="/chat"
              element={isAuthenticated ? (
                <ChatLayout
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                chats={chats}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                toggleMenuSidebar={toggleMenuSidebar}
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                friendRequests={friendRequests}
                renderTabContent={renderTabContent}
                showRightSidebar={showRightSidebar}
                toggleRightSidebar={toggleRightSidebar}
                />
              ) : (
                <Navigate to="/" replace /> // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
              )}
            />
            <Route path="/meeting" element={ isAuthenticated ? (
              <MeetingPage 
                toggleMenuSidebar={toggleMenuSidebar}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                userName = {userName}
              />
              
            ) : (
              <Navigate to="/" replace /> // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            )} />
            <Route path="/meeting/:roomId" element={isAuthenticated ? (
                <VideoCall />
              ) : (
                <Navigate to="/" replace />
              )} />
            <Route path="/document" element={ isAuthenticated ? (
              <DocumentsPage
                toggleMenuSidebar={toggleMenuSidebar}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}

                setSelectedChat={setSelectedChat}
              />
            ) : (
              <Navigate to="/" replace /> // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            )}>

            </Route>

          </Routes>
      </div>
    </Router>
  );
}