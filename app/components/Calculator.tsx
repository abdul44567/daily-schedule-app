"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Trash2 } from "lucide-react";
import { evaluate } from "mathjs";
import toast, { Toaster } from "react-hot-toast";
import Button from "../components/Button";

const basicButtons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
];

const advancedButtons = [
  ["(", ")", "^", "√"],
  ["sin", "cos", "tan", "log"],
  ["π", "e", "ln", "%"],
];

const isOperator = (val: string) =>
  ["+", "-", "*", "/", "=", "^", "√", "%"].includes(val);

export default function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [isFocused, setIsFocused] = useState(false);
  const calculatorRef = useRef<HTMLDivElement | null>(null);

  const evaluateExpression = useCallback(() => {
    try {
      const formatted = input
        .replace(/√/g, "sqrt")
        .replace(/π/g, Math.PI.toString())
        .replace(/\be\b/g, Math.E.toString());

      const result = evaluate(formatted);
      const record = `${input} = ${result}`;
      setHistory((h) => [record, ...h.slice(0, 4)]);
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      const allowed = "0123456789.+-*/()^%";
      if (allowed.includes(e.key)) {
        setInput((prev) => {
          if (
            isOperator(e.key) &&
            prev.length > 0 &&
            isOperator(prev[prev.length - 1])
          ) {
            return prev.slice(0, -1) + e.key;
          }
          return prev + e.key;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        evaluateExpression();
      } else if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape") {
        setInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [evaluateExpression, isFocused]);

  const handleClick = (val: string) => {
    if (val === "=") return evaluateExpression();
    if (val === "π") return setInput((prev) => prev + Math.PI.toString());
    if (val === "e") return setInput((prev) => prev + Math.E.toString());
    if (val === "√") return setInput((prev) => prev + "sqrt(");
    if (["sin", "cos", "tan", "log", "ln"].includes(val))
      return setInput((prev) => prev + `${val}(`);

    setInput((prev) => {
      if (
        isOperator(val) &&
        prev.length > 0 &&
        isOperator(prev[prev.length - 1])
      ) {
        return prev.slice(0, -1) + val;
      }
      return prev + val;
    });
  };

  const clear = () => setInput("");
  const deleteLastChar = () => setInput((prev) => prev.slice(0, -1));

  const deleteHistoryItem = (i: number) => {
    const newHistory = history.filter((_, idx) => idx !== i);
    setHistory(newHistory);
    toast("🗑️ Item deleted", { position: "top-right" });
  };

  const clearHistory = () => {
    setHistory([]);
    toast.error("All history cleared", { position: "top-right" });
  };

  return (
    <div
      ref={calculatorRef}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-xl border border-purple-200 focus:outline-none"
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-bold">🧮 Calculator</h1>
        <p className="text-xs text-purple-200">Basic + Advanced</p>
      </div>

      {/* Mode Switch */}
      <div className="mb-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "basic" | "advanced")}
          className="text-sm rounded px-2 py-1 bg-white text-purple-800 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600/40 cursor-pointer"
        >
          <option value="basic">Basic</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Display */}
      <div className="bg-gray-100 text-right text-xl p-4 rounded mb-4 font-mono border-2 border-gray-300 text-purple-800 h-16 overflow-auto">
        {input || "0"}
      </div>

      {/* Advanced Buttons */}
      {mode === "advanced" && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {advancedButtons.flat().map((btn, i) => (
            <Button
              key={i}
              onClick={() => handleClick(btn)}
              className="font-semibold py-2 rounded transition text-sm bg-purple-700 text-white hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
              style={{ fontWeight: btn === "√" ? "bold" : "normal" }}
            >
              {btn}
            </Button>
          ))}
        </div>
      )}

      {/* Basic Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {basicButtons.flat().map((btn, i) => (
          <Button
            key={i}
            onClick={() => handleClick(btn)}
            className={`font-semibold py-3 rounded transition focus:outline-none focus:ring-2 focus:ring-purple-600/40 ${
              isOperator(btn)
                ? "bg-purple-700 text-white hover:bg-purple-800"
                : "bg-purple-100 text-purple-700 hover:bg-purple-700 hover:text-white"
            }`}
          >
            {btn}
          </Button>
        ))}
      </div>

      {/* Clear + Backspace */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={clear}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/40 transition duration-300"
        >
          Clear
        </Button>
        <Button
          onClick={deleteLastChar}
          className="w-full bg-yellow-500 text-yellow-900 font-semibold py-2 rounded hover:bg-yellow-600/80 focus:outline-none focus:ring-2 focus:ring-yellow-600/40 transition duration-300"
        >
          ⌫ Backspace
        </Button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-purple-700">History</h3>
            <Button
              onClick={clearHistory}
              className="bg-purple-700 text-white px-2 py-1 text-xs font-semibold rounded hover:bg-purple-800 active:scale-95 transition duration-300"
            >
              Clear History
            </Button>
          </div>
          {history.map((h, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-sm bg-purple-100 text-purple-700 rounded px-3 py-2 group hover:bg-purple-200"
            >
              <span
                className="flex-1 cursor-pointer"
                onClick={() => {
                  if (h.includes("=")) {
                    const expression = h.split("=")[0].trim();
                    setInput(expression);
                  }
                }}
              >
                {h}
              </span>
              <Trash2
                size={24}
                className="text-purple-700 hover:bg-purple-300 dark:hover:bg-purple-900 hover:text-purple-300 rounded-full cursor-pointer transition duration-300"
                onClick={() => deleteHistoryItem(i)}
                style={{ padding: "4px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
