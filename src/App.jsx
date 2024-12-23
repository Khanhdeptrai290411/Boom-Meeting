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
import ProfilePage from './pages/Profile/ProfilePage';
import Auth from './pages/Login/Auth';
import io from 'socket.io-client'; // Import socket.io-client

const socketServerURL = 'http://localhost:3009'; // Địa chỉ server Socket.io
export default function MessengerInterface() {
  const [allUsers, setAllUsers] = useState([]); // State để lưu danh sách tất cả người dùng

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('messages'); // Default tab is 'messages'
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [friendRequests, setFriendRequests] = useState(); // Number of friend requests
  const [friends, setFriends] = useState([]);
  const [socket, setSocket] = useState(null); // State để lưu socket instance
  const user = JSON.parse(localStorage.getItem('user')); // Lấy thông tin người dùng từ local storage
  const userName = user ? user.username : "Guest"; // Lấy tên người dùng hoặc hiển thị "Guest"
  const userId = user ? user.id : null; // Lấy ID người dùng
  // useEffect để lấy danh sách bạn bè sau khi component mount
  const handleLogin = (token) => {
    localStorage.setItem('token', token); // Lưu token vào Local Storage
    setIsAuthenticated(true); // Cập nhật trạng thái xác thực
    // Không cần kết nối socket ở đây nữa, việc kết nối sẽ do useEffect đảm nhiệm
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;
  
    if (!token || !userId) {
      console.error('No token or userId found, user is not authenticated');
      return;
    }
  
    // Thiết lập kết nối với server và truyền userId vào query
    const socketConnection = io(socketServerURL, {
      auth: { token },
      query: { userId }, // Truyền userId vào query
    });
  
    setSocket(socketConnection);
  
    // Lắng nghe sự kiện từ server
    socketConnection.on('connect', () => {
      console.log('Connected to socket server');
    });
  
    socketConnection.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  
    // Lắng nghe các sự kiện liên quan đến friend request
    socketConnection.on('friendRequestReceived', () => {
      console.log('New friend request received');
      fetchFriendRequests();
    });
  
    socketConnection.on('friendRequestAccepted', ({ fromUserId, toUserId }) => {
      console.log('Friend request accepted');
      if (user && (user.id === fromUserId || user.id === toUserId)) {
        fetchFriendRequests(); // Cập nhật lại danh sách yêu cầu kết bạn
        fetchChatMembers();    // Cập nhật danh sách bạn bè để thể hiện mối quan hệ đã chấp nhận
        fetchSuggestedFriends(); // Cập nhật danh sách người dùng để bỏ trạng thái 'pending'
      }
    });
  
    socketConnection.on('friendRequestCanceled', () => {
      console.log('Friend request canceled');
      fetchFriendRequests();
      fetchSuggestedFriends();
    });
  
    socketConnection.on('friendRequestSent', () => {
      console.log('Friend request sent');
      fetchFriendRequests();
    });
  
    // Cleanup khi component unmount
    return () => {
      socketConnection.off('friendRequestReceived');
      socketConnection.off('friendRequestAccepted');
      socketConnection.off('friendRequestCanceled');
      socketConnection.disconnect();
    };
  }, [userId]);
  
  
  
  
  
  // Lấy tất cả người dùng ngoại trừ chính mình, bao gồm trạng thái kết bạn

  const fetchSuggestedFriends = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.id : null;

      if (!userId) {
        console.error('User is not authenticated');
        return; // Thoát khỏi hàm nếu không có userId
      }

      // Gọi API lấy danh sách gợi ý kết bạn, bao gồm trạng thái
      const response = await fetch(`${socketServerURL}/friends/suggested?userId=${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggested friends');
      }

      const suggestedFriends = await response.json();
      setAllUsers(suggestedFriends); // Cập nhật danh sách người dùng kèm trạng thái kết bạn
    } catch (error) {
      console.error('Error fetching suggested friends:', error);
    }
  };

useEffect(() => {
  // Kiểm tra `activeTab` trước khi gọi hàm `fetchSuggestedFriends`
  if (activeTab === 'archive') {
    fetchSuggestedFriends();
  }
}, [activeTab]);
  
  
    
const sendFriendRequest = async (friendId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    if (!userId) {
      throw new Error('User is not authenticated');
    }

    if (!socket) {
      throw new Error('Socket is not connected');
    }

    // Gửi yêu cầu kết bạn thông qua API để lưu trữ vào cơ sở dữ liệu
    const response = await fetch(`${socketServerURL}/friends/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId, friendId }),
    });

    if (!response.ok) {
      throw new Error('Failed to send friend request');
    }

    const result = await response.json();
    // Gửi sự kiện qua socket sau khi gửi yêu cầu kết bạn
    

    console.log('Friend request sent:', result);

    // Cập nhật trạng thái của người dùng trong danh sách để chuyển sang "pending" ngay lập tức
    setAllUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === friendId ? { ...u, status: 'pending' } : u
      )
    );
    socket.emit('friendRequestSent', { userId, friendId });
    console.log('Friend request sent via API and UI updated.');
  } catch (error) {
    console.error('Error sending friend request:', error);
  }
};

  

