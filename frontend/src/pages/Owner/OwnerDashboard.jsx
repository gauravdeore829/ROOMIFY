import React, { useState, useEffect } from 'react';
import { propertyAPI, applicationAPI } from '../../services/api';
import { Building, Bed, Users, FileCheck, Star, PlusSquare, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const [propsRes, appsRes] = await Promise.all([
          propertyAPI.getOwnerProperties(),
          applicationAPI.getApplications(),
        ]);
        if (propsRes.data.success) setProperties(propsRes.data.properties);
        if (appsRes.data.success) setApplications(appsRes.data.applications);
      } catch (err) {
        console.error('Error loading Owner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, []);

  const totalProperties = properties.length;
  let totalRooms = 0;
  let totalBeds = 0;
  let occupiedBeds = 0;
  let availableBeds = 0;

  properties.forEach((p) => {
    (p.rooms || []).forEach((r) => {
      totalRooms += 1;
      totalBeds += r.totalBeds;
      occupiedBeds += r.occupiedBeds;
      availableBeds += r.availableBeds;
    });
  });

  const pendingApps = applications.filter((a) => a.status === 'PENDING').length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Landlord & Host Portal</span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Owner Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage listings, track room occupancy, and process tenant applications.</p>
        </div>
        <Link
          to="/owner/properties/add"
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-teal-500/20"
        >
          <PlusSquare className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Total Properties</span>
            <Building className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalProperties}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Occupied Beds</span>
            <Bed className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {occupiedBeds} <span className="text-xs font-normal text-slate-400">/ {totalBeds} beds</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Vacant / Available</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{availableBeds}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase">Pending Applications</span>
            <FileCheck className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-sky-400">{pendingApps}</div>
        </div>
      </div>

      {/* Property Performance Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Your Listed Properties</h2>
          <Link to="/owner/properties" className="text-xs text-teal-400 font-semibold hover:underline">
            Manage All Properties
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center p-8 text-slate-400 space-y-2">
            <p className="text-xs">No properties listed under your account yet.</p>
            <Link to="/owner/properties/add" className="inline-block text-xs font-bold text-teal-400 underline">
              Create your first property listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((p) => (
              <div key={p.id} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.area}, {p.city}</p>
                  <p className="text-xs text-teal-400 font-semibold mt-1">
                    {p.rooms ? p.rooms.reduce((sum, r) => sum + r.availableBeds, 0) : 0} Available Beds
                  </p>
                </div>
                <Link
                  to={`/property/${p.id}`}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
                >
                  View Page
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
