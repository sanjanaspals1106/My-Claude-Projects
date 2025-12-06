# Testing Guide - Expense Tracker

This guide will help you test all features of the Expense Tracker application.

## Prerequisites

Make sure the development server is running:
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Feature Testing Checklist

### 1. Initial Load & Sample Data

**Test Steps:**
1. Open the application for the first time
2. You should see empty state messages
3. Click "Load Sample Data" button in the header
4. Verify 20 sample expenses are loaded
5. Verify the dashboard shows:
   - Total spending summary
   - Monthly spending summary
   - Top category
   - Spending trend chart with data
   - Category breakdown with percentages
   - Recent expenses (5 items)

**Expected Results:**
- Sample data loads successfully
- All dashboard widgets populate with data
- Charts and graphs display correctly
- No errors in browser console

---

### 2. Adding a New Expense

**Test Steps:**
1. Click "Add Expense" button in the header
2. Modal should open with form
3. Try submitting empty form
   - Should show validation errors
4. Fill in the form:
   - Date: Select today's date
   - Amount: Enter "25.50"
   - Category: Select "Food"
   - Description: Enter "Coffee and breakfast"
5. Click "Add Expense"

**Expected Results:**
- Form validation works correctly
- Expense is added to the list
- Dashboard updates immediately
- Modal closes
- New expense appears at the top of recent expenses

---

### 3. Form Validation

**Test Cases:**

**Date Validation:**
1. Try to select a future date → Should show error
2. Leave date empty → Should show "Date is required"
3. Select valid date → Error should clear

**Amount Validation:**
1. Enter "0" → Should show "Amount must be greater than 0"
2. Enter "-10" → Should show "Amount must be greater than 0"
3. Enter "abc" → Should show "Amount must be a valid number"
4. Enter "10.999" → Should show "Amount can have at most 2 decimal places"
5. Enter "10000000.01" → Should show "Amount cannot exceed ₹1,00,00,000"
6. Enter "25.50" → Should accept

**Description Validation:**
1. Leave empty → Should show "Description is required"
2. Enter "ab" → Should show "Description must be at least 3 characters"
3. Enter 201 characters → Should show "Description cannot exceed 200 characters"
4. Enter valid text → Should accept

---

### 4. Viewing All Expenses

**Test Steps:**
1. Click "All Expenses" tab in navigation
2. Verify all expenses are displayed
3. Check that each expense shows:
   - Category badge with color
   - Date
   - Description
   - Amount
   - Edit button
   - Delete button

**Expected Results:**
- All expenses display correctly
- Expenses are sorted by date (newest first)
- Category colors are consistent
- Numbers are formatted as currency

---

### 5. Search Functionality

**Test Steps:**
1. Navigate to "All Expenses" tab
2. In the search box, type "coffee"
3. Verify only matching expenses show
4. Try searching by:
   - Description text: "coffee"
   - Category: "Food"
   - Amount: "25.50"
5. Clear search box
6. Verify all expenses show again

**Expected Results:**
- Search works across description, category, and amount
- Results update in real-time
- Clear search restores all expenses

---

### 6. Category Filtering

**Test Steps:**
1. Navigate to "All Expenses" tab
2. Select "Food" from category dropdown
3. Verify only Food expenses show
4. Try each category:
   - Food
   - Transportation
   - Entertainment
   - Shopping
   - Bills
   - Other
5. Select "All Categories"
6. Verify all expenses show

**Expected Results:**
- Filter works correctly for each category
- Expense count updates
- "All Categories" shows all expenses

---

### 7. Date Range Filtering

**Test Steps:**
1. Navigate to "All Expenses" tab
2. Set start date to 30 days ago
3. Set end date to today
4. Verify only expenses in range show
5. Try various date ranges:
   - Last week
   - Last month
   - Last 3 months
6. Clear date filters

**Expected Results:**
- Date range filter works correctly
- Combining date filters works
- Clear filters resets everything

---

### 8. Sorting

**Test Steps:**
1. Navigate to "All Expenses" tab
2. Sort by "Date" ascending
   - Oldest expenses should appear first
3. Sort by "Date" descending
   - Newest expenses should appear first
4. Sort by "Amount" ascending
   - Smallest amounts first
5. Sort by "Amount" descending
   - Largest amounts first

**Expected Results:**
- Sorting works in both directions
- Toggle between ascending/descending works
- Data reorders correctly

---

### 9. Editing an Expense

