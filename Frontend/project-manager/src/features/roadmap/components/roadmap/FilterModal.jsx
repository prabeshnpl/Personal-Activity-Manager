
const FilterModal = ({
  show,
  onClose,
  filters,
  setFilters,
}) => {
  if (!show) return null;

  return (
    <div className="absolute right-40 mt-15 w-90 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg border p-4" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option value="">All</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
              </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="skill_development">Skill Development</option>
              <option value="career">Career</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;