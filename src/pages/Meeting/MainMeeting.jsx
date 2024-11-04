import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function generateRandomCode(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    if (i % 3 === 2 && i < length - 1) {
      result += '-'; // Thêm dấu gạch nối sau mỗi 3 ký tự
    }
  }
  return result;
}
function MainMeeting(userId) {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  // Chuyen generate code sang server xu li 
  const handleCreateMeeting = async () => {
    // const generatedMeetingCode = generateRandomCode(9);
    try {
        const response = await fetch('http://localhost:3009/api/meeting/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ createdBy: userId }) // Add body if needed
        });

        if (!response.ok) {
            throw new Error("Failed to create meeting"); // Handle error properly
        }

        const data = await response.json();
        if(data.message=="Create Room Successfully")
        { 
          const roomCode = data.newRoom.roomCode;  
       
          setMeetingCode(data.newRoom.roomCode);
          navigate(`/meeting/${roomCode}`);  // Chuyển trang tới phòng vừa tạo

     
        }
        // Use the response data as needed
        console.log(data);
        
    } catch (error) {
        console.error(error.message);
        // Handle error display to user
    }
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
