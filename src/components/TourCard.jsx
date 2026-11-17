import React from 'react';
import { Star, MapPin, Clock, Plane, Calendar, Flame, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function TourCard({ tour, onSelect, onBook }) {
  const { t, effectiveLanguage } = useLanguage();
  const numPrice = Number(tour?.price) || 0;
  const numOldPrice = tour?.oldPrice ? Number(tour.oldPrice) : null;
  const uzsRate = 12900; // 1 USD = 12,900 UZS
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
    <div className="group relative bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-blue-500/50 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/10 flex flex-col">
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Category & Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-600/90 backdrop-blur-md text-white rounded-lg shadow-sm">
              {tour.category}
            </span>
            {tour.discountPercent > 0 && (
              <span className="px-2 py-1 text-[11px] font-extrabold bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded-lg flex items-center gap-1 shadow-md shadow-rose-900/40 animate-pulse">
                <Flame className="w-3 h-3 fill-white" />
                -{tour.discountPercent}% {t('discount').toUpperCase()}
              </span>
            )}
          </div>
          {remainingText && (
            <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-950/90 backdrop-blur-md text-amber-300 rounded border border-amber-500/40">
              ⏳ {remainingText}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2.5 right-2.5 px-2 py-1 text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-amber-400 rounded-lg flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{tour.rating}</span>
          <span className="text-[9px] text-slate-400">({tour.reviewsCount})</span>
        </div>

        {/* Location & Title over image */}
        <div className="absolute bottom-2.5 left-3 right-3">
          <div className="flex items-center gap-1 text-[12px] text-blue-300 font-medium mb-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{tour.city}, {tour.country}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-tight line-clamp-1 group-hover:text-blue-200 transition-colors">
            {tour.title}
          </h3>
        </div>
      </div>

      {/* Tour Specifications */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2 mb-3">
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/50">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1.5 rounded-lg border border-slate-700/50">
              <Plane className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{tour.flightInfo?.split('(')[0] || 'Parvoz'}</span>
            </div>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2">
            {tour.description}
          </p>

          {/* Seats left indicator */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-200">{tour.departureDates?.[0] || '2026'}</span>
            </span>
            <span className={`font-semibold ${tour.availableSeats <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {tour.availableSeats} {t('seatsLeft')}
            </span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">
              {tour.discountPercent > 0 ? `${t('discount')}:` : "Narx:"}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">
                ${numPrice.toLocaleString()}
              </span>
              {numOldPrice !== null && (
                <span className="text-xs text-rose-400 font-bold line-through decoration-rose-500 decoration-2">
                  ${numOldPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-[10px] text-blue-400 font-medium">
              ≈ {priceInUzs} so'm
            </div>
            {remainingText && (
              <div className="text-[9px] text-amber-400 font-semibold mt-0.5">
                ⏳ {remainingText}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(tour)}
              className="px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
              title={t('details')}
            >
              {t('details')}
            </button>
            <button
              onClick={() => onBook(tour)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-1 active:scale-95"
            >
              <span>{t('bookNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
