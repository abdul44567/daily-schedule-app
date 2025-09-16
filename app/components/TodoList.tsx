"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, CalendarDays, StickyNote } from "lucide-react";
import PageTitle from "./pageTitle";
import toast, { Toaster } from "react-hot-toast";

interface Task {
  id: number;
  text: string;
  deadline: string;
  category: string;
  completed: boolean;
  notes?: string;
}

const categories = [
  {
    key: "must",
    label: "MUST DO",
    bg: "bg-indigo-800",
    shadow: "shadow-[0_0_12px_3px_rgba(99,102,241,0.6)]",
  },
  {
    key: "should",
    label: "SHOULD DO",
    bg: "bg-sky-800",
    shadow: "shadow-[0_0_12px_3px_rgba(56,189,248,0.6)]",
  },
  {
    key: "could",
    label: "COULD DO",
    bg: "bg-green-800",
    shadow: "shadow-[0_0_12px_3px_rgba(34,197,94,0.6)]",
  },
  {
    key: "ifTime",
    label: "IF I HAVE TIME",
    bg: "bg-pink-800",
    shadow: "shadow-[0_0_12px_3px_rgba(236,72,153,0.6)]",
  },
];

// 📌 CalendarButton (fixed)
const CalendarButton = ({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (date: string) => void;
  hasError?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const getDays = () => {
    const startDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const items: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) items.push(null);
    for (let d = 1; d <= totalDays; d++) items.push(d);
    return items;
  };

  const selectDate = (d: number) => {
    const selected = new Date(year, month, d);
    const localDateStr = `${selected.getFullYear()}-${String(
      selected.getMonth() + 1
    ).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`;
    onChange(localDateStr);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => !hasError && setOpen(!open)}
        disabled={hasError}
        className={`w-44 p-3 rounded-xl border-2 shadow-sm transition
      flex items-center justify-center gap-2 focus:outline-none
      ${
        hasError
          ? "border-red-400 bg-red-50 text-red-600 cursor-not-allowed opacity-70"
          : "border-purple-300 bg-white/60 text-purple-700 hover:bg-purple-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
      }`}
        type="button"
      >
        <CalendarDays size={20} />
        {value
          ? new Date(value).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Select date"}
      </button>

      {open && (
        <div className="absolute z-50 bg-white border rounded-xl shadow-lg p-3 w-64 mt-2">
          <h3 className="text-center font-semibold text-purple-700 mb-2 text-sm">
            {monthName} {year}
          </h3>
          <div className="grid grid-cols-7 gap-[3px] text-center text-xs text-gray-600 font-semibold">
            {days.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-[3px] mt-1 text-sm">
            {getDays().map((d, i) =>
              d ? (
                <div
                  key={i}
                  onClick={() => selectDate(d)}
                  className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer ${
                    value && new Date(value).getDate() === d
                      ? "bg-purple-600 text-white font-bold shadow-md"
                      : d === currentDay
                      ? "bg-purple-100 text-purple-700 font-semibold"
                      : "hover:bg-purple-50 text-gray-700"
                  }`}
                >
                  {d}
                </div>
              ) : (
                <div key={i} />
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TodoBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState(categories[0].key);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Notes Modal State
  const [notesTask, setNotesTask] = useState<Task | null>(null);
  const [notesInput, setNotesInput] = useState("");

  const isDeadlineMissing = deadline;

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // decide when error active
  const isTitleTooLong = newTask.length >= 25;
  const maxChars = 25;

  const addTask = () => {
    if (!newTask.trim()) {
      toast("⚠️ Please enter a task!");
      return;
    }
    const task: Task = {
      id: Date.now(),
      text: newTask,
      deadline,
      category,
      completed: false,
    };
    setTasks([task, ...tasks]);
    toast.success("Task added!");
    setNewTask("");
    setDeadline("");
    setCategory(categories[0].key);
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast("🗑️ Task deleted!");
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    const task = tasks.find((t) => t.id === id);
    if (task) {
      if (!task.completed) toast.success("Task completed!");
      else toast("↩️ Task marked as incomplete!");
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask(task.text);
    setDeadline(task.deadline);
    setCategory(task.category);
  };

  const saveEdit = () => {
    if (!newTask.trim()) {
      toast("⚠️ Please enter a task!");
      return;
    }
    if (!editingTask) return;
    setTasks(
      tasks.map((t) =>
        t.id === editingTask.id
          ? { ...t, text: newTask, deadline, category }
          : t
      )
    );
    setEditingTask(null);
    setNewTask("");
    setDeadline("");
    setCategory(categories[0].key);
    toast.success("Task updated!");
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setNewTask("");
    setDeadline("");
    setCategory(categories[0].key);
  };

  // 📝 Save Notes
  const saveNotes = () => {
    if (!notesTask) return;
    setTasks(
      tasks.map((t) =>
        t.id === notesTask.id ? { ...t, notes: notesInput } : t
      )
    );
    setNotesTask(null);
    setNotesInput("");
    toast.success("Notes saved!");
  };

  const formatDate = (dateStr: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white p-6">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        <PageTitle text="Todo Board" />

        {/* Add Task */}
        <div
          className={`bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-lg border-t-6 p-6 mb-8 backdrop-blur-md ${
            isTitleTooLong ? "border-red-500" : "border-purple-700"
          }`}
        >
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-3 items-center flex-wrap relative w-full">
              {/* Task input */}
              <div className="relative flex-grow min-w-[200px]">
                <input
                  type="text"
                  placeholder="Enter new task..."
                  maxLength={maxChars}
                  className={`w-full p-3 pr-14 rounded-xl shadow-sm focus:outline-none transition ${
                    isTitleTooLong
                      ? "border-2 border-red-400 bg-red-50 text-red-600 placeholder-red-400 focus:ring-2 focus:ring-red-500"
                      : "border-2 border-purple-300 bg-white/60 text-purple-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  }`}
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!isTitleTooLong) {
                        editingTask ? saveEdit() : addTask();
                      } else {
                        toast.error(
                          `❌ Task too long! Max ${maxChars} characters allowed.`
                        );
                      }
                    }
                  }}
                />

                {/* Character counter inside input */}
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold pointer-events-none ${
                    isTitleTooLong ? "text-red-500" : "text-purple-500"
                  }`}
                >
                  {newTask.length}/{maxChars}
                </span>
              </div>

              {/* Date picker button */}
              <CalendarButton
                value={deadline}
                onChange={setDeadline}
                hasError={isTitleTooLong}
              />

              {/* Category dropdown */}
              <select
                disabled={isTitleTooLong}
                className={`w-44 p-3 rounded-xl border-2 shadow-sm transition focus:outline-none
    ${
      isTitleTooLong
        ? "border-red-400 bg-red-50 text-red-600 cursor-not-allowed opacity-70"
        : "border-purple-300 bg-white/60 text-purple-700 focus:ring-2 focus:ring-purple-500 cursor-pointer"
    }`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Add / Save button */}
              {editingTask ? (
                <button
                  onClick={saveEdit}
                  disabled={isTitleTooLong}
                  className={`px-6 py-3 rounded-xl font-semibold border-2 shadow-md transition focus:outline-none ${
                    isTitleTooLong
                      ? "bg-red-500 text-white cursor-not-allowed opacity-80 border-red-300"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 border-purple-300 cursor-pointer"
                  }`}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={addTask}
                  disabled={isTitleTooLong}
                  className={`px-6 py-3 rounded-xl font-semibold border-2 shadow-md transition focus:outline-none ${
                    isTitleTooLong
                      ? "bg-red-500 text-white cursor-not-allowed opacity-80 border-red-300"
                      : "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 border-purple-300 cursor-pointer"
                  }`}
                >
                  Add
                </button>
              )}
            </div>

            {/* Inline error message */}
            {isTitleTooLong && (
              <p className="text-sm text-red-600 font-medium mt-1">
                ❌ Task title too long! Keep it under {maxChars} characters.
              </p>
            )}
          </div>

          {editingTask && (
            <button
              onClick={cancelEdit}
              className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Task Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const catTasks = tasks.filter((t) => t.category === cat.key);

            const deleteAllTasksInCategory = () => {
              setTasks(tasks.filter((t) => t.category !== cat.key));
              toast("🗑️ All tasks deleted");
            };

            return (
              <div
                key={cat.key}
                className={`bg-white rounded-2xl shadow-xl p-5 border border-purple-200 ${cat.shadow}`}
              >
                {/* Header with Delete All button */}
                <div className="flex justify-between items-center mb-3">
                  <h2
                    className={`text-xl font-semibold ${cat.bg} text-white px-3 py-1 rounded-lg`}
                  >
                    {cat.label}
                  </h2>

                  {catTasks.length > 0 && (
                    <button
                      onClick={deleteAllTasksInCategory}
                      className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer shadow"
                    >
                      Delete All
                    </button>
                  )}
                </div>

                {/* Task List */}
                <ul className="space-y-3">
                  {catTasks.length === 0 && (
                    <p className="text-gray-400 text-sm">No tasks here...</p>
                  )}
                  {catTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 rounded-lg border border-purple-300 bg-purple-50"
                    >
                      {/* Task text */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`${
                            task.completed
                              ? "line-through text-gray-400"
                              : "text-purple-800"
                          } break-words`}
                        >
                          {task.text}
                        </p>
                        {task.deadline && (
                          <span className="text-sm text-purple-600 block">
                            Deadline: {formatDate(task.deadline)}
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 justify-end shrink-0">
                        <button
                          onClick={() => toggleComplete(task.id)}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
                            task.completed
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-white border border-purple-400 text-purple-700 hover:bg-purple-100"
                          }`}
                        >
                          {task.completed ? "Undo" : "Done"}
                        </button>
                        <button
                          onClick={() => {
                            setNotesTask(task);
                            setNotesInput(task.notes || "");
                          }}
                          disabled={task.completed}
                          className={`w-8 h-8 flex items-center justify-center rounded-md transition ${
                            task.notes?.trim()
                              ? "bg-blue-700 text-white hover:bg-blue-800"
                              : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                          } ${
                            task.completed
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer"
                          }`}
                        >
                          <StickyNote size={16} />
                        </button>
                        <button
                          onClick={() => startEdit(task)}
                          disabled={task.completed}
                          className={`w-8 h-8 flex items-center justify-center rounded-md bg-yellow-500 text-white hover:bg-yellow-600 ${
                            task.completed
                              ? "cursor-not-allowed opacity-60 "
                              : "cursor-pointer"
                          }`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Notes Modal */}
        {notesTask && (
          <div className="fixed inset-0 bg-gray-900/70 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 border-t-4 border-purple-500">
              <h3
                className="relative text-base font-medium text-purple-800 mb-4 px-4 py-3 
                bg-gradient-to-r from-purple-50 to-purple-200 
                border-l-4 border-purple-600 rounded-md shadow-sm flex items-center gap-3"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full shadow-sm"></span>
                <span
                  className="flex-1 max-w-full line-clamp-2"
                  title={notesTask.text}
                >
                  {notesTask.text}
                </span>
              </h3>

              <textarea
                className="w-full p-3 rounded-lg border border-purple-300 text-sm text-purple-900 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
                rows={5}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Add your notes..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    saveNotes();
                  }
                }}
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setNotesTask(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveNotes}
                  className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoBoard;
