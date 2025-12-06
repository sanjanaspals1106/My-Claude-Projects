'use client';

import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { filterExpenses } from '@/utils/analytics';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Transportation: 'bg-blue-100 text-blue-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Bills: 'bg-red-100 text-red-800',
  Other: 'bg-gray-100 text-gray-800',
};

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter expenses
  const filteredExpenses = filterExpenses(expenses, {
    category: selectedCategory,
    startDate,
    endDate,
    searchQuery,
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || startDate || endDate;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Expenses</CardTitle>
          <div className="text-sm text-gray-600">
            {sortedExpenses.length} {sortedExpenses.length === 1 ? 'expense' : 'expenses'}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'All')}
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Food', label: 'Food' },
                { value: 'Transportation', label: 'Transportation' },
                { value: 'Entertainment', label: 'Entertainment' },
                { value: 'Shopping', label: 'Shopping' },
                { value: 'Bills', label: 'Bills' },
                { value: 'Other', label: 'Other' },
              ]}
            />

            <Input
              type="date"
              placeholder="Start date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              type="date"
              placeholder="End date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Expense List */}
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {expenses.length === 0
                ? 'No expenses yet. Add your first expense to get started.'
                : 'No expenses match your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[expense.category]}`}
                    >
                      {expense.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatDate(expense.date)}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {expense.description}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit expense"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this expense?')) {
                        onDelete(expense.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
