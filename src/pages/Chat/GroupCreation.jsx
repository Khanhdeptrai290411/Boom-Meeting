import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function GroupCreation({ socketServerURL, onClose,socket }) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupName, setGroupName] = useState('');

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${socketServerURL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [socketServerURL]);

  // Handle search filter
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add user to selected list
  const handleAddUser = (user) => {
    setSelectedUsers((prevSelected) => [...prevSelected, user]);
    setAllUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
  };

  // Remove user from selected list
  const handleRemoveUser = (user) => {
    setAllUsers((prevUsers) => [...prevUsers, user]);
    setSelectedUsers((prevSelected) =>
      prevSelected.filter((selected) => selected.id !== user.id)
    );
  };

  // Handle group creation
  const handleCreateGroup = async () => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id; // Lấy `userId` từ localStorage
    console.log('User ID:', userId); // Kiểm tra `userId` trong console
  
    if (groupName && selectedUsers.length > 0 && userId) {
      let userIds = selectedUsers.map((user) => user.id);
      
      // Thêm `userId` vào `userIds` nếu chưa có
      if (!userIds.includes(userId)) {
        userIds.push(userId);
      }
  
      try {
        const response = await fetch(`${socketServerURL}/api/chats/group/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ groupName, userIds, userId }), // Gửi `userId` từ client
        });
  
        if (response.ok) {
          const data = await response.json();
          socket.emit('createGroup', { chat: data.chat, userIds });
          onClose();
        } else {
          console.error('Failed to create group');
        }
      } catch (error) {
        console.error('Error creating group:', error);
      }
    } else {
      alert('Please enter a group name and select at least one member.');
    }
  };
  
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create Group</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded focus:outline-none dark:bg-gray-700 dark:text-white"
        />

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* User List */}
        <div className="flex">
          {/* Available Users */}
          <div className="flex-1">
            <h3 className="text-gray-800 dark:text-white mb-2">All Users</h3>
            <div className="h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  onClick={() => handleAddUser(user)}
                >
                  <span className="text-gray-800 dark:text-white">{user.email}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Users */}
          <div className="flex-1 ml-4">
            <h3 className="text-gray-800 dark:text-white mb-2">Selected Users</h3>
            <div className="h-40 overflow-y-auto">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span className="text-gray-800 dark:text-white">{user.username}</span>
                  <button onClick={() => handleRemoveUser(user)}>
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Group Button */}
        <button
          onClick={handleCreateGroup}
          className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}

export default GroupCreation;
