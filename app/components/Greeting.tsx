'use client';
import { useEffect, useState } from 'react';

export default function Greeting() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    let msg = '';

    if (hours < 12) msg = 'Good Morning';
    else if (hours < 17) msg = 'Good Afternoon';
    else if (hours < 20) msg = 'Good Evening';
    else msg = 'Good Night';

    setGreeting(msg);
  }, []);

  return (
    <div className="sticky top-5 z-50 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-purple-800 shadow-md flex items-center gap-2 w-fit mx-auto animate-fadeIn">
      <span className="inline-block animate-wave origin-bottom">👋</span>
      <span className="text-sm sm:text-base font-medium whitespace-nowrap">
        {greeting}, Abdul Rehman!
      </span>
    </div>
  );
}
