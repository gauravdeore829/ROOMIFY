import React from 'react';
import { ShieldCheck, Compass, Users, Sparkles, Building } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          About <span className="text-sky-400">RoomEase</span>
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          "Find the right room before you visit." RoomEase solves the nightmare of physical door-to-door room hunting for students and relocating professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Verified Listings & Landlords</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every property listed on RoomEase undergoes physical verification and owner identity validation by platform administrators before public listing.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h3 className="text-lg font-bold text-white">Weighted AI Match Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our Python FastAPI recommendation microservice analyzes your monthly budget, preferred location radius, room sharing preferences, and required amenities to recommend high-compatibility rooms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
