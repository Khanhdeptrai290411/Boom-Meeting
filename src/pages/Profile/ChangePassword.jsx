import React, { useState } from 'react';
import { io } from 'socket.io-client'; // Import Socket.IO client
function ChangePassword({ userId, socketServerURL }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không trùng khớp.');
      return;
    }

    try {
      const response = await fetch(`${socketServerURL}/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }
      const socket = io(socketServerURL);
      socket.emit('profileUpdated', { id: userId });

      alert('Đổi mật khẩu thành công!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Không thể đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Đổi mật khẩu
      </h2>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Mật khẩu cũ</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Mật khẩu mới</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-200 mb-2">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handlePasswordChange}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Đổi mật khẩu
      </button>
    </div>
  );
}

export default ChangePassword;
