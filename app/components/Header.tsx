"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // current path for active link

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/calendar", label: "Calendar" },
    { href: "/todo", label: "To-Do List" },
    { href: "/clock-suite", label: "Clock Suite" },
    { href: "/Utilities", label: "Utilities" },
  ];

  return (
    <header className="sticky top-0 z-100 bg-purple-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-15 h-15 rounded-full" />
          <span className="text-xl font-bold">MyPlanner</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 rounded-md font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "bg-purple-800 text-white shadow-md"
                      : "text-purple-100 hover:bg-purple-600 hover:text-white"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-600 px-4 pb-4 pt-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "bg-purple-800 text-white shadow-md"
                      : "text-purple-100 hover:bg-purple-500 hover:text-white"
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
