import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex justify-center items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-30 h-30 rounded-full" />
          <span className="text-xl font-bold">MyPlanner</span>
        </Link>
          <p className="text-sm mt-2">Plan your day, achieve your goals!</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/calendar" className="hover:underline">
                Calendar
              </Link>
            </li>
            <li>
              <Link href="/todo" className="hover:underline">
                To-Do List
              </Link>
            </li>
            <li>
              <Link href="/clock-suite" className="hover:underline">
                Clock Suite
              </Link>
            </li>
            <li>
              <Link href="/Utilities" className="hover:underline">
                Utilities
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-purple-300" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-purple-300" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="hover:text-purple-300"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
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
