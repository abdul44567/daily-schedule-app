"use client";
import React, { useState } from "react";

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState("");

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

    setResult(`${years} years, ${months} months, ${days} days`);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-purple-800 mb-2">🎂 Age Calculator</h2>
      <input
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        className="w-full mb-3 p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
      />
      <button
        onClick={calculateAge}
        className="w-full bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 active:scale-95 transition mb-2"
      >
        Calculate Age
      </button>
      {result && (
        <p className="text-purple-700 font-medium">You are: {result}</p>
      )}
    </div>
  );
}