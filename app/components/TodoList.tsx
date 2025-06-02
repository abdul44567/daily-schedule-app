'use client';

import { useState, useEffect } from 'react';
import { Check, Trash2, Pencil } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  category: string;
}

export default function TodoList() {
  const categories = ['Work', 'Home', 'Personal', 'Shopping', 'Others'];

  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Others');
  const [dateTime, setDateTime] = useState(new Date());
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'danger';
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message: string, type: 'success' | 'danger') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const addOrEditTodo = () => {
    if (!input.trim()) return;

    // Check if input matches any category (case-insensitive)
    const matchedCategory = categories.find(
      cat => cat.toLowerCase() === input.trim().toLowerCase()
    );

    const categoryToUse = matchedCategory ?? selectedCategory;

    if (editId !== null) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === editId ? { ...todo, text: input, category: categoryToUse } : todo
        )
      );
      showNotification('Task updated successfully!', 'success');
      setEditId(null);
    } else {
      const newTodo: Todo = {
        id: Date.now(),
        text: input,
        done: false,
        category: categoryToUse,
      };
      setTodos(prev => [...prev, newTodo]);
      showNotification('New task added!', 'success');
    }
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
    if (editId === id) {
      setEditId(null);
      setInput('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    showNotification('Task deleted!', 'danger');
    if (editId === id) {
      setEditId(null);
      setInput('');
    }
  };

  const startEdit = (todo: Todo) => {
    if (todo.done) return;
    setEditId(todo.id);
    setInput(todo.text);
    setSelectedCategory(todo.category);
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-20 p-5 bg-white shadow-xl rounded-xl relative">
        {/* Top Centered Date-Time Box */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-[250px] text-center bg-purple-700 text-white px-4 py-2 rounded-full shadow-md text-sm font-semibold">
          <span>{dateTime.toLocaleDateString()}</span>
          <span className="mx-3">|</span>
          <span>
            {dateTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            })}
          </span>
        </div>

        {/* Heading */}
        <div className="my-4">
          <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-2">
            📝 <span>To-Do List</span>
          </h2>

          {/* Alert Notification */}
          {notification && (
            <div
              className={`mt-3 px-4 py-2 text-sm rounded-md border transition duration-300 ${
                notification.type === 'success'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
            >
              {notification.message}
            </div>
          )}
        </div>

        {/* Categories row */}
        <div className="flex gap-3 mb-3 justify-center flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer transition
                ${
                  selectedCategory === cat
                    ? 'bg-purple-700 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-purple-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input field and button */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addOrEditTodo();
              else if (e.key === 'Escape') {
                setInput('');
                setEditId(null);
              }
            }}
            placeholder="Write a task..."
            className="flex-1 border border-gray-300 px-4 py-2 rounded-md text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addOrEditTodo}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm cursor-pointer"
          >
            {editId !== null ? 'Update' : 'Add'}
          </button>
        </div>

        {/* Todo List grouped by categories */}
        {categories.map(cat => (
          <div key={cat} className="mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">{cat}</h3>
            <div className="space-y-3">
              {todos.filter(todo => todo.category === cat).length === 0 ? (
                <p className="text-gray-400 text-sm italic">No tasks in this category.</p>
              ) : (
                todos
                  .filter(todo => todo.category === cat)
                  .map(todo => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-gray-50 hover:shadow transition"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`w-6 h-6 flex items-center justify-center border rounded-full cursor-pointer ${
                            todo.done ? 'bg-green-500 text-white' : 'border-gray-400'
                          }`}
                          aria-label={todo.done ? "Mark as not done" : "Mark as done"}
                        >
                          {todo.done && <Check size={16} />}
                        </button>
                        <span
                          className={`text-sm ${
                            todo.done
                              ? 'line-through text-gray-400'
                              : 'text-gray-800'
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {!todo.done && (
                          <button
                            onClick={() => startEdit(todo)}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            aria-label="Edit task"
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          aria-label="Delete task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