const cancelFriendRequest = async (friendId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      throw new Error('User is not authenticated');
    }

    const userId = user.id;

    // URL endpoint để gọi hủy yêu cầu kết bạn
    const cancelUrl = `${socketServerURL}/friends/cancel?userId=${userId}&friendId=${friendId}`;
    console.log('Cancel URL:', cancelUrl);

    const response = await fetch(cancelUrl, {
      method: 'DELETE', // Chú ý: Phương thức DELETE
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error('Failed to cancel friend request');
    }

    const result = await response.json();
    console.log(result.message);

    // Cập nhật danh sách người dùng
    setAllUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === friendId ? { ...u, status: null } : u
      )
    );

    console.log('Friend request canceled via API and UI updated.');
  } catch (error) {
    console.error('Error canceling friend request:', error);
  }
};

  
  


const fetchFriendRequests = async () => {
  try {
    const response = await fetch(`${socketServerURL}/friends/requests?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch friend requests');

    const requests = await response.json();
    console.log('Fetched friend requests:', requests);

    if (Array.isArray(requests)) {
      setChats(requests.map(req => ({
        id: req.id,
        user_id: req.user_id,
        friend_id: req.friend_id,
        name: req.userDetail ? req.userDetail.username : 'Unknown',
        status: req.status,
      })));
    } else {
      console.error('Invalid friend requests data:', requests);
    }
  } catch (error) {
    console.error('Error fetching friend requests:', error);
  }
};

  
useEffect(() => {
  fetchFriendRequests();
}, []);


const handleAccept = async (id) => {
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

    // Gửi yêu cầu chấp nhận kết bạn tới server qua API
    const response = await fetch(`${socketServerURL}/friends/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        userId: userId,
        friendId: chat.user_id,
      }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Failed to accept friend request: ${errorResponse.message}`);
    }

    const result = await response.json();
    console.log(result.message);

    // Phát sự kiện thông qua socket để thông báo cho cả hai bên
    socket.emit('friendRequestAccepted', { fromUserId: userId, toUserId: chat.user_id });

    // Xóa yêu cầu kết bạn khỏi danh sách
    setChats(prevChats => prevChats.filter(chat => chat.id !== id));

    // Cập nhật danh sách bạn bè sau khi chấp nhận
    fetchChatMembers();
  } catch (error) {
    console.error('Error accepting friend request:', error);
  }
};

  
  // Lắng nghe sự kiện Socket.IO từ server để cập nhật UI ngay lập tức khi yêu cầu kết bạn được chấp nhận
  useEffect(() => {
    if (!socket) return;
  
    // Lắng nghe sự kiện 'friendRequestAccepted'
    socket.on('friendRequestAccepted', ({ fromUserId, toUserId }) => {
      console.log('Friend request accepted by:', toUserId);
  
      // Kiểm tra nếu người dùng hiện tại là người được chấp nhận thì cập nhật lại danh sách bạn bè
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && (currentUser.id === fromUserId || currentUser.id === toUserId)) {
        fetchFriendRequests(); // Cập nhật lại danh sách yêu cầu kết bạn
        fetchChatMembers();    // Cập nhật danh sách bạn bè để thể hiện mối quan hệ đã chấp nhận
      }
    });
  
    // Cleanup khi component bị unmount
    return () => {
      socket.off('friendRequestAccepted');
    };
  }, [socket]);


  
  
  
  
  
  
  
  
  
  

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
  
      // Gửi yêu cầu từ chối kết bạn tới server qua API
      const response = await fetch(`${socketServerURL}/friends/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          userId: userId,
          friendId: chat.user_id
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to decline friend request');
      }
  
      const result = await response.json();
      console.log(result.message);
  
      // Xóa yêu cầu kết bạn khỏi danh sách
      setChats(prevChats => prevChats.filter(chat => chat.id !== id));
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };
  
  
  // Lắng nghe sự kiện Socket.IO từ server để cập nhật UI ngay lập tức khi yêu cầu kết bạn bị từ chối
  useEffect(() => {
    if (!socket) return;
  
    // Lắng nghe sự kiện 'friendRequestDeclined'
    socket.on('friendRequestDeclined', ({ fromUserId, toUserId }) => {
      console.log('Friend request declined by:', toUserId);
  
      // Kiểm tra nếu người dùng hiện tại liên quan thì cập nhật lại danh sách yêu cầu kết bạn
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser && (currentUser.id === fromUserId || currentUser.id === toUserId)) {
        fetchFriendRequests(); // Cập nhật lại danh sách yêu cầu kết bạn
      }
    });
  
    // Cleanup khi component bị unmount
    return () => {
      socket.off('friendRequestDeclined');
    };
  }, [socket]);
  
  
  

  
  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    // Đặt lại các state về trạng thái ban đầu
    setIsAuthenticated(false);
    setFriends([]);
    setChats([]);
    setSelectedChat(null);
    setSocket(null);
  
    // Chuyển hướng người dùng đến trang đăng nhập
    navigate('/');
  };
  
  useEffect(() => {
    // Gọi hàm fetchChatMembers nếu `userId` và `socket` có giá trị hợp lệ
    if (isAuthenticated && userId && socket) {
      fetchChatMembers();
    }
  }, [userId, socket, isAuthenticated]);
  
  
  
  
  //
  // Cập nhật số lượng yêu cầu kết bạn đã được chấp nhận
