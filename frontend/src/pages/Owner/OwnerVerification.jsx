import React, { useState } from 'react';
import { verificationAPI } from '../../services/api';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OwnerVerification = () => {
  const { user } = useAuth();
  const currentVerification = user?.verificationRequest;

  const [phone, setPhone] = useState(user?.phone || '');
  const [idProofRef, setIdProofRef] = useState('AADHAAR_DOCUMENT_REF.pdf');
  const [propertyDocRef, setPropertyDocRef] = useState('PROPERTY_TITLE_DEED_REF.pdf');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(!!currentVerification);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verificationAPI.submitVerification({
        phone,
        idProofRef,
        propertyDocRef,
        address,
      });
      if (res.data.success) {
        setSubmitted(true);
        alert('Verification request submitted to platform admins for approval!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <span>Owner Identity & Property Verification</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Verified landlords receive a green verification badge on all property listings to build tenant trust.
        </p>
      </div>

      {submitted ? (
        <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Verification Status: {currentVerification?.status || 'VERIFIED'}</span>
          </div>
          <p className="text-xs text-slate-300">
            Your verification reference documents have been registered. Admin status updates will appear in your notification feed.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Owner Address</label>
            <input
              type="text"
              required
              placeholder="Flat 402, Sunshine Heights, Kothrud, Pune"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Government ID Reference (Aadhaar / PAN)</label>
              <input
                type="text"
                required
                value={idProofRef}
                onChange={(e) => setIdProofRef(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Property Ownership Document Ref</label>
              <input
                type="text"
                required
                value={propertyDocRef}
                onChange={(e) => setPropertyDocRef(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-2.5 rounded-xl transition mt-2"
          >
            {loading ? 'Submitting...' : 'Submit Verification Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default OwnerVerification;
