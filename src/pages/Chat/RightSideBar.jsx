  import React from 'react';
  import {
    Avatar,
    AvatarFallback,
    AvatarImage
  } from '@/components/ui/avatar';
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
  } from '@/components/ui/tabs';

  function RightSidebar({ selectedChat}) {
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
                <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={selectedChat?.name} />
                <AvatarFallback>{selectedChat?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 font-semibold dark:text-white">{selectedChat?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active 2h ago</p>

              {/* Button to create group */}
              <button
                onClick={() => handleCreateGroup(selectedChat?.name)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 dark:text-black dark:bg-white dark:hover:bg-blue-500"
              >
                Create Group with {selectedChat?.name}
              </button>
            </div>
          </TabsContent>

          {/* Tab Content for Files */}
          <TabsContent value="files" className="mt-4">
            <p className="text-center text-gray-500 dark:text-gray-400">No files shared yet</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  export default RightSidebar;
