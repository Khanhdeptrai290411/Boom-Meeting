import React from 'react';
import {
  Phone,
  Video,
  Info,
  Send
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function MainChat({ selectedChat, toggleRightSidebar }) {
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
          <div className="flex-1 p-4">
            {/* Chat messages would go here */}
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center">
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
