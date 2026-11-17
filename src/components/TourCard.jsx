import React from 'react';
import { Star, MapPin, Clock, Plane, Calendar, ShieldCheck, Flame, ArrowRight } from 'lucide-react';

export default function TourCard({ tour, onSelect, onBook }) {
  const uzsRate = 12900; // 1 USD = 12,900 UZS
  const priceInUzs = Math.round((tour.price * uzsRate)).toLocaleString('uz-UZ');

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
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-600/90 backdrop-blur-md text-white rounded-lg shadow-sm">
            {tour.category}
          </span>
          {tour.discountPercent > 0 && (
            <span className="px-2 py-1 text-[11px] font-bold bg-rose-500/95 backdrop-blur-md text-white rounded-lg flex items-center gap-1 shadow-sm">
              <Flame className="w-3 h-3 fill-white" />
              -{tour.discountPercent}% Chegirma
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
              <span className="truncate">{tour.flightInfo?.split('(')[0] || 'Parvoz bor'}</span>
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
              Eng yaqin sana: <b className="text-slate-200">{tour.departureDates?.[0] || 'Har hafta'}</b>
            </span>
            <span className={`font-semibold ${tour.availableSeats <= 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {tour.availableSeats} ta joy qoldi
            </span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tur narxi:</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white">
                ${tour.price.toLocaleString()}
              </span>
              {tour.oldPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${tour.oldPrice}
                </span>
              )}
            </div>
            <div className="text-[10px] text-blue-400 font-medium">
              ≈ {priceInUzs} so'm
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(tour)}
              className="px-2.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
              title="Batafsil ma'lumot"
            >
              Batafsil
            </button>
            <button
              onClick={() => onBook(tour)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-1 active:scale-95"
            >
              <span>Bron qilish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
