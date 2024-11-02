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
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user ? user.id : null;
  
        if (!userId) {
          throw new Error('User is not authenticated');
        }
  
        const response = await fetch(`${socketServerURL}/friends/requests?userId=${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch friend requests');
        }
  
        const requests = await response.json();
        setChats(requests.map(req => ({
          id: req.id,
          user_id: req.user_id,
          friend_id: req.friend_id,
          name: req.userDetail ? req.userDetail.username : 'Unknown', // Lấy thông tin từ userDetail
          status: req.status,
        })));
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };
  
    fetchFriendRequests();
  }, []);
  

  
  

  const handleAccept = async (id) => {
    try {
      const chat = chats.find(chat => chat.id === id);
  
      if (!chat) {
        throw new Error('Friend request not found');
      }
  
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.id : null;  // ID người dùng hiện tại
  
      if (!userId) {
        throw new Error('User is not authenticated');
      }
  
      console.log("User ID:", userId);
      console.log("Friend ID:", chat.user_id); // `user_id` là ID của người gửi yêu cầu kết bạn
  
      const response = await fetch(`${socketServerURL}/friends/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: userId,          // ID người dùng hiện tại
          friendId: chat.user_id   // ID người gửi yêu cầu kết bạn
        }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to accept friend request: ${errorResponse.message}`);
      }
  
      const result = await response.json();
      console.log(result.message);
  
      // Xóa yêu cầu kết bạn khỏi danh sách
      setChats(prevChats => prevChats.filter(chat => chat.id !== id));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  
  
  
  
  

  const handleDecline = async (id) => {
    try {
      const chat = chats.find(chat => chat.id === id);
      
      if (!chat) {
        throw new Error('Friend request not found');
      }
  
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.id : null;
  
      if (!userId) {
        throw new Error('User is not authenticated');
      }
  
      const response = await fetch(`${socketServerURL}/friends/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: userId,           // ID của người dùng hiện tại (người nhận yêu cầu)
          friendId: chat.user_id    // ID của người gửi yêu cầu kết bạn
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to decline friend request');
      }
  
      setChats(prevChats => prevChats.filter(chat => chat.id !== id));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };
  

  
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // Default tab is 'messages'
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [socket, setSocket] = useState(null); // State để lưu socket instance
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ local storage
  const userName = user ? user.username : "Guest"; // Lấy tên người dùng hoặc hiển thị "Guest"
  const userId = user ? user.id : null; // Lấy ID người dùng
  
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
  //
  useEffect(() => {
    // Đếm số phần tử có status là 'accepted' và cập nhật friendRequests
    const countStatusZero = chats.filter((chat) => chat.status === 'accepted').length;
    setFriendRequests(countStatusZero);
  }, [chats]);

  const [friendRequests, setFriendRequests] = useState(); // Number of friend requests

  const [friends, setFriends] = useState([]);

// useEffect để lấy danh sách bạn bè sau khi component mount
useEffect(() => {
  const fetchChatMembers = async () => {
    if (!userId) {
      console.error('Invalid User ID');
      return;
    }

    try {
      // Giả sử bạn muốn lấy những cuộc trò chuyện của user hiện tại
      const response = await fetch(`${socketServerURL}/api/chats/chatmembers/list?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat members');
      }

      const chatMembers = await response.json();

      // Xác định chatId dựa trên các thành viên và gán vào `friends` hoặc `selectedChat`
      setFriends(chatMembers.map(member => ({
        id: member.chatId, // Sử dụng chatId thay vì userId để tham chiếu tới cuộc trò chuyện
        userId: member.userId,
        name: member.user.username,
        email: member.user.email,
      })));
    } catch (error) {
      console.error('Error fetching chat members:', error);
    }
  };

  fetchChatMembers();
}, [userId]);



//đổi màu
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
//set để nút đổi màu
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
// bật tắt navbar
  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
  };
  
  
  const toggleMenuSidebar = () => {
    setShowMenuSidebar(!showMenuSidebar);
  };
  const [allUsers, setAllUsers] = useState([]); // State để lưu danh sách tất cả người dùng

//lấy tất cả users
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${socketServerURL}/api/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      setAllUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  if (activeTab === 'archive') {
    fetchUsers();
  }
}, [activeTab]);
//render phần search
const [searchQuery, setSearchQuery] = useState('');

//GỬi LMKB
const sendFriendRequest = async (friendId) => {
  try {
    // Lấy ID người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem('user')); 
    const userId = user ? user.id : null; // Lấy ID người dùng từ localStorage

    const response = await fetch(`${socketServerURL}/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId: userId, friendId: friendId }), // userId là ID của người gửi yêu cầu, friendId là ID của bạn
    });

    if (!response.ok) {
      throw new Error('Failed to send friend request');
    }

    const result = await response.json();
    console.log('Friend request sent:', result);
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};


