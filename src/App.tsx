import React from "react";
import CalendarView from "./components/Calendar/CalendarView";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          <div className="bg-white text-black dark:bg-gray-900 dark:text-white p-4">
  Dark mode test
</div>

        </h1>
        <CalendarView />
      </div>
    </div>
  );
}
