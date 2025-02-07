import React from 'react';
import { FaHome, FaTasks, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Workspace Branding */}
      <div className="h-16 px-4 border-b border-gray-200 flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">MW</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">My Workspace</span>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <button className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
          <FaHome className="mr-3 text-gray-400 group-hover:text-blue-500" />
          <span className="font-medium">Home</span>
        </button>
        <button className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
          <FaTasks className="mr-3 text-gray-400 group-hover:text-blue-500" />
          <span className="font-medium">Tasks</span>
        </button>
        <button className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
          <FaChartBar className="mr-3 text-gray-400 group-hover:text-blue-500" />
          <span className="font-medium">Dashboard</span>
        </button>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-gray-200">
        <button className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group">
          <FaCog className="mr-3 text-gray-400 group-hover:text-blue-500" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
