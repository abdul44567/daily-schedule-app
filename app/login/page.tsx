"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setUserState } = useUser();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      toast.success("Login successful!");

      // ✅ Update global user state
      setUserState(data.user, data.token);

      setForm({ email: "", password: "" });
      router.push("/"); // optional: redirect after login
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex items-center justify-center p-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-6xl grid md:grid-cols-2 items-center gap-8">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl font-extrabold text-purple-800 mb-4">Welcome Back 👋</h1>
          <p className="text-purple-700 text-lg mb-6">
            Continue your journey with MyPlanner. Manage your tasks smarter and achieve your goals faster!
          </p>
          <img
            src="https://illustrations.popsy.co/gray/graph-2.svg"
            alt="Login Illustration"
            className="w-64 mx-auto md:mx-0"
          />
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-purple-200"
        >
          <h2 className="text-2xl font-bold text-purple-800 mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              Login
            </button>
          </form>
          <p className="text-sm text-purple-600 mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-purple-800 font-semibold hover:underline">
              Register
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
