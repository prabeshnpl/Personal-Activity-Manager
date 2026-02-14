import { useCallback, useEffect, useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Spinner } from '../../../../shared/components/Spinner';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { AddAccountModal } from './AddAccountModal';
import { Tag, Edit2, Trash2, Wallet, CreditCard, Building2, MoreVertical } from 'lucide-react';
import { useAccount } from '../../hooks/useAccount';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import {formatCurrency} from '@/shared/utils/formatCurrency';

export const AccountManager = ({ addActionRef }) => {

  const { 
    accounts:accountData, 
    createAccount:onCreate, 
    updateAccount:onUpdate, 
    deleteAccount:onDelete 
  } = useAccount();
  
  const {data:accounts, isLoading, error, refetch} = accountData;
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const openAddAccountModal = useCallback(() => {
    setEditingAccount(null);
    setShowAddModal(true);
  }, []);

  useEffect(() => {
    if (!addActionRef) return;
    addActionRef.current = openAddAccountModal;

    return () => {
      addActionRef.current = null;
    };
  }, [addActionRef, openAddAccountModal]);

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowAddModal(true);
    setMenuOpen(null);
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Delete this account? Transactions linked to this account will remain.')) {
      try {
        await onDelete.mutateAsync(accountId);
      } catch (error) {
        alert('Failed to delete account');
      }
    }
    setMenuOpen(null);
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'bank':
        return Building2;
      case 'credit_card':
        return CreditCard;
      case 'cash':
      default:
        return Wallet;
    }
  };

  if (isLoading){
    return <Spinner size="md" />;
  }

  if (error){
    return <ErrorState message="Failed to load accounts." onRetry={refetch} />;
  }

  return (
    <>
      <Card
        // title={`Accounts (${accounts.length})`}
      > 
        {accounts?.length===0 ? 
        <EmptyState
          icon={Tag}
          iconClassNames='h-8 w-8 text-gray-400'
          title="No accounts yet"
          description="Create accounts to track balances"
          classNames = "text-center"
        /> : 
          <div className="space-y-3 h-full overflow-y-auto">
            {accounts.map((account) => {
              const Icon = getAccountIcon(account.account_type);
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-600">
                        {account.account_type.replace('_', ' ').toUpperCase()}
                        {account.account_number && ` • ****${account.account_number.slice(-4)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(account.balance || 0)}
                      </p>
                      <p className="text-xs text-gray-500">Current Balance</p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === account.id ? null : account.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>

                      {menuOpen === account.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(null)}
                          ></div>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                            <button
                              onClick={() => handleEdit(account)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(account.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </Card>

      {showAddModal && (
        <AddAccountModal
          account={editingAccount}
          onClose={() => {
            setShowAddModal(false);
            setEditingAccount(null);
          }}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
