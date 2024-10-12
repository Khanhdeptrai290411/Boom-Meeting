import React from 'react';
import { FileText, Share, Clock, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function MainDocuments({ selectedChat, toggleRightSidebar }) {
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-100 dark:bg-gray-800 transition-colors">
      {/* Header Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: FileText, color: 'text-blue-500', label: 'Tài liệu mới' },
          { icon: Share, color: 'text-purple-500', label: 'Tạo từ cuộc họp' },
          { icon: Clock, color: 'text-yellow-500', label: 'Mẫu' },
          { icon: Upload, color: 'text-purple-500', label: 'Nhập' }
        ].map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center border rounded-md shadow-md px-4 py-6 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
          >
            <action.icon className={`${action.color} mb-2`} size={24} />
            <span className="text-sm font-medium dark:text-white">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="w-full">
        {/* Document List Header */}
        <div className="hidden md:grid grid-cols-3 md:grid-cols-5 text-gray-600 dark:text-gray-400 text-sm mb-4">
          <div className="col-span-1 font-semibold text-gray-800 dark:text-gray-200">Tên</div>
          <div className="col-span-2 md:col-span-3 text-center font-semibold text-gray-800 dark:text-gray-200">
            Được tạo bởi
          </div>
          <div className="col-span-1 text-right font-semibold text-gray-800 dark:text-gray-200">Xem lần cuối</div>
        </div>

        {/* Document List */}
        <div className="space-y-4">
          {[
            { title: 'Không có tiêu đề', creator: 'Nguyễn Đình Quốc Khánh', time: 'Ngay bây giờ' },
            { title: 'Không có tiêu đề', creator: 'Nguyễn Đình Quốc Khánh', time: '13 phút trước' },
            { title: 'Không có tiêu đề', creator: 'Nguyễn Đình Quốc Khánh', time: '30 phút trước' },
            { title: 'Welcome to Zoom Docs!', creator: 'Nguyễn Đình Quốc Khánh', time: '3 ngày trước' },
          ].map((doc, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 items-center bg-white dark:bg-gray-700 p-4 rounded-md shadow-md transition-all hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {/* Document Title */}
              <div className="col-span-2 flex items-center text-gray-800 dark:text-gray-200">
                <span className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m2 6H7m14-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2z"
                    />
                  </svg>
                  {doc.title}
                </span>
              </div>

              {/* Creator */}
              <div className="col-span-2 flex items-center justify-start md:justify-center text-gray-600 dark:text-gray-400">
                <Avatar className="w-10 h-10 mr-3 dark:shadow-gray-400 dark:text-white shadow-md">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={doc.creator} />
                  <AvatarFallback>{doc.creator.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="ml-2">{doc.creator}</span>
              </div>

              {/* Last Viewed */}
              <div className="col-span-1 flex items-center justify-end text-gray-600 dark:text-gray-400">
                {doc.time}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default MainDocuments;
