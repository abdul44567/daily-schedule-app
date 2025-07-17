"use client";
import React, { useState } from "react";
import { Trash2, Copy } from "lucide-react";
import Button from "../components/Button";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const calculateAge = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const ageStr = `${years} years, ${months} months, ${days} days`;
    setResult(ageStr);

    const newEntry = {
      time: new Date().toLocaleTimeString(),
      dob,
      ageStr,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 4)]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide">
          🎂 Age Calculator
        </h1>
        <p className="text-xs text-purple-200">Calculate your age in Y/M/D</p>
      </div>

      {/* Input */}
      <label className="block text-sm font-medium text-purple-700 mb-1">
        Select Date of Birth
      </label>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="w-full rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40 mb-4 cursor-pointer"
      />

      <Button
        onClick={calculateAge}
        className="w-full bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 active:scale-95 transition duration-300 mb-4"
      >
        Calculate Age
      </Button>

      {/* Result */}
      {result && (
        <div className="bg-purple-50 text-center p-4 rounded text-purple-800 shadow-inner flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium">You are:</p>
            <p className="text-lg font-semibold">{result}</p>
          </div>
          <Button
            onClick={() => copyToClipboard(result)}
            className="text-purple-600 hover:scale-110"
          >
            <Copy size={18} />
          </Button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold text-purple-700">
            Recent Age History
          </h3>
          {history.map((h, i) => (
            <div
              key={i}
              className="flex justify-between items-center text-sm bg-purple-100 text-purple-700 rounded px-3 py-2 group hover:bg-purple-200"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                  setDob(h.dob);
                  setResult(h.ageStr);
                }}
              >
                <span className="block font-medium">{h.time}</span>
                <span className="text-xs">Age: {h.ageStr}</span>
              </div>

              <Trash2
                size={24}
                className="text-purple-700 hover:bg-purple-300 dark:hover:bg-purple-900 hover:text-purple-300 rounded-full cursor-pointer transition duration-300"
                onClick={() => handleDelete(i)}
                style={{ padding: "4px" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
