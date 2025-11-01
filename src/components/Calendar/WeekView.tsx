import React from "react";
import type { CalendarEvent } from "./CalendarView.types";
import { startOfWeek, addDays, isSameDay } from "../../utils/date.utils";

interface Props {
  date: Date;
  events: CalendarEvent[];
  onTimeSlotCreate: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const WeekViewComponent: React.FC<Props> = ({
  date,
  events,
  onTimeSlotCreate,
  onEventClick,
}) => {
  const weekStart = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  const normalizedEvents = events.map((ev) => ({
    ...ev,
    startDate: new Date(ev.startDate),
    endDate: new Date(ev.endDate),
  }));

  return (
    <section
      role="region"
      aria-label={`Week of ${weekStart.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
      })}`}
      className="w-full bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-md overflow-hidden border border-gray-200
                 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 transition-colors duration-500"
    >
      {/* Header */}
      <div
        role="row"
        className="grid grid-cols-8 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-700
                   dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-colors duration-500"
      >
        <div
          role="columnheader"
          className="p-2 text-center border-r border-gray-200 dark:border-gray-600"
        >
          Time
        </div>
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            role="columnheader"
            aria-label={`Day ${day.toLocaleDateString("default", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}`}
            className={`p-2 text-center transition-colors duration-300 ${
              isSameDay(day, today)
                ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {day.toLocaleDateString("default", {
              weekday: "short",
              day: "numeric",
            })}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-8 text-xs relative" role="grid">
        {/* Time Column */}
        <div
          role="rowheader"
          className="flex flex-col border-r border-gray-200 text-gray-500 dark:border-gray-600 dark:text-gray-400"
        >
          {hours.map((h) => (
            <div
              key={h}
              className="h-16 border-b border-gray-100 dark:border-gray-700 flex items-start justify-center pt-1"
            >
              {h === 0
                ? "12 AM"
                : h < 12
                ? `${h} AM`
                : h === 12
                ? "12 PM"
                : `${h - 12} PM`}
            </div>
          ))}
        </div>

        {/* Days */}
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            role="gridcell"
            tabIndex={0}
            aria-label={`Day column for ${day.toDateString()}`}
            onClick={() => onTimeSlotCreate(day)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onTimeSlotCreate(day);
            }}
            className={`border-r border-gray-200 relative cursor-pointer transition-colors duration-300 
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 
                        ${
                          isSameDay(day, today)
                            ? "bg-blue-50/40 dark:bg-blue-900/20"
                            : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                        } dark:border-gray-600`}
          >
            {/* Hour Slots */}
            {hours.map((h) => (
              <div key={h} className="h-16 border-b border-gray-100 dark:border-gray-700"></div>
            ))}

            {/* Events */}
            {normalizedEvents
              .filter((ev) => isSameDay(ev.startDate, day))
              .map((ev) => {
                const start = new Date(ev.startDate);
                const end = new Date(ev.endDate);
                const startMinutes = start.getHours() * 60 + start.getMinutes();
                const endMinutes = end.getHours() * 60 + end.getMinutes();
                const duration = Math.max(endMinutes - startMinutes, 30);

                const top = (startMinutes / 1440) * 100;
                const height = (duration / 1440) * 100;

                return (
                  <div
                    key={ev.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Event ${ev.title}, from ${start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} to ${end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
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
                    className="absolute left-1 right-1 rounded-md px-2 py-1 text-[11px] text-white cursor-pointer shadow-sm 
                               hover:opacity-90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{
                      backgroundColor: ev.color || "#0ea5e9",
                      top: `${top}%`,
                      height: `${height}%`,
                    }}
                  >
                    <strong>{ev.title}</strong>
                    {ev.description && (
                      <div className="truncate opacity-90">{ev.description}</div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </section>
  );
};

// ✅ Memoized to prevent re-renders when props don’t change
export const WeekView = React.memo(WeekViewComponent);
export default WeekView;
