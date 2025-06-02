"use client";
import { useRouter } from 'next/navigation';
import { useState } from "react";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function YearCalendar() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const today = new Date();

  const generateDays = (month: number) => {
    const days = [];
    const date = new Date(year, month, 1);
    const firstDay = date.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push(
        <div
          key={d + "-day"}
          className={`h-6 w-6 text-center flex items-center justify-center rounded-full transition ${
            isToday
              ? "bg-purple-600 text-white font-bold shadow-md ring-2 ring-purple-400 text-xs"
              : "hover:bg-purple-100 text-gray-800 text-sm"
          }`}
        >
          {d}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-4">
      {/* 🔙 Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
      >
        ← Back to Home
      </button>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[80vh] overflow-auto">
        {months.map((month, idx) => (
          <div key={idx} className="border rounded p-2 shadow-sm bg-white">
            <h3 className="text-center font-semibold text-purple-700">
              {month} {year}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-sm text-gray-700 mt-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                <div
                  key={`${d}-${idx}`}
                  className="text-center font-bold text-xs mb-2"
                >
                  {d}
                </div>
              ))}
              {generateDays(idx)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
