"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/calendar", label: "Calendar" },
  { href: "/todo", label: "To-Do" },
  { href: "/clock-suite", label: "Clock Suite" },
  { href: "/Utilities", label: "Utilities" },
  { href: "/contact", label: "Contact us" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      {/* Glow Background (full width) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.25))] blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-8xl mx-auto px-6 py-3">
        <div className="flex items-center justify-around backdrop-blur-xl bg-purple-900/80 border border-purple-500/70 rounded-2xl shadow-lg px-5 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-pink-500/40 to-indigo-500/40 border border-white/20 shadow-lg group-hover:scale-110 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-wide text-white group-hover:text-pink-400 transition-colors duration-300">
              MyPlanner
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative group text-white/80 font-medium text-sm tracking-wide"
                >
                  <span
                    className={`transition-colors ${
                      isActive
                        ? "text-pink-400 font-semibold"
                        : "group-hover:text-white"
                    }`}
                  >
                    {label}
                  </span>
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] rounded-full transition-all duration-300
                      ${
                        isActive
                          ? "w-full bg-gradient-to-r from-pink-400 to-purple-400"
                          : "w-0 group-hover:w-full bg-gradient-to-r from-pink-400 to-purple-400"
                      }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 px-5 py-4 bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-pink-900/90 backdrop-blur-xl border border-white/20 shadow-lg rounded-xl animate-fadeIn">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`block px-3 py-2 rounded-lg font-medium transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-pink-500/60 to-purple-600/60 text-white shadow-md"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
