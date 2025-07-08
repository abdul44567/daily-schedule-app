"use client";
import React, { useState } from "react";

// TYPES

type Conversion = {
  label: string;
  factor?: number;
  from: string;
  to: string;
  custom?: (val: number) => number | string;
};

type Category =
  | "length"
  | "currency"
  | "mass"
  | "area"
  | "time"
  | "data"
  | "discount"
  | "speed"
  | "temperature";

// CATEGORY DATA

const categories: Record<Category, Conversion[]> = {
  length: [
    { label: "Kilometers to Miles", factor: 0.621371, from: "km", to: "miles" },
    { label: "Feet to Inches", factor: 12, from: "ft", to: "in" },
    { label: "Inches to Feet", factor: 1 / 12, from: "in", to: "ft" },
  ],
  currency: [
    { label: "USD to PKR", factor: 277, from: "USD", to: "PKR" },
  ],
  mass: [
    { label: "Kilograms to Pounds", factor: 2.20462, from: "kg", to: "lbs" },
  ],
  area: [
    { label: "Square Meters to Square Feet", factor: 10.7639, from: "sqm", to: "sqft" },
  ],
  time: [
    { label: "Minutes to Hours", factor: 1 / 60, from: "min", to: "hr" },
  ],
  data: [
    { label: "MB to GB", factor: 1 / 1024, from: "MB", to: "GB" },
  ],
  discount: [
    { label: "Custom Discount", factor: 0.1, from: "price", to: "after discount" },
  ],
  speed: [
    { label: "KPH to MPH", factor: 0.621371, from: "kph", to: "mph" },
  ],
  temperature: [
    { label: "Celsius to Fahrenheit", custom: (val) => (val * 9 / 5 + 32), from: "°C", to: "°F" },
  ],
};

// COMPONENT

export default function Converter() {
  const [category, setCategory] = useState<Category>("length");
  const [conversionIndex, setConversionIndex] = useState(0);
  const [input, setInput] = useState(0);
  const [customRate, setCustomRate] = useState(1);

  const conversions = categories[category];
  const selected = conversions[conversionIndex];

  const convert = () => {
    if (selected.custom) return selected.custom(input);
    if (category === "discount") return (input - input * customRate).toFixed(2);
    if (category === "currency" && customRate !== 1)
      return (input * customRate).toFixed(2);
    return selected.factor ? (input * selected.factor).toFixed(2) : input;
  };

  const result = convert();

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">🧮 Smart Converter</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <select
          className="w-full p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category);
            setConversionIndex(0);
          }}
        >
          {Object.keys(categories).map((cat, i) => (
            <option key={i} value={cat}>{cat.toUpperCase()}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
          value={conversionIndex}
          onChange={(e) => setConversionIndex(Number(e.target.value))}
        >
          {conversions.map((conv, i) => (
            <option key={i} value={i}>{conv.label}</option>
          ))}
        </select>
      </div>

      {(category === "currency" || category === "discount") && (
        <input
          type="number"
          value={customRate}
          onChange={(e) => setCustomRate(parseFloat(e.target.value))}
          className="w-full mb-3 p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
          placeholder={`Custom ${category === "discount" ? "discount % (e.g. 0.1 for 10%)" : "rate"}`}
        />
      )}

      <input
        type="number"
        value={input}
        onChange={(e) => setInput(parseFloat(e.target.value))}
        className="w-full mb-3 p-2 border border-purple-400 rounded text-purple-900 font-medium focus:outline-none"
        placeholder={`Enter ${selected.from}`}
      />

      <p className="text-purple-700 font-medium">
        {input} {selected.from} = {result} {selected.to}
      </p>
    </div>
  );
}
