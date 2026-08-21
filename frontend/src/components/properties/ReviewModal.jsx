import React, { useState } from 'react';
import Modal from '../common/Modal';
import { reviewAPI } from '../../services/api';
import { Star } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, propertyId, onReviewAdded }) => {
  const [cleanliness, setCleanliness] = useState(5);
  const [location, setLocation] = useState(5);
  const [safety, setSafety] = useState(5);
  const [ownerBehavior, setOwnerBehavior] = useState(5);
  const [facilities, setFacilities] = useState(5);
  const [valueForMoney, setValueForMoney] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await reviewAPI.addReview({
        propertyId,
        cleanliness,
        location,
        safety,
        ownerBehavior,
        facilities,
        valueForMoney,
        comment,
      });

      if (res.data.success) {
        alert('Thank you! Review posted successfully.');
        if (onReviewAdded) onReviewAdded();
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStarSelector = (label, value, setter) => (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-slate-300">{label}</span>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 hover:scale-110 transition"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Write a Property Review">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
          {renderStarSelector('Cleanliness', cleanliness, setCleanliness)}
          {renderStarSelector('Location', location, setLocation)}
          {renderStarSelector('Safety', safety, setSafety)}
          {renderStarSelector('Owner Behavior', ownerBehavior, setOwnerBehavior)}
          {renderStarSelector('Facilities', facilities, setFacilities)}
          {renderStarSelector('Value for Money', valueForMoney, setValueForMoney)}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Detailed Feedback / Review
          </label>
          <textarea
            rows="3"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your stay experience, room cleanliness, location pros/cons..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-sky-500/20"
          >
            {loading ? 'Submitting...' : 'Post Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
