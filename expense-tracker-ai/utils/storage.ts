import { Expense } from '@/types';

const STORAGE_KEY = 'expense-tracker-data';

export const storageUtils = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  addExpense: (expense: Expense): Expense[] => {
    const expenses = storageUtils.getExpenses();
    const updatedExpenses = [expense, ...expenses];
    storageUtils.saveExpenses(updatedExpenses);
    return updatedExpenses;
  },

  updateExpense: (id: string, updatedExpense: Expense): Expense[] => {
    const expenses = storageUtils.getExpenses();
    const updatedExpenses = expenses.map(exp =>
      exp.id === id ? updatedExpense : exp
    );
    storageUtils.saveExpenses(updatedExpenses);
    return updatedExpenses;
  },

  deleteExpense: (id: string): Expense[] => {
    const expenses = storageUtils.getExpenses();
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    storageUtils.saveExpenses(updatedExpenses);
    return updatedExpenses;
  },

  clearAllExpenses: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
