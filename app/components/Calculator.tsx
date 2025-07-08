"use client";
import React, { useState, useEffect } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");

  const handleClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput("Error");
    }
  };

  const clear = () => setInput("");
  const backspace = () => setInput((prev) => prev.slice(0, -1));

  // ⌨️ Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Allow digits and operators
      if (/^[0-9+\-*/.]$/.test(key)) {
        setInput((prev) => prev + key);
      }

      if (key === "Enter" || key === "=") {
        e.preventDefault();
        calculate();
      }

      if (key === "Backspace") {
        e.preventDefault();
        backspace();
      }

      if (key === "Escape") {
        e.preventDefault();
        clear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-purple-800 mb-2">🧮 Calculator</h2>

      <input
        className="w-full mb-3 p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
        value={input}
        readOnly
      />

      <div className="grid grid-cols-4 gap-2">
        {[
          "7", "8", "9", "/",
          "4", "5", "6", "*",
          "1", "2", "3", "-",
          "0", ".", "=", "+"
        ].map((val) => (
          <button
            key={val}
            onClick={() => val === "=" ? calculate() : handleClick(val)}
            className="bg-purple-700 text-white font-semibold p-2 rounded hover:bg-purple-800 active:scale-95 transition"
          >
            {val}
          </button>
        ))}

        <button
          onClick={backspace}
          className="col-span-2 bg-yellow-400 text-white font-semibold p-2 rounded hover:bg-yellow-500 active:scale-95 transition"
        >
          ⌫ Backspace
        </button>

        <button
          onClick={clear}
          className="col-span-2 bg-red-600 text-white font-semibold p-2 rounded hover:bg-red-700 active:scale-95 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
