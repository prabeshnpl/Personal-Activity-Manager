import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Map, 
  DollarSign, 
  Building2, 
  Bell,
  Settings, 
  Network,
  X
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Roadmaps', path: '/roadmaps', icon: Map },
  { name: 'Finance', path: '/finance', icon: DollarSign },
  { name: 'Organization', path: '/organization', icon: Building2 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div className={`fixed top-0 left-0 h-full z-50 w-64 bg-gray-50 border-r border-gray-200 transform md:relative md:translate-x-0 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <nav className="px-4 py-6 space-y-2">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h3 className="text-lg font-semibold">Menu</h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200">
              <X className="h-4 w-4" />
            </button>
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose?.(); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};