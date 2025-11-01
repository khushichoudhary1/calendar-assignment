import React from "react";
import type { CalendarEvent } from "./CalendarView.types";
import { getCalendarGrid, isSameDay } from "../../utils/date.utils";

interface Props {
  currentDate?: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const MonthViewComponent: React.FC<Props> = ({
  currentDate,
  events,
  onDayClick,
  onEventClick,
}) => {
  const safeDate = currentDate instanceof Date ? currentDate : new Date();
  const today = new Date();
  const grid = getCalendarGrid(safeDate);

  const normalizedEvents = events.map((ev) => ({
    ...ev,
    startDate: new Date(ev.startDate),
    endDate: new Date(ev.endDate),
  }));

  return (
    <div
      role="grid"
      aria-label={`${safeDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })} calendar`}
      className="rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-b from-white to-gray-50 shadow-md 
                 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 transition-colors duration-500"
    >
      {/* Week Header */}
      <div
        role="row"
        className="grid grid-cols-7 bg-gray-100 text-gray-700 text-sm font-semibold border-b border-gray-300 
                   dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-colors duration-500"
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            role="columnheader"
            className="py-3 text-center uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 text-xs" role="rowgroup">
        {grid.map((date, i) => {
          const isCurrentMonth = date.getMonth() === safeDate.getMonth();
          const isToday = isSameDay(date, today);
          const dayEvents = normalizedEvents.filter((ev) =>
            isSameDay(ev.startDate, date)
          );

          return (
            <div
              key={i}
              role="gridcell"
              aria-selected={isToday}
              tabIndex={0}
              aria-label={`${isToday ? "Today, " : ""}${date.toDateString()}, ${
                dayEvents.length
              } event${dayEvents.length !== 1 ? "s" : ""}`}
              onClick={() => onDayClick(date)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onDayClick(date);
              }}
              className={`border border-gray-200 p-2 h-32 cursor-pointer relative transition-all duration-200 
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                ${
                  isCurrentMonth
                    ? "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    : "bg-gray-100/70 text-gray-400 dark:bg-gray-700/40 dark:text-gray-500"
                }
                ${
                  isToday
                    ? "ring-2 ring-blue-400 bg-blue-50 dark:ring-blue-500 dark:bg-blue-900/30"
                    : ""
                }`}
            >
              <div
                className={`text-sm font-semibold ${
                  isToday
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {date.getDate()}
              </div>

              {/* Events */}
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Event: ${ev.title}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(ev);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        onEventClick(ev);
                      }
                    }}
                    className="truncate text-[11px] px-1 py-0.5 rounded text-white cursor-pointer shadow-sm 
                               hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ backgroundColor: ev.color || "#0ea5e9" }}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div
                    aria-label={`${dayEvents.length - 2} more events`}
                    className="text-[10px] text-blue-600 dark:text-blue-400 font-medium"
                  >
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ✅ Memoized for performance
export const MonthView = React.memo(MonthViewComponent);
export default MonthView;
