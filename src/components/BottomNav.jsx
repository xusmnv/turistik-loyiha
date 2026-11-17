import React from 'react';
import { Home, Compass, Ticket, LayoutDashboard, MessageCircleQuestion } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav({ activeTab, setActiveTab, ordersCount = 0 }) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Home },
    { id: 'catalog', label: t('navTours'), icon: Compass },
    { id: 'orders', label: t('navTickets'), icon: Ticket, badge: ordersCount > 0 ? ordersCount : null },
    { id: 'admin', label: t('navCrm'), icon: LayoutDashboard, isAccent: true },
    { id: 'contact', label: t('navContact'), icon: MessageCircleQuestion },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 max-w-lg mx-auto md:max-w-md shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Highlight background pill for active */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-fade-in shadow-sm shadow-blue-500" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
