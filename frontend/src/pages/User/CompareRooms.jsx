import React, { useState, useEffect } from 'react';
import { favoriteAPI } from '../../services/api';
import { Sliders, Check, X, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareRooms = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await favoriteAPI.getFavorites();
        if (res.data.success) {
          setFavorites(res.data.favorites);
        }
      } catch (err) {
        console.error('Error fetching favorites for comparison:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <span>Compare Shortlisted Accommodation</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Side-by-side feature, rent, and rules comparison table</p>
      </div>

      {loading ? (
        <div className="bg-slate-900 h-64 rounded-2xl animate-pulse"></div>
      ) : favorites.length < 2 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 space-y-3">
          <p className="text-sm font-semibold text-white">Save at least 2 properties to use the comparison matrix.</p>
          <Link to="/search" className="inline-block bg-sky-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold">
            Browse & Save Rooms
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="p-4 w-40 text-slate-400 uppercase font-bold">Features</th>
                {favorites.map((p) => (
                  <th key={p.id} className="p-4 min-w-[200px] text-white font-bold text-sm">
                    <Link to={`/property/${p.id}`} className="hover:text-sky-400 underline">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-4 font-semibold text-slate-400">Monthly Rent</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-emerald-400 text-sm">
                    ₹{(p.minRent || 0).toLocaleString('en-IN')} / mo
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">City / Area</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4 font-medium">{p.area}, {p.city}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Property Type</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4 font-semibold text-sky-400">{p.propertyType}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Verified Status</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.isVerified ? (
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Unverified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Average Rating</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-amber-400 flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{p.avgRating || 4.5}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Wi-Fi Internet</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.amenities?.wifi ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Air Conditioning</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.amenities?.ac ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Food / Meals</td>
                {favorites.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.amenities?.food ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompareRooms;
