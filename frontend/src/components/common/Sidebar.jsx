import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  PlusSquare,
  FileCheck,
  Heart,
  Bell,
  User,
  ShieldCheck,
  Flag,
  Users,
  BarChart2,
  Sliders,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isUser, isOwner, isAdmin } = useAuth();

  const userLinks = [
    { path: '/user', label: 'Dashboard Overview', icon: LayoutDashboard },
    { path: '/user/profile', label: 'My Profile & Preferences', icon: User },
    { path: '/user/applications', label: 'My Applications', icon: FileCheck },
    { path: '/user/saved', label: 'Saved Favorites', icon: Heart },
    { path: '/user/compare', label: 'Compare Rooms', icon: Sliders },
    { path: '/user/notifications', label: 'Notifications', icon: Bell },
  ];

  const ownerLinks = [
    { path: '/owner', label: 'Owner Dashboard', icon: LayoutDashboard },
    { path: '/owner/properties', label: 'My Properties', icon: Building },
    { path: '/owner/properties/add', label: 'Add New Property', icon: PlusSquare },
    { path: '/owner/applications', label: 'Tenant Applications', icon: FileCheck },
    { path: '/owner/verification', label: 'Identity Verification', icon: ShieldCheck },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Platform Analytics', icon: BarChart2 },
    { path: '/admin/users', label: 'Users & Owners', icon: Users },
    { path: '/admin/verifications', label: 'Pending Verifications', icon: ShieldCheck },
    { path: '/admin/reports', label: 'Reported Listings', icon: Flag },
  ];

  const links = isAdmin ? adminLinks : isOwner ? ownerLinks : userLinks;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center text-sm shadow-md">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{user?.name}</h4>
            <span className="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 inline-block border border-sky-500/30">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Dashboard Menu
          </div>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/user' || item.path === '/owner' || item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 font-semibold shadow-lg shadow-sky-500/20'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-center text-xs text-slate-500">
        RoomEase v1.0 • verified portal
      </div>
    </aside>
  );
};

export default Sidebar;
