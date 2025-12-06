import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Expense } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface SpendingChartProps {
  expenses: Expense[];
}

interface MonthlyData {
  month: string;
  total: number;
  count: number;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ expenses }) => {
  // Group expenses by month
  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthLabel,
        total: 0,
        count: 0,
      };
    }

    acc[monthKey].total += expense.amount;
    acc[monthKey].count += 1;

    return acc;
  }, {} as Record<string, MonthlyData>);

  // Convert to array and sort by date (most recent last)
  const monthlyArray = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Show last 6 months
    .map(([_, data]) => data);

  const maxAmount = Math.max(...monthlyArray.map(d => d.total), 1);

  if (monthlyArray.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No data available. Add expenses to see your spending trend.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="flex items-end justify-between gap-4 h-64 pt-4">
            {monthlyArray.map((data, index) => {
              const heightPercentage = (data.total / maxAmount) * 100;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex flex-col items-center justify-end flex-1">
                    <div className="relative group w-full flex items-end justify-center">
                      <div
                        className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-700 hover:to-primary-500 cursor-pointer"
                        style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <div className="font-semibold">{formatCurrency(data.total)}</div>
                            <div className="text-gray-300">{data.count} expenses</div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      {data.month}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(data.total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(
                  monthlyArray.reduce((sum, d) => sum + d.total, 0) / monthlyArray.length
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Highest</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(Math.max(...monthlyArray.map(d => d.total)))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Lowest</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(Math.min(...monthlyArray.map(d => d.total)))}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
