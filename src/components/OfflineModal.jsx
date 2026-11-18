import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OfflineModal() {
  const { effectiveLanguage } = useLanguage();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);

  // Check actual network connectivity by pinging local version file or network
  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // First check navigator
      if (!navigator.onLine) {
        setIsOffline(true);
        setIsChecking(false);
        return false;
      }

      // Try quick cache-busting fetch to verify actual internet connectivity
      const response = await fetch(`/version.json?_t=${Date.now()}`, { 
        method: 'HEAD',
        cache: 'no-store'
      });
      if (response.ok || response.status === 304 || response.status === 200) {
        setIsOffline(false);
        setIsChecking(false);
        return true;
      }
    } catch (e) {
      // If fetch fails, we may still be offline
      if (!navigator.onLine) {
        setIsOffline(true);
      }
    }
    setIsChecking(false);
    return navigator.onLine;
  };

  useEffect(() => {
    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkConnection();

    // Check periodically every 6 seconds
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        setIsOffline(true);
      }
    }, 6000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl shadow-rose-950/50">
        
        {/* Pulsing WiFi-Off Icon with warning rings */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-inner">
          <span className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
          <WifiOff className="w-10 h-10 relative z-10 animate-bounce-soft" />
        </div>

        {/* Warning Texts */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              {effectiveLanguage === 'ru' 
                ? "Нет связи" 
                : effectiveLanguage === 'en' 
                ? "No Connection" 
                : "Aloqa uzildi"}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            {effectiveLanguage === 'ru' 
              ? "Нет подключения к интернету!" 
              : effectiveLanguage === 'en' 
              ? "No Internet Connection!" 
              : "Internet Aloqasi Yo'q!"}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {effectiveLanguage === 'ru' 
              ? "Для работы USMWORLD, просмотра туров и онлайн бронирования требуется подключение к сети. Включите Wi-Fi или мобильный интернет."
              : effectiveLanguage === 'en'
              ? "USMWORLD requires an active internet connection to load tours, bookings, and travel services. Please enable Wi-Fi or cellular data."
              : "USMWORLD turizm xizmatlari, yangi turlar va bron qilish tizimi ishlashi uchun internet talab etiladi. Iltimos, Wi-Fi yoki mobil internetingizni yoqing."}
          </p>
        </div>

        {/* Retry Button */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>
              {isChecking
                ? (effectiveLanguage === 'ru' ? "Проверка сети..." : effectiveLanguage === 'en' ? "Checking network..." : "Aloqa tekshirilmoqda...")
                : (effectiveLanguage === 'ru' ? "Повторить попытку" : effectiveLanguage === 'en' ? "Retry Connection" : "Qayta Tekshirish")}
            </span>
          </button>

          <p className="text-[10px] text-slate-500 animate-pulse">
            {effectiveLanguage === 'ru'
              ? "При появлении интернета приложение возобновит работу автоматически..."
              : effectiveLanguage === 'en'
              ? "The app will resume automatically once connected..."
              : "Internet yoqilishi bilan tizim avtomatik ochiladi..."}
          </p>
        </div>

      </div>
    </div>
  );
}
