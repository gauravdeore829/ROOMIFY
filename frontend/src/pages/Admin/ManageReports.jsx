import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import { Flag, CheckCircle } from 'lucide-react';

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await reportAPI.getReports();
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    try {
      const res = await reportAPI.resolveReport(id);
      if (res.data.success) {
        alert('Report marked as resolved');
        fetchReports();
      }
    } catch (err) {
      alert('Failed to resolve report');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Flag className="w-5 h-5 text-rose-400" />
          <span>Reported Property Listings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review flagged listings submitted by users for inaccurate info or fraud</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-900 h-20 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400">
          No active listing reports filed.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-white text-sm">{r.property?.name || 'Property'}</h4>
                <p className="text-rose-400 font-semibold">Reason: {r.reason}</p>
                {r.description && <p className="text-slate-400">"{r.description}"</p>}
                <span className="text-[10px] text-slate-500 block">Reported by: {r.user?.name} ({r.user?.email})</span>
              </div>

              {r.status === 'PENDING' ? (
                <button
                  onClick={() => handleResolve(r.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  Resolved
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReports;
