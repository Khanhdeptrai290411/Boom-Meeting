import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function RightSidebar({ selectedChat, socketServerURL }) {
  const userId = JSON.parse(localStorage.getItem('user'))?.id;
  const [chatMembers, setChatMembers] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      const fetchChatMembers = async () => {
        if (selectedChat?.id) {
          try {
            const response = await fetch(
              `http://localhost:3009/api/chats/chatmembers?chatId=${selectedChat.id}`
            );
            if (!response.ok) {
              throw new Error('Failed to fetch chat members');
            }
            const data = await response.json();
            setChatMembers(data);
          } catch (error) {
            console.error('Lỗi khi lấy danh sách thành viên:', error);
          }
        }
      };
  
      fetchChatMembers();
    }
  }, [selectedChat, socketServerURL, userId]);

  return (
    <div className="w-64 border-l border-gray-200 dark:border-gray-700 p-4 transition-transform transform">
      <Tabs defaultValue="info">
        <TabsList className="grid dark:text-white w-full grid-cols-2">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        {/* Tab Content for Info */}
        <TabsContent value="info" className="mt-4">
          <div className="text-center">
            <Avatar className="w-20 h-20 dark:text-white mx-auto shadow-md dark:shadow-gray-700">
              <AvatarImage
                src={`/placeholder.svg?height=80&width=80`}
                alt={selectedChat?.name}
              />
              <AvatarFallback>{selectedChat?.name?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <h3 className="mt-2 font-semibold dark:text-white">{selectedChat?.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active 2h ago</p>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-lg dark:text-white mb-2">
              Participants
            </h4>
            <ul>
              {chatMembers.map((member) => (
                <li key={member.id} className="flex items-center mb-2">
                  <Avatar className="w-8 h-8 mr-2 shadow-md">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40`}
                      alt={member.user.username}
                    />
                    <AvatarFallback>{member.user.username?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <span className="dark:text-white">{member.user.username}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* Tab Content for Files */}
        <TabsContent value="files" className="mt-4">
          <p className="text-center text-gray-500 dark:text-gray-400">
            No files shared yet
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RightSidebar;
