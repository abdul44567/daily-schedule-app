"use client";
import React, { useState } from "react";
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

  const weightInKg =
    weightUnit === "kg"
      ? typeof bmiWeight === "number"
        ? bmiWeight
        : 0
      : typeof bmiWeight === "number"
      ? bmiWeight * 0.453592
      : 0;

  let heightInMeters = 0;
  if (heightUnit === "cm") {
    heightInMeters = typeof heightCm === "number" ? heightCm / 100 : 0;
  } else {
    const ft = typeof heightFeet === "number" ? heightFeet : 0;
    const inch = typeof heightInch === "number" ? heightInch : 0;
    heightInMeters = (ft * 12 + inch) * 0.0254;
  }

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

  const handleSave = () => {
    if (
      !bmi ||
      bmiWeight === "" ||
      (heightUnit === "cm" && heightCm === "") ||
      (heightUnit === "ft" && heightFeet === "")
    )
      return;

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

  const handleDelete = (index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
    toast("🗑️ Item deleted", { position: "top-right" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200 max-w-md mx-auto">
      <Toaster position="top-right" />

      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide">
          ⚖️ BMI Calculator
        </h1>
        <p className="text-xs text-purple-200">Supports KG/LBS and CM/FT-IN</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700">
          Weight
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="number"
            className="w-full rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
            value={bmiWeight === "" ? "" : bmiWeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setBmiWeight(isNaN(val) ? "" : val);
            }}
            placeholder={
              weightUnit === "kg" ? "Enter weight in kg" : "Enter weight in lbs"
            }
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

      <div>
        <label className="block text-sm font-medium text-purple-700">
          Height
        </label>
        {heightUnit === "cm" ? (
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              className="w-full rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
              value={heightCm === "" ? "" : heightCm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightCm(isNaN(val) ? "" : val);
              }}
              placeholder="Enter height in cm"
            />
          </div>
        ) : (
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              className="w-1/2 rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
              value={heightFeet === "" ? "" : heightFeet}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightFeet(isNaN(val) ? "" : val);
              }}
              placeholder="Feet"
            />
            <input
              type="number"
              className="w-1/2 rounded border border-purple-500 p-2 text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
              value={heightInch === "" ? "" : heightInch}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightInch(isNaN(val) ? "" : val);
              }}
              placeholder="Inch"
            />
          </div>
        )}
        <select
          value={heightUnit}
          onChange={(e) => setHeightUnit(e.target.value as "cm" | "ft")}
          className="mt-2 rounded border border-purple-500 p-2 text-purple-800 w-full focus:outline-none focus:ring-2 focus:ring-purple-600/40 cursor-pointer"
        >
          <option value="cm">cm</option>
          <option value="ft">ft + in</option>
        </select>
      </div>

      {bmi && (
        <div className="bg-purple-50 text-center p-4 mt-6 rounded text-purple-800 shadow-inner">
          <p className="text-lg font-semibold">
            Your BMI is: <span className="text-purple-900 font-bold">{bmi}</span>
          </p>
          <p className="text-sm mt-1">
            Category: {getBMICategory(parseFloat(bmi))}
          </p>
        </div>
      )}

      <Button
        onClick={handleSave}
        className="mt-4 w-full bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 active:scale-95 transition duration-300"
      >
        Save to History
      </Button>

      {history.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold text-purple-700">
            Recent BMI History
          </h3>
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
                    const parts = h.height
                      .replace("ft", "")
                      .replace("in", "")
                      .split(" ");
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
