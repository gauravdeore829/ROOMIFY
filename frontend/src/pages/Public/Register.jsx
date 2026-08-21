import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'OWNER' ? 'OWNER' : 'USER';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register({ name, email, password, phone, role });
      if (res.success) {
        if (role === 'OWNER') navigate('/owner');
        else navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-100">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              <Home className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-2xl font-extrabold text-white">
              Room<span className="text-sky-400">Ease</span>
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-white pt-2">Create an Account</h2>
          <p className="text-xs text-slate-400">Join as a Room Seeker or Property Owner</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('USER')}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                role === 'USER' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Room Seeker (User)
            </button>
            <button
              type="button"
              onClick={() => setRole('OWNER')}
              className={`py-2 rounded-lg text-xs font-bold transition ${
                role === 'OWNER' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Property Owner
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Patel"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-sky-400 font-semibold hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