**Test Steps:**
1. Navigate to "All Expenses" tab
2. Click edit icon on any expense
3. Modal should open with pre-filled data
4. Change the amount to "30.00"
5. Change description to "Updated description"
6. Click "Update Expense"

**Expected Results:**
- Edit modal opens with correct data
- Form validation still works
- Changes are saved
- Dashboard updates
- Modal closes
- Expense list updates

---

### 10. Deleting an Expense

**Test Steps:**
1. Navigate to "All Expenses" tab
2. Click delete icon on any expense
3. Confirm deletion in dialog
4. Try canceling deletion:
   - Click delete on another expense
   - Click "Cancel" in confirmation

**Expected Results:**
- Confirmation dialog appears
- Confirming deletes the expense
- Canceling keeps the expense
- Dashboard updates after deletion
- Expense count updates

---

### 11. CSV Export

**Test Steps:**
1. Ensure you have some expenses
2. Click "Export CSV" button in header
3. File should download
4. Open the CSV file in Excel or Google Sheets
5. Verify columns:
   - Date
   - Category
   - Description
   - Amount

**Expected Results:**
- CSV file downloads successfully
- All expenses are included
- Data is properly formatted
- Special characters in descriptions are escaped correctly

---

### 12. Dashboard Analytics

**Test Steps:**
1. Navigate to "Dashboard" tab
2. Verify Summary Cards:
   - Total Spending shows correct sum
   - This Month shows current month total
   - Top Category shows category with most spending
3. Verify Spending Trend Chart:
   - Shows last 6 months
   - Bars have correct heights
   - Hover shows tooltip with details
4. Verify Category Breakdown:
   - All categories with expenses are shown
   - Percentages add up to 100%
   - Progress bars match percentages
   - Sorted by amount (highest first)

**Expected Results:**
- All calculations are correct
- Charts render properly
- Data updates when expenses change
- Visual representations are accurate

---

### 13. Responsive Design

**Test Steps:**
1. Resize browser window to different sizes:
   - Desktop (1920px)
   - Laptop (1366px)
   - Tablet (768px)
   - Mobile (375px)
2. Check each view:
   - Dashboard
   - All Expenses
   - Modals

**Expected Results:**
- Layout adapts to screen size
- No horizontal scrolling
- All elements remain accessible
- Touch targets are appropriate on mobile
- Grids stack properly on smaller screens

---

### 14. Data Persistence

**Test Steps:**
1. Add several expenses
2. Refresh the page
3. Verify expenses are still there
4. Open browser DevTools
5. Go to Application > Local Storage
6. Find "expense-tracker-data"
7. Verify data is stored
8. Close browser completely
9. Reopen and navigate to app
10. Verify expenses persisted

**Expected Results:**
- Data saves automatically
- localStorage contains expense data
- Data persists across sessions
- Data survives browser restart

---

### 15. Edge Cases

**Test Cases:**

**Empty States:**
1. Clear all expenses
2. Verify empty state messages appear:
   - Dashboard shows "No expenses yet"
   - Charts show empty state
   - Expense list shows empty state

**Large Numbers:**
1. Add expense with amount ₹99,99,999.99
2. Verify it displays correctly
3. Verify charts handle large values

**Long Text:**
1. Add expense with 200-character description
2. Verify it displays without breaking layout
3. Verify truncation works in lists

**Special Characters:**
1. Add expense with description: "Café & Restaurant - "Special" Deal!"
2. Export to CSV
3. Verify special characters are preserved

**Multiple Filters:**
1. Apply search + category + date range together
2. Verify all filters work in combination
3. Clear filters and verify reset

**Expected Results:**
- All edge cases handled gracefully
- No layout breaks
- No errors in console
- Data integrity maintained

---

## Performance Checklist

- [ ] Page loads in under 2 seconds
- [ ] Form submissions are instant
- [ ] Filtering/searching updates in real-time
- [ ] No lag when scrolling through expenses
- [ ] Smooth animations and transitions
- [ ] Charts render quickly

## Browser Compatibility

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Common Issues & Solutions

### Issue: Sample data doesn't load
**Solution:** Check browser console for errors. Clear localStorage and reload.

### Issue: Expenses not persisting
**Solution:** Check if cookies/localStorage is enabled in browser settings.

### Issue: Export doesn't work
**Solution:** Check browser's download settings and permissions.

### Issue: Modal doesn't open
**Solution:** Check for JavaScript errors in console. Verify no ad blockers interfering.

## Reporting Issues

If you find any bugs during testing:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Note your browser and OS version
4. Include screenshots if relevant

---

**Happy Testing!**
