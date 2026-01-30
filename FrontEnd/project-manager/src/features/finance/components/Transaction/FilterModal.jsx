
const FilterModal = ({
  show,
  onClose,
  filters,
  setFilters,
  categories,
}) => {
  if (!show) return null;

  return (
    <div className="absolute right-40 mr-6 w-90 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg border p-4" onClick={(e) => e.stopPropagation()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value || null })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
  );
};

export default FilterModal;