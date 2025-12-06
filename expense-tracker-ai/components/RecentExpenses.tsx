import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Expense } from '@/types';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface RecentExpensesProps {
  expenses: Expense[];
  maxItems?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Transportation: 'bg-blue-100 text-blue-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Bills: 'bg-red-100 text-red-800',
  Other: 'bg-gray-100 text-gray-800',
};

export const RecentExpenses: React.FC<RecentExpensesProps> = ({
  expenses,
  maxItems = 5,
}) => {
  const recentExpenses = expenses.slice(0, maxItems);

  if (recentExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No expenses yet. Add your first expense to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${CATEGORY_COLORS[expense.category]}`}
                  >
                    {expense.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(expense.date)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 truncate">
                  {expense.description}
                </p>
              </div>
              <div className="ml-4">
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
