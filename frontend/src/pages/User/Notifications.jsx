import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, Info } from 'lucide-react';

const Notifications = () => {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Bell className="w-5 h-5 text-sky-400" />
          <span>Notifications & Updates</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Application updates, verification responses, and room alerts</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 space-y-2">
          <p className="text-sm">No notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                n.isRead
                  ? 'bg-slate-900 border-slate-800 text-slate-400'
                  : 'bg-slate-800/90 border-sky-500/30 text-white font-medium shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${n.isRead ? 'bg-slate-800 text-slate-500' : 'bg-sky-500/20 text-sky-400'}`}>
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="px-3 py-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 rounded-lg text-xs font-semibold"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
