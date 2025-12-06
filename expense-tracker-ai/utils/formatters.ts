export const formatCurrency = (amount: number): string => {
  try {
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }

    // Fallback formatting
    return `₹${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  } catch (error) {
    return `₹${amount.toFixed(2)}`;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Check if Intl is available
   if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
  return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    }

    // Fallback formatting
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (error) {
    return dateString;
  }
};

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const getCurrentMonthRange = (): { start: string; end: string } => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

export const getMonthName = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (typeof Intl !== 'undefined' && Intl.DateFormat) {
      return new Intl.DateFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    }

    // Fallback formatting
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  } catch (error) {
    return dateString;
  }
};
