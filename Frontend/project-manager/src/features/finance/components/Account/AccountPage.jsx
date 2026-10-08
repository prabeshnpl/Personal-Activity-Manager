import { useCallback, useState } from 'react';
import { Button } from '../../../../shared/components/Button';
import { Spinner } from '../../../../shared/components/Spinner';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { AddAccountModal } from './AddAccountModal';
import { Plus, Edit2, Trash2, Wallet, CreditCard, Building2, MoreVertical } from 'lucide-react';
import { useAccount } from '../../hooks/useAccount';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import {formatCurrency} from '@/shared/utils/formatCurrency';

export const AccountPage = () => {

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

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowAddModal(true);
    setMenuOpen(null);
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Delete this account? Transactions linked to this account will remain.')) {
      try {
        await onDelete.mutateAsync(accountId);
      } catch {
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

  const accountList = accounts ?? [];
  const totalBalance = accountList.reduce(
    (total, account) => total + Number(account.balance || 0),
    0
  );

  return (
    <>
      <div className="space-y-6 pb-6">
        <header className="flex flex-col gap-4 rounded-2xl  p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-1 text-2xl font-bold">Accounts</h1>
            <p className="mt-1 text-sm">
              Balances and everyday money in one place.
            </p>
          </div>
          <Button
            onClick={openAddAccountModal}
            className="inline-flex items-center justify-center gap-2 self-start  sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Account summary">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total balance</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2.5">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active accounts</p>
                <p className="text-xl font-bold text-gray-900">{accountList.length}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="account-list-heading">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="account-list-heading" className="text-lg font-semibold text-gray-900">Accounts</h2>
            <span className="text-sm text-gray-500">
              {accountList.length} {accountList.length === 1 ? 'account' : 'accounts'}
            </span>
          </div>
          {accountList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10">
              <EmptyState
                icon={Wallet}
                iconClassNames="h-8 w-8 text-gray-400"
                title="No accounts yet"
                description="Add an account to start tracking your balances."
                classNames="text-center"
              />
              <div className="mt-4 flex justify-center">
                <Button onClick={openAddAccountModal} className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add your first account
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {accountList.map((account) => {
              const Icon = getAccountIcon(account.account_type);
              return (
                <div
                  key={account.id}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="shrink-0 rounded-xl bg-blue-50 p-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{account.name}</p>
                      <p className="mt-1 text-sm capitalize text-gray-500">
                        {(account.account_type || 'account').replace(/[_-]/g, ' ')}
                        {account.account_number && ` ····${String(account.account_number).slice(-4)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 sm:gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-900 sm:text-lg">
                        {formatCurrency(account.balance || 0)}
                      </p>
                      <p className="text-xs text-gray-500">Balance</p>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuOpen(menuOpen === account.id ? null : account.id)}
                        aria-label={`More actions for ${account.name}`}
                        aria-expanded={menuOpen === account.id}
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {menuOpen === account.id && (
                        <>
                          <button
                            type="button"
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(null)}
                            aria-label="Close account actions"
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                            <button
                              type="button"
                              onClick={() => handleEdit(account)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
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
          )}
        </section>
      </div>

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
