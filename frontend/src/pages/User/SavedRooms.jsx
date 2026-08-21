import React, { useState, useEffect } from 'react';
import { favoriteAPI } from '../../services/api';
import PropertyCard from '../../components/properties/PropertyCard';
import { Heart } from 'lucide-react';

const SavedRooms = () => {
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
        console.error('Error loading saved rooms:', err);
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
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
          <span>Saved Favorites</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Shortlisted properties you saved for later comparison</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-900 h-72 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 space-y-2">
          <p className="text-sm">No saved properties yet.</p>
          <p className="text-xs">Browse listings and click the heart icon to save rooms!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((prop) => (
            <PropertyCard key={prop.id} property={prop} isFavorite={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRooms;
