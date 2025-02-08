import React, { useState, useEffect } from 'react';
import { 
  FaHome, 
  FaTasks, 
  FaChartBar, 
  FaCog, 
  FaChevronLeft, 
  FaChevronRight,
  FaCalendarAlt,
  FaColumns,
  FaClock,
  FaTable,
  FaPalette,
  FaKeyboard
} from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [workspaceColor, setWorkspaceColor] = useState('#3B82F6');
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { path: '/', icon: <FaHome />, label: 'Home', shortcut: '⌘1' },
    { path: '/board', icon: <FaColumns />, label: 'Board', shortcut: '⌘2' },
    { path: '/table', icon: <FaTable />, label: 'Table', shortcut: '⌘3' },
    { path: '/calendar', icon: <FaCalendarAlt />, label: 'Calendar', shortcut: '⌘4' },
    { path: '/timeline', icon: <FaClock />, label: 'Timeline', shortcut: '⌘5' },
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard', shortcut: '⌘6' },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= navItems.length) {
          e.preventDefault();
          window.location.href = navItems[num - 1].path;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navItems]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleWorkspace = () => {
    setIsWorkspaceOpen(!isWorkspaceOpen);
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-200 ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-200`}>
      {/* Workspace Branding */}
      <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
        <button 
          onClick={toggleCollapse} 
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <FaChevronRight className="text-gray-600" /> : <FaChevronLeft className="text-gray-600" />}
        </button>
        {!isCollapsed && (
          <div className="flex items-center space-x-2 flex-1 ml-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: workspaceColor }}
              onClick={() => setIsCustomizing(true)}
              title="Customize workspace"
            >
              <span className="text-white font-bold">MW</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 truncate">My Workspace</span>
            {isCustomizing && (
              <div className="absolute top-16 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Customize Workspace</span>
                  <button 
                    onClick={() => setIsCustomizing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Color
                    </label>
                    <input
                      type="color"
                      value={workspaceColor}
                      onChange={(e) => setWorkspaceColor(e.target.value)}
                      className="w-full h-8 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workspace Switcher */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-b border-gray-200">
          <button onClick={toggleWorkspace} className="w-full text-left flex items-center justify-between">
            <span>Switch Workspace</span>
            <span>{isWorkspaceOpen ? '▲' : '▼'}</span>
          </button>
          {isWorkspaceOpen && (
            <div className="mt-2">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Workspace 1</button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Workspace 2</button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-100">Add Workspace</button>
            </div>
          )}
        </div>
      )}

      {/* Navigation Shortcuts */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              w-full flex items-center px-3 py-2 rounded-lg transition-colors group relative
              ${isActive 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }
            `}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={`text-lg ${location.pathname === item.path ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <>
                <span className="ml-3 font-medium flex-1">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400 font-mono">{item.shortcut}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Settings & Utilities */}
      <div className="p-2 border-t border-gray-200 space-y-1">
        <button 
          className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
          title={isCollapsed ? "Settings" : undefined}
        >
          <FaCog className="text-lg text-gray-400 group-hover:text-blue-500" />
          {!isCollapsed && <span className="ml-3 font-medium">Settings</span>}
        </button>
        <button 
          className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
          title={isCollapsed ? "Customize Theme" : undefined}
        >
          <FaPalette className="text-lg text-gray-400 group-hover:text-blue-500" />
          {!isCollapsed && <span className="ml-3 font-medium">Customize Theme</span>}
        </button>
        <button 
          className="w-full flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
          title={isCollapsed ? "Keyboard Shortcuts" : undefined}
        >
          <FaKeyboard className="text-lg text-gray-400 group-hover:text-blue-500" />
          {!isCollapsed && (
            <>
              <span className="ml-3 font-medium flex-1">Keyboard Shortcuts</span>
              <span className="text-xs text-gray-400 font-mono">⌘K</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
