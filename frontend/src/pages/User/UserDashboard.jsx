import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { propertyAPI, applicationAPI, aiAPI } from '../../services/api';
import PropertyCard from '../../components/properties/PropertyCard';
import { Sparkles, FileCheck, Heart, Bell, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [recommendedRooms, setRecommendedRooms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [propsRes, appsRes] = await Promise.all([
          propertyAPI.getProperties({ verifiedOnly: 'true' }),
          applicationAPI.getApplications(),
        ]);

        if (appsRes.data.success) {
          setApplications(appsRes.data.applications);
        }

        if (propsRes.data.success) {
          let properties = propsRes.data.properties;
          if (user?.profile) {
            try {
              const aiRes = await aiAPI.getRecommendations(user.profile, properties);
              if (aiRes.data.success) {
                properties = aiRes.data.recommendations;
              }
            } catch (aiErr) {
              console.log('AI recommendation microservice fallback');
            }
          }
          setRecommendedRooms(properties.slice(0, 3));
        }
      } catch (err) {
        console.error('User Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-900/40 via-slate-900 to-teal-900/30 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">User Control Panel</span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">
            Targeting rooms near <strong className="text-slate-200">{user?.profile?.preferredLocation || 'Pune'}</strong> within ₹{user?.profile?.budget || 10000}/mo budget.
          </p>
        </div>
        <Link
          to="/user/profile"
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-sky-500/20 text-center"
        >
          Update Search Preferences
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">{applications.length}</span>
            <p className="text-xs text-slate-400">Active Applications</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">{recommendedRooms.length}</span>
            <p className="text-xs text-slate-400">AI Matched Listings</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-white">100%</span>
            <p className="text-xs text-slate-400">Verified Platform</p>
          </div>
        </div>
      </div>

      {/* AI Recommended Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>AI Recommended Rooms For You</span>
          </h2>
          <Link to="/search" className="text-xs font-semibold text-sky-400 hover:underline">
            Explore All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 h-72 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedRooms.map((prop) => (
              <PropertyCard key={prop.id} property={prop} matchScore={prop.matchScore} />
            ))}
          </div>
        )}
      </div>

      {/* Applications Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Recent Room Applications</h2>
          <Link to="/user/applications" className="text-xs text-sky-400 font-semibold hover:underline">
            View All Applications
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No room applications submitted yet. Browse listings and click Apply!</p>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{app.room?.property?.name || 'Property'}</h4>
                  <p className="text-[11px] text-slate-400">{app.room?.roomType} • ₹{app.room?.rent}/mo</p>
                </div>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    app.status === 'ACCEPTED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : app.status === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
