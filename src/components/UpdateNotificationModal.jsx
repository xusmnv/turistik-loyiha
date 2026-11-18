import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Download, RefreshCw, X, ArrowRight, CheckCircle2, 
  ShieldCheck, Zap, RotateCcw, Smartphone, Check 
} from 'lucide-react';
import { 
  checkRemoteUpdate, performInAppUpdate, downloadLatestApk, getInstalledVersion 
} from '../services/updater';
import { useLanguage } from '../context/LanguageContext';

export default function UpdateNotificationModal({ triggerCheck = 0 }) {
  const { effectiveLanguage } = useLanguage();
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'downloading' | 'ready_to_restart'
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [justUpdatedToast, setJustUpdatedToast] = useState(false);

  // Check if app was just restarted from an update
  useEffect(() => {
    try {
      if (localStorage.getItem('usmworld_just_updated') === 'true') {
        localStorage.removeItem('usmworld_just_updated');
        setJustUpdatedToast(true);
        setTimeout(() => setJustUpdatedToast(false), 5000);
      }
    } catch (e) {}
  }, []);

  // Check for updates on mount, when triggerCheck changes, and periodically
  const runUpdateCheck = async () => {
    const res = await checkRemoteUpdate();
    if (res.hasUpdate) {
      // Don't show if user dismissed this exact version in this session
      const dismissed = sessionStorage.getItem('usmworld_dismissed_update');
      if (dismissed !== res.latestVersion) {
        setUpdateInfo(res);
        setShowModal(true);
      }
    }
  };

  useEffect(() => {
    runUpdateCheck();
    // Re-check every 5 minutes
    const interval = setInterval(runUpdateCheck, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [triggerCheck]);

  // Handle In-App Live Update
  const handleStartInAppUpdate = async () => {
    setStatus('downloading');
    setProgress(10);
    setProgressText(
      effectiveLanguage === 'ru' 
        ? "Подключение к серверу обновлений..." 
        : effectiveLanguage === 'en' 
        ? "Connecting to update server..." 
        : "Yangilanish serveriga ulanmoqda..."
    );

    await performInAppUpdate(updateInfo.latestVersion, (pct, txt) => {
      setProgress(pct);
      setProgressText(txt);
    });

    setStatus('ready_to_restart');
  };

  // Handle Restart Application
  const handleRestartApp = () => {
    // Force reload bypassing cache
    window.location.reload(true);
  };

  // Handle Direct APK Download
  const handleDownloadApk = () => {
    downloadLatestApk(updateInfo?.apkUrl);
  };

  const handleDismiss = () => {
    if (updateInfo?.latestVersion) {
      sessionStorage.setItem('usmworld_dismissed_update', updateInfo.latestVersion);
    }
    setShowModal(false);
  };

  return (
    <>
      {/* Toast Notification for Just Updated Success */}
      {justUpdatedToast && (
        <div className="fixed top-3 inset-x-3 z-50 max-w-md mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-emerald-400/40 animate-bounce-soft">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                {effectiveLanguage === 'ru' ? "Обновление Установлено!" : effectiveLanguage === 'en' ? "Update Applied!" : "Yangilanish O'rnatildi!"}
              </div>
              <div className="text-[11px] text-emerald-100">
                USMWORLD v{getInstalledVersion()} {effectiveLanguage === 'ru' ? "успешно работает." : effectiveLanguage === 'en' ? "is running smoothly." : "muvaffaqiyatli ishga tushdi."}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setJustUpdatedToast(false)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Update Modal */}
      {showModal && updateInfo && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative bg-slate-900 w-full sm:max-w-md rounded-3xl border-2 border-blue-500/60 shadow-2xl p-5 space-y-4 ring-1 ring-blue-500/30">
            
            {/* Header banner */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
                    {effectiveLanguage === 'ru' ? "ДОСТУПНО ОБНОВЛЕНИЕ" : effectiveLanguage === 'en' ? "UPDATE AVAILABLE" : "YANGI YANGILANISH!"}
                  </span>
                  <h3 className="text-base font-extrabold text-white">USMWORLD v{updateInfo.latestVersion}</h3>
                </div>
              </div>

              {!updateInfo.forceUpdate && status !== 'downloading' && (
                <button
                  onClick={handleDismiss}
                  className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content based on status */}
            {status === 'idle' && (
              <div className="space-y-3.5">
                {/* Release description box */}
                <div className="bg-blue-950/30 border border-blue-500/30 p-4 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{updateInfo.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {updateInfo.description}
                  </p>
                </div>

                {/* Version comparison pill */}
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-[11px] flex items-center justify-between">
                  <span className="text-slate-400">
                    {effectiveLanguage === 'ru' ? "Текущая:" : effectiveLanguage === 'en' ? "Current:" : "Sizdagi:"} <b className="text-slate-200">v{updateInfo.currentVersion}</b>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                    <ArrowRight className="w-3 h-3" /> v{updateInfo.latestVersion}
                  </span>
                </div>

                {/* Primary Action 1: In-App 1-Click Update */}
                <button
                  onClick={handleStartInAppUpdate}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>
                    {effectiveLanguage === 'ru' 
                      ? "Обновить Сейчас (Внутри приложения)" 
                      : effectiveLanguage === 'en' 
                      ? "Update Now (In-App)" 
                      : "Ilova Ichidan Yangilashni O'rnatish"}
                  </span>
                </button>

                {/* Secondary Action 2: Direct APK Download */}
                <button
                  onClick={handleDownloadApk}
                  className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {effectiveLanguage === 'ru' 
                      ? "Скачать новый APK файл" 
                      : effectiveLanguage === 'en' 
                      ? "Download new APK file" 
                      : "Yangi APK Faylini Yuklab Olish"}
                  </span>
                </button>
              </div>
            )}

            {/* STATUS: DOWNLOADING / INSTALLING */}
            {status === 'downloading' && (
              <div className="py-6 space-y-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center animate-spin">
                  <RefreshCw className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-white">
                    {effectiveLanguage === 'ru' ? "Установка обновления..." : effectiveLanguage === 'en' ? "Installing update..." : "Yangilanish O'rnatilmoqda..."}
                  </h4>
                  <p className="text-[11px] text-slate-400">{progressText}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-teal-400 font-bold">{progress}%</div>
              </div>
            )}

            {/* STATUS: READY TO RESTART */}
            {status === 'ready_to_restart' && (
              <div className="py-4 space-y-4 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border-2 border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white">
                    {effectiveLanguage === 'ru' 
                      ? "Обновление Успешно Установлено!" 
                      : effectiveLanguage === 'en' 
                      ? "Update Successfully Installed!" 
                      : "Yangilanish Muvaffaqiyatli O'rnatildi!"}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {effectiveLanguage === 'ru'
                      ? "Нажмите кнопку ниже, чтобы перезапустить приложение и применить новые изменения."
                      : effectiveLanguage === 'en'
                      ? "Tap the button below to restart the app and activate new changes."
                      : "Yangi imkoniyatlar va o'zgarishlarni faollashtirish uchun ilovani qayta ishga tushiring."}
                  </p>
                </div>

                {/* RESTART BUTTON */}
                <button
                  onClick={handleRestartApp}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95 animate-pulse"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {effectiveLanguage === 'ru' 
                      ? "🔄 Перезапустить Приложение" 
                      : effectiveLanguage === 'en' 
                      ? "🔄 Restart Application" 
                      : "🔄 Qayta Ishga Tushirish (Restart)"}
                  </span>
                </button>
              </div>
            )}

            {/* Footer notice */}
            <div className="text-center pt-2 border-t border-slate-800 text-[10px] text-slate-500">
              {effectiveLanguage === 'ru'
                ? "Автоматическая система обновления USMWORLD"
                : effectiveLanguage === 'en'
                ? "USMWORLD Automated Update System"
                : "USMWORLD avtomatlashtirilgan yangilanish tizimi"}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
