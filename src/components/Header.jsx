import React from 'react';
import { PhoneCall, User, LogOut, Crown, LogIn, Send } from 'lucide-react';
import { isUserAdmin } from '../services/auth';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

export default function Header({ 
  onOpenContact, 
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const isAdmin = isUserAdmin(currentUser);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-blue-700 via-brand-600 to-indigo-700 text-white text-[11px] font-medium py-1 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-emerald-300">USMWORLD CRM:</span>
            <span className="truncate">{t('crmSubtitle')}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Selector in Top Bar */}
            <LanguageSelector compact={true} />

            {/* User status badge */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center gap-1 border border-amber-400/30 text-[10px]">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span className="hidden xs:inline">{t('superAdmin')}</span>
                    <span className="xs:hidden">Admin</span>
                  </span>
                ) : (
                  <span className="text-blue-100 flex items-center gap-1 text-[11px] truncate max-w-[100px] sm:max-w-none">
                    <User className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{currentUser.name}</span>
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="text-slate-300 hover:text-white flex items-center gap-0.5 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded transition"
                  title={t('logout')}
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-white hover:underline flex items-center gap-1 font-bold text-[10px] bg-white/20 px-2 py-0.5 rounded-full"
              >
                <LogIn className="w-3 h-3" />
                <span>{t('login')}</span>
              </button>
            )}

            {/* Quick Telegram in top bar */}
            <a 
              href="https://t.me/xusmnv"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-sky-200 hover:text-white font-semibold text-[10px] bg-sky-500/20 hover:bg-sky-500/30 px-2 py-0.5 rounded-full border border-sky-400/30 transition"
              title="Telegram lichkaga yozish: @xusmnv"
            >
              <Send className="w-2.5 h-2.5 text-sky-300" />
              <span>@xusmnv</span>
            </a>

            {/* Quick Call in top bar (Number hidden, opens dialer with +998990738859) */}
            <a 
              href="tel:+998990738859"
              className="flex items-center gap-1 text-emerald-200 hover:text-white font-semibold text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 px-2 py-0.5 rounded-full border border-emerald-400/30 transition"
              title="Qo'ng'iroq qilish"
            >
              <PhoneCall className="w-2.5 h-2.5 text-emerald-400" />
              <span>{t('call')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center overflow-hidden">
              <img 
                src="/USMWORLD.png" 
                alt="USMWORLD Logo" 
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/USMWORLD.jpg";
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                USMWORLD
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                Travel
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-xs">
              Smart Tourism Automation
            </p>
          </div>
        </div>

        {/* Clean Contact Action Buttons & Full Language Selector on desktop */}
        <div className="flex items-center gap-2">
          {/* Full Language Selector for desktop */}
          <div className="hidden sm:block">
            <LanguageSelector compact={false} />
          </div>

          {/* Telegram Lichka button */}
          <a
            href="https://t.me/xusmnv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-white border border-sky-500/40 text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl transition shadow-sm active:scale-95"
            title="Telegramda shaxsiy lichkaga yozish: @xusmnv"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xs:inline">@xusmnv</span>
          </a>

          {/* Call button: phone number +998990738859 is hidden from screen, but phone dialer opens with it ready! */}
          <a
            href="tel:+998990738859"
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95"
            title="Qo'ng'iroq qilish"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce-soft" />
            <span>{t('callNow')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
