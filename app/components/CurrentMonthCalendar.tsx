'use client';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CurrentMonthCalendar() {
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

  return (
    <div className="relative bg-white border rounded-xl shadow-lg p-3 w-60 animate-fadeIn">

      {/* Arrow indicator */}
      <div className="absolute -top-2 left-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>

      <h3 className="text-center font-semibold text-purple-700 mb-2 text-sm">
        {monthName} {year}
      </h3>

      <div className="grid grid-cols-7 gap-[3px] text-center text-xs text-gray-600 font-semibold">
        {days.map((d, index) => (
          <div key={index}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[3px] mt-1 text-sm">
        {getDays().map((d, i) =>
          d ? (
            <div
              key={i}
              className={`h-6 w-6 flex items-center justify-center rounded-full ${
                d === currentDay
                  ? 'bg-purple-600 text-white font-bold shadow'
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
  );
}
