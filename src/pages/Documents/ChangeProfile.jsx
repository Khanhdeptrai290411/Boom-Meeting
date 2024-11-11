import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function ChangeProfile({ userName, email }) {
  const [newUserName, setNewUserName] = useState(userName);
  const [newEmail, setNewEmail] = useState(email);

  const handleSaveChanges = () => {
    // Xử lý lưu thông tin mới ở đây
    console.log("Tên mới:", newUserName, "Email mới:", newEmail);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Chào mừng, {userName}!
      </h2>

      <div className="flex items-center mb-4">
        <Avatar className="w-16 h-16 mr-4">
          <AvatarImage src="/placeholder.svg" alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{userName}</h3>
          <span className="text-gray-500 dark:text-gray-400">{email}</span>
        </div>
      </div>

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
