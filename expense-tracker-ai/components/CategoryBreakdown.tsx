import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { SpendingSummary } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface CategoryBreakdownProps {
  summary: SpendingSummary;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-orange-500',
  Transportation: 'bg-blue-500',
  Entertainment: 'bg-purple-500',
  Shopping: 'bg-pink-500',
  Bills: 'bg-red-500',
  Other: 'bg-gray-500',
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ summary }) => {
  if (summary.categoryBreakdown.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No expenses yet. Add your first expense to see the breakdown.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summary.categoryBreakdown.map(({ category, total, percentage }) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${CATEGORY_COLORS[category]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
