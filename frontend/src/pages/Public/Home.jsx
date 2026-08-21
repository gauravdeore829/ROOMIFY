import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, ShieldCheck, Compass, MapPin, Building, Star, ArrowRight } from 'lucide-react';
import { propertyAPI, aiAPI } from '../../services/api';
import PropertyCard from '../../components/properties/PropertyCard';

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('Pune');
  const [budget, setBudget] = useState('');
  const [roomType, setRoomType] = useState('');
  const [nlpQuery, setNlpQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await propertyAPI.getProperties({ verifiedOnly: 'true' });
        if (res.data.success) {
          setFeaturedProperties(res.data.properties.slice(0, 6));
        }
      } catch (err) {
        console.error('Error loading featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleStandardSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (city) queryParams.set('city', city);
    if (budget) queryParams.set('maxRent', budget);
    if (roomType) queryParams.set('roomType', roomType);
    navigate(`/search?${queryParams.toString()}`);
  };

  const handleNlpSearch = async (e) => {
    e.preventDefault();
    if (!nlpQuery.trim()) return;
    try {
      const res = await aiAPI.parseNaturalSearch(nlpQuery);
      if (res.data.success && res.data.parsed) {
        const { maxRent, roomType, city } = res.data.parsed;
        const queryParams = new URLSearchParams();
        if (city) queryParams.set('city', city);
        if (maxRent) queryParams.set('maxRent', maxRent);
        if (roomType) queryParams.set('roomType', roomType);
        navigate(`/search?${queryParams.toString()}`);
      } else {
        navigate(`/search?search=${encodeURIComponent(nlpQuery)}`);
      }
    } catch (err) {
      navigate(`/search?search=${encodeURIComponent(nlpQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Smart AI-Powered Room Recommendation Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Find a room that <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">fits your life.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal">
              Search verified rooms, PGs, hostels, and shared accommodations based on your budget, preferred location, and lifestyle amenities.
            </p>

            {/* MAIN SEARCH BOX */}
            <div className="mt-8 bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-2xl max-w-4xl mx-auto">
              <form onSubmit={handleStandardSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* City */}
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">City / Region</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                {/* Max Budget */}
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Room Type */}
                <div className="text-left">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500"
                  >
                    <option value="">All Types</option>
                    <option value="Single">Single Room</option>
                    <option value="2 Sharing">2 Sharing</option>
                    <option value="3 Sharing">3 Sharing</option>
                  </select>
                </div>

                {/* Submit */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-sm transition shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Rooms</span>
                  </button>
                </div>
              </form>

              {/* Natural Language Prompt Search Bar */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <form onSubmit={handleNlpSearch} className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-purple-500 transition">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={nlpQuery}
                    onChange={(e) => setNlpQuery(e.target.value)}
                    placeholder="Try AI search: 'Single room in Pune under 8000 with wifi and attached bathroom'"
                    className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shrink-0 ml-2"
                  >
                    AI Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROPERTIES */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Verified Accommodations</h2>
              <p className="text-slate-400 text-sm mt-1">Inspected properties with active room availabilities</p>
            </div>
            <button
              onClick={() => navigate('/search')}
              className="text-sky-400 hover:text-sky-300 font-semibold text-sm flex items-center space-x-1 transition"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900 h-80 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-slate-900/60 border-y border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How RoomEase Works</h2>
              <p className="text-slate-400 text-sm mt-1">Shortlist your dream room in 3 simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xl mx-auto">
                  1
                </div>
                <h3 className="text-lg font-bold text-white">Discover & Filter</h3>
                <p className="text-sm text-slate-400">
                  Search by college, office, city, or budget. Filter by amenities like Wi-Fi, AC, attached bathrooms, or food.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xl mx-auto">
                  2
                </div>
                <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
                <p className="text-sm text-slate-400">
                  Our algorithm scores listings based on your exact budget, distance preferences, and property verified ratings.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl mx-auto">
                  3
                </div>
                <h3 className="text-lg font-bold text-white">Apply & Move In</h3>
                <p className="text-sm text-slate-400">
                  Apply directly online to property owners. Track acceptance status live on your user dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
