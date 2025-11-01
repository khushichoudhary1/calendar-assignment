import React, { useState, useEffect } from "react";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import EventModal from "./EventModal";
import type { CalendarEvent } from "./CalendarView.types";
import { useCalendar } from "../../hooks/useCalendar";
import { useEventManager } from "../../hooks/useEventManager";
import { motion } from "framer-motion";

const CalendarView: React.FC = () => {
  const { currentDate, view, goToToday, goToPrevious, goToNext, switchView } =
    useCalendar();
  const { events, addOrUpdateEvent, deleteEvent } = useEventManager();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (newEvent: CalendarEvent) => {
    addOrUpdateEvent(newEvent);
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleClearAll = () => {
    if (events.length === 0) return;
    if (confirm("Are you sure you want to delete all events?")) {
      localStorage.removeItem("calendar-events");
      window.location.reload();
    }
  };

  return (
    <main
  role="main"
  aria-label="Calendar main section"
  className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 
             text-gray-900 py-10 px-4 sm:px-8 
             dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:text-gray-100 
             transition-colors duration-500"
>
  <div
    className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6
               dark:bg-gray-800 dark:border-gray-700 transition-colors duration-500"

        role="region"
        aria-labelledby="calendar-heading"
      >
        {/* Header Title */}
        <h1
          id="calendar-heading"
          className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight dark:text-blue-400"
        >
          Calendar View
        </h1>

        {/* Header Controls */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
          role="toolbar"
          aria-label="Calendar navigation controls"
        >
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              aria-label="Go to previous month"
              className="px-3 py-1.5 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              ‹
            </button>
            <button
              onClick={goToToday}
              aria-label="Go to today"
              className="px-3 py-1.5 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 font-medium 
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              aria-label="Go to next month"
              className="px-3 py-1.5 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-100"
            >
              ›
            </button>

            <h2
              className="ml-4 text-lg font-semibold text-gray-800 dark:text-gray-200"
              aria-live="polite"
            >
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>

          {/* View Toggle + Clear All + Dark Mode */}
          <div className="flex items-center gap-3">
            {/* View Switch */}
            <div
              onClick={() => switchView(view === "month" ? "week" : "month")}
              role="switch"
              aria-label="Toggle between month and week views"
              aria-checked={view === "week"}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  switchView(view === "month" ? "week" : "month");
              }}
              className="relative w-28 h-8 bg-gray-200 rounded-full cursor-pointer transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         dark:bg-gray-700"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 left-1 w-[50%] h-6 rounded-full flex items-center justify-center text-xs font-medium
                  ${view === "month"
                    ? "translate-x-0 bg-blue-600 text-white"
                    : "translate-x-[100%] bg-blue-600 text-white"}`}
              >
                {view === "month" ? "Month" : "Week"}
              </motion.div>
            </div>

            {/* 🌞 / 🌙 Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="px-3 py-1.5 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 
                         dark:bg-gray-700 dark:border-gray-600 dark:text-yellow-300 dark:hover:bg-gray-600 
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
            >
            Light / Dark
            </button>

            {/* Clear All */}
            <button
              onClick={handleClearAll}
              aria-label="Clear all calendar events"
              disabled={events.length === 0}
              className={`px-3 py-1.5 rounded-md border text-sm font-medium transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${events.length === 0
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
                  : "bg-red-50 text-red-600 border-red-300 hover:bg-red-100 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200"
                }`}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Calendar Display */}
        <section
          role="region"
          aria-label={`Calendar ${view === "month" ? "month view" : "week view"}`}
          className="rounded-xl overflow-hidden border border-gray-200 bg-white transition-all duration-300
                     dark:bg-gray-800 dark:border-gray-700"
        >
          {view === "month" ? (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          ) : (
            <WeekView
              date={currentDate}
              events={events}
              onTimeSlotCreate={handleDayClick}
              onEventClick={handleEventClick}
            />
          )}
        </section>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
        />
      )}
    </main>
  );
};

export default CalendarView;
