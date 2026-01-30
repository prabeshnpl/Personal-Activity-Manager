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
  Network
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

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full">
      <nav className="px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
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
  );
};