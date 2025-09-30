"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Correct API route
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Account created successfully!");
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex items-center justify-center p-8">
      <Toaster position="top-right" />

      <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-8">
        {/* Left (Form) */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-purple-200"
        >
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 rounded-xl text-purple-800 border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 rounded-xl text-purple-800 border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full p-3 rounded-xl text-purple-800 border border-purple-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Register
            </button>
          </form>
          <p className="text-sm text-purple-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-purple-800 font-semibold hover:underline">
              Login
            </a>
          </p>
        </motion.div>

        {/* Right (Illustration/Content) */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl font-extrabold text-purple-800 mb-4">
            Welcome to <span className="text-purple-600">MyPlanner</span>
          </h1>
          <p className="text-purple-700 text-lg mb-6">
            Plan your day, manage your tasks and achieve your goals with ease.  
            Sign up today and take control of your productivity!
          </p>
          <img
            src="https://illustrations.popsy.co/gray/laptop-2.svg"
            alt="Register Illustration"
            className="w-64 mx-auto md:mx-0"
          />
        </motion.div>
      </div>
    </div>
  );
}
