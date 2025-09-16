"use client";
import React, { useEffect, useState, useRef } from "react";
import Button from "./Button";
import toast from "react-hot-toast";

const sentences = [
  "Practice makes perfect.",
  "Typing fast requires focus and rhythm.",
  "React and Tailwind make UI development fun.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "The quick brown fox jumps over the lazy dog.",
];

export default function SpeedTypingTest() {
  const [text, setText] = useState("");
  const [targetText, setTargetText] = useState("Practice makes perfect."); // default sentence
  const [customTime, setCustomTime] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10); // start with default 10
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [hasShownToast, setHasShownToast] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (started && timeLeft > 0 && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft === 0 && !hasShownToast) {
      setFinished(true);
      setHasShownToast(true);
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      toast.success("Typing test completed! 🎉");
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, timeLeft, hasShownToast]);

  useEffect(() => {
    if (!finished) return;

    const wordsTyped = text.trim().split(/\s+/).length;
    const minutes = Math.max((customTime - timeLeft) / 60, 1);
    const correctChars = text
      .split("")
      .filter((char, idx) => char === targetText[idx]).length;

    const acc = targetText.length
      ? Math.round((correctChars / targetText.length) * 100)
      : 0;

    setAccuracy(acc);
    setWpm(Math.round(wordsTyped / minutes));
  }, [finished]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started) setStarted(true);
    if (finished) return;
    setText(e.target.value);
  };

  // ✅ Restart function reset timer to default (customTime)
  const handleRestart = () => {
    setText("");
    setTimeLeft(customTime); // reset timer to customTime
    setStarted(false);
    setFinished(false);
    setAccuracy(100);
    setWpm(0);
    setHasShownToast(false);

    // stop any running interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    inputRef.current?.focus();
    toast("🔄️ Test restarted!");
  };

  const pickNewSentence = () => {
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    setTargetText(random);
    toast("🌟 New sentence loaded!");
  };

  const renderTargetText = () => {
    return targetText.split("").map((char, i) => {
      let color = "text-gray-400";
      if (i < text.length) {
        color = text[i] === char ? "text-green-600" : "text-red-500";
      }
      return (
        <span key={`${char}-${i}`} className={`font-bold ${color}`}>
          {char}
        </span>
      );
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white text-center p-5 rounded-xl mb-6">
        <h1 className="text-2xl font-extrabold tracking-wide">
          ⌨️ Speed Typing Test
        </h1>
        <p className="text-xs text-purple-200">Focus • Type • Improve</p>
      </div>

      <div className="space-y-4">
        {/* Target Sentence */}
        <div className="bg-purple-50 p-4 rounded-md text-purple-900 font-mono text-sm break-words leading-relaxed flex justify-between items-start">
          <div className="flex-1">{renderTargetText()}</div>
        </div>

        {/* Input Area */}
        <textarea
          value={text}
          onChange={handleChange}
          disabled={finished}
          placeholder="Start typing here..."
          ref={inputRef}
          className="w-full h-28 p-3 text-purple-800 border border-purple-400 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
        ></textarea>

        {/* Stats */}
        <div className="flex justify-between text-sm text-purple-700 mt-2">
          <span>🕒 Time Left: {formatTime(timeLeft)}</span>
          <span>✍️ WPM: {wpm}</span>
          <span>✅ Accuracy: {accuracy}%</span>
        </div>

        {/* Result */}
        {finished && (
          <div className="bg-green-100 text-green-800 p-4 rounded text-center font-semibold">
            ⏱ Test Completed! <br /> You typed at {wpm} WPM with {accuracy}%
            accuracy.
          </div>
        )}

        {/* Timer Input Box */}
        <div className="mt-6 flex justify-center">
          <div className="bg-purple-100 p-4 rounded shadow-inner border border-purple-300 w-full max-w-sm mx-auto">
            <h3 className="text-center text-purple-800 font-bold text-sm mb-3 uppercase tracking-wider">
              ⏱ Customize Your Timer
            </h3>
            <div className="flex items-center justify-center gap-3">
              <input
                type="number"
                min={1}
                max={60}
                disabled={started}
                value={customTime}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1 && val <= 60) {
                    setCustomTime(val);
                    if (!started) setTimeLeft(val);
                  } else {
                    toast.error("Please enter time between 1–60 seconds");
                  }
                }}
                className="w-24 px-3 py-2 text-center rounded-xl bg-purple-50 text-purple-800 border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 font-semibold cursor-pointer"
              />
              <span className="text-purple-700 font-medium text-sm">
                seconds
              </span>
            </div>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-3">
          <Button
            onClick={pickNewSentence}
            title="Get a new random sentence"
            className="flex-1 bg-yellow-500 text-yellow-900 font-semibold py-2 rounded hover:bg-yellow-600/80 active:scale-95 transition duration-300 shadow-md"
          >
            New Sentence
          </Button>

          <Button
            onClick={handleRestart}
            className="flex-1 bg-purple-700 text-white font-semibold px-4 py-2 rounded hover:bg-purple-800 active:scale-95 transition duration-300"
          >
            Restart 🔄️
          </Button>
        </div>
      </div>
    </div>
  );
}
