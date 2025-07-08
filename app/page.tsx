import React from "react";
import ScheduleItem from "./components/ScheduleItem";
// import ThemeToggle from './components/ThemeToggle';
import QuoteRotator from "./components/Quotes";
import CalendarButton from "./components/CalendarButton";
import Greeting from "./components/Greeting";
import WeatherButton from "./components/WeatherButton";
import SleepTracker from "./components/SleepTracker";
import PageTitle from "./components/pageTitle";

export default function DailySchedule() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white py-12 px-4">
        <div className="container mb-4">
          <Greeting />
        </div>

      <div className="max-w-2xl mx-auto">
        <PageTitle text="🗓️ My Daily Schedule" />

        <div className="space-y-4">
          {/* <ThemeToggle /> */}
          <div className="flex justify-between ">
            <CalendarButton />
            <WeatherButton />
          </div>
          {/* <WeatherWidget/> */}
          <ScheduleItem />
        </div>

        <SleepTracker/>

        <div className="mt-10 text-center">
          <QuoteRotator />
        </div>
      </div>
    </div>
  );
}
            