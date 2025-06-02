'use client'

import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react'; // Lucide icon (optional)

const quotes = [
  "Success is the sum of small efforts repeated daily. 💡",
  "The secret of getting ahead is getting started. 🚀",
  "Don't watch the clock; do what it does. Keep going. ⏰",
  "Great things never come from comfort zones. 🌟",
  "Push yourself, because no one else is going to do it for you. 💪",
  "Believe you can and you're halfway there. 🌈",
  "Dream it. Wish it. Do it. ✨",
  "Stay positive, work hard, make it happen. 💼",
  "Your limitation—it's only your imagination. 🎯",
  "Push harder than yesterday if you want a different tomorrow. 🔥",
  "Success doesn't just find you. You have to go out and get it. 🏆",
  "Great things take time. ⏳",
  "Don’t stop when you’re tired. Stop when you’re done. 💥",
  "The harder you work for something, the greater you’ll feel when you achieve it. 🥇",
  "Dream bigger. Do bigger. 🚀",
];

export default function QuoteRotator() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 bg-purple-100 rounded-lg shadow-md transition duration-500">
      <div className="flex items-center justify-center mb-2 text-purple-500">
        <Quote className="w-6 h-6" />
      </div>
      <p className="text-center text-[20px] sm:text-[17px] font-semibold text-purple-700 italic animate-fade-in">
        "{quotes[currentQuoteIndex]}"
      </p>
    </div>
  );
}