useEffect(() => {
  // Đếm số phần tử có `status` là 'accepted' và cập nhật `acceptedFriendRequests`
  const acceptedRequestsCount = chats.filter((chat) => chat.status === 'accepted').length;
  setFriendRequests(acceptedRequestsCount);
}, [chats]);

// Lấy danh sách thành viên của các cuộc trò chuyện
useEffect(() => {
  if (socket) {
    socket.on('groupCreated', (data) => {
      console.log('New group created:', data);

      // Kiểm tra xem group có tồn tại trong friends chưa
      setFriends((prevFriends) => {
        const isAlreadyInList = prevFriends.some(friend => friend.id === data.chat.id);
        if (isAlreadyInList) return prevFriends; // Nếu đã tồn tại, không thêm lại

        return [
          ...prevFriends,
          {
            id: data.chat.id,
            name: data.chat.name,
            isGroup: true,
          }
        ];
      });
    });

    return () => {
      socket.off('groupCreated');
    };
  }
}, [socket]);


const fetchChatMembers = async () => {
  if (!userId || !socket) {
    console.error('Invalid User ID or socket connection not established');
    return;
  }

  try {
    const response = await fetch(`${socketServerURL}/api/chats/chatmembers/list?userId=${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });    

    if (!response.ok) {
      throw new Error('Failed to fetch chat members');
    }

    const chats = await response.json();

    setFriends(chats.map(chat => ({
      id: chat.id,
      name: chat.name,
      email: chat.type === 'private' ? chat.email : '', // Chỉ hiển thị email nếu là chat cá nhân
      isGroup: chat.type === 'group', // Đặt isGroup dựa trên type
    })));
  } catch (error) {
    console.error('Error fetching chat members:', error);
  }
};

useEffect(() => {
  // Gọi hàm fetchChatMembers nếu `userId` và `socket` có giá trị hợp lệ
  if (userId && socket) {
    fetchChatMembers();
  }
}, [userId, socket]);




  



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
  
//lấy tất cả users
// Lấy tất cả người dùng ngoại trừ chính mình, bao gồm trạng thái kết bạn







//render phần search
const [searchQuery, setSearchQuery] = useState('');

//GỬi LMKB

useEffect(() => {
  if (!socket) return;

  socket.on('userUpdated', (updatedUser) => {
    console.log('User information updated:', updatedUser);

    // Cập nhật thông tin người dùng trong localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser && currentUser.id == updatedUser.id) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...currentUser,
          username: updatedUser.username,
          email: updatedUser.email,
        })
      );
    }
    console.log('All Users Before Update:', allUsers);
    // Cập nhật React state
    setAllUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) =>
        user.id == updatedUser.id ? { ...user, ...updatedUser } : user
      );
  
      console.log('All Users After Update:', updatedUsers);
      return updatedUsers;
    });

    console.log('Friends Before Update:', friends);

    setFriends((prevFriends) => {
      const updatedFriends = prevFriends.map((friend) =>
        friend.id == updatedUser.id ? { ...friend, ...updatedUser } : friend
      );

      console.log('Friends After Update:', updatedFriends);
      return updatedFriends;
    });
  });

  return () => {
    socket.off('userUpdated');
  };
}, [socket]);
  



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
          <Avatar className="w-20 h-20 rounded-full shadow-md flex-shrink-0">
            <AvatarImage src={ReactLogo} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xl font-medium dark:text-white block mb-2">
              {user.username}
            </span>
            <button
              className={`px-6 py-2 rounded-lg text-sm w-full sm:w-auto ${
                user.status === 'pending'
                  ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              onClick={() =>
                user.status === 'pending'
                  ? cancelFriendRequest(user.id)
                  : sendFriendRequest(user.id)
              }
            >
              {user.status === 'pending' ? 'Cancel' : 'Add Friend'}
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
        const filteredFriends = friends.filter(friend =>
          friend.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div className="overflow-y-auto flex-1">
            {filteredFriends.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No friends found.
            </p>
          ) : (
            filteredFriends.map((friend) => (
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
                    <h2 className="font-semibold dark:text-white">
                      {friend.isGroup ? friend.name : friend.name}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</span>
                  </div>
                </div>
              </div>
            )))}
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
            <NavBar toggleMenuSidebar={toggleMenuSidebar} handleLogout={handleLogout}/>
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
                userId={userId}
              />
              
            ) : (
              <Navigate to="/" replace /> // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            )} />
            <Route path="/meeting/:roomId" element={isAuthenticated ? (
                <VideoCall  userId={userId}/>
              ) : (
                <Navigate to="/" replace />
              )} />
            <Route path="/profile" element={ isAuthenticated ? (
              <ProfilePage
                toggleMenuSidebar={toggleMenuSidebar}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                socket={socket} // Truyền socket xuống ChatLayout
                socketServerURL={socketServerURL}
                user={{
                  id: userId,
                  username: userName,
                  email: user?.email,
                }}
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