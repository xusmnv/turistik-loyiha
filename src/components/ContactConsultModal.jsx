import React, { useState } from 'react';
import { X, PhoneCall, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { createFeedback } from '../services/db';
import { useLanguage } from '../context/LanguageContext';
import PhoneInput from './PhoneInput';

export default function ContactConsultModal({ onClose }) {
  const { t, effectiveLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [feedbackType, setFeedbackType] = useState('Taklif'); // 'Taklif', 'Shikoyat', 'Savol'
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 6 || !message.trim()) {
      alert(effectiveLanguage === 'ru' 
        ? "Пожалуйста, заполните ваше имя, номер телефона и текст сообщения!" 
        : effectiveLanguage === 'en' 
        ? "Please enter your name, phone number and message!" 
        : "Iltimos, ismingiz, telefon raqamingiz va xabaringizni to'liq kiriting!");
      return;
    }

    // Save directly to Admin database
    createFeedback({
      name,
      phone,
      type: feedbackType,
      message
    });

    setSubmitted(true);
  };

  const getFeedbackLabel = (type) => {
    if (type === 'Taklif') return t('suggestion');
    if (type === 'Shikoyat') return t('complaint');
    return t('question');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-md rounded-3xl border border-slate-700 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 overflow-hidden flex items-center justify-center shadow-md">
              <img 
                src="/USMWORLD.png" 
                alt="USMWORLD" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/USMWORLD.jpg"; }}
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{t('contactTitle')}</h3>
              <p className="text-[11px] text-blue-400">{t('contactSubtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">{t('feedbackSuccessTitle')}</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {t('feedbackSuccessDesc')}
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick direct contact channels */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Call: Number is hidden from UI, opens dialer with +998990738859 */}
              <a
                href="tel:+998990738859"
                className="bg-emerald-950/30 hover:bg-emerald-950/50 p-3 rounded-2xl border border-emerald-500/30 flex items-center gap-2.5 transition group"
                title="Qo'ng'iroq qilish"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-emerald-400 block font-semibold">{t('call')}:</span>
                  <span className="font-bold text-white text-xs truncate block">{t('callNow')}</span>
                </div>
              </a>

              {/* Telegram: Directly opens private chat @xusmnv */}
              <a
                href="https://t.me/xusmnv"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-950/30 hover:bg-sky-950/50 p-3 rounded-2xl border border-sky-500/30 flex items-center gap-2.5 transition group"
                title="Telegram shaxsiy profilga yozish"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                  <Send className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-sky-400 block font-semibold">Telegram:</span>
                  <span className="font-bold text-white text-xs truncate block">@xusmnv</span>
                </div>
              </a>
            </div>

            {/* Feedback / Complaint / Proposal Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  {t('contactSubtitle')}:
                </span>
              </div>

              {/* Type selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs">
                {['Taklif', 'Shikoyat', 'Savol'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setFeedbackType(type)}
                    className={`py-1.5 rounded-lg font-bold text-xs transition ${
                      feedbackType === type
                        ? type === 'Shikoyat'
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {getFeedbackLabel(type)}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t('yourName')}</label>
                  <input
                    type="text"
                    required
                    placeholder="Alisher Karimov"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">{t('yourPhone')}</label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    placeholder="90 123 45 67"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  {feedbackType === 'Shikoyat' ? t('complaint') : feedbackType === 'Taklif' ? t('suggestion') : t('question')}:
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder={
                    feedbackType === 'Shikoyat' 
                      ? (effectiveLanguage === 'ru' ? "Опишите проблему, с которой вы столкнулись..." : effectiveLanguage === 'en' ? "Describe the issue you encountered..." : "Qanday kamchilik yoki noqulaylikka duch keldingiz? Yozib qoldiring...")
                      : (effectiveLanguage === 'ru' ? "Ваши предложения по улучшению сервиса..." : effectiveLanguage === 'en' ? "Your suggestions or feedback..." : "Xizmatimizni yaxshilash bo'yicha fikr va takliflaringiz...")
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('sendBtn')}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
