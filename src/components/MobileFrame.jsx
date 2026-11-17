import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

export default function MobileFrame({ isMobileView, setIsMobileView, children }) {
  // Check if running on mobile device or native APK
  const isNativeOrMobile = typeof window !== 'undefined' && (
    Boolean(window.Capacitor?.isNativePlatform?.()) ||
    (window.Capacitor?.getPlatform && window.Capacitor.getPlatform() !== 'web') ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth < 1024
  );

  // If not mobile frame view mode or running on mobile/APK, render naturally full responsive layout
  if (!isMobileView || isNativeOrMobile) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  // Current real-time clock for mobile status bar
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 transition-all duration-300">
      {/* Device wrapper representation */}
      <div className="relative w-full max-w-[430px] h-[92vh] max-h-[880px] bg-slate-900 rounded-[48px] border-[10px] border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_40px_rgba(37,99,235,0.2)] flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Top Speaker / Dynamic Island */}
        <div className="relative z-30 pt-3 px-6 pb-2 bg-slate-900 flex items-center justify-between text-white text-[12px] font-semibold shrink-0 select-none">
          <span>{currentTime}</span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-end px-2 space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-500/80"></span>
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable screen viewport inside phone */}
        <div className="relative flex-1 overflow-y-auto no-scrollbar bg-slate-950 flex flex-col">
          {children}
        </div>

        {/* iPhone bottom home bar indicator */}
        <div className="absolute bottom-1 inset-x-0 h-4 flex items-center justify-center pointer-events-none z-50">
          <div className="w-32 h-1 bg-white/40 rounded-full"></div>
        </div>
      </div>

      {/* Frame helper badge */}
      <div className="mt-3 text-center">
        <span className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 shadow">
          📱 Mobil Ilova Rejimi • Yuqoridagi tugma orqali to'liq ekranga o'tishingiz mumkin
        </span>
      </div>
    </div>
  );
}
