// app/calendar/page.tsx
'use client';

import PageTitle from "../components/pageTitle";
import YearCalendar from "../components/YearCalendar";

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white py-12 px-4">
      <PageTitle text="📅 Full Year Calendar" />

      <div className="flex justify-center">
        <YearCalendar />
      </div>
    </div>
  );
}
