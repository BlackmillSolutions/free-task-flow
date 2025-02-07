import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BoardView from './components/BoardView';
import './App.css';
import { FaBars, FaTimes, FaHome, FaTasks, FaChartBar } from 'react-icons/fa';

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
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
      <main className="flex-1 min-w-0 w-full">
        {/* Header and Board Content */}
        <div className="h-full w-full">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6">
              <Header />
            </div>
          </div>

          {/* Board Content */}
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
            <BoardView />
          </div>
        </div>

        {/* Bottom Navigation (Mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
          <div className="flex justify-around p-3">
            <button className="p-2 text-gray-600 hover:text-primary focus:text-primary transition-colors">
              <FaHome className="text-xl" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary focus:text-primary transition-colors">
              <FaTasks className="text-xl" />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary focus:text-primary transition-colors">
              <FaChartBar className="text-xl" />
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

export default App;
