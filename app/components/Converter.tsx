"use client";
import React, { useState, useEffect } from "react";
import { Copy, Trash2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Button from "../components/Button";

interface Conversion {
  label: string;
  factor?: number;
  from: string;
  to: string;
  custom?: (val: number) => number;
}

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

const categories: Record<Category, Conversion[]> = {
  length: [
    { label: "Km → Mi", factor: 0.621371, from: "km", to: "mi" },
    { label: "Mi → Km", factor: 1.60934, from: "mi", to: "km" },
    { label: "Ft → M", factor: 0.3048, from: "ft", to: "m" },
    { label: "M → Ft", factor: 3.28084, from: "m", to: "ft" },
    { label: "Cm → In", factor: 0.393701, from: "cm", to: "in" },
    { label: "In → Cm", factor: 2.54, from: "in", to: "cm" },
  ],
  currency: [
    { label: "USD → PKR", factor: 277, from: "USD", to: "PKR" },
    { label: "PKR → USD", factor: 1 / 277, from: "PKR", to: "USD" },
    { label: "USD → EUR", factor: 0.85, from: "USD", to: "EUR" },
    { label: "EUR → USD", factor: 1.18, from: "EUR", to: "USD" },
  ],
  mass: [
    { label: "Kg → Lb", factor: 2.20462, from: "kg", to: "lb" },
    { label: "Lb → Kg", factor: 0.453592, from: "lb", to: "kg" },
    { label: "G → Oz", factor: 0.035274, from: "g", to: "oz" },
    { label: "Oz → G", factor: 28.3495, from: "oz", to: "g" },
  ],
  area: [
    { label: "m² → ft²", factor: 10.7639, from: "m²", to: "ft²" },
    { label: "ft² → m²", factor: 0.092903, from: "ft²", to: "m²" },
    { label: "Ac → Ha", factor: 0.404686, from: "ac", to: "ha" },
    { label: "Ha → Ac", factor: 2.47105, from: "ha", to: "ac" },
  ],
  time: [
    { label: "Min → Hr", factor: 1 / 60, from: "min", to: "hr" },
    { label: "Hr → Min", factor: 60, from: "hr", to: "min" },
    { label: "Sec → Min", factor: 1 / 60, from: "sec", to: "min" },
    { label: "Min → Sec", factor: 60, from: "min", to: "sec" },
  ],
  data: [
    { label: "MB → GB", factor: 1 / 1024, from: "MB", to: "GB" },
    { label: "GB → MB", factor: 1024, from: "GB", to: "MB" },
    { label: "KB → MB", factor: 1 / 1024, from: "KB", to: "MB" },
    { label: "MB → KB", factor: 1024, from: "MB", to: "KB" },
  ],
  discount: [{ label: "Price & %", from: "price", to: "after discount" }],
  speed: [
    { label: "KPH → MPH", factor: 0.621371, from: "kph", to: "mph" },
    { label: "MPH → KPH", factor: 1.60934, from: "mph", to: "kph" },
  ],
  temperature: [
    { label: "°C → °F", custom: (c) => (c * 9) / 5 + 32, from: "°C", to: "°F" },
    { label: "°F → °C", custom: (f) => ((f - 32) * 5) / 9, from: "°F", to: "°C" },
    { label: "°C → K", custom: (c) => c + 273.15, from: "°C", to: "K" },
    { label: "K → °C", custom: (k) => k - 273.15, from: "K", to: "°C" },
  ],
};

const categoryIcons: Record<Category, string> = {
  length: "📏",
  currency: "💱",
  mass: "⚖️",
  area: "🗺️",
  time: "⏳",
  data: "💾",
  discount: "🏷️",
  speed: "🚀",
  temperature: "🌡️",
};

const format = (num: number) =>
  Number.isFinite(num)
    ? num.toLocaleString(undefined, { maximumFractionDigits: 4 })
    : "";

export default function ConverterPro() {
  const [category, setCategory] = useState<Category>("length");
  const [conversionIndex, setConversionIndex] = useState(0);
  const [converterInput, setConverterInput] = useState<number | "">("");
  const [aux, setAux] = useState<number | "">("");
  const [history, setHistory] = useState<any[]>([]);

  // ✅ Load history
  useEffect(() => {
    const saved = localStorage.getItem("converter_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        console.error("Invalid history in localStorage");
      }
    }
  }, []);

  // ✅ Save history
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("converter_history", JSON.stringify(history));
    } else {
      localStorage.removeItem("converter_history");
    }
  }, [history]);

  const selected = categories[category][conversionIndex];

  const compute = () => {
    const val = typeof converterInput === "number" ? converterInput : 0;
    if (category === "discount") {
      const pct = typeof aux === "number" ? aux : 0;
      const savings = (val * pct) / 100;
      return { final: val - savings, savings };
    }
    if (category === "currency") {
      const rate =
        typeof aux === "number" && aux > 0 ? aux : selected.factor ?? 1;
      return val * rate;
    }
    if (selected.custom) return selected.custom(val);
    if (selected.factor !== undefined) return val * selected.factor;
    return val;
  };

  const result = compute();
  const isDiscount = category === "discount" && typeof result === "object";

  const handleConvert = () => {
    if (
      converterInput === "" ||
      (typeof converterInput === "number" && converterInput <= 0) ||
      (category === "currency" && (aux === "" || aux <= 0))
    ) {
      toast("⚠️ Please enter a valid input!", { position: "top-right" });
      return;
    }

    const record = {
      time: new Date().toLocaleTimeString(),
      category,
      label: selected.label,
      input: converterInput,
      aux,
      result,
    };
    setHistory((h) => [record, ...h.slice(0, 4)]);
    toast.success("Saved to history", { position: "top-right" });
  };

  const handleDelete = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
    toast("🗑️ Item deleted", { position: "top-right" });
  };

  const handleClearAll = () => {
    setHistory([]);
    toast.error("All history cleared", { position: "top-right" });
  };

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
      <Toaster position="top-right" />
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide">
          {categoryIcons[category]} Converter
        </h1>
        <p className="text-xs text-purple-200">Instant • Multi-unit</p>
      </div>

      <div className="space-y-5">
        {/* Selectors */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="flex-1 text-purple-700 border border-purple-500 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-600/40 cursor-pointer"
            value={category}
            onChange={(e) => {
              const val = e.target.value as Category;
              setCategory(val);
              setConversionIndex(0);
              setConverterInput("");
              setAux("");
            }}
          >
            {Object.keys(categories).map((c) => (
              <option key={c} value={c}>
                {c.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            className="flex-1 text-purple-700 border border-purple-500 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-600/40 cursor-pointer"
            value={conversionIndex}
            onChange={(e) => setConversionIndex(Number(e.target.value))}
          >
            {categories[category].map((conv, idx) => (
              <option key={idx} value={idx}>
                {conv.label}
              </option>
            ))}
          </select>
        </div>

        {/* Inputs */}
        {category === "discount" ? (
          <>
            <Input
              label="Original Price"
              value={converterInput}
              onChange={setConverterInput}
              onEnter={handleConvert}
            />
            <Input label="Discount %" value={aux} onChange={setAux} onEnter={handleConvert} />
            {isDiscount && (
              <div className="bg-purple-50 p-4 rounded text-purple-800">
                <p>
                  You save: <strong>Rs {format((result as any).savings)}</strong>
                </p>
                <p className="text-lg font-semibold">
                  Final price: Rs {format((result as any).final)}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {category === "currency" && (
              <Input label="Live Rate" value={aux} onChange={setAux} onEnter={handleConvert} />
            )}
            <Input
              label={`Enter ${selected.from}`}
              value={converterInput}
              onChange={setConverterInput}
              onEnter={handleConvert}
            />
            {typeof converterInput === "number" && (
              <div className="bg-purple-50 text-center p-4 rounded text-purple-800">
                {format(converterInput)} {selected.from} =
                <div className="mt-1 text-xl font-semibold flex items-center justify-center gap-2">
                  {format(result as number)} {selected.to}
                  <Button
                    onClick={() =>
                      copyToClipboard(String(format(result as number)))
                    }
                    className="text-purple-600 hover:scale-110"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        <Button
          onClick={handleConvert}
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 active:scale-95 transition duration-300"
        >
          Save to History
        </Button>

        {/* History */}
        {history.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-purple-700">
                Recent conversions
              </h3>
              <Button
                onClick={handleClearAll}
                className="text-xs font-semibold bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-800"
              >
                Clear All
              </Button>
            </div>
            {history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm bg-purple-100 text-purple-700 rounded px-3 py-2 group hover:bg-purple-200"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    setCategory(h.category);
                    setConversionIndex(
                      categories[h.category as Category].findIndex(
                        (c) => c.label === h.label
                      )
                    );
                    setConverterInput(h.input);
                    setAux(h.aux);
                  }}
                >
                  <span>{h.label}</span>
                  <span className="block text-xs">
                    {format(
                      typeof h.result === "number" ? h.result : h.result.final
                    )}
                  </span>
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
    </div>
  );
}

// ✅ Input Component with Enter Support
function Input({
  label,
  value,
  onChange,
  onEnter,
}: {
  label: string;
  value: number | "";
  onChange: (val: number | "") => void;
  onEnter?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-purple-700">{label}</span>
      <input
        type="number"
        className="mt-1 w-full rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
        value={value === "" ? "" : value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "") onChange("");
          else {
            const parsed = Number(v);
            if (!isNaN(parsed)) onChange(parsed);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter();
        }}
      />
    </label>
  );
}
