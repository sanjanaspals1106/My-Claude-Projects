'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseFormData } from '@/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { validateExpenseForm, hasValidationErrors, ValidationErrors } from '@/utils/validation';
import { formatDateForInput } from '@/utils/formatters';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  onCancel?: () => void;
  initialData?: Expense;
  submitLabel?: string;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Add Expense',
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: initialData ? formatDateForInput(initialData.date) : formatDateForInput(new Date().toISOString()),
    amount: initialData ? initialData.amount.toString() : '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ValidationErrors];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      date: true,
      amount: true,
      category: true,
      description: true,
    });

    // Validate form
    const validationErrors = validateExpenseForm(formData);

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Create expense object
    const expense: Expense = {
      id: initialData?.id || `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSubmit(expense);

    // Reset form if not editing
    if (!initialData) {
      setFormData({
        date: formatDateForInput(new Date().toISOString()),
        amount: '',
        category: 'Food',
        description: '',
      });
      setTouched({});
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={() => handleBlur('date')}
          error={touched.date ? errors.date : undefined}
          max={formatDateForInput(new Date().toISOString())}
          required
        />

        <Input
          type="number"
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          onBlur={() => handleBlur('amount')}
          error={touched.amount ? errors.amount : undefined}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        onBlur={() => handleBlur('category')}
        error={touched.category ? errors.category : undefined}
        options={CATEGORIES.map(cat => ({ value: cat, label: cat }))}
        required
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur('description')}
          className={`
            w-full px-3 py-2 border rounded-lg
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-colors duration-200 resize-none
            ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}
          `}
          rows={3}
          placeholder="Enter expense description..."
          maxLength={200}
          required
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/200 characters
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" fullWidth>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
