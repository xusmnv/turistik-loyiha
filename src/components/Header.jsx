import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Download, PhoneCall, Sparkles, User, LogOut, Crown, LogIn } from 'lucide-react';
import { AGENCY_INFO } from '../data/mockData';
import { isUserAdmin } from '../services/auth';

export default function Header({ 
  isMobileView, 
  setIsMobileView, 
  onOpenInstall, 
  onOpenContact, 
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const isAdmin = isUserAdmin(currentUser);

  // Check if running inside mobile device or native APK
  const isNativeOrMobile = typeof window !== 'undefined' && (
    Boolean(window.Capacitor?.isNativePlatform?.()) ||
    (window.Capacitor?.getPlatform && window.Capacitor.getPlatform() !== 'web') ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-blue-700 via-brand-600 to-indigo-700 text-white text-[11px] font-medium py-1 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-emerald-300">USMWORLD CRM:</span>
            <span className="truncate">Turizm agentligi faoliyatini avtomatlashtirish tizimi</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* User status badge */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center gap-1 border border-amber-400/30 text-[10px]">
                    <Crown className="w-3 h-3 text-amber-400" />
                    Bosh Administrator
                  </span>
                ) : (
                  <span className="text-blue-100 flex items-center gap-1 text-[11px]">
                    <User className="w-3 h-3 text-emerald-400" />
                    {currentUser.name}
                  </span>
                )}
                <button
                  onClick={onLogout}
                  className="text-slate-300 hover:text-white flex items-center gap-0.5 text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded transition"
                  title="Chiqish"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Chiqish</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="text-white hover:underline flex items-center gap-1 font-bold text-[10px] bg-white/20 px-2 py-0.5 rounded-full"
              >
                <LogIn className="w-3 h-3" />
                <span>Kirish / Ro'yxatdan o'tish</span>
              </button>
            )}

            <button 
              onClick={onOpenContact}
              className="hidden sm:flex hover:underline items-center gap-1 text-white font-medium text-[11px]"
            >
              <PhoneCall className="w-3 h-3" />
              {AGENCY_INFO.phone}
            </button>
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

        {/* Action Controls (strictly for Desktop browsers; hidden in APK and mobile screens) */}
        {!isNativeOrMobile && (
          <div className="hidden lg:flex items-center gap-2">
            {/* APK / PWA download button */}
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition active:scale-95"
              title="Ilovani mobil telefonga o'rnatish (APK / PWA)"
            >
              <Download className="w-3.5 h-3.5 animate-bounce-soft" />
              <span>Ilova / APK</span>
            </button>

            {/* Desktop Device Frame Toggle */}
            <button
              onClick={() => setIsMobileView(!isMobileView)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition ${
                isMobileView
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={isMobileView ? "Keng ekran ko'rinishiga o'tish" : "Telefon (Mobile App) ko'rinishiga o'tish"}
            >
              {isMobileView ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Keng Ekran</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>Telefon Rejimi</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
