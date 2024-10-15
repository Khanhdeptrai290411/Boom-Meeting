import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MainMeeting() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');

  const handleCreateMeeting = () => {
    const email = 'user@example.com'; // Đây là email giả sử đã có của người dùng
    const randomNumber = Math.floor(Math.random() * 10000);
    const generatedMeetingCode = `${email.split('@')[0]}-${randomNumber}`;
    navigate(`/meeting/${generatedMeetingCode}`);
  };

  const handleJoinMeeting = () => {
    if (meetingCode) {
      navigate(`/meeting/${meetingCode}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h2 className="text-2xl sm:text-3xl font-bold dark:text-white text-center mb-6">
        Tính năng họp và gọi video
      </h2>

      <div className="space-y-4 w-full max-w-md">
        <button
          onClick={handleCreateMeeting}
          className="w-full px-4 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all text-lg"
        >
          Bắt đầu một cuộc họp tức thì
        </button>

        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="text"
            placeholder="Nhập mã cuộc họp"
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleJoinMeeting}
            className="w-full sm:w-auto px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-lg"
          >
            Tham gia
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainMeeting;
