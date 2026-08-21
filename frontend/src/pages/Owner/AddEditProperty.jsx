import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../../services/api';
import { Building, PlusSquare, ArrowLeft } from 'lucide-react';

const AddEditProperty = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pune');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [propertyType, setPropertyType] = useState('PG');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Amenities
  const [amenities, setAmenities] = useState({
    wifi: true,
    ac: false,
    food: true,
    kitchen: false,
    washingMachine: true,
    attachedBathroom: true,
    powerBackup: true,
    cctv: true,
    waterSupply: true,
  });

  // House Rules
  const [rules, setRules] = useState({
    visitorsAllowed: true,
    smokingAllowed: false,
    petsAllowed: false,
    cookingAllowed: false,
    curfewTime: '10:30 PM',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const defaultImg = imageUrl.trim()
        ? imageUrl
        : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

      const res = await propertyAPI.createProperty({
        name,
        description,
        address,
        city,
        area,
        pincode,
        propertyType,
        images: [defaultImg],
        amenities,
        rules,
      });

      if (res.data.success) {
        alert('Property created successfully! Now add room sharing options.');
        navigate('/owner/properties');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create property listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl space-y-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/owner/properties')}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-white">Create New Property Listing</h1>
          <p className="text-xs text-slate-400">Fill in location, property overview, amenities, and policies</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        <div className="space-y-4">
          <h3 className="font-bold text-white uppercase text-[11px] tracking-wider text-teal-400">1. Property Overview</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Property Name / Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sunshine Luxury PG for Students"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
            <textarea
              rows="3"
              required
              placeholder="Describe proximity to colleges, metro station, mess facilities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="PG">PG (Paying Guest)</option>
                <option value="Hostel">Hostel</option>
                <option value="Flat">Flat / Apartment</option>
                <option value="Single Room">Single Room</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Image URL (Unsplash or Cloudinary)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-bold text-white uppercase text-[11px] tracking-wider text-teal-400">2. Location Details</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Street Address</label>
            <input
              type="text"
              required
              placeholder="Lane 5, Paud Road, Opposite Gate No 3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              >
                <option value="Pune">Pune</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Area / Locality</label>
              <input
                type="text"
                required
                placeholder="e.g. Kothrud"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pincode</label>
              <input
                type="text"
                required
                placeholder="411038"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20"
          >
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProperty;
