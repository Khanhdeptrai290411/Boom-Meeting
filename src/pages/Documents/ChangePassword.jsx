import React, { useState } from 'react';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);

  const handlePasswordChange = () => {
    if (oldPassword === "userOldPassword") { // Bạn cần kiểm tra mật khẩu cũ ở đây
      setIsPasswordCorrect(true);
      // Xử lý thay đổi mật khẩu mới
      if (newPassword === confirmNewPassword) {
        console.log("Mật khẩu đã được thay đổi thành công");
      } else {
        console.log("Mật khẩu mới và xác nhận mật khẩu không trùng khớp");
      }
    } else {
      setIsPasswordCorrect(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Đổi mật khẩu
      </h2>

      {!isPasswordCorrect && (
        <p className="text-red-500 mb-4">Mật khẩu cũ không chính xác.</p>
      )}

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
