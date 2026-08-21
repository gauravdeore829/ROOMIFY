import React, { useState, useEffect } from 'react';
import { verificationAPI, propertyAPI, adminAPI } from '../../services/api';
import { ShieldCheck, Check, X, FileText, Building } from 'lucide-react';

const ManageVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [unverifiedProperties, setUnverifiedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVerifications = async () => {
    try {
      const [vRes, pRes] = await Promise.all([
        verificationAPI.getVerifications(),
        propertyAPI.getProperties({ verifiedOnly: 'false' }),
      ]);
      if (vRes.data.success) setVerifications(vRes.data.verifications);
      if (pRes.data.success) {
        setUnverifiedProperties(pRes.data.properties.filter((p) => !p.isVerified));
      }
    } catch (err) {
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleOwnerVerification = async (id, status) => {
    try {
      const res = await verificationAPI.handleVerification(id, status);
      if (res.data.success) {
        alert(`Owner identity status set to ${status}`);
        fetchVerifications();
      }
    } catch (err) {
      alert('Failed to update verification');
    }
  };

  const handlePropertyVerify = async (propId, isVerified) => {
    try {
      const res = await adminAPI.verifyProperty(propId, { isVerified, status: isVerified ? 'VERIFIED' : 'REJECTED' });
      if (res.data.success) {
        alert('Property verification updated');
        fetchVerifications();
      }
    } catch (err) {
      alert('Failed to update property status');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <span>Verification Approvals Portal</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Approve landlord documents and inspect property listings</p>
      </div>

      {/* Owner Identity Verification Submissions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <FileText className="w-4 h-4 text-sky-400" />
          <span>Owner Identity Document Approvals</span>
        </h2>

        {verifications.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No pending owner verification documents.</p>
        ) : (
          <div className="space-y-3">
            {verifications.map((v) => (
              <div key={v.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-white text-sm">{v.owner?.name}</h4>
                  <p className="text-slate-400">{v.owner?.email} • {v.phone}</p>
                  <p className="text-slate-300"><strong>Address:</strong> {v.address}</p>
                  <div className="flex items-center space-x-3 pt-1 text-[11px] text-sky-400">
                    <span>ID Proof: {v.idProofRef}</span>
                    <span>Title Deed: {v.propertyDocRef}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {v.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleOwnerVerification(v.id, 'VERIFIED')}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Landlord</span>
                      </button>
                      <button
                        onClick={() => handleOwnerVerification(v.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-bold rounded-lg text-xs flex items-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                      {v.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Listing Approvals */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Building className="w-4 h-4 text-teal-400" />
          <span>Pending Property Listing Approvals ({unverifiedProperties.length})</span>
        </h2>

        {unverifiedProperties.length === 0 ? (
          <p className="text-xs text-slate-400 italic">All active property listings are currently verified!</p>
        ) : (
          <div className="space-y-3">
            {unverifiedProperties.map((p) => (
              <div key={p.id} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <p className="text-xs text-slate-400">{p.address}, {p.city} • Owner: {p.owner?.name}</p>
                </div>

                <button
                  onClick={() => handlePropertyVerify(p.id, true)}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Approve Listing
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVerifications;
