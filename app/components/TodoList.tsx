"use client";

import React, { useState, useEffect } from "react";
import { StickyNote, Edit2, Trash2, X, } from "lucide-react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import PageTitle from "./pageTitle";
import Button from "./Button";

type Task = {
  text: string;
  completed: boolean;
  details?: string;
};

const categories = [
  {
    key: "must",
    label: "MUST DO",
    color: "bg-indigo-300",
    bg: "bg-indigo-800",
    shadow: "shadow-[0_0_12px_3px_rgba(99,102,241,0.6)]", // Indigo glow
  },
  {
    key: "should",
    label: "SHOULD DO",
    color: "bg-sky-300",
    bg: "bg-sky-800",
    shadow: "shadow-[0_0_12px_3px_rgba(56,189,248,0.6)]", // Sky blue glow
  },
  {
    key: "could",
    label: "COULD DO",
    color: "bg-green-300",
    bg: "bg-green-800",
    shadow: "shadow-[0_0_12px_3px_rgba(34,197,94,0.6)]", // Green glow
  },
  {
    key: "ifTime",
    label: "IF I HAVE TIME",
    color: "bg-pink-300",
    bg: "bg-pink-800",
    shadow: "shadow-[0_0_12px_3px_rgba(236,72,153,0.6)]", // Pink glow
  },
];

