import React, { useState, useEffect } from 'react';
import { Sparkles, Download, RefreshCw, X, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const CURRENT_APP_VERSION = "1.0.0";

export default function UpdateNotificationModal() {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Check version on load and periodically
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch(`/version.json?t=${Date.now()}`);
        if (!response.ok) return;
        const data = await response.json();

        // If server version is greater than current app version
        if (data.version && data.version !== CURRENT_APP_VERSION) {
          // Check if user dismissed this specific version recently
          const dismissedVersion = localStorage.getItem('usmworld_dismissed_update');
          if (dismissedVersion !== data.version) {
            setUpdateInfo(data);
            setShowModal(true);
          }
        }
      } catch (e) {
        // Offline or fetch failed, silently ignore
      }
    };

    checkForUpdates();
    // Check every 10 minutes
    const interval = setInterval(checkForUpdates, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyUpdate = () => {
    setIsUpdating(true);

    // If Service worker exists, update cache
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.update();
        }
      });
    }

    // Trigger APK download if configured
    if (updateInfo?.apkUrl) {
      const a = document.createElement('a');
      a.href = updateInfo.apkUrl;
      a.download = 'USMWORLD.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Reload app to apply live assets
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleDismiss = () => {
    if (updateInfo?.version) {
      localStorage.setItem('usmworld_dismissed_update', updateInfo.version);
    }
    setShowModal(false);
  };

  if (!showModal || !updateInfo) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-md rounded-3xl border border-blue-500/50 shadow-2xl p-5 space-y-4 ring-1 ring-blue-500/20">
        
        {/* Top banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4 animate-bounce-soft" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                YANGI VERSIYA MAVJUD!
              </span>
              <h3 className="text-sm font-black text-white">USMWORLD v{updateInfo.version}</h3>
            </div>
          </div>

          {!updateInfo.forceUpdate && (
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Body info */}
        <div className="space-y-3">
          <div className="bg-blue-950/30 border border-blue-500/30 p-3.5 rounded-2xl space-y-1.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {updateInfo.title || "Yangi imkoniyatlar qo'shildi!"}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {updateInfo.description || "Dasturda yangi tur paketlari, narxlar va tezkor qulayliklar yangilandi."}
            </p>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sizdagi versiya: <b>v{CURRENT_APP_VERSION}</b></span>
            <span className="text-emerald-400 font-bold">Yangi: v{updateInfo.version}</span>
          </div>

          {/* Action button */}
          <button
            onClick={handleApplyUpdate}
            disabled={isUpdating}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Yangilanmoqda...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Yangilanishni O'rnatish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="text-center pt-1 border-t border-slate-800 text-[10px] text-slate-500">
          Avtomatlashtirilgan xavfsiz yangilanish tizimi
        </div>
      </div>
    </div>
  );
}
