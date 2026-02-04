import React, { useState, useEffect } from 'react';
import { Button } from '../../../../shared/components/Button';
import { X } from 'lucide-react';

export const AddCategoryModal = ({ category, onClose, onCreate, onUpdate }) => {
  const isEditing = !!category;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_type: '', // income, expense
    color: 'blue',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        category_type: category.category_type || '',
        color: category.color || 'blue',
      });
    }
  }, [category]);

  const colors = [
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'gray', label: 'Gray', class: 'bg-gray-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }
    if (!formData.category_type) {
      setError('Category type is required');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await onUpdate.mutateAsync({ id: category.id, data: formData });
      } else {
        await onCreate.mutateAsync(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} category`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Groceries, Salary, Rent"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.category_type}
              onChange={(e) => setFormData({ ...formData, category_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">None</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-7 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`h-10 w-10 rounded-lg ${color.class} ${
                    formData.color === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-900'
                      : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-400'
                  }`}
                  title={color.label}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="flex-1">
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};