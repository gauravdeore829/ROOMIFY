import React, { useState, useEffect } from 'react';
import { propertyAPI, roomAPI } from '../../services/api';
import { Building, Plus, Trash2, Edit, Bed, PlusSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../../components/common/Modal';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Room Modal State
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [roomType, setRoomType] = useState('2 Sharing');
  const [totalBeds, setTotalBeds] = useState(2);
  const [occupiedBeds, setOccupiedBeds] = useState(0);
  const [rent, setRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');

  const fetchProperties = async () => {
    try {
      const res = await propertyAPI.getOwnerProperties();
      if (res.data.success) {
        setProperties(res.data.properties);
      }
    } catch (err) {
      console.error('Error fetching owner properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await propertyAPI.deleteProperty(id);
      fetchProperties();
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await roomAPI.addRoom({
        propertyId: selectedPropertyId,
        roomType,
        totalBeds: parseInt(totalBeds),
        occupiedBeds: parseInt(occupiedBeds),
        rent: parseFloat(rent),
        securityDeposit: parseFloat(securityDeposit || rent),
      });
      if (res.data.success) {
        alert('Room added successfully');
        setRoomModalOpen(false);
        fetchProperties();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Delete this room configuration?')) return;
    try {
      await roomAPI.deleteRoom(roomId);
      fetchProperties();
    } catch (err) {
      alert('Failed to delete room');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Building className="w-5 h-5 text-teal-400" />
            <span>My Property Listings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your active rental accommodations and room capacities</p>
        </div>
        <Link
          to="/owner/properties/add"
          className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5"
        >
          <PlusSquare className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-slate-900 h-32 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400">
          No properties found. Add a property to start listing rooms!
        </div>
      ) : (
        <div className="space-y-6">
          {properties.map((prop) => (
            <div key={prop.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white text-base">{prop.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-teal-400 border border-slate-700">
                      {prop.propertyType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{prop.address}, {prop.area}, {prop.city}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPropertyId(prop.id);
                      setRoomModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Room</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProperty(prop.id)}
                    className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition"
                    title="Delete Property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rooms configured for this property */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Configured Rooms</h4>
                {prop.rooms && prop.rooms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {prop.rooms.map((r) => (
                      <div key={r.id} className="bg-slate-800/60 border border-slate-700/50 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">{r.roomType}</span>
                          <span className="text-slate-400">Rent: ₹{r.rent}/mo</span>
                          <div className="text-[11px] font-semibold mt-1">
                            Beds: <span className="text-emerald-400">{r.availableBeds} Avail</span> / {r.totalBeds} Total
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRoom(r.id)}
                          className="p-1 text-slate-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No rooms configured yet for this property. Click "Add Room".</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      <Modal isOpen={roomModalOpen} onClose={() => setRoomModalOpen(false)} title="Configure Room & Bed Capacity">
        <form onSubmit={handleAddRoomSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Room Sharing Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="Single">Single Room</option>
              <option value="2 Sharing">2 Sharing</option>
              <option value="3 Sharing">3 Sharing</option>
              <option value="4 Sharing">4 Sharing</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Total Beds</label>
              <input
                type="number"
                required
                min="1"
                value={totalBeds}
                onChange={(e) => setTotalBeds(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Occupied Beds</label>
              <input
                type="number"
                required
                min="0"
                value={occupiedBeds}
                onChange={(e) => setOccupiedBeds(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Rent (₹)</label>
              <input
                type="number"
                required
                placeholder="7500"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Deposit (₹)</label>
              <input
                type="number"
                placeholder="15000"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setRoomModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
            >
              Save Room
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageProperties;
