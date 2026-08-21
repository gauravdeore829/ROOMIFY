import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ShieldAlert, Users, Building, FileCheck, Flag } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminAPI.getStats();
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.error('Error loading Admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  const COLORS = ['#38bdf8', '#2dd4bf', '#a855f7', '#f43f5e'];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-slate-800 p-6 rounded-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">System Control Center</span>
        <h1 className="text-2xl font-extrabold text-white mt-1">Platform Admin Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">System analytics, landlord identity verifications, user moderation, and compliance.</p>
      </div>

      {/* Metrics Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-slate-900 h-28 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Users</span>
              <Users className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats?.totalUsers}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Registered Owners</span>
              <Building className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-3xl font-extrabold text-teal-400">{stats?.totalOwners}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Total Listings</span>
              <FileCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-400">{stats?.totalProperties}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase">Pending Reports</span>
              <Flag className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold text-rose-400">{stats?.totalReports}</div>
          </div>
        </div>
      )}

      {/* Visual Analytics Charts Section using Recharts */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Growth Trend Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Activity Trends</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyTrends}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                  />
                  <Bar dataKey="applications" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Applications" />
                  <Bar dataKey="users" fill="#a855f7" radius={[4, 4, 0, 0]} name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Distribution Pie Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Platform Account Distribution</h2>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
