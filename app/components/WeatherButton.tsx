'use client';

import { useState, useEffect, useRef } from 'react';
import { CloudSun } from 'lucide-react';
import axios from 'axios';
import { usePopup } from './PopupContext';

export default function WeatherButton() {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { openPopup, setOpenPopup } = usePopup();
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openPopup === 'weather';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=d223045c0ee2426e6b555013e82c4e3d`
          );
          setWeather(res.data);
        } catch {
          setError('Failed to fetch weather');
        }
      },
      () => setError('Location access denied')
    );
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenPopup(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, setOpenPopup]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpenPopup(isOpen ? null : 'weather')}
        className="p-2 bg-purple-200 text-purple-800 rounded-full hover:bg-purple-300 cursor-pointer"
        aria-label="Toggle Weather"
      >
        <CloudSun />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-50 bg-white border rounded-xl shadow-lg p-4 w-52 animate-fadeIn">
          <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>

          {error ? (
            <div className="text-red-500">{error}</div>
          ) : weather ? (
            <>
              <h3 className="text-center font-semibold text-purple-700 mb-2 text-sm">
                Weather in {weather.name}
              </h3>
              <div className="text-center text-gray-800">
                <div className="text-lg font-semibold">
                  🌡 {Math.round(weather.main.temp)}°C
                </div>
                <div className="capitalize mt-1">
                  ☁ {weather.weather[0].description}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}
