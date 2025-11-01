// src/components/Calendar/CalendarView.types.ts
export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: string | Date;
    endDate: string | Date;

    color?: string;
    category?: string;
}
