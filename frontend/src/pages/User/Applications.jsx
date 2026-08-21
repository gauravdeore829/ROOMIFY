import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../services/api';
import { FileCheck, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await applicationAPI.getApplications();
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleCancelApp = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this application?')) return;
    try {
      const res = await applicationAPI.updateStatus(id, 'CANCELLED');
      if (res.data.success) {
        fetchApps();
      }
    } catch (err) {
      alert('Failed to cancel application');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-sky-400" />
          <span>My Accommodation Applications</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track approval status of your room requests</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-900 h-24 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 space-y-2">
          <p className="text-sm">No applications submitted yet.</p>
          <Link to="/search" className="text-xs text-sky-400 font-semibold underline">Discover rooms to apply</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const property = app.room?.property;
            return (
              <div key={app.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">{property?.name || 'Property'}</h3>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-400 border border-slate-700">
                      {app.room?.roomType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{property?.address}, {property?.city}</p>
                  <p className="text-xs text-slate-300 font-medium">Rent: ₹{app.room?.rent}/mo • Security Deposit: ₹{app.room?.securityDeposit}</p>
                  {app.message && (
                    <p className="text-xs text-slate-400 italic bg-slate-800/40 p-2 rounded-lg border border-slate-800 mt-2">
                      "{app.message}"
                    </p>
                  )}
                  <span className="text-[10px] text-slate-500 block pt-1">
                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 ${
                      app.status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : app.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : app.status === 'CANCELLED'
                        ? 'bg-slate-800 text-slate-500 border border-slate-700'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {app.status === 'ACCEPTED' && <CheckCircle2 className="w-4 h-4" />}
                    {app.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                    {app.status === 'PENDING' && <Clock className="w-4 h-4" />}
                    <span>{app.status}</span>
                  </span>

                  {app.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelApp(app.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-xl text-xs font-semibold border border-slate-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
