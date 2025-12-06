# Expense Tracker - Modern Financial Management App

A beautiful, feature-rich expense tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your expenses, visualize spending patterns, and manage your finances with ease.

## Features

### Core Functionality
- **Add Expenses**: Easily add expenses with date, amount, category, and description
- **Edit & Delete**: Full CRUD operations for managing expenses
- **Smart Filtering**: Filter expenses by date range, category, and search query
- **Sorting**: Sort expenses by date or amount in ascending/descending order
- **Data Persistence**: All data stored in browser's localStorage

### Dashboard & Analytics
- **Summary Cards**: View total spending, monthly spending, and top category at a glance
- **Spending Trend Chart**: Visualize your spending patterns over the last 6 months
- **Category Breakdown**: See spending distribution across categories with visual progress bars
- **Recent Expenses**: Quick view of your latest transactions

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### Additional Features
- **CSV Export**: Export all expenses to CSV for external analysis
- **Form Validation**: Comprehensive validation for all inputs
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Date Validation**: Prevents future dates and validates date ranges
- **Amount Validation**: Ensures valid monetary values with 2 decimal places
- **Search Functionality**: Search expenses by description, category, or amount

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: localStorage API
- **Icons**: SVG icons

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd expense-tracker-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
npm start
```

## How to Use

### Adding an Expense

1. Click the "Add Expense" button in the top-right corner
2. Fill in the form:
   - **Date**: Select the expense date (cannot be in the future)
   - **Amount**: Enter the amount (must be greater than 0, max 2 decimal places)
   - **Category**: Choose from 6 predefined categories
   - **Description**: Enter a description (3-200 characters)
3. Click "Add Expense" to save

### Viewing Expenses

**Dashboard Tab:**
- View summary cards showing total spending, monthly spending, and top category
- See a 6-month spending trend chart
- Check category breakdown with percentages
- View recent expenses (last 5)

**All Expenses Tab:**
- See all expenses in a detailed list
- Search by description, category, or amount
- Filter by category and date range
- Sort by date or amount
- Edit or delete individual expenses

### Filtering & Searching

1. Navigate to "All Expenses" tab
2. Use the filter controls:
   - **Search**: Type to search across descriptions, categories, and amounts
   - **Category**: Select a specific category or "All Categories"
   - **Date Range**: Set start and/or end dates
   - **Sort**: Choose to sort by date or amount, ascending or descending
3. Click "Clear Filters" to reset all filters

### Editing an Expense

1. Find the expense in the "All Expenses" tab
2. Click the edit icon (pencil)
3. Modify the fields as needed
4. Click "Update Expense" to save changes

### Deleting an Expense

1. Find the expense in the "All Expenses" tab
2. Click the delete icon (trash)
3. Confirm the deletion in the popup dialog

### Exporting Data

1. Click the "Export CSV" button in the header
2. The CSV file will download automatically
3. Open in Excel, Google Sheets, or any CSV-compatible application

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main application page
├── components/
│   ├── ui/
│   │   ├── Button.tsx        # Reusable button component
│   │   ├── Card.tsx          # Card components
│   │   ├── Input.tsx         # Input field component
│   │   ├── Modal.tsx         # Modal dialog component
│   │   └── Select.tsx        # Select dropdown component
│   ├── CategoryBreakdown.tsx # Category spending visualization
│   ├── ExpenseForm.tsx       # Add/Edit expense form
│   ├── ExpenseList.tsx       # Expense list with filters
│   ├── RecentExpenses.tsx    # Recent expenses widget
│   ├── SpendingChart.tsx     # Monthly spending chart
│   └── SummaryCard.tsx       # Summary card component
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   ├── analytics.ts          # Analytics and filtering logic
│   ├── formatters.ts         # Date and currency formatters
│   ├── storage.ts            # localStorage utilities
│   └── validation.ts         # Form validation logic
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Features in Detail

### Form Validation

The application includes comprehensive validation:
- **Date**: Required, cannot be in the future
- **Amount**: Required, must be a positive number, max 2 decimal places, cannot exceed ₹1,00,00,000
- **Category**: Required, must be one of the predefined categories
- **Description**: Required, 3-200 characters, leading/trailing whitespace trimmed

### Data Persistence

All expense data is stored in the browser's localStorage:
- Data persists across browser sessions
- Automatic save on every add/edit/delete operation
- No backend required for demo purposes

### Responsive Design

The application is fully responsive:
- **Desktop**: Full-width layout with multi-column grids
- **Tablet**: Adapted layouts with appropriate column counts
- **Mobile**: Single-column layout with touch-friendly controls

### Accessibility

- Semantic HTML elements
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Focus states on interactive elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Storage Limitations

Since the app uses localStorage:
- Maximum storage: ~5-10MB (browser-dependent)
- Data is tied to the browser/device
- Clearing browser data will remove all expenses

## Future Enhancements

Potential features for future versions:
- Backend API for multi-device sync
- User authentication
- Budget planning and alerts
- Recurring expenses
- Multiple currencies
- Receipt photo uploads
- Advanced analytics and reports
- Dark mode
- Data import from CSV
- Monthly/yearly comparisons

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue in the repository.

---

**Enjoy tracking your expenses!** 🎯
