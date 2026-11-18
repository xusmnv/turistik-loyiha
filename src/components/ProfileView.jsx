import React, { useState, useRef } from 'react';
import { 
  User, Phone, Mail, Camera, Upload, Check, Moon, Sun, Globe, 
  Bell, ShieldCheck, Crown, RefreshCw, LogOut, Sparkles, AlertCircle 
} from 'lucide-react';
import { updateUserProfile, isUserAdmin } from '../services/auth';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getInstalledVersion } from '../services/updater';

const AVATAR_EMOJIS = ['✈️', '🌍', '🌴', '👑', '💎', '🦁', '🚀', '🧭', '🌟', '🏖️'];

export default function ProfileView({ 
  currentUser, 
  onUserUpdated, 
  onLogout, 
  onCheckUpdate 
}) {
  const { t, effectiveLanguage, currentLanguage, changeLanguage } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  // Profile form states
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+998 ');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '✈️');
  const [photo, setPhoto] = useState(currentUser?.photo || null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera stream for profile selfie
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const isAdmin = isUserAdmin(currentUser);

  // Start selfie camera for profile picture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 400 }, height: { ideal: 400 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      alert("Kameraga ruxsat berilmadi yoki kamera topilmadi. Fayldan rasm yuklashingiz mumkin.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 300, 300);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhoto(dataUrl);
      stopCamera();
    }
  };

  // Upload photo from device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = updateUserProfile(currentUser.id, {
        name,
        phone,
        avatar,
        photo
      });

      setIsSaving(false);
      if (res.success) {
        setSavedSuccess(true);
        onUserUpdated?.(res.user);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setErrorMessage(res.error || "Xatolik yuz berdi");
      }
    }, 400);
  };

  // Send a test top notification
  const handleTestNotification = () => {
    const testCode = Math.floor(1000 + Math.random() * 9000).toString();
    window.dispatchEvent(new CustomEvent('usmworld_sms_received', {
      detail: {
        code: testCode,
        phone: phone || '+998 90 123 45 67',
        context: 'Profil sinovi'
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Profile Summary Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-400 bg-slate-900 shadow-xl flex items-center justify-center">
              {photo ? (
                <img src={photo} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{avatar}</span>
              )}
            </div>

            {/* Quick change camera button */}
            <button
              type="button"
              onClick={startCamera}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition active:scale-95"
              title="Kamera orqali rasmga olish"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-white">{name || "Mehmon"}</h2>
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold flex items-center gap-1 border border-amber-400/30 text-[10px]">
                  <Crown className="w-3 h-3 text-amber-400" />
                  <span>Bosh Admin</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-[10px]">
                  Sayohatchi
                </span>
              )}
            </div>
            <p className="text-xs text-blue-200 font-mono">{currentUser?.email || 'email@usmworld.uz'}</p>
            <p className="text-xs text-slate-300">{phone || "Telefon kiritilmagan"}</p>
          </div>
        </div>
      </div>

      {/* Live Camera Modal (if active) */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500 rounded-3xl p-5 max-w-sm w-full space-y-3 text-center">
            <h4 className="text-sm font-bold text-white">Profil uchun rasmga oling</h4>
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-500 relative bg-black">
              <video ref={videoRef} playsInline autoPlay muted className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={captureCameraPhoto}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow"
              >
                Suratga Olish
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: PROFILE EDITING */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-blue-400" />
          <span>Profil Ma'lumotlarini Tahrirlash</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          {/* Avatar Emojis Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Avatarni tanlang:</label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {AVATAR_EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => {
                    setAvatar(em);
                    setPhoto(null);
                  }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition ${
                    avatar === em && !photo 
                      ? 'bg-blue-600 scale-110 shadow-md shadow-blue-500/30' 
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}

              {/* Gallery upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Galereyadan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">To'liq ismingiz:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Telefon raqamingiz:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Profil o'zgarishlari muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saqlanmoqda..." : "O'zgarishlarni Saqlash"}
          </button>
        </form>
      </div>

      {/* SECTION 2: APP SETTINGS (THEME, LANGUAGE, NOTIFICATIONS) */}
      <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Ilova Sozlamalari</span>
        </h3>

        {/* 1. Theme Toggle (Dark / Light) */}
        <div className="flex items-center justify-between p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-amber-300">
              {isDark ? <Moon className="w-4 h-4 text-blue-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">Mavzu Rejimi: {isDark ? "Qora fon (Dark)" : "Oq fon (Light)"}</div>
              <p className="text-[10px] text-slate-400">Ko'zingizga qulay bo'lgan rang palitrasi</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
          >
            <span>{isDark ? "☀️ Oq fonga o'tish" : "🌙 Qora fonga o'tish"}</span>
          </button>
        </div>

        {/* 2. Language Switcher */}
        <div className="p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Ilova Tili:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {[
              { id: 'uz', label: "🇺🇿 O'zbekcha" },
              { id: 'ru', label: "🇷🇺 Русский" },
              { id: 'en', label: "🇬🇧 English" },
              { id: 'auto', label: "📱 Qurilma tili" }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => changeLanguage(lang.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition text-center ${
                  currentLanguage === lang.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Push Notifications & Test Top SMS Banner */}
        <div className="flex items-center justify-between p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Push Bildirishnomalar & SMS</div>
              <p className="text-[10px] text-slate-400">SMS kod tepadan bildirishnoma bo'lib tushadi</p>
            </div>
          </div>

          <button
            onClick={handleTestNotification}
            className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 hover:text-white text-[11px] font-bold border border-blue-500/40 transition active:scale-95"
            title="Sinov xabarnomasini chaqirish"
          >
            Sinov (Test SMS)
          </button>
        </div>

        {/* 4. App Version & In-App Update Trigger */}
        <div className="flex items-center justify-between p-3.5 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div>
            <div className="text-xs font-bold text-white">Ilova Versiyasi</div>
            <p className="text-[10px] text-emerald-400 font-mono">v{getInstalledVersion()} (Rasmiy Release)</p>
          </div>

          <button
            onClick={onCheckUpdate}
            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Yangilanishni Tekshirish</span>
          </button>
        </div>

        {/* Logout button */}
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Hisobdan Chiqish</span>
          </button>
        </div>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
