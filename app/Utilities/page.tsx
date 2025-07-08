import React from "react";
import Calculator from "../components/Calculator";
import Converter from "../components/Converter";
import AgeCalculator from "../components/AgeCalculator";
import BMICalculator from "../components/BMICalculator";
import PageTitle from "../components/pageTitle";

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white py-12 px-4">
      <PageTitle text="🛠️ Tools & Utilities" />

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <Calculator />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <Converter />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <AgeCalculator />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <BMICalculator />
        </div>
      </div>
    </div>
  );
}
