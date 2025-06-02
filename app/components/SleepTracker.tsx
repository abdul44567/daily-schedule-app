"use client";
import React, { useState } from "react";

const SleepTracker = () => {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [duration, setDuration] = useState("");

  const calculateSleep = () => {
    if (!sleepTime || !wakeTime) return;

    const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(":").map(Number);

    // Total minutes from 00:00
    const sleepInMinutes = sleepHour * 60 + sleepMinute;
    const wakeInMinutes = wakeHour * 60 + wakeMinute;

    let totalSleepMinutes = wakeInMinutes - sleepInMinutes;

    // If sleep was at night and wake is next day
    if (totalSleepMinutes < 0) {
      totalSleepMinutes += 24 * 60;
    }

    const hours = Math.floor(totalSleepMinutes / 60);
    const minutes = totalSleepMinutes % 60;

    setDuration(`${hours}h ${minutes}m`);
  };

  return (
    <div className="mt-10 p-6 rounded-lg bg-purple-50 shadow">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">😴 Sleep Tracker</h2>

      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="block text-purple-600 font-medium mb-1">
            Sone ka time:
          </label>
          <input
            type="time"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            className="w-full text-black border rounded px-3 py-2"
          />
        </div>

        <div className="flex-1">
          <label className="block text-purple-600 font-medium mb-1">
            Uthne ka time:
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full text-black border rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        onClick={calculateSleep}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Calculate Sleep
      </button>

      {duration && (
        <div className="mt-4 text-lg font-semibold text-green-600">
          😌 Tum ne total: <span className="font-bold">{duration}</span> soya!
        </div>
      )}
    </div>
  );
};

export default SleepTracker;
