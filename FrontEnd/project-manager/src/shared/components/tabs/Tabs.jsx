export const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-300">
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {Icon && <Icon className="h-5 w-5" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs font-semibold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export const TabPanel = ({ children, isActive }) => {
  if (!isActive) return null;
  
  return (
    <div>
      {children}
    </div>
  );
};