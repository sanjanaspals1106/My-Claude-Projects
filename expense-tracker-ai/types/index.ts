export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: string;
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: ExpenseCategory;
  description: string;
}

export interface ExpenseFilters {
  category: ExpenseCategory | 'All';
  startDate: string;
  endDate: string;
  searchQuery: string;
}

export interface SpendingSummary {
  total: number;
  monthly: number;
  categoryBreakdown: {
    category: ExpenseCategory;
    total: number;
    percentage: number;
  }[];
  topCategory: {
    category: ExpenseCategory;
    amount: number;
  } | null;
}
