import type { Meta, StoryObj } from "@storybook/react";
import CalendarView from "./CalendarView";
import type { CalendarEvent } from "./CalendarView.types";

const meta: Meta<typeof CalendarView> = {
  title: "Calendar/CalendarView",
  component: CalendarView,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;
type Story = StoryObj<typeof CalendarView>;

/* ------------------ STORY DATA HELPERS ------------------ */

// sample mock events for demonstration
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    startDate: new Date(2025, 10, 2, 10, 0).toISOString(),
    endDate: new Date(2025, 10, 2, 11, 0).toISOString(),
    description: "Weekly sync with design team.",
    color: "#0ea5e9",
  },
  {
    id: "2",
    title: "Project Review",
    startDate: new Date(2025, 10, 3, 14, 0).toISOString(),
    endDate: new Date(2025, 10, 3, 15, 0).toISOString(),
    description: "Review sprint progress.",
    color: "#22c55e",
  },
  {
    id: "3",
    title: "Lunch with Client",
    startDate: new Date(2025, 10, 5, 12, 30).toISOString(),
    endDate: new Date(2025, 10, 5, 13, 30).toISOString(),
    description: "Discuss new requirements.",
    color: "#f59e0b",
  },
];

/* ------------------ STORIES ------------------ */

// 1️⃣ Default (Month View)
export const Default: Story = {
  name: "Default - Month View",
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default calendar in Month view with navigation and event modal.",
      },
    },
  },
  render: () => <CalendarView />,
};

// 2️⃣ Week View
export const WeekViewStory: Story = {
  name: "Week View",
  render: () => {
    localStorage.setItem("calendar-events", JSON.stringify(mockEvents));
    return <CalendarView />;
  },
  parameters: {
    docs: {
      description: {
        story: "Displays the calendar in Week view with a few events.",
      },
    },
  },
};

// 3️⃣ Empty State
export const EmptyState: Story = {
  name: "Empty State",
  render: () => {
    localStorage.removeItem("calendar-events");
    return <CalendarView />;
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the calendar with no events added yet.",
      },
    },
  },
};

// 4️⃣ Large Dataset
export const LargeDataset: Story = {
  name: "Large Dataset",
  render: () => {
    const manyEvents: CalendarEvent[] = Array.from({ length: 100 }, (_, i) => ({
      id: String(i + 1),
      title: `Event ${i + 1}`,
      startDate: new Date(2025, 10, (i % 28) + 1, (i % 10) + 8, 0).toISOString(),
      endDate: new Date(2025, 10, (i % 28) + 1, (i % 10) + 9, 0).toISOString(),
      description: "Auto-generated event",
      color: "#3b82f6",
    }));
    localStorage.setItem("calendar-events", JSON.stringify(manyEvents));
    return <CalendarView />;
  },
  parameters: {
    docs: {
      description: {
        story: "Renders performance test with 100+ events stored in localStorage.",
      },
    },
  },
};

// 5️⃣ Interactive Story
export const Interactive: Story = {
  name: "Interactive",
  render: () => <CalendarView />,
  parameters: {
    docs: {
      description: {
        story: "Fully functional calendar with add/edit/delete events enabled.",
      },
    },
  },
};

// 6️⃣ Mobile Responsive
export const MobileView: Story = {
  name: "Mobile View",
  parameters: {
    viewport: { defaultViewport: "iphone12" },
    docs: {
      description: {
        story: "Displays how the calendar adapts to mobile screen size.",
      },
    },
  },
  render: () => <CalendarView />,
};
