import { useState, useEffect } from 'react';
import { Button } from '../../../../shared/components/Button';
import { X } from 'lucide-react';

export const AddAccountModal = ({ account, onClose, onCreate, onUpdate }) => {
  const isEditing = !!account;
  const [formData, setFormData] = useState({
    name: '',
    account_type: 'bank',
    account_number: '',
    balance: '',
    currency: 'USD',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        account_type: account.account_type,
        account_number: account.account_number || '',
        balance: account.balance || '',
        currency: account.currency || 'USD',
        description: account.description || '',
      });
    }
  }, [account]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Account name is required');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await onUpdate.mutateAsync({ id: account.id, data: formData });
      } else {
        await onCreate.mutateAsync(formData);
      }
      onClose();
    } catch (err) {
      onClose();
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} account`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Account' : 'Add Account'}
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
                  Account Name *
                  </label>
                  <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Checking, Savings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                  </label>
                  <select
                  value={formData.account_type}
                  onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  >
                  <option value="bank">Bank Account</option>
                  <option value="e-sewa">Esewa</option>
                  <option value="digital">Digital</option>
                  <option value="cash">Cash</option>
                  </select>
              </div>

              {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number (Optional)
                  </label>
                  <input
                  type="text"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  placeholder="Last 4 digits recommended"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  />
              </div> */}

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Balance
                  </label>
                  <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"variant="secondary"
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
