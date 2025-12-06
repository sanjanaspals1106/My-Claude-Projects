import { Expense, ExpenseCategory } from '@/types';

const SAMPLE_DESCRIPTIONS: Record<ExpenseCategory, string[]> = {
  Food: [
    'Grocery shopping at Whole Foods',
    'Lunch at Italian restaurant',
    'Coffee and pastries',
    'Dinner with friends',
    'Weekly groceries',
    'Fast food takeout',
    'Breakfast at cafe',
    'Pizza delivery',
  ],
  Transportation: [
    'Gas station fill-up',
    'Uber ride to airport',
    'Monthly metro pass',
    'Parking downtown',
    'Car maintenance',
    'Taxi to office',
    'Bus tickets',
  ],
  Entertainment: [
    'Movie tickets',
    'Concert tickets',
    'Netflix subscription',
    'Video game purchase',
    'Museum entry fee',
    'Bowling with friends',
    'Theater show',
  ],
  Shopping: [
    'New running shoes',
    'Clothing at department store',
    'Electronics purchase',
    'Home decor items',
    'Books from bookstore',
    'Gift for friend',
    'Online shopping',
  ],
  Bills: [
    'Electricity bill',
    'Internet service',
    'Phone bill',
    'Rent payment',
    'Water bill',
    'Insurance premium',
    'Gym membership',
  ],
  Other: [
    'Medical prescription',
    'Haircut',
    'Charity donation',
    'Pet supplies',
    'Office supplies',
    'Miscellaneous expense',
  ],
};

const getRandomElement = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomAmount = (min: number, max: number): number => {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
};

const getRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

export const generateSampleExpenses = (count: number = 20): Expense[] => {
  const categories: ExpenseCategory[] = [
    'Food',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Bills',
    'Other',
  ];

  const expenses: Expense[] = [];

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const description = getRandomElement(SAMPLE_DESCRIPTIONS[category]);

    const amountRanges: Record<ExpenseCategory, [number, number]> = {
      Food: [5, 100],
      Transportation: [3, 80],
      Entertainment: [10, 150],
      Shopping: [20, 300],
      Bills: [50, 500],
      Other: [10, 100],
    };

    const [min, max] = amountRanges[category];

    const expense: Expense = {
      id: `sample-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      date: getRandomDate(180), // Random date within last 6 months
      amount: getRandomAmount(min, max),
      category,
      description,
      createdAt: new Date().toISOString(),
    };

    expenses.push(expense);
  }

  // Sort by date (newest first)
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
