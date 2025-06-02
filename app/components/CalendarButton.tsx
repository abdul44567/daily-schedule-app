'use client';

import { useRef, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { usePopup } from './PopupContext';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarButton() {
  const { openPopup, setOpenPopup } = usePopup();
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openPopup === 'calendar';

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();
  const monthName = today.toLocaleString('default', { month: 'long' });

  const getDays = () => {
    const startDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const items = [];

    for (let i = 0; i < startDay; i++) items.push(null);
    for (let d = 1; d <= totalDays; d++) items.push(d);

    return items;
  };

  // Close on outside click
  useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpenPopup(null);
    }
  };
  if (isOpen) {
    document.addEventListener('mousedown', handleClick);
  }
  return () => document.removeEventListener('mousedown', handleClick);
}, [isOpen, setOpenPopup]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpenPopup(isOpen ? null : 'calendar')}
        className="p-2 bg-purple-200 text-purple-800 rounded-full hover:bg-purple-300 transition cursor-pointer"
        aria-label="Toggle Calendar"
      >
        <CalendarDays size={25} />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 bg-white border rounded-xl shadow-lg p-3 w-60 animate-fadeIn">
          <div className="absolute -top-2 left-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>

          <h3 className="text-center font-semibold text-purple-700 mb-2 text-sm">
            {monthName} {year}
          </h3>

          <div className="grid grid-cols-7 gap-[3px] text-center text-xs text-gray-600 font-semibold">
            {days.map((d, index) => (
              <div key={`${d}-${index}`}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[3px] mt-1 text-sm">
            {getDays().map((d, i) =>
              d ? (
                <div
                  key={i}
                  className={`h-7 w-7 flex items-center justify-center rounded-full ${
                    d === currentDay
                      ? 'bg-purple-600 text-white font-bold shadow-md ring-2 ring-purple-400 text-xs'
                      : 'hover:bg-purple-100 text-gray-700'
                  }`}
                >
                  {d}
                </div>
              ) : (
                <div key={i}></div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
