
export const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className} h-full`}>
      {title && (
        <div className="px-6 py-2 border border-gray-200 flex justify-between items-center rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 h-full">{children}</div>
    </div>
  );
};