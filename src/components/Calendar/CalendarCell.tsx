import React from "react";
import type { CalendarEvent } from "./CalendarView.types";

interface Props {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isFromCurrentMonth: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const CalendarCell: React.FC<Props> = ({
  date,
  events,
  isToday,
  isFromCurrentMonth,
  onClick,
  onEventClick,
}) => {
  return (
    <div
      onClick={() => onClick(date)}
      className={`relative h-28 p-2 border border-gray-700 cursor-pointer transition-all duration-150
        ${!isFromCurrentMonth ? "bg-gray-800 text-gray-500" : "bg-gray-900 text-gray-200"}
        hover:bg-gray-800 hover:border-blue-600
        ${isToday ? "ring-2 ring-blue-500 shadow-md" : ""}`}
    >
      <div className="text-right text-sm font-semibold text-gray-300">
        {date.getDate()}
      </div>

      <div className="mt-2 space-y-1">
        {events.slice(0, 2).map((ev) => (
          <div
            key={ev.id}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(ev);
            }}
            className="truncate text-xs px-2 py-0.5 rounded bg-blue-500/30 text-blue-300 hover:bg-blue-500/50"
          >
            {ev.title}
          </div>
        ))}
        {events.length > 2 && (
          <div className="text-[11px] text-blue-400">+{events.length - 2} more</div>
        )}
      </div>
    </div>
  );
};

export default CalendarCell;
