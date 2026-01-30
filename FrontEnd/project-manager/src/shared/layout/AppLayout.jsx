import { TopBar } from './TopBar';
import { Sidebar } from './SideBar';
import { Outlet } from 'react-router-dom';
import ErrorMessage from '../components/Error/ErrorMessage';

export const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-yellow-50">
          <Outlet />
        </main>
      </div>
      <ErrorMessage />
    </div>
  );
};