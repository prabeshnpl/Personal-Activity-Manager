import { useState } from 'react';
import { MoreVertical, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export const TransactionCard = ({ transaction, onUpdate, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NPR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    var date = new Date(dateString);
    date = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return date
  };

  const isIncome = transaction.transaction_type === 'income';

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
          {isIncome ? (
            <TrendingUp className="h-5 w-5 text-green-600" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </div>

        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-gray-600">{formatDate(transaction.occurred_at)}</span>
            {transaction.category && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                {transaction.category.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <p className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
        </p>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >            
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              ></div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-9999">
                <button
                  onClick={() => {
                    onUpdate?.mutateAsync?.({ id: transaction.id, data: transaction });
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this transaction?')) {
                      onDelete?.mutateAsync?.(transaction.id);
                    }
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};