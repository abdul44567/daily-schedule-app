import React from "react";
import BackToTopButton from "./BackToTopButton";

const scheduleData = [
  { time: "4:30 AM", task: "Fajr Namaz & Qur'an Recitation", emoji: "🕌" },
  { time: "6:00 AM", task: "Morning Walk & Refresh", emoji: "🌅" },
  { time: "7:00 AM", task: "Breakfast & Light Reading", emoji: "☕" },
  {
    time: "9:00 AM",
    task: "Web Development (Next.js + TypeScript)",
    emoji: "💻",
  },
  { time: "12:00 PM", task: "Lunch & Short Break", emoji: "🍽️" },
  { time: "1:00 PM", task: "Zohar Prayer & Rest", emoji: "🕌" },
  { time: "3:00 PM", task: "Revising Code / Practice", emoji: "📚" },
  { time: "5:00 PM", task: "Asr Prayer & Walk", emoji: "🕌" },
  { time: "6:00 PM", task: "Mini Project / Creative Coding", emoji: "🛠️" },
  { time: "8:00 PM", task: "Dinner & Family Time", emoji: "🍛" },
  { time: "9:30 PM", task: "Isha Prayer & Wind Down", emoji: "🕋" },
  { time: "10:00 PM", task: "Sleep & Recharge", emoji: "😴" },
];

export default function ScheduleItem() {
  return (
    <div className="space-y-4">
      {scheduleData.map(({ time, task, emoji }, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded shadow"
        >
          <span className="text-xl">{emoji}</span>
          <div>
            <p className="font-semibold">{time}</p>
            <p>{task}</p>
          </div>
        </div>
      ))}
      <BackToTopButton />
    </div>
  );
}
