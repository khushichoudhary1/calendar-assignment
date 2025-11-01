import { useState } from "react";

// ==============================
// 📆 useCalendar Hook
// Handles navigation, view switching, and date state
// ==============================

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  // Go to previous month or week
  const goToPrevious = () => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() - 7);
        return newDate;
      }
    });
  };

  // Go to next month or week
  const goToNext = () => {
    setCurrentDate((prev) => {
      if (view === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else {
        const newDate = new Date(prev);
        newDate.setDate(prev.getDate() + 7);
        return newDate;
      }
    });
  };

  // Go to today
  const goToToday = () => setCurrentDate(new Date());

  // Switch view
  const switchView = (newView: "month" | "week") => setView(newView);

  return {
    currentDate,
    view,
    goToPrevious,
    goToNext,
    goToToday,
    switchView,
  };
};
