import React from 'react';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  classNames = "", 
  iconClassNames = "h-16 w-16 text-gray-400"
}) => {
  return (
    <div className={`${classNames} text-center py-12`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className={ iconClassNames }/>
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};