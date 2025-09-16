"use client";
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState<number | "">("");
  const [activity, setActivity] = useState("low");
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<
    { weight: number; activity: string; result: number }[]
  >([]);

  // ✅ Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("water_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        console.error("Invalid water_history in localStorage");
      }
    }
  }, []);

  // ✅ Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("water_history", JSON.stringify(history));
    } else {
      localStorage.removeItem("water_history");
    }
  }, [history]);

  const calculate = () => {
    if (weight === "" || weight <= 0) {
      toast("⚠️ Please enter a valid weight!", { position: "top-right" });
      return;
    }

    let waterMl = Number(weight) * 35;
    if (activity === "moderate") waterMl += 350;
    else if (activity === "high") waterMl += 700;

    const waterLiters = waterMl / 1000;
    setResult(waterLiters);

    setHistory((prev) => [
      { weight: Number(weight), activity, result: waterLiters },
      ...prev.slice(0, 4), // max 5 records
    ]);

    toast.success("Saved to history", { position: "top-right" });
  };

  const clear = () => {
    setWeight("");
    setActivity("low");
    setResult(null);
  };

  const deleteHistoryItem = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
    toast("🗑️ Item deleted", { position: "top-right" });
  };

  const clearAllHistory = () => {
    setHistory([]);
    toast.error("All history cleared!", { position: "top-right" });
  };

  const handleHistoryClick = (item: {
    weight: number;
    activity: string;
    result: number;
  }) => {
    setWeight(item.weight);
    setActivity(item.activity);
    setResult(item.result);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200 max-w-md mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide">💧 Water Intake</h1>
        <p className="text-xs text-purple-200">Hydration • Health • Daily Goal</p>
      </div>

      <div className="space-y-4">
        {/* Inputs */}
        <div>
          <label className="text-sm text-purple-700 font-semibold block mb-1">
            Your Weight (kg)
          </label>
          <input
            type="number"
            min={1}
            value={weight}
            onChange={(e) =>
              setWeight(e.target.value === "" ? "" : Number(e.target.value))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") calculate(); // ✅ Enter key se calculate
            }}
            className="w-full border border-purple-400 p-2 rounded text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Enter weight in kg"
          />
        </div>

        <div>
          <label className="text-sm text-purple-700 font-semibold block mb-1">
            Activity Level
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border border-purple-400 p-2 rounded text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
          >
            <option value="low">Low (Sedentary)</option>
            <option value="moderate">Moderate (Exercise 2-3x/week)</option>
            <option value="high">High (Daily Intense Workout)</option>
          </select>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-purple-50 text-purple-800 p-4 rounded text-center shadow-inner">
            Recommended Water Intake: <br />
            <span className="font-bold text-lg">{result.toFixed(2)} Liters/day</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={calculate}
            className="flex-1 bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 transition"
          >
            💧 Calculate
          </Button>
          <Button
            onClick={clear}
            className="flex-1 bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
          >
            🗑️ Clear
          </Button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-purple-700">History</h3>
              <button
                onClick={clearAllHistory}
                className="text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded transition"
              >
                Clear All 
              </button>
            </div>

            {history.map((h, i) => (
              <div
                key={i}
                onClick={() => handleHistoryClick(h)}
                className="flex justify-between items-center bg-purple-100 text-purple-800 text-sm rounded px-3 py-2 group hover:bg-purple-200 cursor-pointer"
              >
                <div>
                  Weight: {h.weight}kg • Activity: {h.activity} →{" "}
                  <strong>{h.result.toFixed(2)}L</strong>
                </div>
                <Trash2
                  size={24}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHistoryItem(i);
                  }}
                  className="text-purple-700 hover:bg-purple-300 dark:hover:bg-purple-900 hover:text-purple-300 rounded-full cursor-pointer transition duration-300"
                  style={{ padding: "4px" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
