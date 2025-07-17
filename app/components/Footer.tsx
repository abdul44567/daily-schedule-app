"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100082160492723",
    icon: (
      <Facebook size={24} className="text-white group-hover:text-purple-900" />
    ),
  },
  {
    label: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: (
      <Twitter size={24} className="text-white group-hover:text-purple-900" />
    ),
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/abdul._.x47/",
    icon: (
      <Instagram
        size={24}
        className="text-white group-hover:text-purple-900"
      />
    ),
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/abdul-rehman-73a769220/",
    icon: (
      <Linkedin size={24} className="text-white group-hover:text-purple-900" />
    ),
  },
  {
    label: "GitHub",
    url: "https://github.com/AbdulRehman646765",
    icon: (
      <Github size={24} className="text-white group-hover:text-purple-900" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex justify-center items-center gap-2">
            <img
              src="/logo.png"
              alt="Logo"
              title="Return Home Page"
              className="w-30 h-30 rounded-full"
            />
            <span className="text-xl font-bold" title="Return Home Page">
              MyPlanner
            </span>
          </Link>
          <p className="text-sm mt-2">Plan your day, achieve your goals!</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/calendar", label: "Calendar" },
              { href: "/todo", label: "To-Do List" },
              { href: "/clock-suite", label: "Clock Suite" },
              { href: "/Utilities", label: "Utilities" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold mb-2">Follow Us</h3>

          {/* Top 3 Icons */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 justify-items-center">
            {socials.slice(0, 3).map(({ label, url, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white/30 border border-purple-200 backdrop-blur-md
                           p-3 rounded-xl flex flex-col items-center shadow-md
                           hover:shadow-lg hover:bg-purple-100 transition-all duration-300 hover:scale-105"
              >
                {icon}
                <div
                  className="absolute -bottom-7 left-1/2 transform -translate-x-1/2
                                bg-purple-700 text-white text-xs rounded px-2 py-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  {label}
                </div>
              </a>
            ))}

            {/* Last 2 Icons (only visible on large screens) */}
            {socials.slice(3).map(({ label, url, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden sm:flex relative bg-white/30 border border-purple-200 backdrop-blur-md
                           p-3 rounded-xl flex-col items-center shadow-md
                           hover:shadow-lg hover:bg-purple-100 transition-all duration-300 hover:scale-105"
              >
                {icon}
                <div
                  className="absolute -bottom-7 left-1/2 transform -translate-x-1/2
                                bg-purple-700 text-white text-xs rounded px-2 py-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  {label}
                </div>
              </a>
            ))}
          </div>

          {/* Bottom 2 Icons (only visible on small screens, centered) */}
          <div className="sm:hidden flex justify-center gap-4 mt-4">
            {socials.slice(3).map(({ label, url, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white/30 border border-purple-200 backdrop-blur-md
                           p-3 rounded-xl flex flex-col items-center shadow-md
                           hover:shadow-lg hover:bg-purple-100 transition-all duration-300 hover:scale-105"
              >
                {icon}
                <div
                  className="absolute -bottom-7 left-1/2 transform -translate-x-1/2
                                bg-purple-700 text-white text-xs rounded px-2 py-1
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  {label}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs py-4 border-t-2 border-purple-700">
        © {new Date().getFullYear()} MyPlanner. All rights reserved.
      </div>
    </footer>
  );
}
  