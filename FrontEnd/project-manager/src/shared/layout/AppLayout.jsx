import { TopBar } from './TopBar';
import { Sidebar } from './SideBar';
import { Outlet } from 'react-router-dom';
import ErrorMessage from '../components/Error/ErrorMessage';
import { useState } from 'react';

export const AppLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <TopBar onToggleSidebar={() => setShowSidebar((s) => !s)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
        <main className="flex-1 bg-yellow-50 min-h-0">
          <Outlet />
        </main>
      </div>
      <ErrorMessage />
    </div>
  );
};