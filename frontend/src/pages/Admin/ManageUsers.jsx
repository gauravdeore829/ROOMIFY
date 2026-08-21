import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users, Ban, CheckCircle } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error loading users list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (id) => {
    try {
      const res = await adminAPI.toggleUserStatus(id);
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Users className="w-5 h-5 text-purple-400" />
          <span>User & Owner Account Moderation</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage accounts, inspect user roles, and toggle suspensions</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900 h-16 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase border-b border-slate-800">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : u.role === 'OWNER'
                          ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {u.isSuspended ? (
                      <span className="text-red-400 font-bold">Suspended</span>
                    ) : (
                      <span className="text-emerald-400 font-bold">Active</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleToggleSuspend(u.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          u.isSuspended
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
