import React, { useState } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { TransactionCard } from './TransactionCard';
import { AddTransactionModal } from './AddTransactionModal';
import { Plus, Download, Filter, Receipt } from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import { useTransaction } from '../../hooks/useTransaction';
import FilterModal from './FilterModal';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import SearchBar from '../../../../shared/components/Search/SearchBar';

export const TransactionsList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
    const {
      transactions,
      categories,
      filters,
      setFilters,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      exportTransactions,
    } = useTransaction();

  const {data, isLoading, error, refetch} = transactions;

  if (isLoading){
    return <Spinner size="md" />;
  }
  if (error){
    return <ErrorState message="Failed to load transactions." onRetry={refetch} />;
  }

  return (
    <div className='mt-5 overflow-y-auto max-h-120'>
      <Card
        title={`Transactions (${data?.length || 0})`}
        action={
          <div className="flex space-x-2">
            <SearchBar
                placeholder="Search transactions..."
                value={filters.search || ''}
                onSubmit={(value) => setFilters({ ...filters, search: value || null })}
                className="max-w-md"
              />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={exportTransactions}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        }
      >
        {/* Filters */}
        <FilterModal
          show={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          setFilters={setFilters}
          categories={categories?.data || []}
        />

        {/* Transactions List */}
        { data.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Start tracking your income and expenses"
            iconClassNames="h-8 w-8 text-gray-400"
          />
        ) : (
          <div className="space-y-3">
            {data.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onUpdate={updateTransaction}
                onDelete={deleteTransaction}
              />
            ))}
          </div>
        )}
      </Card>

      {showAddModal && (
        <AddTransactionModal
          onClose={() => setShowAddModal(false)}
          onCreate={createTransaction}
        />
      )}
    </div>
  );
};