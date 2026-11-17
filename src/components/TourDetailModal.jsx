import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Plane, Calendar, CheckCircle2, ShieldCheck, Utensils, Hotel, ArrowRight, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TourDetailModal({ tour, onClose, onBook }) {
  if (!tour) return null;

  const { t, effectiveLanguage } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = tour.gallery && tour.gallery.length ? tour.gallery : [tour.image];
  const numPrice = Number(tour?.price) || 0;
  const numOldPrice = tour?.oldPrice ? Number(tour.oldPrice) : null;
  const uzsRate = 12900;
  const priceInUzs = Math.round(numPrice * uzsRate).toLocaleString();

  // Calculate discount remaining time safely
  const getRemainingDiscountText = () => {
    try {
      if (!tour?.discountUntil || !tour?.discountPercent) return null;
      const targetTime = new Date(tour.discountUntil).getTime();
      if (isNaN(targetTime)) return null;
      const diffMs = targetTime - Date.now();
      if (diffMs <= 0) return null;
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const d = new Date(targetTime);
      const day = d.getDate();
      const monthIndex = d.getMonth();

      if (effectiveLanguage === 'ru') {
        const ruMonths = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        return `Осталось ${days} дн. (до ${day} ${ruMonths[monthIndex]})`;
      }
      if (effectiveLanguage === 'en') {
        const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days} days left (until ${enMonths[monthIndex]} ${day})`;
      }
      const uzMonths = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
      return `${days} kun qoldi (${day}-${uzMonths[monthIndex]}gacha)`;
    } catch (e) {
      return null;
    }
  };

  const remainingText = getRemainingDiscountText();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-2xl sm:rounded-3xl border border-slate-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Actions */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-slate-200 flex items-center justify-center hover:bg-slate-800 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 pb-24">
          {/* Main Image Banner */}
          <div className="relative aspect-[16/9] bg-slate-800">
            <img
              src={images[activeImageIndex]}
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

            <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg shadow">
                {tour.category}
              </span>
              {tour.discountPercent > 0 && (
                <span className="px-3 py-1 bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-black rounded-lg shadow flex items-center gap-1 animate-pulse">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  -{tour.discountPercent}% {t('discount').toUpperCase()}
                </span>
              )}
              <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1 border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {tour.rating} ({tour.reviewsCount})
              </span>
            </div>

            <div className="absolute bottom-3 left-4 right-4">
              <div className="flex items-center gap-1 text-blue-300 text-xs font-medium mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{tour.city}, {tour.country}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {tour.title}
              </h2>
            </div>
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="p-3 bg-slate-950 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-800">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Body Information */}
          <div className="p-5 space-y-5">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <Clock className="w-4 h-4 text-blue-400 mb-1" />
                <div className="text-[10px] text-slate-400">{t('days')}:</div>
                <div className="text-xs font-bold text-white">{tour.duration}</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <Plane className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-[10px] text-slate-400">Avia:</div>
                <div className="text-xs font-bold text-white truncate">{tour.flightInfo?.split('(')[0] || 'Parvoz'}</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <Hotel className="w-4 h-4 text-amber-400 mb-1" />
                <div className="text-[10px] text-slate-400">Mehmonxona:</div>
                <div className="text-xs font-bold text-white truncate">{tour.hotel || '4-5★ Lux'}</div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <Utensils className="w-4 h-4 text-purple-400 mb-1" />
                <div className="text-[10px] text-slate-400">Taom:</div>
                <div className="text-xs font-bold text-white truncate">{tour.mealPlan || 'All Inclusive'}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-white mb-1.5">Tur haqida to'liq ma'lumot:</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            {/* What's Included */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">{t('allInclusive')}:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tour.included?.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-800/40 p-2 rounded-lg border border-slate-700/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Sayohat dasturi kunbay:</h4>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-slate-800">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 z-10">
                        {item.day}
                      </div>
                      <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 flex-1">
                        <div className="text-xs font-bold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Dates */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Mavjud jo'nash sanalari:</h4>
              <div className="flex flex-wrap gap-2">
                {tour.departureDates?.map((date, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-blue-300 rounded-lg border border-slate-700 flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {date}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Booking Bar */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex items-center justify-between gap-4 z-30">
          <div>
            <div className="text-[11px] text-slate-400">
              {tour.discountPercent > 0 ? `${t('discount')} Narx:` : "Umumiy narx:"}
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl font-black text-white">${numPrice.toLocaleString()}</span>
              {numOldPrice !== null && (
                <span className="text-sm font-bold text-rose-400 line-through decoration-rose-500 decoration-2">
                  ${numOldPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-blue-400">({priceInUzs} so'm)</span>
            </div>
            {remainingText && (
              <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                ⏳ {remainingText}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onBook(tour);
            }}
            className="flex-1 max-w-xs py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <span>{t('bookNow')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
