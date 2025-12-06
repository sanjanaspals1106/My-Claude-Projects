import { ExpenseFormData } from '@/types';

export interface ValidationErrors {
  date?: string;
  amount?: string;
  category?: string;
  description?: string;
}

export const validateExpenseForm = (data: ExpenseFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate date
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (selectedDate > today) {
      errors.date = 'Date cannot be in the future';
    }
  }

  // Validate amount
  if (!data.amount) {
    errors.amount = 'Amount is required';
  } else {
    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      errors.amount = 'Amount must be a valid number';
    } else if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (amount > 10000000) {
      errors.amount = 'Amount cannot exceed ₹1,00,00,000';
    } else if (!/^\d+(\.\d{1,2})?$/.test(data.amount)) {
      errors.amount = 'Amount can have at most 2 decimal places';
    }
  }

  // Validate category
  if (!data.category) {
    errors.category = 'Category is required';
  }

  // Validate description
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 3) {
    errors.description = 'Description must be at least 3 characters';
  } else if (data.description.length > 200) {
    errors.description = 'Description cannot exceed 200 characters';
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
