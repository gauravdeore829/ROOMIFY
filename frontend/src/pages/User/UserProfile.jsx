import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, User, MapPin, Building2, Wallet } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const profile = user?.profile || {};

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [collegeOrOffice, setCollegeOrOffice] = useState(profile.collegeOrOffice || '');
  const [preferredLocation, setPreferredLocation] = useState(profile.preferredLocation || '');
  const [budget, setBudget] = useState(profile.budget || '');
  const [roomType, setRoomType] = useState(profile.roomType || '2 Sharing');
  const [facilities, setFacilities] = useState(profile.facilities || ['wifi', 'ac']);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const facilityOptions = [
    { key: 'wifi', label: 'Wi-Fi' },
    { key: 'ac', label: 'Air Conditioner' },
    { key: 'food', label: 'Mess / Meals' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'washingMachine', label: 'Washing Machine' },
    { key: 'attachedBathroom', label: 'Attached Bathroom' },
  ];

  const handleFacilityToggle = (key) => {
    if (facilities.includes(key)) {
      setFacilities(facilities.filter((f) => f !== key));
    } else {
      setFacilities([...facilities, key]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      await updateProfile({
        name,
        phone,
        collegeOrOffice,
        preferredLocation,
        budget,
        roomType,
        facilities,
      });
      setMsg('Profile & AI recommendation preferences updated successfully!');
    } catch (err) {
      setMsg('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Profile & Search Preferences</h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize your preferences to improve AI recommendation match accuracy.
        </p>
      </div>

      {msg && <div className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs p-3 rounded-xl">{msg}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">College or Work Office</label>
            <input
              type="text"
              placeholder="e.g. MIT World Peace University"
              value={collegeOrOffice}
              onChange={(e) => setCollegeOrOffice(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Location</label>
            <input
              type="text"
              placeholder="e.g. Kothrud, Pune"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Max Monthly Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Room Sharing</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="Single">Single Room</option>
              <option value="2 Sharing">2 Sharing</option>
              <option value="3 Sharing">3 Sharing</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Required Facilities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {facilityOptions.map((fac) => {
              const active = facilities.includes(fac.key);
              return (
                <button
                  key={fac.key}
                  type="button"
                  onClick={() => handleFacilityToggle(fac.key)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-between ${
                    active
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <span>{fac.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
