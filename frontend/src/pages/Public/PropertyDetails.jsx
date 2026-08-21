import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI, reportAPI } from '../../services/api';
import RoomCard from '../../components/properties/RoomCard';
import ReviewModal from '../../components/properties/ReviewModal';
import MapComponent from '../../components/maps/MapComponent';
import Modal from '../../components/common/Modal';
import {
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
  Car,
  Wind,
  Utensils,
  ChefHat,
  Shirt,
  Bath,
  Zap,
  Tv,
  Eye,
  Droplet,
  Check,
  X,
  Clock,
  Flag,
  User,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inaccurate information');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const fetchPropertyData = async () => {
    try {
      const res = await propertyAPI.getPropertyById(id);
      if (res.data.success) {
        setProperty(res.data.property);
      }
    } catch (err) {
      console.error('Error loading property details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportSubmitting(true);
    try {
      const res = await reportAPI.reportProperty({
        propertyId: id,
        reason: reportReason,
        description: reportDesc,
      });
      if (res.data.success) {
        alert('Thank you. Report submitted to platform moderators.');
        setReportModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setReportSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-sky-400 font-bold animate-pulse text-lg">Loading Property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 p-12 text-center text-white space-y-4">
        <h2 className="text-2xl font-bold">Property Listing Not Found</h2>
        <Link to="/search" className="text-sky-400 font-semibold underline">Back to Search</Link>
      </div>
    );
  }

  const { amenities, rules, owner } = property;

  const amenityIcons = [
    { key: 'wifi', label: 'High-Speed Wi-Fi', icon: Wifi },
    { key: 'ac', label: 'Air Conditioner', icon: Wind },
    { key: 'food', label: 'Mess / Meals', icon: Utensils },
    { key: 'kitchen', label: 'Self Kitchen', icon: ChefHat },
    { key: 'washingMachine', label: 'Washing Machine', icon: Shirt },
    { key: 'attachedBathroom', label: 'Attached Bath', icon: Bath },
    { key: 'powerBackup', label: 'Power Backup', icon: Zap },
    { key: 'cctv', label: '24/7 CCTV', icon: Eye },
    { key: 'waterSupply', label: '24/7 Water', icon: Droplet },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {property.propertyType}
            </span>
            {property.isVerified && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Listing</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{property.name}</h1>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center space-x-1.5 mt-2">
            <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{property.address}, {property.area}, {property.city} - {property.pincode}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (!isAuthenticated) return alert('Please login to report a property');
              setReportModalOpen(true);
            }}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 rounded-xl transition"
          >
            <Flag className="w-4 h-4" />
            <span>Report Listing</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[350px] sm:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
        <div className="md:col-span-2 h-full bg-slate-900 overflow-hidden">
          <img
            src={property.images[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'}
            alt={property.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          <img
            src={property.images[1]?.url || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}
            alt="Room view"
            className="w-full h-full object-cover rounded-xl"
          />
          <img
            src={property.images[2]?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'}
            alt="Bathroom view"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Main Grid: Details + Rooms list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">About this Accommodation</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{property.description}</p>
          </div>

          {/* Rooms & Availability */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-white">Available Rooms</h2>
              <span className="text-xs text-slate-400">Calculated in real-time</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.rooms && property.rooms.map((room) => (
                <RoomCard key={room.id} room={room} propertyName={property.name} />
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Facilities & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {amenities &&
                amenityIcons.map(({ key, label, icon: Icon }) => {
                  const isAvailable = amenities[key];
                  return (
                    <div
                      key={key}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border ${
                        isAvailable
                          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600 line-through'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isAvailable ? 'text-sky-400' : 'text-slate-600'}`} />
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* House Rules */}
          {rules && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">House Rules & Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2 bg-slate-800/50 p-3 rounded-xl">
                  {rules.visitorsAllowed ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>Visitors: <strong>{rules.visitorsAllowed ? 'Allowed' : 'Not Allowed'}</strong></span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800/50 p-3 rounded-xl">
                  {rules.smokingAllowed ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>Smoking: <strong>{rules.smokingAllowed ? 'Allowed' : 'Prohibited'}</strong></span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800/50 p-3 rounded-xl">
                  {rules.petsAllowed ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-red-400" />}
                  <span>Pets: <strong>{rules.petsAllowed ? 'Allowed' : 'Not Allowed'}</strong></span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-800/50 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Curfew Timing: <strong>{rules.curfewTime || 'No Curfew'}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Reviews & Ratings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Reviews & Ratings</span>
                  <div className="flex items-center space-x-1 text-amber-400 text-sm font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{property.avgRating || 4.5}</span>
                  </div>
                </h2>
                <p className="text-xs text-slate-400 mt-1">{property.reviews?.length || 0} verified tenant reviews</p>
              </div>

              <button
                onClick={() => {
                  if (!isAuthenticated) return alert('Please login to post a review');
                  setReviewModalOpen(true);
                }}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Write a Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {property.reviews && property.reviews.length > 0 ? (
                property.reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-700 text-sky-400 flex items-center justify-center font-bold text-xs">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-semibold text-white text-xs">{rev.user?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-400 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.averageRating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No reviews written yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Host & Map */}
        <div className="space-y-6">
          {/* Owner Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Property Host</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-lg border border-teal-500/30">
                {owner?.name?.charAt(0) || 'O'}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{owner?.name || 'Property Owner'}</h4>
                <p className="text-xs text-emerald-400 flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Landlord</span>
                </p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Location Map</span>
            </h3>
            <div className="h-[250px] w-full rounded-xl overflow-hidden">
              <MapComponent properties={[property]} center={[property.latitude, property.longitude]} zoom={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        propertyId={property.id}
        onReviewAdded={fetchPropertyData}
      />

      {/* Report Modal */}
      <Modal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report Inappropriate Property Listing">
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Report</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="Fake listing">Fake listing</option>
              <option value="Wrong rent">Wrong rent price advertised</option>
              <option value="Room unavailable">Room already unavailable</option>
              <option value="Fake photos">Fake photos</option>
              <option value="Scam">Fraud / Scam concern</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Details / Explanation</label>
            <textarea
              rows="3"
              value={reportDesc}
              onChange={(e) => setReportDesc(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reportSubmitting}
              className="px-5 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl text-xs"
            >
              {reportSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PropertyDetails;
