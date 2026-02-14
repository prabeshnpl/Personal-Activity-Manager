import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { TransactionCard } from './TransactionCard';
import { AddTransactionModal } from './AddTransactionModal';
import { Plus, Download, Filter, Receipt } from 'lucide-react';
import { Spinner } from '../../../../shared/components/Spinner';
import FilterModal from './FilterModal';
import ErrorState from '../../../../shared/components/Error/ErrorState';
import SearchBar from '../../../../shared/components/Search/SearchBar';
import { useTransaction } from '../../hooks/useTransaction';

export const TransactionsList = () => {
  const {
    getInfiniteTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    filters,
    setFilters,
    categories,
    accounts,
    exportTransactions,
  } = useTransaction();

  const infiniteTransactions = getInfiniteTransactions();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const sentinelRef = useRef(null);

  const { 
    data: pages, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    refetch 
  } = infiniteTransactions;

  const data = pages?.pages ? pages.pages.flat() : [];

  // Intersection observer to auto-fetch next page
  useEffect(() => {
    if (!fetchNextPage) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 1 });

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading){
    return <Spinner size="md" />;
  }
  if (error){
    return <ErrorState message="Failed to load transactions." onRetry={refetch} />;
  }
  return (
    <div className='mt-5 max-h-120'>
      <Card
        title={`Transactions (${pages?.pages?.at(-1)?.meta?.total_count || 0})`}
        action={
          <div className="flex flex-wrap gap-2 items-center">
            <SearchBar
                placeholder="Search..."
                value={filters.search || ''}
                onSubmit={(value) => setFilters({ ...filters, search: value || null })}
                className="flex-1 min-w-xs sm:max-w-md"
              />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              title="Filter"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Filter</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={exportTransactions}
              title="Export"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Add</span>
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
          accounts={accounts?.data || []}
          categories={categories?.data || []}
        />

        {/* Transactions List */}
        { data?.length === 0 ? (
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
        {/* Infinite sentinel */}
        <div className="flex items-center justify-center mt-6">
          <div ref={sentinelRef} className="h-6"></div>
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && (
            <div className="text-sm text-gray-500 mt-2">No more transactions</div>
          )}
        </div>
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