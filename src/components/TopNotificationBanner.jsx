import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, Copy, X, Smartphone, ArrowDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TopNotificationBanner() {
  const { effectiveLanguage } = useLanguage();
  const [notification, setNotification] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleSmsEvent = (e) => {
      const { code, phone, context } = e.detail || {};
      if (!code) return;

      // Play soft vibration if supported
      try {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (err) {}

      // Fire native browser / Android push notification if granted
      try {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification("USMWORLD SMS Xabarnoma", {
            body: `Sizning tasdiqlash kodingiz: ${code}`,
            icon: "/USMWORLD.png",
            badge: "/USMWORLD.png",
            tag: "usmworld-sms"
          });
        }
      } catch (err) {}

      setNotification({
        code,
        phone: phone || '',
        context: context || 'Tasdiqlash kodi',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setCopied(false);

      // Auto dismiss after 9 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 9000);

      return () => clearTimeout(timer);
    };

    window.addEventListener('usmworld_sms_received', handleSmsEvent);
    return () => window.removeEventListener('usmworld_sms_received', handleSmsEvent);
  }, []);

  if (!notification) return null;

  const handleAutoFill = () => {
    try {
      navigator.clipboard?.writeText(notification.code);
    } catch (e) {}

    setCopied(true);
    // Dispatch auto-fill event to inputs
    window.dispatchEvent(new CustomEvent('usmworld_sms_autofill', { 
      detail: { code: notification.code } 
    }));

    setTimeout(() => {
      setNotification(null);
    }, 1200);
  };

  return (
    <div className="fixed top-2 inset-x-2 sm:inset-x-auto sm:right-4 sm:max-w-md z-[100] animate-slide-down">
      <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-blue-500/70 rounded-3xl p-3.5 shadow-2xl shadow-blue-900/40 text-white space-y-2.5 ring-2 ring-blue-500/20">
        
        {/* Top Header of Notification */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
              <img src="/USMWORLD.png" alt="USMWORLD" className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
              USMWORLD SMS • {notification.timestamp}
            </span>
          </div>

          <button
            onClick={() => setNotification(null)}
            className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message body */}
        <div className="flex items-start gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-xs text-slate-200">
              {effectiveLanguage === 'ru'
                ? <>Ваш проверочный код: <b className="text-base text-emerald-400 font-mono tracking-widest">{notification.code}</b>. Не сообщайте его никому.</>
                : effectiveLanguage === 'en'
                ? <>Your verification code is: <b className="text-base text-emerald-400 font-mono tracking-widest">{notification.code}</b>. Do not share with anyone.</>
                : <>Sizning tasdiqlash kodingiz: <b className="text-base text-emerald-400 font-mono tracking-widest">{notification.code}</b>. Ushbu kodni hech kimga bermang.</>}
            </p>
          </div>
        </div>

        {/* Auto-fill Action Button */}
        <div className="flex gap-2">
          <button
            onClick={handleAutoFill}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{effectiveLanguage === 'ru' ? "Код Вставлен ✓" : effectiveLanguage === 'en' ? "Code Inserted ✓" : "Kod Kiritildi ✓"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{effectiveLanguage === 'ru' ? "Вставить код автоматически" : effectiveLanguage === 'en' ? "Auto-fill code" : "Avtomatik Kiritish (Auto-fill)"}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
