import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaBell, 
  FaUserCircle, 
  FaSearch, 
  FaPlus, 
  FaFilter,
  FaColumns,
  FaTable,
  FaCalendarAlt,
  FaClock,
  FaSpinner
} from 'react-icons/fa';

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'project' | 'user';
  url: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'mention' | 'update' | 'deadline' | 'assignment';
}

const viewOptions = [
  { icon: <FaColumns />, label: 'Board', path: '/board' },
  { icon: <FaTable />, label: 'Table', path: '/table' },
  { icon: <FaCalendarAlt />, label: 'Calendar', path: '/calendar' },
  { icon: <FaClock />, label: 'Timeline', path: '/timeline' },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Comment',
    message: 'Sarah mentioned you in a comment',
    time: '5m ago',
    read: false,
    type: 'mention'
  },
  {
    id: '2',
    title: 'Task Update',
    message: 'Design homepage was updated',
    time: '1h ago',
    read: false,
    type: 'update'
  },
  {
    id: '3',
    title: 'Deadline Approaching',
    message: 'Project X due in 2 days',
    time: '2h ago',
    read: true,
    type: 'deadline'
  }
];

const Header: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isViewSelectorOpen, setIsViewSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const viewSelectorRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (viewSelectorRef.current && !viewSelectorRef.current.contains(event.target as Node)) {
        setIsViewSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulated search with debounce
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      // Simulate API call
      setTimeout(() => {
        const results: SearchResult[] = [
          { id: '1', title: 'Homepage Redesign', type: 'task', url: '/task/1' },
          { id: '2', title: 'Marketing Campaign', type: 'project', url: '/project/2' },
          { id: '3', title: 'Sarah Smith', type: 'user', url: '/user/3' },
        ];
        setSearchResults(results.filter(result => 
          result.title.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        setIsSearching(false);
      }, 500);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSelect = (result: SearchResult) => {
    navigate(result.url);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
    setIsViewSelectorOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
    setIsViewSelectorOpen(false);
  };

  const toggleViewSelector = () => {
    setIsViewSelectorOpen(!isViewSelectorOpen);
    setIsNotificationOpen(false);
    setIsProfileOpen(false);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getCurrentView = () => {
    return viewOptions.find(option => option.path === location.pathname) || viewOptions[0];
  };

  return (
    <div className="bg-white h-16 flex items-center justify-between px-4 shadow-sm border-b border-gray-200">
      {/* Left Side */}
      <div className="flex items-center flex-1">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="#" className="inline-flex items-center text-gray-700 hover:text-gray-900">
                <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <a href="#" className="ml-1 text-gray-700 hover:text-gray-900 md:ml-2">Projects</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Monday Clone</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl mx-4">
          <div
            className={`flex items-center transition-all duration-200 ${
              isSearchFocused ? 'bg-white shadow-md' : 'bg-gray-100'
            } rounded-lg px-3 py-2`}
          >
            {isSearching ? (
              <FaSpinner className="animate-spin text-blue-500 mr-2" />
            ) : (
              <FaSearch className={`${isSearchFocused ? 'text-blue-500' : 'text-gray-400'} mr-2`} />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, projects, or people... (⌘K)"
              className="w-full bg-transparent border-none outline-none placeholder-gray-400"
              onFocus={() => setIsSearchFocused(true)}
            />
            {isSearchFocused && (
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg">
                ESC
              </kbd>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && (searchQuery || searchResults.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchSelect(result)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        {result.type === 'task' && <FaColumns />}
                        {result.type === 'project' && <FaTable />}
                        {result.type === 'user' && <FaUserCircle />}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <div className="text-sm text-gray-500 capitalize">{result.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  {searchQuery ? 'No results found' : 'Start typing to search'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <button className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <FaPlus className="mr-2" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Filter Button */}
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <FaFilter />
        </button>

        {/* View Selector */}
        <div ref={viewSelectorRef} className="relative">
          <button
            onClick={toggleViewSelector}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-600">{getCurrentView().icon}</span>
            <span className="hidden sm:inline text-sm font-medium">{getCurrentView().label}</span>
          </button>
          
          {isViewSelectorOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white border border-gray-200 py-2">
              {viewOptions.map((option) => (
                <button
                  key={option.path}
                  onClick={() => {
                    navigate(option.path);
                    setIsViewSelectorOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-gray-50
                    ${location.pathname === option.path ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}
                  `}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div ref={notificationRef} className="relative">
          <button 
            onClick={toggleNotification}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
            aria-label={`${notifications.filter(n => !n.read).length} unread notifications`}
          >
            <FaBell className="text-xl" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
          
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0
                      ${notification.read ? 'opacity-75' : 'bg-blue-50/30'}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        {notification.type === 'mention' && '@'}
                        {notification.type === 'update' && '↑'}
                        {notification.type === 'deadline' && '⏰'}
                        {notification.type === 'assignment' && '✓'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={toggleProfile} 
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="User menu"
          >
            <FaUserCircle className="text-gray-600 text-xl" />
            <span className="hidden md:inline text-sm font-medium text-gray-700">John Doe</span>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-600">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">John Doe</div>
                    <div className="text-sm text-gray-500">john.doe@example.com</div>
                  </div>
                </div>
              </div>
              
              <nav className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span className="w-8">👤</span>
                  Your Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span className="w-8">⚙️</span>
                  Settings
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span className="w-8">🌙</span>
                  Dark Mode
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                  <span className="w-8">❓</span>
                  Help & Support
                </button>
              </nav>
              
              <div className="border-t border-gray-200 py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                  <span className="w-8">🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