export default function TodoBoard() {
  const [todos, setTodos] = useState<Record<string, Task[]>>({
    must: [],
    should: [],
    could: [],
    ifTime: [],
  });

  const [inputValues, setInputValues] = useState<Record<string, string>>({
    must: "",
    should: "",
    could: "",
    ifTime: "",
  });

  const [editMode, setEditMode] = useState<Record<string, number | null>>({
    must: null,
    should: null,
    could: null,
    ifTime: null,
  });

  const [detailInputs, setDetailInputs] = useState<Record<string, string>>({});
  const [activeNote, setActiveNote] = useState<{
    key: string;
    index: number;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTodos(parsed);
      } catch (e) {
        console.error("Invalid todos in localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddOrUpdate = (key: string) => {
    const text = inputValues[key].trim();
    if (!text) return;

    if (editMode[key] !== null) {
      const updatedTasks = [...todos[key]];
      updatedTasks[editMode[key]!] = {
        ...updatedTasks[editMode[key]!],
        text,
      };
      setTodos((prev) => ({ ...prev, [key]: updatedTasks }));
      setEditMode((prev) => ({ ...prev, [key]: null }));
      toast.success("Task updated!");
    } else {
      setTodos((prev) => ({
        ...prev,
        [key]: [{ text, completed: false }, ...prev[key]],
      }));
      toast.success("Task added!");
    }

    setInputValues((prev) => ({ ...prev, [key]: "" }));
  };

  const handleDelete = (key: string, index: number) => {
    const updatedTasks = [...todos[key]];
    updatedTasks.splice(index, 1);
    setTodos((prev) => ({ ...prev, [key]: updatedTasks }));
    toast.success("Task deleted");
  };

  const handleEdit = (key: string, index: number) => {
    setInputValues((prev) => ({ ...prev, [key]: todos[key][index].text }));
    setEditMode((prev) => ({ ...prev, [key]: index }));
  };

  const handleToggleComplete = (key: string, index: number) => {
    const updatedTasks = [...todos[key]];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTodos((prev) => ({ ...prev, [key]: updatedTasks }));
  };

  const openStickyNote = (key: string, index: number) => {
    setActiveNote({ key, index });
    setDetailInputs((prev) => ({
      ...prev,
      [`${key}-${index}`]: todos[key][index].details || "",
    }));
  };

  const saveStickyNote = () => {
    if (!activeNote) return;

    const { key, index } = activeNote;
    const detailKey = `${key}-${index}`;
    const details = detailInputs[detailKey]?.trim() || "";

    const updatedTasks = [...todos[key]];
    updatedTasks[index] = {
      ...updatedTasks[index],
      details,
    };

    setTodos((prev) => ({ ...prev, [key]: updatedTasks }));
    setActiveNote(null);
    toast.success("Details saved!");
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceTasks = [...todos[source.droppableId]];
    const destTasks = [...todos[destination.droppableId]];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setTodos((prev) => ({
        ...prev,
        [source.droppableId]: sourceTasks,
      }));
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      setTodos((prev) => ({
        ...prev,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destTasks,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-8 bg-gradient-to-br from-purple-200 to-white p-6 overflow-x-auto min-h-screen relative">
      <Toaster position="top-right" />

      <PageTitle text="📝 My Todo Board" />
      <p className="text-center max-w-2xl mx-auto text-gray-600 italic relative px-8 -mt-6 text-sm md:text-base">
        <FaQuoteLeft className="absolute left-2 top-0 text-purple-400 text-xl" />
        Organize your day, prioritize your goals, and boost your productivity
        with this intuitive, drag-and-drop todo board. Keep track of what you{" "}
        <span className="font-semibold text-purple-600">must</span>,{" "}
        <span className="font-semibold text-sky-600">should</span>, and{" "}
        <span className="font-semibold text-green-600">could</span> do — all in
        one place.
        <FaQuoteRight className="absolute right-2 bottom-0 text-purple-400 text-xl" />
      </p>

      <div className="w-24 h-[2px] bg-purple-400 mx-auto mb-4 rounded"></div>


      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col sm:flex-row gap-6">
          {categories.map(({ key, label, color, bg, shadow }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${bg} ${shadow} rounded-lg flex-1 min-w-[280px] min-h-[480px] p-5 flex flex-col`}
                >
                  <div
                    className={`${color} text-gray-900 rounded-lg p-3 text-center font-extrabold text-lg mb-4 select-none`}
                  >
                    {label}
                  </div>

                  <div className="flex flex-col gap-3 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-purple-400">
                    {todos[key].map((task, i) => (
                      <Draggable
                        draggableId={`${key}-${i}`}
                        index={i}
                        key={`${key}-${i}`}
                      >
                        {(dragProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={`relative flex items-start gap-3 border border-gray-300 p-3 rounded-lg bg-white text-black text-sm transition-transform duration-300 cursor-grab select-text ${
                              task.completed
                                ? "line-through text-gray-400 bg-gray-100"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => handleToggleComplete(key, i)}
                              className="mt-1 cursor-pointer"
                              aria-label={`Mark task '${task.text}' as completed`}
                            />
                            <div className="flex-1 whitespace-pre-wrap break-words">
                              {task.text}
                            </div>
                            <div className="flex gap-3 items-center">
                              <StickyNote
                                size={18}
                                className={`cursor-pointer transition-colors duration-200 ${
                                  task.details
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-400 hover:text-yellow-500"
                                }`}
                                onClick={() => openStickyNote(key, i)}
                                aria-label="Add or edit task details"
                              />
                              <Edit2
                                size={18}
                                className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                                onClick={() => handleEdit(key, i)}
                                aria-label="Edit task"
                              />
                              <Trash2
                                size={18}
                                className="text-red-600 cursor-pointer hover:text-red-700 transition-colors"
                                onClick={() => handleDelete(key, i)}
                                aria-label="Delete task"
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  {/* Summary Box Below Tasks */}
                  <div className="mt-4 bg-white border border-gray-300 rounded-lg p-3 text-center shadow-inner select-none">
                    <p className="font-semibold text-gray-800">
                      Total tasks:{" "}
                      <span className="text-purple-700">
                        {todos[key].length}
                      </span>
                    </p>
                  </div>

                  <div className="mt-2 flex gap-3">
                    <input
                      type="text"
                      placeholder="Add a task..."
                      value={inputValues[key]}
                      onChange={(e) =>
                        setInputValues((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddOrUpdate(key);
                        }
                      }}
                      className="flex-1 px-3 py-1 w-full text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 transition"
                      aria-label={`Add new task for ${label}`}
                    />
                    <Button
                      onClick={() => handleAddOrUpdate(key)}
                      className="px-3 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                      aria-label={
                        editMode[key] !== null ? "Update task" : "Add task"
                      }
                    >
                      {editMode[key] !== null ? "Update" : "Add"}
                    </Button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {activeNote && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-5 z-50">
          <div className="bg-yellow-50 p-6 rounded-2xl shadow-2xl w-full max-w-md relative">
            <Button
              onClick={() => setActiveNote(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 cursor-pointer"
              aria-label="Close details modal"
            >
              <X size={24} />
            </Button>
            <h3 className="text-xl font-bold mb-3 text-yellow-800 truncate">
              {todos[activeNote.key][activeNote.index].text}
            </h3>
            <textarea
              value={
                detailInputs[`${activeNote.key}-${activeNote.index}`] || ""
              }
              onChange={(e) =>
                setDetailInputs((prev) => ({
                  ...prev,
                  [`${activeNote.key}-${activeNote.index}`]: e.target.value,
                }))
              }
              placeholder="Add details for this task..."
              className="w-full h-44 p-4 border border-yellow-300 rounded-lg bg-yellow-100 text-yellow-900 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              aria-label="Task details"
            />
            <div className="flex justify-end mt-5 gap-4">
              <Button
                onClick={() => setActiveNote(null)}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={saveStickyNote}
                className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition cursor-pointer"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
