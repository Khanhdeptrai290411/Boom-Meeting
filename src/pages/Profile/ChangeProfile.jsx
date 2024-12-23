import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { io } from 'socket.io-client'; // Import Socket.IO client
function ChangeProfile({ userName, email, userId, socket, socketServerURL }) {
  const [newUserName, setNewUserName] = useState(userName);
  const [newEmail, setNewEmail] = useState(email);

  useEffect(() => {
    // Khi `userName` hoặc `email` thay đổi, cập nhật các state tương ứng
    setNewUserName(userName);
    setNewEmail(email);
  }, [userName, email]);

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${socketServerURL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: newUserName,
          email: newEmail,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
  
      const result = await response.json();
  
      if (result && result.user) {
        // Gửi sự kiện cập nhật đến server qua socket
        if (socket) {
          socket.emit('profileUpdated', result.user); // Chỉ phát sự kiện khi server trả về đúng user
        }
        alert('Cập nhật thông tin thành công!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  };
  

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Chào mừng, {userName}!
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Thay đổi tên</label>
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Thay đổi email</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSaveChanges}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Lưu thay đổi
      </button>
    </div>
  );
}

export default ChangeProfile;
