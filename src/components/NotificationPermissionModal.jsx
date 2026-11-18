import React, { useState, useEffect } from 'react';
import { Bell, Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationPermissionModal() {
  const { effectiveLanguage } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const prompted = localStorage.getItem('usmworld_notif_prompted');
      // If never prompted and browser supports notifications
      if (!prompted && typeof Notification !== 'undefined' && Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleAllowNotifications = async () => {
    try {
      localStorage.setItem('usmworld_notif_prompted', 'true');
      if (typeof Notification !== 'undefined') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Send welcome test notification
          new Notification("USMWORLD Travel", {
            body: effectiveLanguage === 'ru' 
              ? "Уведомления успешно включены! Вы будете вовремя получать коды и обновления."
              : effectiveLanguage === 'en'
              ? "Notifications enabled! You will receive SMS codes and travel alerts."
              : "Bildirishnomalar muvaffaqiyatli yoqildi! SMS kodlar va reys xabarlarini o'z vaqtida olasiz.",
            icon: "/USMWORLD.png",
            badge: "/USMWORLD.png"
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
    setShowModal(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('usmworld_notif_prompted', 'true');
    } catch (e) {}
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border-2 border-blue-500/50 rounded-3xl p-5 sm:p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
        
        {/* Close icon */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Animated Bell with Pulsing Ring */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/30">
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
          </span>
          <Bell className="w-8 h-8 animate-bounce-soft" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-white">
            {effectiveLanguage === 'ru'
              ? "Разрешить уведомления?"
              : effectiveLanguage === 'en'
              ? "Enable Notifications?"
              : "Bildirishnomalarni Yoqish"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {effectiveLanguage === 'ru'
              ? "Включите уведомления, чтобы вовремя получать SMS-коды подтверждения, статус билетов, ваучеры и спецпредложения."
              : effectiveLanguage === 'en'
              ? "Enable notifications to receive SMS verification codes, booking vouchers, flight updates and exclusive deals."
              : "SMS tasdiqlash kodlari, reys vaqtlari, vaucherlar va maxsus chegirmalardan xabardor bo'lib turish uchun bildirishnomalarga ruxsat bering."}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleAllowNotifications}
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>
              {effectiveLanguage === 'ru' 
                ? "Включить / Разрешить" 
                : effectiveLanguage === 'en' 
                ? "Enable Notifications" 
                : "Yoqish va Ruxsat Berish"}
            </span>
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
          >
            {effectiveLanguage === 'ru' ? "Позже" : effectiveLanguage === 'en' ? "Later" : "Keyinroq"}
          </button>
        </div>

      </div>
    </div>
  );
}
