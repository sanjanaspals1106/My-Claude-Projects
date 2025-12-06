import { Expense, ExpenseCategory, SpendingSummary } from '@/types';

export const calculateSpendingSummary = (
  expenses: Expense[],
  startDate?: string,
  endDate?: string
): SpendingSummary => {
  // Filter expenses by date range if provided
  let filteredExpenses = expenses;

  if (startDate || endDate) {
    filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return expenseDate >= start && expenseDate <= end;
      } else if (start) {
        return expenseDate >= start;
      } else if (end) {
        return expenseDate <= end;
      }
      return true;
    });
  }

  // Calculate total spending
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate monthly spending (current month)
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthly = filteredExpenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= currentMonthStart && expenseDate <= currentMonthEnd;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate category breakdown
  const categoryTotals = new Map<ExpenseCategory, number>();

  filteredExpenses.forEach(expense => {
    const current = categoryTotals.get(expense.category) || 0;
    categoryTotals.set(expense.category, current + expense.amount);
  });

  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, categoryTotal]) => ({
      category,
      total: categoryTotal,
      percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // Find top category
  const topCategory = categoryBreakdown.length > 0
    ? {
        category: categoryBreakdown[0].category,
        amount: categoryBreakdown[0].total,
      }
    : null;

  return {
    total,
    monthly,
    categoryBreakdown,
    topCategory,
  };
};

export const filterExpenses = (
  expenses: Expense[],
  filters: {
    category?: ExpenseCategory | 'All';
    startDate?: string;
    endDate?: string;
    searchQuery?: string;
  }
): Expense[] => {
  return expenses.filter(expense => {
    // Category filter
    if (filters.category && filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.startDate) {
      const expenseDate = new Date(expense.date);
      const startDate = new Date(filters.startDate);
      if (expenseDate < startDate) return false;
    }

    if (filters.endDate) {
      const expenseDate = new Date(expense.date);
      const endDate = new Date(filters.endDate);
      if (expenseDate > endDate) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const descriptionMatch = expense.description.toLowerCase().includes(query);
      const categoryMatch = expense.category.toLowerCase().includes(query);
      const amountMatch = expense.amount.toString().includes(query);

      if (!descriptionMatch && !categoryMatch && !amountMatch) {
        return false;
      }
    }

    return true;
  });
};

export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const rows = expenses.map(expense => [
    expense.date,
    expense.category,
    `"${expense.description.replace(/"/g, '""')}"`, // Escape quotes in description
    expense.amount.toFixed(2),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (expenses: Expense[], filename: string = 'expenses.csv'): void => {
  const csvContent = exportToCSV(expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
