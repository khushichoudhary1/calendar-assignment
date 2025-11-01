import React, { useState, useEffect, useRef } from "react";
import type { CalendarEvent } from "./CalendarView.types";

interface Props {
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
}

const EventModal: React.FC<Props> = ({
  onClose,
  onSave,
  onDelete,
  selectedDate,
  selectedEvent,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState("#0ea5e9");

  // ✅ Reference for accessibility focus trap
  const modalRef = useRef<HTMLDivElement | null>(null);

  // ✅ Initialize values
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description || "");
      setStartDate(new Date(selectedEvent.startDate).toISOString().slice(0, 16));
      setEndDate(new Date(selectedEvent.endDate).toISOString().slice(0, 16));
      setColor(selectedEvent.color || "#0ea5e9");
    } else if (selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0, 16);
      setStartDate(dateStr);
      setEndDate(dateStr);
      setTitle("");
      setDescription("");
      setColor("#0ea5e9");
    }

    // ✅ Focus the first input when modal opens
    const firstInput = modalRef.current?.querySelector("input, textarea, button");
    (firstInput as HTMLElement | null)?.focus();

    // ✅ Close modal with ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent, selectedDate, onClose]);

  // ✅ Save Event
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    const newEvent: CalendarEvent = {
      id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      color,
    };

    onSave(newEvent);
  };

  // ✅ Delete Event
  const handleDelete = () => {
    if (selectedEvent && onDelete) {
      onDelete(selectedEvent.id);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      aria-describedby="event-modal-description"
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={(e) => {
        // Close when clicking outside modal content
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-3 border border-gray-200 transition-all scale-100 animate-fade-in"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-3 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
          <h2
            id="event-modal-title"
            className="text-lg font-semibold text-blue-700"
          >
            {selectedEvent ? "Edit Event" : "Add Event"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close event modal"
            className="text-gray-500 hover:text-gray-800 transition text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4"
          aria-describedby="event-modal-description"
        >
          <p id="event-modal-description" className="sr-only">
            Enter or edit the details for your calendar event.
          </p>

          <div>
            <label
              htmlFor="event-title"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="event-title"
              type="text"
              className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting, Task, Reminder..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="event-description"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Description
            </label>
            <textarea
              id="event-description"
              rows={2}
              className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="event-start"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Start Date & Time
              </label>
              <input
                id="event-start"
                type="datetime-local"
                className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="event-end"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                End Date & Time
              </label>
              <input
                id="event-end"
                type="datetime-local"
                className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="event-color"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Event Color
            </label>
            <input
              id="event-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex justify-between items-center pt-3">
            {/* Delete Button */}
            {selectedEvent && (
              <button
                type="button"
                onClick={handleDelete}
                aria-label="Delete this event"
                className="px-4 py-2 rounded-md border border-red-400 text-red-600 hover:bg-red-50 transition font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                Delete
              </button>
            )}

            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="Cancel and close modal"
                className="px-4 py-2 rounded-md bg-gray-100 border border-gray-300 hover:bg-gray-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                aria-label="Save event"
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
