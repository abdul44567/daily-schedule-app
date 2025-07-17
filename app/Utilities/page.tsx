import React from "react";
import Calculator from "../components/Calculator";
import Converter from "../components/Converter";
import AgeCalculator from "../components/AgeCalculator";
import BMICalculator from "../components/BMICalculator";
import PageTitle from "../components/pageTitle";
import SpeedTypingTest from "../components/SpeedTypingTest";
import WaterIntakeCalculator from "../components/WaterIntakeCalculator";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white py-12 px-4">
      <PageTitle text="🛠️ Tools & Utilities" />

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-purple-400">
          <Converter />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-purple-400">
          <AgeCalculator />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-purple-400">
          <WaterIntakeCalculator />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md shadow-purple-400">
          <BMICalculator />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-purple-400">
          <Calculator />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md shadow-purple-400">
          <SpeedTypingTest />
        </div>
      </div>
    </div>
  );
}
