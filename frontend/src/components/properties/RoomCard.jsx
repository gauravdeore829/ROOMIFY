import React, { useState } from 'react';
import { Bed, Users, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { applicationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

const RoomCard = ({ room, propertyName }) => {
  const { isAuthenticated, isUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const isFull = room.availableBeds <= 0 || room.status === 'FULL';

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to apply for a room');
      return;
    }
    setLoading(true);
    try {
      const res = await applicationAPI.createApplication({
        roomId: room.id,
        message,
      });
      if (res.data.success) {
        setApplied(true);
        setModalOpen(false);
        alert('Application submitted successfully to property owner!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
            {room.roomType}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isFull ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {isFull ? 'FULL' : `${room.availableBeds} Bed Available`}
          </span>
        </div>

        <div className="mt-4 flex items-baseline space-x-1">
          <span className="text-2xl font-extrabold text-white">₹{room.rent.toLocaleString('en-IN')}</span>
          <span className="text-xs text-slate-400">/ month</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Deposit: <span className="text-slate-200 font-semibold">₹{room.securityDeposit.toLocaleString('en-IN')}</span>
        </p>

        {/* Beds Calculation Display */}
        <div className="mt-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Total Beds:</span>
            </span>
            <span className="font-semibold text-white">{room.totalBeds}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Bed className="w-3.5 h-3.5 text-amber-400" />
              <span>Occupied:</span>
            </span>
            <span className="font-semibold text-amber-400">{room.occupiedBeds}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available:</span>
            </span>
            <span className="font-bold text-emerald-400">{room.availableBeds}</span>
          </div>
        </div>
      </div>

      <button
        disabled={isFull || applied}
        onClick={() => setModalOpen(true)}
        className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-md ${
          isFull
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : applied
            ? 'bg-emerald-600 text-white cursor-default'
            : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
        }`}
      >
        {isFull ? 'No Beds Vacant' : applied ? 'Application Pending' : 'Apply for this Room'}
      </button>

      {/* Application Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={`Apply for ${room.roomType} in ${propertyName}`}>
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Message to Owner (Optional)
            </label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I am interested in moving in by next week..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500"
            ></textarea>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 space-y-1 text-xs text-slate-300">
            <p><strong>Monthly Rent:</strong> ₹{room.rent}</p>
            <p><strong>Deposit:</strong> ₹{room.securityDeposit}</p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold"
            >
              {loading ? 'Submitting...' : 'Confirm Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomCard;
