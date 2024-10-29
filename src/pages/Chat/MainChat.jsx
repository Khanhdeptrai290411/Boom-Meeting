import React from 'react';
import { Phone, Video, Info, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function MainChat({ selectedChat, toggleRightSidebar }) {
  // Dữ liệu giả của tin nhắn
  const messages = [
    { sender: 'A', message: 'Hello, how are you?', timestamp: '10:00 AM' },
    { sender: 'B', message: 'I am fine, thank you! And you?', timestamp: '10:02 AM' },
    { sender: 'A', message: 'Doing well, thanks for asking!', timestamp: '10:03 AM' },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {selectedChat && (
        <>
          {/* Header Section */}
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

          {/* Chat Messages Section */}
          <div className="flex-1 p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'A' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`p-3 rounded-lg ${msg.sender === 'A' ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs text-gray-500">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => handleFileUpload(e)}
              />
              <label
                htmlFor="file-upload"
                className="m-2 p-2 bg-gray-300 dark:bg-white text-white dark:text-black rounded-full shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span className="w-5 h-5">📎</span>
              </label>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button className="ml-2 p-2 bg-blue-500 dark:bg-white text-white dark:text-black rounded-full shadow-md hover:opacity-90 transition-opacity">
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
