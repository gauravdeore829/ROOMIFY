import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
              <Home className="w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Room<span className="text-sky-400">Ease</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Smart & Verified Room Rental platform for students and working professionals. Discover, compare, and shortlist accommodation before visiting.
          </p>
          <div className="flex items-center space-x-2 text-xs text-sky-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Owner Verified Listings</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Popular Cities</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search?city=Pune" className="hover:text-sky-400 transition">PGs & Rooms in Pune</Link></li>
            <li><Link to="/search?city=Bangalore" className="hover:text-sky-400 transition">Rooms in Bangalore</Link></li>
            <li><Link to="/search?city=Delhi" className="hover:text-sky-400 transition">Student PGs in Delhi NCR</Link></li>
            <li><Link to="/search?city=Mumbai" className="hover:text-sky-400 transition">Flats in Mumbai</Link></li>
            <li><Link to="/search?city=Hyderabad" className="hover:text-sky-400 transition">Hostels in Hyderabad</Link></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/search" className="hover:text-sky-400 transition">Explore All Listings</Link></li>
            <li><Link to="/about" className="hover:text-sky-400 transition">How RoomEase Works</Link></li>
            <li><Link to="/register?role=OWNER" className="hover:text-sky-400 transition">List Your Property</Link></li>
            <li><Link to="/contact" className="hover:text-sky-400 transition">Help & Support</Link></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contact Support</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Tech Hub, Kothrud, Pune, Maharashtra 411038</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>+91 1800-ROOM-EASE (Toll Free)</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>support@roomease.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} RoomEase Inc. All rights reserved.</p>
        <p className="flex items-center space-x-1 mt-2 sm:mt-0">
          <span>Designed with</span>
          <Heart className="w-3.5 h-3.5 text-pink-500 inline fill-pink-500" />
          <span>for room seekers</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
