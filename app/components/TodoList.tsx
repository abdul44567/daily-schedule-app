"use client";

import React, { useState, useEffect } from "react";
import { StickyNote, Edit2, Trash2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import PageTitle from "./pageTitle";

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
  },
  { key: "should", label: "SHOULD DO", color: "bg-sky-300", bg: "bg-sky-800" },
  {
    key: "could",
    label: "COULD DO",
    color: "bg-green-300",
    bg: "bg-green-800",
  },
  {
    key: "ifTime",
    label: "IF I HAVE TIME",
    color: "bg-pink-300",
    bg: "bg-pink-800",
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col sm:flex-row gap-4">
          {categories.map(({ key, label, color, bg }) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`${bg} rounded shadow-md flex-1 min-w-[250px] min-h-[400px] p-4 flex flex-col`}
                >
                  <div
                    className={`${color} text-gray-800 rounded p-2 text-center font-bold text-lg mb-3`}
                  >
                    {label}
                  </div>

                  <div className="flex flex-col gap-2 flex-grow">
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
                            className={`relative flex items-start gap-2 border border-gray-300 p-2 rounded bg-white text-black shadow-sm text-sm transition-all duration-300 ${
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
                            />
                            <div className="flex-1 whitespace-pre-wrap break-words">
                              {task.text}
                            </div>
                            <div className="flex gap-2">
                              <StickyNote
                                size={16}
                                className={`cursor-pointer ${
                                  task.details
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-500"
                                }`}
                                onClick={() => openStickyNote(key, i)}
                              />
                              <Edit2
                                size={16}
                                className="text-blue-600 cursor-pointer"
                                onClick={() => handleEdit(key, i)}
                              />
                              <Trash2
                                size={16}
                                className="text-red-500 cursor-pointer"
                                onClick={() => handleDelete(key, i)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>

                  <div className="mt-3 flex gap-2">
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
                      className="flex-1 text-white px-2 py-1 rounded border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-gray-800 placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleAddOrUpdate(key)}
                      className="px-3 py-1 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition-all cursor-pointer"
                    >
                      {editMode[key] !== null ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {activeNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-yellow-100 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setActiveNote(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-2 text-yellow-800">
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
              className="w-full h-40 p-3 border border-yellow-300 rounded bg-yellow-50 text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setActiveNote(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveStickyNote}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
