import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Contact RoomEase Support</h1>
        <p className="text-sm text-slate-400">Have questions or need assistance with your room application?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Get in Touch</h3>
          <ul className="space-y-4 text-xs text-slate-300">
            <li className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
              <span>Tech Hub, Kothrud, Pune, Maharashtra 411038</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-sky-400 shrink-0" />
              <span>+91 1800-ROOM-EASE</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-sky-400 shrink-0" />
              <span>support@roomease.com</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          {submitted ? (
            <div className="text-center p-8 space-y-2">
              <h3 className="text-lg font-bold text-emerald-400">Message Received!</h3>
              <p className="text-xs text-slate-400">Our customer team will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Aarav Patel"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="aarav@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message</label>
                <textarea
                  rows="3"
                  required
                  placeholder="How can we help you?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
