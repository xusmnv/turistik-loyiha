import React, { useState } from 'react';
import { X, Star, MapPin, Clock, Plane, Calendar, CheckCircle2, ShieldCheck, Utensils, Hotel, ArrowRight, Share2, Flame } from 'lucide-react';

export default function TourDetailModal({ tour, onClose, onBook }) {
  if (!tour) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = tour.gallery && tour.gallery.length ? tour.gallery : [tour.image];
  const uzsRate = 12900;
  const priceInUzs = Math.round((tour.price * uzsRate)).toLocaleString('uz-UZ');

  // Calculate discount remaining time
  const getRemainingDiscountText = () => {
    if (!tour.discountUntil || !tour.discountPercent) return null;
    const diffMs = new Date(tour.discountUntil).getTime() - Date.now();
    if (diffMs <= 0) return null;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const untilDate = new Date(tour.discountUntil).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
    return `${days} kun qoldi (${untilDate}gacha)`;
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
                  -{tour.discountPercent}% CHEGIRMA
                </span>
              )}
              <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1 border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {tour.rating} ({tour.reviewsCount} sharh)
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
            <div className="flex gap-2 p-3 bg-slate-900/90 overflow-x-auto no-scrollbar border-b border-slate-800">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-slate-700 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Body Information */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Quick Details Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Davomiyligi</div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {tour.duration}
                </div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Mehmonxona</div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                  <Hotel className="w-3.5 h-3.5 text-amber-400" />
                  {tour.hotelStars}★ {tour.hotelName?.split(' ')[0]}
                </div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Ovqatlanish</div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                  <Utensils className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{tour.foodType}</span>
                </div>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Parvoz turi</div>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                  <Plane className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">To'g'ridan-to'g'ri</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">Tur haqida ma'lumot</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Flight info */}
            {tour.flightInfo && (
              <div className="bg-blue-950/40 border border-blue-800/40 p-3 rounded-xl flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-blue-200">Reys ma'lumoti: </span>
                  <span className="text-slate-300">{tour.flightInfo}</span>
                </div>
              </div>
            )}

            {/* What's included */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Narxga kiritilgan xizmatlar:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tour.includes?.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/40 p-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary (Daily program) */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Kunlik sayohat dasturi:
                </h4>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
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
              {tour.discountPercent > 0 ? "Chegirmali umumiy narx:" : "Umumiy narx:"}
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl font-black text-white">${tour.price.toLocaleString()}</span>
              {tour.oldPrice && (
                <span className="text-sm font-bold text-rose-400 line-through decoration-rose-500 decoration-2">
                  ${tour.oldPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-blue-400">({priceInUzs} so'm)</span>
            </div>
            {remainingText && (
              <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                ⏳ Chegirma muddati: {remainingText}
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
            <span>Bron qilish va To'lash</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
