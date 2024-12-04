import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, Send,File,Paperclip  } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function MainChat({ selectedChat, toggleRightSidebar, socket, socketServerURL, }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;
  const fileInputRef = useRef(null); // Thêm ref để kết nối với input file
  
  // Ref để tham chiếu đến container chứa tin nhắn
  const messagesEndRef = useRef(null);
  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Mở cửa sổ chọn file khi nhấn vào nút "kẹp giấy"
    }
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedChat) {
      const message = {
        chatId: selectedChat.id,
        senderId: userId,
        content: newMessage,
      };

      try {
        const response = await fetch(`${socketServerURL}/api/chats/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(message),
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const savedMessage = await response.json();

        if (socket) {
          socket.emit('sendMessage', savedMessage.message);
        }

        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.id !== savedMessage.message.id),
          savedMessage.message,
        ]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && selectedChat) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', selectedChat.id);
      formData.append('senderId', userId);
  
      try {
        const response = await fetch(`${socketServerURL}/api/chats/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Token cần phải có
          },
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
  
        const savedMessage = await response.json();
        if (savedMessage && savedMessage.message) {
          const message = {
            chatId: selectedChat.id,
            senderId: userId,
            content: 'Sent an image', // Nội dung tin nhắn
            filePath: savedMessage.message.filePath, // Đường dẫn file
            timestamp: new Date().toISOString(), // Thêm timestamp
          };
  
          // Gửi tin nhắn qua socket để những người khác nhận được tin nhắn
          if (socket) {
            socket.emit('sendMessage', message);
          }
  
          // Cập nhật state ngay lập tức cho người gửi
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };
  
  
  
  
  
  
  
  
  
  
  
  
  // Hàm để cuộn đến cuối cùng
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!socketServerURL || !selectedChat || !userId) return;
  
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${socketServerURL}/api/chats/${selectedChat.id}/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
  
        const data = await response.json();
        console.log('Fetched messages from API:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  
    fetchMessages();
  }, [selectedChat, socketServerURL, userId]);
  
  
  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit('joinChat', selectedChat.id);
  
      const handleReceiveMessage = (message) => {
        console.log('Received message:', message); // Log kiểm tra tin nhắn nhận được từ server
  
        // Chỉ xử lý tin nhắn thuộc về cuộc trò chuyện hiện tại
        if (message.chatId == selectedChat.id) {
          setMessages((prevMessages) => {
            // Kiểm tra tin nhắn trùng lặp bằng `id`
            const isDuplicate = prevMessages.some((msg) => msg.id === message.id);
            if (isDuplicate) {
              return prevMessages;
            }
  
            // Cập nhật danh sách tin nhắn
            return [...prevMessages, message];
          });
        }
      };
  
      // Lắng nghe sự kiện `receiveMessage`
      socket.on('receiveMessage', handleReceiveMessage);
  
      // Cleanup khi component unmount hoặc `selectedChat` thay đổi
      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [selectedChat, socket]);
  
  
  
  
  
  
  

  // Cuộn đến cuối cùng khi messages thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  return (
    <div className="flex-1 flex flex-col">
      {selectedChat && (
        <>
          <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center">
              <Avatar className="w-10 h-10 mr-3 dark:shadow-gray-700 dark:text-white shadow-md">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={selectedChat.name} />
                <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold dark:text-white">{selectedChat.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Phone className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-300 transition-colors" />
              <Video className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-300 transition-colors" />
              <Info
                className="w-6 h-6 text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
                onClick={toggleRightSidebar}
              />
            </div>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
  {messages.map((msg, index) => (
    <div
      key={msg.id || index}
      className={`flex items-start ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
    >
      {msg.senderId !== userId && (
        <div className="mr-3">
          <Avatar className="w-10 h-10 mr-3 dark:shadow-gray-700 dark:text-white shadow-md">
            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={msg.sender?.username || 'U'} />
            <AvatarFallback>{msg.sender?.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div>
        {msg.senderId !== userId && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
            {msg.sender?.username || 'Unknown'}
          </p>
        )}

        <div
          className={`p-3 rounded-xl max-w-xs shadow-md ${
            msg.senderId === userId
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-black rounded-bl-none'
          }`}
        >
          {msg.filePath ? (
            msg.filePath.endsWith('.jpg') ||
            msg.filePath.endsWith('.jpeg') ||
            msg.filePath.endsWith('.png') ||
            msg.filePath.endsWith('.gif') ? (
              <img
                src={`${socketServerURL}/${msg.filePath}`}
                alt="Sent"
                className="max-w-full rounded"
              />
            ) : msg.filePath.endsWith('.pdf') ? (
              <a
                href={`${socketServerURL}/${msg.filePath}`}
                download
                className="text-sm font-semibold underline text-blue-700"
              >
                {msg.filePath.split('/').pop()}
              </a>
            ) : msg.filePath.endsWith('.docx') ? (
              <a
                href={`${socketServerURL}/${msg.filePath}`}
                download
                className="text-sm font-semibold underline text-blue-700"
              >
                {msg.filePath.split('/').pop()}
              </a>
            ) : (
              <a
                href={`${socketServerURL}/${msg.filePath}`}
                download
                className="text-sm font-semibold underline text-blue-700"
              >
                Download {msg.filePath.split('.').pop().toUpperCase()}
              </a>
            )
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  ))}
  <div ref={messagesEndRef} />
</div>









          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center">
              <button
                onClick={handleAttachFile}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-opacity mr-2"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-500 dark:bg-white text-white dark:text-black rounded-full shadow-md hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MainChat;