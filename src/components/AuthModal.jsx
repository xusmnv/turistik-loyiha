import React, { useState } from 'react';
import { 
  Plane, Globe, ShieldCheck, Mail, Lock, User, 
  Sparkles, CheckCircle2, ArrowRight, AlertCircle, X, KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loginUser, registerUser } from '../services/auth';
import { useLanguage } from '../context/LanguageContext';
import PhoneInput from './PhoneInput';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, forceAuth = false }) {
  if (!isOpen) return null;

  const { t, effectiveLanguage } = useLanguage();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');

  // Status message
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Confetti helper
  const fireCelebration = (isAdmin) => {
    try {
      confetti({
        particleCount: isAdmin ? 120 : 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = loginUser(loginEmail, loginPassword);
      setLoading(false);
      if (res.success) {
        fireCelebration(res.isAdmin);
        onAuthSuccess(res.user);
        onClose();
      } else {
        // Localized error message
        let msg = res.error;
        if (res.error?.includes("ro'yxatdan o'tmagan")) {
          msg = effectiveLanguage === 'ru' 
            ? "Этот email не зарегистрирован! Пожалуйста, зарегистрируйтесь." 
            : effectiveLanguage === 'en' 
            ? "This email is not registered! Please register first." 
            : "Bunday email ro'yxatdan o'tmagan! Iltimos, avval ro'yxatdan o'ting.";
        } else if (res.error?.includes("parol xato")) {
          msg = effectiveLanguage === 'ru' 
            ? "Неверный email или пароль!" 
            : effectiveLanguage === 'en' 
            ? "Incorrect email or password!" 
            : "Email yoki parol xato!";
        }
        setErrorMsg(msg);
      }
    }, 600);
  };

  // Handle Register
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (regPassword.length < 6) {
      setErrorMsg(t('errShortPass'));
      return;
    }

    if (!regPhone || regPhone.trim().length < 6) {
      setErrorMsg(effectiveLanguage === 'ru' 
        ? "Пожалуйста, введите корректный номер телефона!" 
        : effectiveLanguage === 'en' 
        ? "Please enter a valid phone number!" 
        : "Iltimos, telefon raqamingizni to'liq kiriting!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone
      });
      setLoading(false);

      if (res.success) {
        fireCelebration(res.isAdmin);
        onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.error || t('errFillAll'));
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Background glowing flight elements */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Boarding Pass Card */}
      <div className="relative bg-slate-900 w-full sm:max-w-md rounded-3xl border border-blue-500/30 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
        
        {/* Close button (if not forced) */}
        {!forceAuth && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Animated Flight Ticket Top Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-5 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center overflow-hidden">
                <img 
                  src="/USMWORLD.png" 
                  alt="USMWORLD" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "/USMWORLD.jpg"; }}
                />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">
                  TRAVEL BOARDING PASS
                </span>
                <h3 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                  USMWORLD
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-blue-200 font-mono">GATE</span>
              <div className="text-sm font-black font-mono tracking-wider">A-2026</div>
            </div>
          </div>

          {/* Animated Airplane visual */}
          <div className="mt-3 flex items-center justify-between text-xs text-blue-100 font-semibold border-t border-white/15 pt-2">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {effectiveLanguage === 'ru' ? "Любой город мира" : effectiveLanguage === 'en' ? "Any City" : "Sizning shahringiz"}
            </span>
            <div className="flex items-center gap-1.5 text-blue-300">
              <span className="w-8 h-px bg-dashed border-b border-dashed border-blue-300"></span>
              <Plane className="w-4 h-4 text-white transform rotate-45 animate-bounce-soft" />
              <span className="w-8 h-px bg-dashed border-b border-dashed border-blue-300"></span>
            </div>
            <span className="flex items-center gap-1 text-emerald-300">
              {effectiveLanguage === 'ru' ? "Весь Мир 🌍" : effectiveLanguage === 'en' ? "Worldwide 🌍" : "Butun Dunyo 🌍"}
            </span>
          </div>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/60 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{t('tabLogin')}</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t('tabRegister')}</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-500/50 p-3 rounded-xl flex items-center gap-2 text-xs text-rose-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="pochta@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>{t('rememberMe')}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>{loading ? t('checking') : t('loginBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM with International Phone Input */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('fullNameLabel')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alisher Karimov"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="pochta@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Worldwide Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('phoneLabel')}
                </label>
                <PhoneInput
                  value={regPhone}
                  onChange={setRegPhone}
                  placeholder="90 123 45 67"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('newPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>{loading ? t('creating') : t('registerBtn')}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Guest browsing bypass */}
          <div className="pt-2 text-center border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 transition underline"
            >
              {t('guestMode')}
            </button>
          </div>
        </div>

        {/* Boarding pass bottom barcode simulation */}
        <div className="bg-slate-950 p-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>USMWORLD-SECURE-ID</span>
          <div className="tracking-[3px] font-bold text-slate-400">||| | |||| || ||| ||||</div>
          <span>VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
