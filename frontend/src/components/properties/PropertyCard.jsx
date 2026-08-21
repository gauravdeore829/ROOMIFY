import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Heart, Sparkles, Bed } from 'lucide-react';
import { favoriteAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PropertyCard = ({ property, isFavorite: initialFav = false, matchScore }) => {
  const { isAuthenticated } = useAuth();
  const [fav, setFav] = React.useState(initialFav);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in to save rooms to your favorites.');
      return;
    }
    try {
      const res = await favoriteAPI.toggleFavorite(property.id);
      if (res.data.success) {
        setFav(res.data.isFavorite);
      }
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const imgUrl = property.images && property.images.length > 0
    ? property.images[0].url
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const minRent = property.minRent || (property.rooms && property.rooms.length > 0 ? Math.min(...property.rooms.map(r => r.rent)) : 0);
  const totalAvailBeds = property.totalAvailableBeds !== undefined
    ? property.totalAvailableBeds
    : (property.rooms ? property.rooms.reduce((s, r) => s + r.availableBeds, 0) : 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group flex flex-col justify-between">
      <div>
        {/* Card Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
          <img
            src={imgUrl}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-slate-700">
              {property.propertyType}
            </span>
            {property.isVerified && (
              <span className="bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* AI Match Score Pill */}
          {matchScore !== undefined && (
            <div className="absolute top-3 right-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-lg border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchScore}% Match</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
              fav
                ? 'bg-pink-500 text-white'
                : 'bg-slate-950/60 text-slate-300 hover:text-pink-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-white' : ''}`} />
          </button>

          {/* Rent overlay bottom left */}
          <div className="absolute bottom-3 left-3 text-white">
            <div className="text-xs text-slate-300 font-medium">Starting from</div>
            <div className="text-xl font-extrabold text-white">
              ₹{minRent.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-300">/ mo</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition line-clamp-1">
              {property.name}
            </h3>
          </div>

          <div className="flex items-center space-x-1 text-slate-400 text-xs">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{property.area}, {property.city}</span>
          </div>

          {/* Key details & Bed Count */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <div className="flex items-center space-x-1 text-slate-300">
              <Bed className="w-3.5 h-3.5 text-teal-400" />
              <span>
                {totalAvailBeds > 0 ? (
                  <span className="text-emerald-400 font-semibold">{totalAvailBeds} beds left</span>
                ) : (
                  <span className="text-red-400 font-semibold">Fully Occupied</span>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white text-xs">{property.avgRating || 4.5}</span>
              <span className="text-slate-500 text-[11px]">({property.totalReviews || 1})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <Link
          to={`/property/${property.id}`}
          className="block text-center w-full bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-slate-950 font-semibold py-2 rounded-xl text-xs transition duration-200"
        >
          View Details & Apply
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