const renderTabContent = () => {
  switch (activeTab) {
    case 'archive':
      const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return (
        <div className="overflow-y-auto flex-1 p-4">
          <h2 className="text-2xl font-semibold text-center dark:text-white mb-6">
            All Users
          </h2>

          {filteredUsers.map((user) => (
            <div key={user.id} className="flex flex-col sm:flex-row items-center sm:items-start p-6 bg-white dark:bg-gray-800 rounded-xl mb-5 shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Nội dung hiển thị thông tin người dùng */}
              <Avatar className="w-20 h-20 rounded-full shadow-md flex-shrink-0">
                <AvatarImage src={ReactLogo} alt={user.username} />
                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xl font-medium dark:text-white block mb-2">
                  {user.username}
                </span>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all text-sm w-full sm:w-auto" onClick={() => sendFriendRequest(user.id)}>
                  Add Friend
                </button>
              </div>
            </div>
          ))}
        </div>
      );

      case 'users':
        return (
          <div className="overflow-y-auto flex-1 p-4">
            <h2 className="text-2xl font-semibold text-center dark:text-white mb-6">
              Friend Requests
            </h2>

            {/* Kiểm tra nếu không có yêu cầu kết bạn */}
            {chats.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No friend requests available.
              </p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex flex-col sm:flex-row items-center sm:items-start p-6 bg-white dark:bg-gray-800 rounded-xl mb-5 shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700 space-y-4 sm:space-y-0 sm:space-x-6"
                >
                  <Avatar className="w-20 h-20 rounded-full shadow-md flex-shrink-0">
                    <AvatarImage src={ReactLogo} alt={chat.name} />
                    <AvatarFallback>{chat.name ? chat.name.charAt(0) : '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xl font-medium dark:text-white block mb-2">
                      {chat.name}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 mt-2">
                      {/* Button Accept */}
                      <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all text-sm w-full sm:w-auto"
                        onClick={() => handleAccept(chat.id)}
                      >
                        Accept
                      </button>

                      {/* Button Decline */}
                      <button
                        className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all text-sm w-full sm:w-auto"
                        onClick={() => handleDecline(chat.id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );


        case 'messages':
      default:
        // Hiển thị danh sách bạn bè
        const filteredFriends = friends.filter(friend =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="overflow-y-auto flex-1">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className={`flex items-center p-4 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 cursor-pointer transition-all ${
                  selectedChat && selectedChat.id === friend.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                }`}
                onClick={() => setSelectedChat(friend)}
              >
                <Avatar className="w-12 h-12 mr-4 shadow-md dark:shadow-gray-700">
                  <AvatarImage src={ReactLogo} alt={friend.name} />
                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold dark:text-white">{friend.name}</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</span>
                  </div>
                </div>
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
                searchQuery={searchQuery} // Truyền searchQuery vào ChatLayout
                setSearchQuery={setSearchQuery} // Truyền setSearchQuery vào ChatLayout
                socket={socket} // Truyền socket xuống ChatLayout
                socketServerURL={socketServerURL}
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