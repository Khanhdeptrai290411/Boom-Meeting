import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  FileText, 
  Share, 
  Clock,
  X 
} from 'lucide-react';
function NavBar({toggleMenuSidebar}) {
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 p-4 transition-transform transform">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl dark:text-white mb-4">Menu</h2>
        <button className="mb-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all" onClick={toggleMenuSidebar} ><X className="w-5 h-5 text-gray-600 dark:text-white" /></button >
      </div>
      
      <ul className="space-y-4">
        <Link to="/chat">
          <li className="cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 p-2 rounded transition-all">
            Chat
          </li>
        </Link>
        <Link to="/meeting">
          <li className="cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 p-2 rounded transition-all">
            Meeting
          </li>
        </Link>
        <Link to="/document">
          <li className="cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 p-2 rounded transition-all">
            Document
          </li>
        </Link>
        <Link to="/schedule">
          <li className="cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 p-2 rounded transition-all">
            Schedule
          </li>
        </Link>
        <Link to="/Logout">
          <li className="cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 p-2 rounded transition-all">
            Logout
          </li>
        </Link>
        
      </ul>
    </div>
  );
}

export default NavBar;
