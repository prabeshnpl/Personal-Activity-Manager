import React from 'react';

export const VerticalTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex space-x-6">
      {/* Sidebar */}
      <nav className="w-64 shrink-0 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                {Icon && <Icon className="h-5 w-5" />}
                <span>{tab.label}</span>
              </div>
              {tab.badge && (
                <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};