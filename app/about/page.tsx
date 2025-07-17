import React from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import PageTitle from "../components/pageTitle";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white text-gray-800 px-4 md:px-6 py-12 md:py-16">
      <PageTitle text="👋 About Me" />

      <p className="text-center max-w-2xl mx-auto text-gray-600 mb-6 italic relative px-8 text-sm md:text-base">
        <FaQuoteLeft className="absolute left-2 top-0 text-purple-400 text-xl" />
        I'm a self-taught web developer with a passion for building full-stack
        applications using modern technologies. I love taking on new challenges
        and continuously improving my skills.
        <FaQuoteRight className="absolute right-2 bottom-0 text-purple-400 text-xl" />
      </p>

      <div className="w-24 h-[2px] bg-purple-400 mx-auto mb-12 rounded"></div>

      {/* About Main Section */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-20 px-4 sm:px-8">
        {/* Profile Image */}
        <div className="shadow-lg border-4 border-purple-400 p-1 hover:shadow-purple-500 transition duration-300">
          <img
            src="/profile.jpg"
            alt="Abdul Rehman"
            className="w-52 h-[320px] sm:w-64 sm:h-[360px] md:w-72 md:h-[380px] object-cover rounded-md"
          />
        </div>

        {/* Info Section */}
        <div className="w-full max-w-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-700 text-center lg:text-left">
            Hi, I'm <span className="text-purple-800">Abdul Rehman</span>
          </h2>
          <p className="text-gray-700 mb-6 text-center lg:text-left">
            I enjoy solving real-world problems with code. Learning new tools
            and improving my development skills every day is something I truly
            love. I'm always ready to take on new challenges and build
            meaningful digital experiences.
          </p>

          <div className="space-y-3 text-sm sm:text-base text-gray-800">
            {[
              ["Name :", "Abdul Rehman"],
              ["S/O :", "Muhammad Mehdi"],
              ["Address :", "Gujrat, Pakistan"],
              [
                "Phone No :",
                <a
                  href="https://wa.me/923403148438"
                  className="hover:underline"
                >
                  0340 3148438
                </a>,
              ],
              ["Email :", "abdulofficial187@gmail.com"],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex gap-3 sm:gap-6 flex-wrap">
                <span className="font-bold text-purple-800 sm:w-32 w-25">{label}</span>
                <span className="break-all">: {value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-24 h-[3px] bg-purple-400 mx-auto mt-12 rounded"></div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-12">
        {[
          {
            title: "📚 My Journey",
            content:
              "I started learning to code through online platforms. I began with HTML, CSS, and JavaScript, and later moved on to frameworks like React and Next.js. I’ve built many personal projects along the way, which helped me improve my skills through practice and documentation.",
          },
          {
            title: "🛠️ Skills",
            content:
              "HTML, CSS, JavaScript, React, Next.js, Tailwind CSS, Git, GitHub",
          },
          {
            title: "🚀 Projects",
            content:
              "I’ve created a variety of projects using JavaScript and Next.js — including dynamic websites, dashboards, and functional UIs. Each project helped me better understand how front-end and back-end development come together.",
          },
          {
            title: "⚽ Hobbies",
            content:
              "I’m passionate about fitness and sports. I enjoy working out at the gym and playing cricket in my free time. These activities keep me energized and focused in my work.",
          },
          {
            title: "🎯 Goal",
            content:
              "My goal is to become a professional Full-Stack Developer and build scalable, real-world applications that solve meaningful problems.",
            fullWidth: true,
          },
        ].map(({ title, content, fullWidth }, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl shadow-md p-6 transform transition duration-300 shadow-purple-400 hover:scale-102 hover:shadow-purple-500 ${
              fullWidth ? "sm:col-span-2" : ""
            }`}
          >
            <h2
              className="text-xl md:text-2xl font-semibold w-fit bg-purple-800 text-white mb-2 py-1.5
            pl-2 pr-3 rounded"
            >
              {title}
            </h2>
            <p className="text-gray-600">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
