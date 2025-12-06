import React from 'react';
import { Card, CardContent } from './ui/Card';
import { formatCurrency } from '@/utils/formatters';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'blue',
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span className="ml-1">{Math.abs(trend.value)}%</span>
                <span className="ml-1 text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          {icon && (
            <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
