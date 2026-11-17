import React, { useState } from 'react';
import { X, PhoneCall, Send, MapPin, Clock, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { AGENCY_INFO } from '../data/mockData';

export default function ContactConsultModal({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 9) {
      alert("Iltimos, ism va telefon raqamingizni to'liq kiriting!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-md rounded-3xl border border-slate-700 shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 overflow-hidden flex items-center justify-center">
              <img 
                src="/USMWORLD.png" 
                alt="USMWORLD" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = "/USMWORLD.jpg"; }}
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">USMWORLD Aloqa & Yordam</h3>
              <p className="text-[11px] text-blue-400">24/7 Avtomatlashtirilgan konsultatsiya</p>
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
            <h4 className="text-base font-bold text-white">So'rovingiz Qabul Qilindi!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              USMWORLD turizm operatori 10 daqiqa ichida siz bilan bog'lanib, eng maqbul sayohat takliflarini taqdim etadi.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Yopish
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick contact channels */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href={`tel:${AGENCY_INFO.phone}`}
                className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-2xl border border-slate-700/60 flex items-center gap-2.5 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Qo'ng'iroq:</span>
                  <span className="font-bold text-white text-[11px] truncate block">{AGENCY_INFO.phone}</span>
                </div>
              </a>

              <a
                href={`https://t.me/${AGENCY_INFO.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-2xl border border-slate-700/60 flex items-center gap-2.5 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Telegram:</span>
                  <span className="font-bold text-white text-[11px] truncate block">{AGENCY_INFO.telegram}</span>
                </div>
              </a>
            </div>

            {/* Address */}
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Bosh Ofis Manzili:</span>
              </div>
              <p className="text-[11px] text-slate-400">{AGENCY_INFO.address}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <Clock className="w-3 h-3" />
                <span>{AGENCY_INFO.workHours}</span>
              </div>
            </div>

            {/* Request consultation form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 pt-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                Tezkor bepul konsultatsiya olish:
              </h4>

              <input
                type="text"
                required
                placeholder="Ismingiz"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <input
                type="tel"
                required
                placeholder="Telefon raqamingiz (+998 ...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <textarea
                rows="2"
                placeholder="Qaysi davlat yoki tur paketi qiziqtiryapti?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
              >
                Menga Qo'ng'iroq Qiling
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
