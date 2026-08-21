import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'ADMIN') navigate('/admin');
        else if (res.user.role === 'OWNER') navigate('/owner');
        else navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo@12345');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-100">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              <Home className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-2xl font-extrabold text-white">
              Room<span className="text-sky-400">Ease</span>
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-400">Log in to manage your room applications or listings</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-sky-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
                placeholder="••••••••"
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
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Quick Login buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Quick Demo Login</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setDemoCredentials('student@example.com')}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-sky-400 font-semibold text-center border border-slate-700"
            >
              User
            </button>
            <button
              onClick={() => setDemoCredentials('owner@example.com')}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-teal-400 font-semibold text-center border border-slate-700"
            >
              Owner
            </button>
            <button
              onClick={() => setDemoCredentials('admin@example.com')}
              className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-purple-400 font-semibold text-center border border-slate-700"
            >
              Admin
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
