// ----------------------
// 📅 DATE UTIL FUNCTIONS
// ----------------------

// ✅ Compare two dates safely (handles strings or Date objects)
export const isSameDay = (d1: Date | string, d2: Date | string): boolean => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// ✅ Get start of the week (Sunday)
export const startOfWeek = (date: Date): Date => {
  const newDate = new Date(date);
  const day = newDate.getDay(); // 0 (Sun) to 6 (Sat)
  newDate.setDate(newDate.getDate() - day);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// ✅ Add N days to a given date
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// ✅ Generate a 6x7 grid (42 days) for the month view
export const getCalendarGrid = (date: Date): Date[] => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay(); // Sunday = 0
  const totalDays = endOfMonth.getDate();

  const grid: Date[] = [];

  // Fill previous month days
  for (let i = startDay - 1; i >= 0; i--) {
    const prev = new Date(startOfMonth);
    prev.setDate(startOfMonth.getDate() - (i + 1));
    grid.push(prev);
  }

  // Fill current month days
  for (let i = 1; i <= totalDays; i++) {
    grid.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  // Fill next month days (to make 42 total)
  while (grid.length < 42) {
    const next = new Date(endOfMonth);
    next.setDate(endOfMonth.getDate() + (grid.length - totalDays - startDay + 1));
    grid.push(next);
  }

  return grid;
};

// ✅ Format date for debugging or display
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("default", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
