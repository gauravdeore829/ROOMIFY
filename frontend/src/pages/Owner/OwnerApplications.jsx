import React, { useState, useEffect } from 'react';
import { applicationAPI } from '../../services/api';
import { FileCheck, Check, X, Phone, Mail, User } from 'lucide-react';

const OwnerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getApplications();
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Error fetching owner applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await applicationAPI.updateStatus(id, status);
      if (res.data.success) {
        alert(`Application ${status.toLowerCase()} successfully.`);
        fetchApplications();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-teal-400" />
          <span>Tenant Applications Management</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review applicant contact info and accept/reject room requests</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-900 h-28 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400">
          No tenant applications received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs">
                    {app.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{app.user?.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center space-x-3 mt-0.5">
                      <span className="flex items-center space-x-1"><Mail className="w-3 h-3 text-slate-500" /><span>{app.user?.email}</span></span>
                      <span className="flex items-center space-x-1"><Phone className="w-3 h-3 text-slate-500" /><span>{app.user?.phone || 'N/A'}</span></span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-300">
                  <p><strong>Property:</strong> {app.room?.property?.name} ({app.room?.roomType})</p>
                  <p><strong>Rent:</strong> ₹{app.room?.rent}/mo • <strong>Vacancy:</strong> {app.room?.availableBeds} beds available</p>
                  {app.message && <p className="text-slate-400 italic">"{app.message}"</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {app.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Tenant</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-bold rounded-xl text-xs flex items-center space-x-1"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      app.status === 'ACCEPTED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {app.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerApplications;
