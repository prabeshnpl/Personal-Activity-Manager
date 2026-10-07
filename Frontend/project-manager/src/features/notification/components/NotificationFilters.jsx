import React from 'react';

export const NotificationFilters = ({ filters, onFilterChange }) => {
  const filterOptions = [
    { label: 'All', value: null },
    { label: 'Unread', value: false }, // is_read: false
    { label: 'Read', value: true },
  ];

  return (
    <div className="flex items-center space-x-1 px-4 py-2 border-b border-gray-100">
      {filterOptions.map((option) => (
        <button
          key={option.label}
          onClick={() => onFilterChange({ ...filters, is_read: option.value })}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
            filters.is_read === option.value
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};