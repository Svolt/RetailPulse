import React from 'react';
import { X, CheckCheck, Bell, FileText, CreditCard, Gift, Megaphone, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const { 
    isNotificationOpen, 
    setIsNotificationOpen, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    setActiveNav
  } = useApp();

  if (!isNotificationOpen) return null;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'claim': return FileText;
      case 'payout': return CreditCard;
      case 'reward': return Gift;
      case 'campaign': return Megaphone;
      default: return Info;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col border-l border-[#E5EAE1] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5EAE1]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#153B2B]" />
            <h3 className="text-sm font-bold text-[#172018]">Notifications & Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 text-xs text-[#697565] hover:text-[#153B2B] font-medium cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 text-[#697565] hover:text-[#172018] rounded-md hover:bg-[#F5F7F3] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#E5EAE1]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <Bell className="w-8 h-8 text-[#94A3B8] mb-2" />
              <p className="text-sm font-semibold text-[#172018]">No notifications</p>
              <p className="text-xs text-[#697565] mt-1">You're all caught up with claims and payouts.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = getCategoryIcon(notif.category);
              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.linkAction) {
                      setActiveNav(notif.linkAction);
                      setIsNotificationOpen(false);
                    }
                  }}
                  className={`p-4 transition-colors cursor-pointer hover:bg-[#F5F7F3] ${
                    !notif.isRead ? 'bg-[#FAFBF9]' : 'bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EAEFE6] flex items-center justify-center text-[#153B2B] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs truncate ${!notif.isRead ? 'font-bold text-[#172018]' : 'font-medium text-[#3E4A3D]'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#153B2B] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#697565] mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="text-[10px] text-[#94A3B8] mt-2 font-tabular">
                        {notif.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F5F7F3] border-t border-[#E5EAE1] text-center text-xs text-[#697565]">
          Push and SMS alerts are synchronized with verified mobile number
        </div>
      </div>
    </div>
  );
};
