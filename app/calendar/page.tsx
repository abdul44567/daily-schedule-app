// app/calendar/page.tsx
'use client';

import YearCalendar from "../components/YearCalendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white py-12 px-4">
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">📅 Full Year Calendar</h1>
      <div className="flex justify-center">
        <YearCalendar />
      </div>
    </div>
  );
}
