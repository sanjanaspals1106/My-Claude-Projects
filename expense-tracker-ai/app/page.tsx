'use client';

import React, { useState, useEffect } from 'react';
import { Expense } from '@/types';
import { storageUtils } from '@/utils/storage';
import { calculateSpendingSummary } from '@/utils/analytics';
import { downloadCSV } from '@/utils/analytics';
import { getCurrentMonthRange } from '@/utils/formatters';
import { generateSampleExpenses } from '@/utils/sampleData';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ExpenseForm } from '@/components/ExpenseForm';
import { SummaryCard } from '@/components/SummaryCard';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { RecentExpenses } from '@/components/RecentExpenses';
import { SpendingChart } from '@/components/SpendingChart';
import { ExpenseList } from '@/components/ExpenseList';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses'>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storageUtils.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoaded(true);
  }, []);

  // Calculate summary
  const summary = calculateSpendingSummary(expenses);
  const { start: monthStart, end: monthEnd } = getCurrentMonthRange();

  const handleAddExpense = (expense: Expense) => {
    const updatedExpenses = storageUtils.addExpense(expense);
    setExpenses(updatedExpenses);
    setIsAddModalOpen(false);
  };

  const handleEditExpense = (expense: Expense) => {
    const updatedExpenses = storageUtils.updateExpense(expense.id, expense);
    setExpenses(updatedExpenses);
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = storageUtils.deleteExpense(id);
    setExpenses(updatedExpenses);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      alert('No expenses to export');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    downloadCSV(expenses, `expenses-${today}.csv`);
  };

  const handleLoadSampleData = () => {
    const sampleExpenses = generateSampleExpenses(20);
    const allExpenses = [...sampleExpenses, ...expenses];
    storageUtils.saveExpenses(allExpenses);
    setExpenses(allExpenses);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  Expense Tracker
                </h1>
              </div>
              <nav className="ml-10 flex space-x-4">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'expenses'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  All Expenses
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {expenses.length === 0 && (
                <Button variant="ghost" onClick={handleLoadSampleData} size="sm">
                  Load Sample Data
                </Button>
              )}
              <Button variant="secondary" onClick={handleExportCSV} size="sm">
                <svg
                  className="w-4 h-4 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <svg
                  className="w-5 h-5 mr-2 inline"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Expense
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard
                title="Total Spending"
                value={summary.total}
                subtitle="All time"
                color="blue"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              />

              <SummaryCard
                title="This Month"
                value={summary.monthly}
                subtitle={new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
                color="green"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              />

              <SummaryCard
                title="Top Category"
                value={summary.topCategory?.category || 'N/A'}
                subtitle={
                  summary.topCategory
                    ? `$${summary.topCategory.amount.toFixed(2)} spent`
                    : 'No expenses yet'
                }
                color="purple"
                icon={
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />
            </div>

            {/* Charts and Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingChart expenses={expenses} />
              <CategoryBreakdown summary={summary} />
            </div>

            {/* Recent Expenses */}
            <RecentExpenses expenses={expenses} maxItems={5} />
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteExpense}
          />
        )}
      </main>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          onSubmit={handleAddExpense}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Add Expense"
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingExpense(null);
        }}
        title="Edit Expense"
      >
        {editingExpense && (
          <ExpenseForm
            onSubmit={handleEditExpense}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingExpense(null);
            }}
            initialData={editingExpense}
            submitLabel="Update Expense"
          />
        )}
      </Modal>
    </div>
  );
}
