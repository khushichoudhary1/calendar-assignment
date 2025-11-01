import { useState, useEffect } from "react";
import type { CalendarEvent } from "../components/Calendar/CalendarView.types";

export const useEventManager = () => {
  // Load events from localStorage initially
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const stored = localStorage.getItem("calendar-events");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse stored events:", err);
      return [];
    }
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("calendar-events", JSON.stringify(events));
    } catch (err) {
      console.error("Failed to save events:", err);
    }
  }, [events]);

  // ✅ Add or update an event
  const addOrUpdateEvent = (newEvent: CalendarEvent) => {
    setEvents((prev) => {
      const exists = prev.some((evt) => evt.id === newEvent.id);
      if (exists) {
        return prev.map((evt) => (evt.id === newEvent.id ? newEvent : evt));
      }
      return [...prev, newEvent];
    });
  };

  // ✅ Delete an event
  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
  };

  return { events, addOrUpdateEvent, deleteEvent };
};
