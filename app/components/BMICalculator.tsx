"use client";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Button from "../components/Button"; // ⚠️ Adjust path if needed
import toast, { Toaster } from "react-hot-toast";

export default function BMICalculator() {
  const [bmiWeight, setBmiWeight] = useState<number | "">("");
  const [weightUnit, setBmiWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightCm, setHeightCm] = useState<number | "">("");
  const [heightFeet, setHeightFeet] = useState<number | "">("");
  const [heightInch, setHeightInch] = useState<number | "">("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [history, setHistory] = useState<any[]>([]);

  // ✅ Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bmiHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // ✅ Save history to localStorage
  useEffect(() => {
    localStorage.setItem("bmiHistory", JSON.stringify(history));
  }, [history]);

  // ✅ Convert weight
  const weightInKg =
    weightUnit === "kg"
      ? typeof bmiWeight === "number"
        ? bmiWeight
        : 0
      : typeof bmiWeight === "number"
      ? bmiWeight * 0.453592
      : 0;

  // ✅ Convert height
  let heightInMeters = 0;
  if (heightUnit === "cm") {
    heightInMeters = typeof heightCm === "number" ? heightCm / 100 : 0;
  } else {
    const ft = typeof heightFeet === "number" ? heightFeet : 0;
    const inch = typeof heightInch === "number" ? heightInch : 0;
    heightInMeters = (ft * 12 + inch) * 0.0254;
  }

  // ✅ Calculate BMI
  const bmi =
    weightInKg && heightInMeters
      ? (weightInKg / heightInMeters ** 2).toFixed(1)
      : "";

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight ❗";
    else if (bmi < 24.9) return "Normal ✅";
    else if (bmi < 29.9) return "Overweight ⚠️";
    else return "Obese ❌";
  };

  // ✅ Save entry
  const handleSave = () => {
    if (
      !bmi ||
      bmiWeight === "" ||
      (heightUnit === "cm" && heightCm === "") ||
      (heightUnit === "ft" && heightFeet === "")
    ) {
      toast("⚠️ Please enter valid weight & height!");
      return;
    }

    const newEntry = {
      time: new Date().toLocaleTimeString(),
      weight: bmiWeight,
      weightUnit,
      height:
        heightUnit === "cm"
          ? `${heightCm} cm`
          : `${heightFeet}ft ${heightInch || 0}in`,
      bmi,
      category: getBMICategory(parseFloat(bmi)),
    };

    setHistory((prev) => [newEntry, ...prev.slice(0, 4)]);
    toast.success("Saved to history", { position: "top-right" });
  };

  // ✅ Delete entry
  const handleDelete = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
    toast("🗑️ Entry deleted", { position: "top-right" });
  };

  // ✅ Clear input
  const clearInput = () => {
    setBmiWeight("");
    setHeightCm("");
    setHeightFeet("");
    setHeightInch("");
    setHeightUnit("cm");
    setBmiWeightUnit("kg");
  };

  // ✅ Clear history
  const clearHistory = () => {
    setHistory([]);
    toast.error("All history cleared!", { position: "top-right" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200 max-w-md mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide">⚖️ BMI Calculator</h1>
        <p className="text-xs text-purple-200">Supports KG/LBS and CM/FT-IN</p>
      </div>

      {/* Weight Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700">Weight</label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            value={bmiWeight === "" ? "" : bmiWeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBmiWeight(isNaN(val) ? "" : val);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder={weightUnit === "kg" ? "Enter weight in kg" : "Enter weight in lbs"}
            className="w-full rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
          />
          <select
            value={weightUnit}
            onChange={(e) => setBmiWeightUnit(e.target.value as "kg" | "lbs")}
            className="rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40 cursor-pointer"
          >
            <option value="kg">kg</option>
            <option value="lbs">lbs</option>
          </select>
        </div>
      </div>

      {/* Height Input */}
      <div>
        <label className="block text-sm font-medium text-purple-700">Height</label>
        {heightUnit === "cm" ? (
          <input
            type="number"
            value={heightCm === "" ? "" : heightCm}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setHeightCm(isNaN(val) ? "" : val);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="Enter height in cm"
            className="w-full mt-1 rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
          />
        ) : (
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={heightFeet === "" ? "" : heightFeet}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightFeet(isNaN(val) ? "" : val);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Feet"
              className="w-1/2 rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
            />
            <input
              type="number"
              value={heightInch === "" ? "" : heightInch}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightInch(isNaN(val) ? "" : val);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Inch"
              className="w-1/2 rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
            />
          </div>
        )}
        <select
          value={heightUnit}
          onChange={(e) => setHeightUnit(e.target.value as "cm" | "ft")}
          className="mt-2 w-full rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40 cursor-pointer"
        >
          <option value="cm">cm</option>
          <option value="ft">ft + in</option>
        </select>
      </div>

      {/* Result */}
      {bmi && (
        <div className="bg-purple-50 text-center p-4 mt-6 rounded text-purple-800 shadow-inner">
          <p className="text-lg font-semibold">
            Your BMI is: <span className="text-purple-900 font-bold">{bmi}</span>
          </p>
          <p className="text-sm mt-1">Category: {getBMICategory(parseFloat(bmi))}</p>
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex items-center gap-2 mt-4">
        <Button
          onClick={handleSave}
          className="flex-1 bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 active:scale-95 transition duration-300"
        >
          Save to History
        </Button>
        <Button
          onClick={clearInput}
          className="bg-red-500 text-white font-semibold px-3 py-2 rounded hover:bg-red-600 active:scale-95 transition duration-300"
        >
         🗑️ Clear
        </Button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-purple-700">Recent BMI History</h3>
            <Button
              onClick={clearHistory}
              className="bg-purple-700 text-white text-xs font-semibold px-2 py-1 rounded hover:bg-purple-800 active:scale-95 transition duration-300"
            >
              Clear History
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
                  setBmiWeight(h.weight);
                  setBmiWeightUnit(h.weightUnit);
                  if (h.height.includes("cm")) {
                    const cm = parseFloat(h.height.split(" ")[0]);
                    setHeightCm(isNaN(cm) ? "" : cm);
                    setHeightUnit("cm");
                  } else {
                    const parts = h.height.replace("ft", "").replace("in", "").split(" ");
                    const feet = parseFloat(parts[0]);
                    const inch = parseFloat(parts[1]) || 0;
                    setHeightFeet(isNaN(feet) ? "" : feet);
                    setHeightInch(isNaN(inch) ? "" : inch);
                    setHeightUnit("ft");
                  }
                }}
              >
                <span className="block font-medium">{h.time}</span>
                <span className="text-xs">
                  BMI: {h.bmi} ({h.category})
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
  );
}
