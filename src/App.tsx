import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BoardView from './components/BoardView';
import TableView from './components/TableView';
import CalendarView from './components/CalendarView';
import TimelineView from './components/TimelineView';
import DashboardView from './components/DashboardView';
import KeyboardShortcutOverlay from './components/KeyboardShortcutOverlay';
import './App.css';
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaColumns,
  FaTable,
  FaCalendarAlt,
  FaClock,
  FaChartBar 
} from 'react-icons/fa';

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
  element: React.ReactNode;
}

const App: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isKeyboardShortcutOpen, setIsKeyboardShortcutOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const navItems: NavItem[] = [
    { path: '/', icon: <FaHome className="text-xl" />, label: 'Home', element: <BoardView /> },
    { path: '/board', icon: <FaColumns className="text-xl" />, label: 'Board', element: <BoardView /> },
    { path: '/table', icon: <FaTable className="text-xl" />, label: 'Table', element: <TableView /> },
    { path: '/calendar', icon: <FaCalendarAlt className="text-xl" />, label: 'Calendar', element: <CalendarView /> },
    { path: '/timeline', icon: <FaClock className="text-xl" />, label: 'Timeline', element: <TimelineView /> },
    { path: '/dashboard', icon: <FaChartBar className="text-xl" />, label: 'Dashboard', element: <DashboardView /> },
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsKeyboardShortcutOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-sm hover:bg-gray-50"
        >
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 left-0 h-screen w-sidebar shrink-0 bg-white
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            z-50 md:z-0 shadow-sm
          `}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full flex flex-col h-screen">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
              <Header />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
              <Routes>
                {navItems.map(item => (
                  <Route key={item.path} path={item.path} element={item.element} />
                ))}
              </Routes>
            </div>
          </div>

          {/* Bottom Navigation (Mobile) */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
            <div className="grid grid-cols-4 p-2 gap-1">
              {navItems.slice(0, 4).map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center p-2 rounded-lg
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }
                    transition-colors`
                  }
                >
                  {item.icon}
                  <span className="text-xs mt-1">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </main>
        <KeyboardShortcutOverlay 
          isOpen={isKeyboardShortcutOpen}
          onClose={() => setIsKeyboardShortcutOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;
