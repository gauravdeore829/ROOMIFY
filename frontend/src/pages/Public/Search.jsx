import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyAPI, aiAPI } from '../../services/api';
import PropertyCard from '../../components/properties/PropertyCard';
import MapComponent from '../../components/maps/MapComponent';
import { Search as SearchIcon, Filter, Map, Grid, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Filter States
  const [city, setCity] = useState(searchParams.get('city') || 'Pune');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || '');
  const [maxRent, setMaxRent] = useState(searchParams.get('maxRent') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy, setSortBy] = useState('recommended');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (searchQuery) params.search = searchQuery;
      if (roomType) params.roomType = roomType;
      if (maxRent) params.maxRent = maxRent;
      if (verifiedOnly) params.verifiedOnly = 'true';

      const res = await propertyAPI.getProperties(params);
      if (res.data.success) {
        let fetchedProps = res.data.properties;

        // If user is authenticated & profile has preferences, score with Python AI microservice
        if (isAuthenticated && user?.profile) {
          try {
            const aiRes = await aiAPI.getRecommendations(user.profile, fetchedProps);
            if (aiRes.data.success) {
              fetchedProps = aiRes.data.recommendations;
            }
          } catch (aiErr) {
            console.log('AI microservice fallback to standard sorting');
          }
        }

        // Apply local client sorting if requested
        if (sortBy === 'rent_asc') {
          fetchedProps.sort((a, b) => (a.minRent || 0) - (b.minRent || 0));
        } else if (sortBy === 'rent_desc') {
          fetchedProps.sort((a, b) => (b.minRent || 0) - (a.minRent || 0));
        } else if (sortBy === 'rating') {
          fetchedProps.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        }

        setProperties(fetchedProps);
      }
    } catch (err) {
      console.error('Error fetching property search results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [city, roomType, maxRent, verifiedOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Discover Rooms & PGs</span>
            <span className="text-xs bg-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-full border border-sky-500/30 font-bold">
              {properties.length} Available
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Explore verified accommodations in {city}</p>
        </div>

        {/* View mode toggle & Sort dropdown */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center space-x-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'grid' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'map' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="recommended">Sort by: AI Best Match</option>
            <option value="rent_asc">Rent: Low to High</option>
            <option value="rent_desc">Rent: High to Low</option>
            <option value="rating">Top Rated First</option>
          </select>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-sky-400" />
              <span>Filter Results</span>
            </h3>
            <button
              onClick={() => {
                setCity('Pune');
                setRoomType('');
                setMaxRent('');
                setVerifiedOnly(false);
                setSearchQuery('');
              }}
              className="text-[11px] text-slate-400 hover:text-sky-400"
            >
              Reset All
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Search Keyword */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Kothrud, MIT, Wi-Fi"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 pl-9 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                <option value="Pune">Pune</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Monthly Rent: <span className="text-sky-400">₹{maxRent || 'Any'}</span>
              </label>
              <input
                type="number"
                placeholder="Max Rent e.g. 12000"
                value={maxRent}
                onChange={(e) => setMaxRent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Room Sharing Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                <option value="">All Sharing Types</option>
                <option value="Single">Single Room</option>
                <option value="2 Sharing">2 Sharing</option>
                <option value="3 Sharing">3 Sharing</option>
              </select>
            </div>

            {/* Verified Checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="verifiedOnly"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded"
              />
              <label htmlFor="verifiedOnly" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Show 100% Verified Only
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition mt-4"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-slate-900 h-72 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No properties matched your criteria</h3>
              <p className="text-xs text-slate-400">Try adjusting your budget slider or clearing specific filters.</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-[600px] w-full">
              <MapComponent properties={properties} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} matchScore={prop.matchScore} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
