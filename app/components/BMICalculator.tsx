"use client";
import React, { useState } from "react";

export default function BMICalculator() {
  const [weight, setWeight] = useState(0); // kg
  const [height, setHeight] = useState(0); // cm

  const heightInMeters = height / 100;
  const bmi = heightInMeters ? (weight / (heightInMeters ** 2)).toFixed(1) : "0";

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-purple-800 mb-2">⚖️ BMI Calculator</h2>

      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(parseFloat(e.target.value))}
        className="w-full mb-2 p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
        placeholder="Weight (kg)"
      />

      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(parseFloat(e.target.value))}
        className="w-full mb-3 p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
        placeholder="Height (cm)"
      />

      <p className="text-purple-700 font-medium">Your BMI is: {bmi}</p>
    </div>
  );
}