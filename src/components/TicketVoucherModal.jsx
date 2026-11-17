import React from 'react';
import { X, Printer, Plane, Calendar, User, ShieldCheck, MapPin, QrCode, CheckCircle, Download } from 'lucide-react';
import { AGENCY_INFO } from '../data/mockData';

export default function TicketVoucherModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">
              ELEKTRON VAUCHER
            </span>
            <span className="text-xs text-slate-400 font-mono">#{order.orderNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
              title="Vaucherni chop etish / PDF"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Chop etish / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable area) */}
        <div id="voucher-print-area" className="p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Header branding */}
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
                <h3 className="text-base font-extrabold text-white tracking-wide">USMWORLD TRAVEL</h3>
                <p className="text-[10px] text-blue-400">Rasmiy sayohat va turizm vaucheri</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black rounded-lg uppercase">
                {order.paymentStatus === 'paid' ? 'TO\'LANGAN / PAID' : 'KUTILMOQDA'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                KOD: {order.ticketCode}
              </div>
            </div>
          </div>

          {/* Tour info box */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider">Tur yo'nalishi:</div>
            <h4 className="text-lg font-bold text-white leading-tight">
              {order.tourTitle}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Jo'nash: <b>{order.travelDate}</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <User className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Yo'lovchilar: <b>{order.travelersCount} kishi</b></span>
              </div>
            </div>
          </div>

          {/* Passenger details & Biometric Face ID */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Face ID Photo */}
            <div className="sm:w-28 flex flex-col items-center justify-center p-2.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 shrink-0">
              <div className="w-20 h-24 rounded-xl overflow-hidden bg-slate-900 border border-blue-500/30 flex items-center justify-center relative shadow-inner">
                {order.facePhoto ? (
                  <img src={order.facePhoto} alt="Sayohatchi Face ID" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                    <User className="w-8 h-8 text-blue-400 mb-1" />
                    <span className="text-[8px] text-slate-400">Rasm yo'q</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-blue-600/80 text-[8px] text-white font-bold text-center py-0.5 backdrop-blur-xs">
                  BIOMETRIC
                </div>
              </div>
              <span className="text-[9px] text-emerald-400 font-semibold mt-1 flex items-center gap-0.5">
                <CheckCircle className="w-2.5 h-2.5" /> Face ID ✓
              </span>
            </div>

            {/* Passenger Info Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] text-slate-400">Sayohatchi F.I.SH:</span>
                <div className="text-xs font-bold text-white mt-0.5">{order.customerName}</div>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] text-slate-400">Pasport seriya / raqam:</span>
                <div className="text-xs font-bold text-blue-300 font-mono mt-0.5">{order.passportNumber}</div>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] text-slate-400">Telefon (SMS tasdiqlangan):</span>
                <div className="text-xs font-semibold text-emerald-300 mt-0.5 flex items-center gap-1">
                  <span>{order.phone}</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded">SMS ✓</span>
                </div>
              </div>
              <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
                <span className="text-[10px] text-slate-400">To'lov holati & Usuli:</span>
                <div className="text-xs font-bold text-emerald-400 uppercase mt-0.5">
                  {order.paymentMethod} (${order.totalPrice})
                </div>
              </div>
            </div>
          </div>

          {/* Additional details: Insurance & VIP */}
          <div className="bg-blue-950/20 p-3 rounded-xl border border-blue-900/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Tibbiy sug'urta:
              </span>
              <span className="font-semibold text-emerald-400">
                {order.hasInsurance ? "Rasmiylashtirilgan ✓" : "Kiritilmagan"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-blue-400" />
                VIP Aeroport transferi:
              </span>
              <span className="font-semibold text-blue-400">
                {order.hasVipTransfer ? "Kiritilgan ✓" : "Standart"}
              </span>
            </div>
          </div>

          {/* QR Code & Official stamp representation */}
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              {/* Simulated QR Code */}
              <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-1 rounded-lg">
                  <div className="grid grid-cols-4 gap-1 w-full h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${i % 2 === 0 || i % 5 === 0 ? 'bg-white' : 'bg-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-white">QR Tekshiruv Kodingiz</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Aeroportda va mehmonxonaga joylashishda ushbu QR kodni ko'rsatishingiz kifoya.
                </div>
              </div>
            </div>

            {/* Stamp */}
            <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-dashed border-blue-500/60 text-blue-400 p-1 text-center rotate-[-12deg]">
              <span className="text-[8px] font-black tracking-widest uppercase">USMWORLD</span>
              <span className="text-[7px] text-emerald-400 font-bold">APPROVED</span>
              <span className="text-[7px] text-slate-400">2026/2027</span>
            </div>
          </div>

          {/* Agency Footer info */}
          <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-800/80">
            <p>{AGENCY_INFO.fullName} • Tel: {AGENCY_INFO.phone}</p>
            <p>{AGENCY_INFO.address}</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Vaucherni Saqlash (PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
