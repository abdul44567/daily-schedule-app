"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiEdit, FiTrash2, FiSave, FiX, FiPlus, FiSmile } from "react-icons/fi";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import BackToTopButton from "./BackToTopButton";

interface ScheduleEntry {
  time: string;
  task: string;
  emoji: string;
}

const defaultSchedule: ScheduleEntry[] = [
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
  { time: "9:21 PM", task: "Isha Prayer & Wind Down", emoji: "🕋" },
  { time: "10:00 PM", task: "Sleep & Recharge", emoji: "😴" },
];

const STORAGE_KEY = "scheduleData";

const timeToNumber = (timeStr: string): number => {
  const [time, period] = timeStr.trim().split(" ");
  const [h, m] = time.split(":").map(Number);
  let hour24 = h % 12;
  if (period.toUpperCase() === "PM") hour24 += 12;
  return hour24 * 60 + m;
};

const to12 = (t: string): string => {
  const [hStr, m] = t.split(":");
  let h = parseInt(hStr, 10);
  const p = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${p}`;
};

const to24 = (t: string): string => {
  if (!t.includes("AM") && !t.includes("PM")) return t;
  const [timePart, p] = t.split(" ");
  let [h, m] = timePart.split(":").map(Number);
  if (p === "PM" && h < 12) h += 12;
  if (p === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export default function ScheduleItem() {
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [newEntry, setNewEntry] = useState<ScheduleEntry>({
    time: "",
    task: "",
    emoji: "",
  });
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [reminderMin, setReminderMin] = useState(5);
  const alertRef = useRef<HTMLAudioElement | null>(null);

  // On load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSchedule(
            parsed.sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
          );
          return;
        }
      } catch (e) {
        console.error("Failed to parse saved schedule:", e);
      }
    }
    setSchedule(defaultSchedule);
  }, []);

  // Listen to storage event for cross-tab sync
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newSchedule = JSON.parse(e.newValue);
          if (Array.isArray(newSchedule)) {
            setSchedule(
              newSchedule.sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
            );
          }
        } catch {
          // ignore error
        }
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Save changes
  useEffect(() => {
    if (schedule.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    }
  }, [schedule]);

  // Desktop notifications
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    alertRef.current = new Audio("/alert.mp3");
  }, []);

  // Reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();

      schedule.forEach((item) => {
        const taskMin = timeToNumber(item.time);
        if (taskMin - nowMin === reminderMin) {
          alertRef.current?.play().catch(() => {});
          if (Notification.permission === "granted") {
            new Notification("⏰ Upcoming Task", {
              body: `${item.emoji} ${item.task} at ${item.time}`,
              icon: "/bell.png",
            });
          } else {
            alert(`⏰ ${item.emoji} ${item.task} at ${item.time}`);
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [schedule, reminderMin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ScheduleEntry
  ) => {
    const v = e.target.value;
    editingEntry && editingIdx !== null
      ? setEditingEntry({ ...editingEntry, [field]: v })
      : setNewEntry({ ...newEntry, [field]: v });
    setError(null);
  };

  const handleAdd = () => {
    const { time, task, emoji } = newEntry;
    if (!time || !task || !emoji) return setError("All fields are required.");
    if (schedule.some((s) => s.time.toLowerCase() === time.toLowerCase()))
      return setError("Time already exists");

    const updated = [
      ...schedule,
      { time: time.trim(), task: task.trim(), emoji: emoji.trim() },
    ].sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time));
    setSchedule(updated);
    setNewEntry({ time: "", task: "", emoji: "" });
  };

  const saveEdit = () => {
    if (!editingEntry) return;
    const { time, task, emoji } = editingEntry;
    if (!time || !task || !emoji) return setError("All fields required.");
    const updated = [...schedule];
    updated[editingIdx!] = { time, task, emoji };
    setSchedule(
      updated.sort((a, b) => timeToNumber(a.time) - timeToNumber(b.time))
    );
    setEditingIdx(null);
    setEditingEntry(null);
  };

  const resetToDefault = () => {
    if (confirm("Reset to default schedule?")) {
      setSchedule(defaultSchedule);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSchedule));
    }
  };

  return (
    <div className="space-y-4">
      {/* Add section */}
      <div className="p-4 border rounded bg-white dark:bg-gray-800 sticky top-21 z-10 space-y-2">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Add New Schedule Item</h3>
          <button
            onClick={resetToDefault}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Reset to Default
          </button>
        </div>

        {/* Inputs Section */}
        <div className="flex flex-col md:flex-row md:items-center md:gap-2 gap-3 mb-4">
          {/* Emoji + Time */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-10 h-8 border rounded flex items-center justify-center text-xl"
              >
                {newEntry.emoji || <FiSmile className="text-gray-400" />}
              </button>
              {showPicker && (
                <div className="absolute z-50 top-9">
                  <EmojiPicker
                    onEmojiClick={(e: EmojiClickData) => {
                      setNewEntry({ ...newEntry, emoji: e.emoji });
                      setShowPicker(false);
                    }}
                  />
                </div>
              )}
            </div>

            <input
              type="time"
              className="w-32 border p-1 pl-2 rounded"
              value={to24(newEntry.time)}
              onChange={(e) =>
                setNewEntry({ ...newEntry, time: to12(e.target.value) })
              }
            />
          </div>

          {/* Task Input */}
          <input
            type="text"
            className="flex-1 border p-1 pl-2 rounded"
            placeholder="Task"
            value={newEntry.task}
            onChange={(e) => handleInputChange(e, "task")}
          />

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="p-2 bg-blue-500 text-white rounded-full
                 md:self-auto
                 w-full md:w-auto flex justify-center items-center"
          >
            <FiPlus />
          </button>
        </div>

        {/* Reminder Dropdown */}
        <div className="flex items-center gap-2 text-sm">
          <span>Remind me:</span>
          <select
            value={reminderMin}
            onChange={(e) => setReminderMin(parseInt(e.target.value))}
            className="border p-[2px] rounded dark:bg-gray-700 dark:text-white"
          >
            {[5, 10, 15].map((m) => (
              <option key={m} value={m}>
                {m} min before
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Schedule list */}
      {schedule.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between p-4 bg-white dark:bg-gray-800 rounded shadow"
        >
          {editingIdx === idx ? (
            <div className="flex gap-2 w-full items-center">
              <input
                className="w-10 border p-1 text-xl rounded"
                value={editingEntry?.emoji || ""}
                onChange={(e) => handleInputChange(e, "emoji")}
              />
              <input
                className="w-24 border p-1 rounded"
                value={editingEntry?.time || ""}
                onChange={(e) => handleInputChange(e, "time")}
              />
              <input
                className="flex-1 border p-1 rounded"
                value={editingEntry?.task || ""}
                onChange={(e) => handleInputChange(e, "task")}
              />
              <button onClick={saveEdit} className="text-green-600">
                <FiSave />
              </button>
              <button
                onClick={() => {
                  setEditingIdx(null);
                  setEditingEntry(null);
                }}
                className="text-gray-500"
              >
                <FiX />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <p className="font-semibold">{item.time}</p>
                  <p>{item.task}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingIdx(idx);
                    setEditingEntry(item);
                  }}
                  className="text-blue-500"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={() =>
                    setSchedule(schedule.filter((_, i) => i !== idx))
                  }
                  className="text-red-500"
                >
                  <FiTrash2 />
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <BackToTopButton />
    </div>
  );
}
