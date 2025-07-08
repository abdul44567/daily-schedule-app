"use client";

import { useState, useEffect } from "react";
import PageTitle from "../components/pageTitle";

const ClockSuite = () => {
  const [activeTab, setActiveTab] = useState<"clock" | "stopwatch" | "timer">(
    "clock"
  );

  return (
    <div className="min-screen bg-gradient-to-br from-purple-200 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-10">
        <PageTitle text="🕒 Clock Suite" />

        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {["clock", "stopwatch", "timer"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 text-lg rounded-full font-semibold transition duration-300 ${
                activeTab === tab
                  ? "bg-purple-700 text-white shadow-md cursor-pointer"
                  : "bg-white border border-purple-400 text-purple-700 hover:bg-purple-100 cursor-pointer"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="border-t pt-6">
          {activeTab === "clock" && <Clock />}
          {activeTab === "stopwatch" && <Stopwatch />}
          {activeTab === "timer" && <Timer />}
        </div>
      </div>
    </div>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center text-4xl sm:text-6xl font-bold text-purple-700">
      {time.toLocaleTimeString("en-US", { hour12: true })}
    </div>
  );
};

const Stopwatch = () => {
  const [milliseconds, setMilliseconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => setMilliseconds((prev) => prev + 100), 100);
    }
    return () => clearInterval(interval);
  }, [running]);

  const reset = () => {
    setMilliseconds(0);
    setRunning(false);
  };

  const minutes = Math.floor(milliseconds / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((milliseconds % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  const ms = Math.floor((milliseconds % 1000) / 10)
    .toString()
    .padStart(2, "0");

  return (
    <div className="text-center">
      <div className="text-4xl sm:text-6xl font-bold text-purple-700 mb-6">
        {minutes}:{seconds}:{ms}
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setRunning(true)}
          disabled={running}
          className={`px-4 py-2 rounded-full font-semibold shadow-md text-white cursor-pointer ${
            running ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
          }`}
        >
          Start
        </button>
        <button
          onClick={() => setRunning(false)}
          disabled={!running}
          className={`px-4 py-2 rounded-full font-semibold shadow-md text-white cursor-pointer ${
            !running ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500"
          }`}
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-md cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const Timer = () => {
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [hasSetTimer, setHasSetTimer] = useState(false);

  useEffect(() => {
    let interval: any;
    if (running && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && running) {
      setRunning(false);
      showTimedAlert("Timer finished!");
    }
    return () => clearInterval(interval);
  }, [running, minutes, seconds]);

  const showTimedAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const reset = () => {
    setRunning(false);
    setMinutes(0);
    setSeconds(0);
    setInputMinutes(0);
    setInputSeconds(0);
    setHasSetTimer(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "minutes" | "seconds"
  ) => {
    const value = Math.max(
      0,
      Math.min(type === "seconds" ? 59 : 999, parseInt(e.target.value) || 0)
    );
    if (type === "minutes") {
      setInputMinutes(value);
      if (!running) setMinutes(value);
      if (value > 0 || inputSeconds > 0) setHasSetTimer(true);
      else if (value === 0 && inputSeconds === 0) setHasSetTimer(false);
    } else {
      setInputSeconds(value);
      if (!running) setSeconds(value);
      if (inputMinutes > 0 || value > 0) setHasSetTimer(true);
      else if (inputMinutes === 0 && value === 0) setHasSetTimer(false);
    }
  };

  const handleStart = () => {
    // Only show alert if timer NOT set (hasSetTimer = false)
    if (!hasSetTimer && minutes === 0 && seconds === 0) {
      showTimedAlert("Please set the timer first!");
      return;
    }
    setRunning(true);
  };

  return (
    <div className="text-center relative">
      {/* Custom Alert */}
      {showAlert && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-purple-100 border border-purple-400 text-purple-700 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 w-[300px] sm:w-auto font-semibold z-50">
          <span className="text-2xl">⏰</span>
          <span>{alertMessage}</span>
          <button
            onClick={() => setShowAlert(false)}
            aria-label="Close alert"
            className="ml-auto text-purple-700 hover:text-purple-900 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="text-4xl sm:text-6xl font-bold text-purple-700 mb-6">
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
      <div className="flex justify-center gap-4 mb-4">
        <div className="flex flex-col items-center">
          <label
            htmlFor="minutesInput"
            className="mb-1 font-semibold text-purple-700"
          >
            Min
          </label>
          <input
            id="minutesInput"
            type="number"
            min={0}
            max={999}
            className="border rounded px-4 py-1 w-24 border-purple-500 text-purple-800 text-center text-lg outline-0"
            value={inputMinutes}
            onChange={(e) => handleInputChange(e, "minutes")}
            placeholder="Min"
            disabled={running}
          />
        </div>
        <div className="flex flex-col items-center">
          <label
            htmlFor="secondsInput"
            className="mb-1 font-semibold text-purple-700"
          >
            Sec
          </label>
          <input
            id="secondsInput"
            type="number"
            min={0}
            max={59}
            className="border rounded px-4 py-1 w-24 border-purple-500 text-purple-800 text-center text-lg outline-0"
            value={inputSeconds}
            onChange={(e) => handleInputChange(e, "seconds")}
            placeholder="Sec"
            disabled={running}
          />
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          onClick={handleStart}
          disabled={running}
          className={`px-4 py-2 rounded-full font-semibold shadow-md text-white cursor-pointer ${
            running ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
          }`}
        >
          Start
        </button>
        <button
          onClick={() => setRunning(false)}
          disabled={!running}
          className={`px-4 py-2 rounded-full font-semibold shadow-md text-white cursor-pointer ${
            !running ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500"
          }`}
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-md cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ClockSuite;
