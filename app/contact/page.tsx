"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";
import { FaGithub, FaWhatsapp } from "react-icons/fa";
import PageTitle from "../components/pageTitle";
import toast, { Toaster } from "react-hot-toast";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitContact = async () => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      throw new Error("Failed to send message");
    }

    return res.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await toast.promise(submitContact(), {
        loading: "Sending message...",
        success: "Message sent successfully!",
        error: "Failed to send message",
      });

      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-white p-10">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-5xl mx-auto">
        <PageTitle text="Contact Us" />

        <p className="text-gray-600 text-center max-w-l mx-auto mb-8">
          Got a question, found a bug, or have a feature request?{" "}
          <span className="block md:inline font-semibold text-purple-800">
            Reach out to us below
          </span>
          .
        </p>

        {/* Contact Form */}
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-lg border-t-6 border-purple-700 p-6 mb-10 backdrop-blur-md max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">
            Send us a message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border-2 border-purple-300 bg-white/60 text-purple-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border-2 border-purple-300 bg-white/60 text-purple-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl border-2 border-purple-300 bg-white/60 text-purple-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                required
                className="w-full p-3 rounded-xl border-2 border-purple-300 bg-white/60 text-purple-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-semibold shadow-md border-2 border-purple-300 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition focus:outline-none cursor-pointer"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Address */}
          <div className="bg-white rounded-2xl shadow-xl p-5 border border-purple-200 shadow-[0_0_12px_3px_rgba(99,102,241,0.4)]">
            {/* Heading */}
            <h3 className="flex items-center gap-2 text-lg font-semibold text-indigo-800 mb-2">
              <MapPin size={20} /> Our Address
            </h3>

            {/* Address link */}
            <a className="text-gray-600 text-sm mt-1 block">
              Star Colony, Bhimber Road, Gujrat
            </a>

            <p className="flex items-center gap-1 text-gray-500 text-sm mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Open Mon–Fri, 9:00 AM – 6:00 PM
            </p>

            {/* Get Directions button */}
            <a
              href="https://www.google.com/maps/dir//Star+Colony,+Bhimber+Road,+Gujrat"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              <MapPin size={16} /> Get Directions
            </a>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-xl p-5 border border-purple-200 shadow-[0_0_12px_3px_rgba(56,189,248,0.4)]">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-sky-800 mb-2">
              <Phone size={20} /> Call Us
            </h3>
            <p className="text-gray-600 text-sm mb-3">+92 340 3148438</p>

            <div className="flex gap-3">
              <a
                href="https://wa.me/923403148438"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition"
              >
                <FaWhatsapp size={16} />
                WhatsApp
              </a>

              <a
                href="tel:+923403148438"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition"
              >
                <Phone size={16} />
                Call
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-xl p-5 border border-purple-200 shadow-[0_0_12px_3px_rgba(234,67,53,0.3)]">
            {/* Heading */}
            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-2">
              <Mail size={20} /> Email Us
            </h3>

            {/* Email text */}
            <p className="text-gray-700 text-sm">abdulofficial187@gmail.com</p>

            {/* Optional note */}
            <p className="text-gray-500 text-sm mt-2">We reply within 24h.</p>

            {/* Send Email button */}
            <a
              href="/contact"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
            >
              <Mail size={16} /> Send Email
            </a>
          </div>
        </div>

        {/* Social Media + Map */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Social Media */}
          <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-lg p-6 border border-purple-200 text-center">
            {/* Heading */}
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              Connect with us
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-5">
              Follow us for updates, news, and special announcements
            </p>

            {/* Icons */}
            <div className="flex justify-center gap-6">
              <a
                href="https://www.instagram.com/abdul._.x47/"
                target="_blank"
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white hover:scale-110 transition shadow-lg"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://github.com/AbdulRehman646765"
                target="_blank"
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-gray-800 to-gray-900 text-white hover:scale-110 transition shadow-lg"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/abdul-rehman-73a769220/"
                target="_blank"
                className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white hover:scale-110 transition shadow-lg"
              >
                <Linkedin size={24} />
              </a>
            </div>

            {/* Footer text */}
            <p className="text-gray-400 text-xs mt-4">
              Stay connected and never miss an update!
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-purple-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3311.089580264325!2d72.823!3d33.684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df95b35c3f!2sIslamabad!5e0!3m2!1sen!2s!4v1630000000000!5m2!1sen!2s"
              width="100%"
              height="250"
              loading="lazy"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
