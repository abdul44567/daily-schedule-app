"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=100082160492723",
    icon: <Facebook size={22} />,
  },
  {
    label: "Twitter",
    url: "https://twitter.com/yourusername",
    icon: <Twitter size={22} />,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/abdul._.x47/",
    icon: <Instagram size={22} />,
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/abdul-rehman-73a769220/",
    icon: <Linkedin size={22} />,
  },
  {
    label: "GitHub",
    url: "https://github.com/AbdulRehman646765",
    icon: <Github size={22} />,
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-10">
      {/* Radial Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(88,28,135,0.5))] blur-3xl" />

      {/* Gradient Border Animation */}
      {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse" /> */}

      {/* Main Footer Container */}
      <div className="max-w-5xl mx-auto mb-6 px-6 pt-10 pb-8 text-center backdrop-blur-xl bg-purple-900/40 border border-purple-500/60 rounded-2xl shadow-xl">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex justify-center items-center gap-4 mb-8 group"
        >
          {/* Logo Container */}
          <div className="relative p-2 rounded-full bg-gradient-to-tr from-pink-500/40 to-indigo-500/40 shadow-lg border border-white/20 hover:scale-107 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-14 h-14 rounded-full"
            />
          </div>

          {/* Brand Text */}
          <div className="text-left">
            <span className="text-3xl font-extrabold tracking-wide text-white">
              MyPlanner
            </span>
            <p className="text-white/80 italic text-sm mt-1">
              Plan your day, achieve your goals
            </p>
          </div>
        </Link>

        {/* Quick Links */}
        <ul className="flex flex-wrap justify-center gap-6 text-sm font-medium text-white/80 mb-6">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/calendar", label: "Calendar" },
            { href: "/todo", label: "To-Do" },
            { href: "/clock-suite", label: "Clock Suite" },
            { href: "/Utilities", label: "Utilities" },
            { href: "/contact", label: "Contact us" },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="relative group">
                <span className="group-hover:text-pink-400 transition-colors duration-300">
                  {label}
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-8">
          {socials.map(({ label, url, icon }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-white/20 border border-white/30 
                         hover:bg-white/30 transition-all duration-300 hover:scale-110 
                         shadow-md hover:shadow-pink-500/40 text-white"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-sm transition-all"></span>
              <span className="relative">{icon}</span>
              <span
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold
                 opacity-0 group-hover:opacity-100 
                 text-white group-hover:text-pink-400 
                 transition-all duration-300"
              >
                {label}
              </span>
            </a>
          ))}
        </div>

        <div className="bottom-bar bg-gradient-to-r from-pink-500/70 via-purple-500/70 to-indigo-500/70 rounded-2xl" />
        {/* Bottom Bar */}
        <div className="text-white/70 text-sm pt-4">
          © {new Date().getFullYear()}{" "}
          <Link href="/" className="relative group text-white font-semibold">
            <span className="relative">MyPlanner</span>
            <span
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-semibold
       opacity-0 group-hover:opacity-100 
       text-white group-hover:text-pink-400 
       transition-all duration-400"
            >
              Home
            </span>
          </Link>
          . Built with <span className="animate-pulse text-pink-400">❤</span> by
          Abdul Rehman
        </div>
      </div>
    </footer>
  );
}
