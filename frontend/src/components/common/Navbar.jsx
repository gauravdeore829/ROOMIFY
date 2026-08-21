import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Home,
  Search,
  Heart,
  Bell,
  User,
  LogOut,
  Building,
  ShieldAlert,
  Menu,
  X,
  Compass,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isOwner, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Room<span className="text-sky-400">Ease</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/search"
              className="flex items-center space-x-1.5 text-slate-300 hover:text-sky-400 font-medium transition text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Discover Rooms</span>
            </Link>

            <Link
              to="/about"
              className="text-slate-300 hover:text-sky-400 font-medium transition text-sm"
            >
              About
            </Link>

            <Link
              to="/contact"
              className="text-slate-300 hover:text-sky-400 font-medium transition text-sm"
            >
              Contact
            </Link>
          </div>

          {/* User Auth Buttons or Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Favorites */}
                <Link
                  to="/user/saved"
                  className="p-2 text-slate-400 hover:text-pink-400 hover:bg-slate-800 rounded-lg transition relative"
                  title="Saved Rooms"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Notifications */}
                <Link
                  to="/user/notifications"
                  className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-sky-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Role Specific Dashboard Button */}
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold hover:bg-purple-600/30 transition"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                ) : isOwner ? (
                  <Link
                    to="/owner"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold hover:bg-teal-500/30 transition"
                  >
                    <Building className="w-4 h-4" />
                    <span>Owner Portal</span>
                  </Link>
                ) : (
                  <Link
                    to="/user"
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold hover:bg-sky-500/30 transition"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* User Info Badge */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-semibold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition shadow-lg shadow-sky-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/search"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md text-base"
          >
            Discover Rooms
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md text-base"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md text-base"
          >
            Contact
          </Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to={isAdmin ? '/admin' : isOwner ? '/owner' : '/user'}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sky-400 font-semibold bg-slate-800 rounded-md text-base"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-800 rounded-md text-base"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block text-center px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-md text-base"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block text-center bg-sky-500 text-slate-950 font-semibold px-3 py-2 rounded-md text-base"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
