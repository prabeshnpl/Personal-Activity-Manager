import { useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import { X } from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import { AddCategoryModal } from '../Category/AddCategoryModal';

export const AddTransactionModal = ({ 
  onClose, 
  onCreate, 
  accounts, 
  categories, 
  createCategory, 
  updateCategory, 
  deleteCategory
}) => {

  const [formData, setFormData] = useState({
    transaction_type: '',
    amount: '',
    category: '',
    account: '',
    to_account: '',
    occurred_at: '',
    description: '',
  });

  const [showCategoryAddModal, setShowCategoryAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {data:categoriesData, isLoading:categoriesLoading, error:categoriesError} = categories;
  const {data:accountsData, isLoading:accountsLoading, error:accountsError} = accounts;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.amount || !formData.description) {
      setError('Amount and description are required');
      return;
    }
    formData.occurred_at = formData?.occurred_at ? `${formData.occurred_at}T00:00:00Z` : '';

    try {
      setLoading(true);
      await onCreate.mutateAsync(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">

        {/* Add Transaction Modal */}
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh]">
        
          {/* Add Transaction Header */}
          <div className="flex items-center justify-between py-5 px-8 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Transaction Form */}
          <form onSubmit={handleSubmit} className="py-6 px-8 space-y-4 overflow-y-auto max-h-[calc(90vh-64px)]">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Type and Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Type
                </label>
                <select
                  required
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                  disabled={loading}
                >
                  <option value="" selected disabled>Select Type</option>
                  <option value="income" class="text-gray-900">Income</option>
                  <option value="expense" class="text-gray-900">Expense</option>
                  <option value="transfer" class="text-gray-900">Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Amount
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Category and Occurred Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="font-medium text-gray-900">
                    Category
                  </label>
                  <Button
                    type="button"
                    variant="semi_primary"
                    size="sm"
                    onClick={() => setShowCategoryAddModal(true)}
                  >
                    + Add Category
                  </Button>
                </div>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                  disabled={loading}
                >
                  
                  <option value="" selected disabled>Select Category</option>

                  {categoriesLoading ? (
                    <option>
                      <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                      </div>
                    </option>
                  ) : categoriesError ? (
                    <option>Error loading categories</option>
                  ) : (
                    categoriesData.map((cat) => (
                      <option key={cat.id} value={cat.id} className="text-gray-900">
                        {cat.name}
                      </option>
                    ))
                  )}
                  {/* <option></option> */}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  Occurred Date
                </label>
                <input
                  type="date"
                  value={formData.occurred_at}
                  onChange={(e) => setFormData({ ...formData, occurred_at: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                  disabled={loading}
                />
              </div>

            </div>

            {/* Accounts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block font-medium text-gray-900 mb-2">
                  {formData.transaction_type === 'transfer' ? 'From Account' : 'Account'}
                </label>
                <select
                  required
                  onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                  disabled={loading}
                >
                  <option value="" selected disabled>Select Account</option>
                  {accountsLoading ? (
                    <option>
                      <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                      </div>
                    </option>
                  ) : accountsError ? (
                    <option>Error loading accounts</option>
                  ) : (
                    accountsData.map((acc) => (
                      <option key={acc.id} value={acc.id} className={formData.transaction_type === 'transfer' && formData.to_account == acc.id ? 'text-gray-400' : 'text-gray-900'} disabled={formData.transaction_type === 'transfer' && formData.to_account == acc.id}>
                        {acc.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              {formData.transaction_type === 'transfer' ? (<div>
                <label className="block font-medium text-gray-900 mb-2">To Account</label>
                <select
                  required
                  onChange={(e) => setFormData({ ...formData, to_account: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                  disabled={loading}
                >
                  <option value="" selected disabled>Select Account</option>
                  {accountsLoading ? (
                    <option>
                      <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                      </div>
                    </option>
                  ) : accountsError ? (
                    <option>Error loading accounts</option>
                  ) : (
                    accountsData.map((acc) => (
                      <option 
                      key={acc.id} 
                      value={acc.id} 
                      disabled={formData.account == acc.id}
                      className={formData.account == acc.id ? 'text-gray-400' : 'text-gray-900'}
                      >
                        {acc.name}
                      </option>
                    ))
                  )}
                </select>
              </div>) : null}
              
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows="3"
                required
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:text-gray-400"
                disabled={loading}
              />
            </div>

            {/* Cancel and Submit Buttons */}
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
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Adding...' : 'Add Transaction'}
              </Button>
            </div>
          </form>
        
        </div>
      </div>

      {showCategoryAddModal && (
        <AddCategoryModal
          onClose={() => {setShowCategoryAddModal(false);}}
          onCreate={createCategory}
          onUpdate={updateCategory}
        />
      )}
    </>
  );
};
