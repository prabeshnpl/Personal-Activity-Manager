import React from 'react';
import { Card } from '../../../../shared/components/Card';
import { Button } from '../../../../shared/components/Button';
import { X, Filter } from 'lucide-react';

export const ReportFilters = ({ filters, onFilterChange, categories, accounts, onReset }) => {
  return (
    <Card
      title="Report Filters"
      action={
        <Button size="sm" variant="ghost" onClick={onReset}>
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value || null })}
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
            multiple
            value={filters.category}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              onFilterChange({ ...filters, category: selected });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            size="1"
          >
            <option value="">All Categories</option>
            {categories.isLoading ? (
              <option disabled>Loading...</option>
            ) : (
              categories.data.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
          {filters.category.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {filters.category.length} selected
            </p>
          )}
        </div>

        {/* Account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account
          </label>
          <select
            multiple
            value={filters.account}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              onFilterChange({ ...filters, account: selected });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            size="1"
          >
            <option value="">All Accounts</option>
            {accounts?.isLoading ? (
              <option disabled>Loading...</option>
            ) : (
              accounts?.data.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))
            )}
          </select>
          {filters.account.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {filters.account.length} selected
            </p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
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
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </Card>
  );
};