import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Info, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function MainChat({ selectedChat, toggleRightSidebar, socket, socketServerURL }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  // Ref để tham chiếu đến container chứa tin nhắn
  const messagesEndRef = useRef(null);

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
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    if (socket && selectedChat) {
      socket.emit('joinChat', selectedChat.id);

      const handleReceiveMessage = (message) => {
        if (message.chatId === selectedChat.id) {
          setMessages((prevMessages) => {
            if (prevMessages.some((msg) => msg.id === message.id)) {
              return prevMessages;
            }
            return [...prevMessages, message];
          });
        }
      };

      socket.on('receiveMessage', handleReceiveMessage);

      return () => {
        socket.off('receiveMessage', handleReceiveMessage);
      };
    }
  }, [selectedChat, socket, userId, socketServerURL]);

  // Cuộn đến cuối cùng khi messages thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
                className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {/* Thêm ref để cuộn đến đây */}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
