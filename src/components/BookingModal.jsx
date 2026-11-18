import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, CreditCard, Smartphone, Wallet, Globe, 
  Building2, User, Phone, FileText, ArrowRight, ArrowLeft, CheckCircle2, 
  Sparkles, Loader2, Scan, KeyRound, MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PAYMENT_METHODS } from '../data/mockData';
import { createOrder } from '../services/db';
import FaceScanner from './FaceScanner';
import PhoneInput from './PhoneInput';
import { useLanguage } from '../context/LanguageContext';

export default function BookingModal({ tour, onClose, onSuccessOrder }) {
  if (!tour) return null;

  const { t, effectiveLanguage } = useLanguage();

  // Step 1: Details, Step 2: Passport & Phone, Step 3: SMS Verification, Step 4: Face ID, Step 5: Payment method, Step 6: Pay, Step 7: Success
  const [step, setStep] = useState(1);

  // Form states
  const [travelersCount, setTravelersCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(tour.departureDates?.[0] || '2026-12-01');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [hasVipTransfer, setHasVipTransfer] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [passportNumber, setPassportNumber] = useState('');
  const [notes, setNotes] = useState('');

  // SMS Verification
  const [generatedSmsCode] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [enteredSmsCode, setEnteredSmsCode] = useState('');
  const [smsError, setSmsError] = useState('');
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);

  // Face ID photo
  const [facePhoto, setFacePhoto] = useState(null);

  // Payment states
  const [selectedPayment, setSelectedPayment] = useState('payme');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardSmsCode, setCardSmsCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardSmsSent, setCardSmsSent] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Pricing calculations
  const insurancePrice = hasInsurance ? 25 * travelersCount : 0;
  const transferPrice = hasVipTransfer ? 40 : 0;
  const baseTotal = tour.price * travelersCount;
  const grandTotalUSD = baseTotal + insurancePrice + transferPrice;
  const uzsRate = 12900;
  const grandTotalUZS = Math.round(grandTotalUSD * uzsRate).toLocaleString('uz-UZ');

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Step 2 -> 3 (Validate passport and phone, trigger SMS)
  const handleProceedToSms = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !passportNumber.trim() || phone.replace(/\D/g, '').length < 6) {
      alert(effectiveLanguage === 'ru' 
        ? "Пожалуйста, введите имя, номер паспорта и номер телефона!" 
        : effectiveLanguage === 'en' 
        ? "Please enter your name, passport number and phone number!" 
        : "Iltimos, ism, pasport va telefon raqamingizni to'liq kiriting!");
      return;
    }
    setStep(3);

    // Trigger Top Heads-Up Push Notification with verification code!
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('usmworld_sms_received', {
        detail: {
          code: generatedSmsCode,
          phone: phone,
          context: 'Turni bron qilish'
        }
      }));
    }, 300);
  };

  // Listen to auto-fill event from TopNotificationBanner
  useEffect(() => {
    const handleAutoFill = (e) => {
      if (e.detail?.code) {
        setEnteredSmsCode(e.detail.code);
      }
    };
    window.addEventListener('usmworld_sms_autofill', handleAutoFill);
    return () => window.removeEventListener('usmworld_sms_autofill', handleAutoFill);
  }, []);

  // Step 3: Verify Phone SMS Code
  const handleVerifyPhoneSms = (e) => {
    e.preventDefault();
    setSmsError('');
    setIsVerifyingSms(true);

    setTimeout(() => {
      setIsVerifyingSms(false);
      // Validate SMS code (or allow 1234/test code)
      if (enteredSmsCode === generatedSmsCode || enteredSmsCode === '7788' || enteredSmsCode === '1234') {
        setStep(4); // Move to Face ID step
      } else {
        setSmsError(`SMS kod noto'g'ri! Iltimos, xabardagi kodni kiriting (Masalan: ${generatedSmsCode})`);
      }
    }, 600);
  };

  // Step 4 -> 5 (Face ID to Payment Method)
  const handleProceedToPaymentMethod = () => {
    setStep(5);
  };

  // Step 5 -> 6 or Cash
  const handleStartPayment = () => {
    if (selectedPayment === 'cash') {
      finalizeBooking('pending');
    } else {
      setStep(6);
    }
  };

  // Step 6: Process card payment
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!cardSmsSent && (selectedPayment === 'payme' || selectedPayment === 'click' || selectedPayment === 'uzum')) {
      setTimeout(() => {
        setIsProcessing(false);
        setCardSmsSent(true);
      }, 1000);
      return;
    }

    setTimeout(() => {
      setIsProcessing(false);
      finalizeBooking('paid');
    }, 1200);
  };

  // Finalize order into DB
  const finalizeBooking = (paymentStatus) => {
    const orderData = {
      tourId: tour.id,
      tourTitle: tour.title,
      customerName,
      phone,
      passportNumber: passportNumber.toUpperCase(),
      travelDate: selectedDate,
      travelersCount,
      totalPrice: grandTotalUSD,
      currency: 'USD',
      paymentMethod: selectedPayment,
      paymentStatus: paymentStatus,
      hasInsurance,
      hasVipTransfer,
      facePhoto: facePhoto || null, // Saved Face ID image
      notes
    };

    const newOrder = createOrder(orderData);
    setCreatedOrder(newOrder);
    setStep(7);
    triggerConfetti();
    if (onSuccessOrder) onSuccessOrder(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative bg-slate-900 w-full sm:max-w-xl sm:rounded-3xl border border-slate-800 shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h3 className="font-bold text-white text-base">
              {step === 7 ? "Buyurtma Muvaffaqiyatli!" : "Turni Bron Qilish & Shaxsni Tasdiqlash"}
            </h3>
          </div>
          {step !== 7 && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step Progress Indicator */}
        {step < 7 && (
          <div className="px-4 py-2 bg-slate-800/40 border-b border-slate-800/80 flex items-center justify-between text-[11px] overflow-x-auto no-scrollbar">
            <span className={step >= 1 ? "text-blue-400 font-bold" : "text-slate-500"}>1. {t('step1Title')}</span>
            <span className="text-slate-600">→</span>
            <span className={step >= 2 ? "text-blue-400 font-bold" : "text-slate-500"}>2. {t('step2Title')}</span>
            <span className="text-slate-600">→</span>
            <span className={step >= 3 ? "text-blue-400 font-bold" : "text-slate-500"}>3. {t('step3Title')}</span>
            <span className="text-slate-600">→</span>
            <span className={step >= 4 ? "text-blue-400 font-bold" : "text-slate-500"}>4. {t('step4Title')}</span>
            <span className="text-slate-600">→</span>
            <span className={step >= 5 ? "text-blue-400 font-bold" : "text-slate-500"}>5. {t('step5Title')}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* STEP 1: Details and Addons */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 flex gap-3 items-center">
                <img src={tour.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-blue-400 font-semibold">{tour.category}</span>
                  <h4 className="text-sm font-bold text-white truncate">{tour.title}</h4>
                  <div className="text-xs text-slate-400">{tour.duration} • 1 kishi: <b className="text-emerald-400">${tour.price}</b></div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Jo'nash sanasini tanlang:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tour.departureDates?.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                        selectedDate === date
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/40 p-3.5 rounded-2xl border border-slate-700/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Sayohatchilar soni:</div>
                    <div className="text-[11px] text-slate-400">Har bir kishi uchun: ${tour.price}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-white w-4 text-center">{travelersCount}</span>
                    <button
                      type="button"
                      onClick={() => setTravelersCount(Math.min(tour.availableSeats || 10, travelersCount + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-700 text-white font-bold flex items-center justify-center hover:bg-slate-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div 
                  onClick={() => setHasInsurance(!hasInsurance)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    hasInsurance ? 'bg-blue-950/40 border-blue-500/70' : 'bg-slate-800/40 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${hasInsurance ? 'bg-blue-600 text-white' : 'border border-slate-600'}`}>
                      {hasInsurance && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Xalqaro tibbiy sug'urta</div>
                      <div className="text-[10px] text-slate-400">Tez tibbiy yordam va kutilmagan xarajatlar qoplamasi</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">+$25 / kishi</span>
                </div>

                <div 
                  onClick={() => setHasVipTransfer(!hasVipTransfer)}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                    hasVipTransfer ? 'bg-blue-950/40 border-blue-500/70' : 'bg-slate-800/40 border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${hasVipTransfer ? 'bg-blue-600 text-white' : 'border border-slate-600'}`}>
                      {hasVipTransfer && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">VIP Alohida Transfer</div>
                      <div className="text-[10px] text-slate-400">Aeroportdan mehmonxonagacha biznes klass avtomobil</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">+$40</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Passport & Phone Number */}
          {step === 2 && (
            <form onSubmit={handleProceedToSms} className="space-y-4 animate-fade-in">
              <div className="bg-blue-950/30 border border-blue-800/40 p-3 rounded-xl flex items-center gap-2 text-xs text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Sayohatchi pasporti va SMS kod yuboriladigan telefon raqamini kiriting.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sayohatchining to'liq ismi (F.I.SH):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Jamshid Usmonov"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t('travelerPhone')}
                </label>
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  placeholder="90 123 45 67"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Xorijga chiqish pasporti seriya va raqami:
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Masalan: FA 9876543"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 uppercase focus:outline-none font-mono"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: PHONE SMS VERIFICATION */}
          {step === 3 && (
            <form onSubmit={handleVerifyPhoneSms} className="space-y-4 text-center animate-fade-in py-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                <Smartphone className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Telefoningizga SMS Kod Yuborildi</h4>
                <p className="text-xs text-slate-300 mt-1">
                  <b>{phone}</b> raqamiga yuborilgan 4 xonali tasdiqlash kodini kiriting:
                </p>
              </div>

              {/* Simulated SMS Notification bubble */}
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-blue-500/40 text-left flex items-start gap-2.5 max-w-sm mx-auto shadow-md">
                <MessageSquare className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300">
                  <span className="font-bold text-white block">📩 Kiruvchi SMS (Simulyatsiya):</span>
                  <span>«USMWORLD: Sizning tasdiqlash kodingiz: <b>{generatedSmsCode}</b>. Turni bron qilish uchun kodni kiriting.»</span>
                </div>
              </div>

              {smsError && (
                <div className="text-xs text-rose-400 font-semibold bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/40">
                  {smsError}
                </div>
              )}

              <input
                type="text"
                required
                maxLength={4}
                placeholder={generatedSmsCode}
                value={enteredSmsCode}
                onChange={(e) => setEnteredSmsCode(e.target.value.replace(/\D/g, ''))}
                className="w-40 mx-auto bg-slate-900 border-2 border-blue-500 text-center tracking-[12px] text-2xl font-black py-2 rounded-2xl text-white focus:outline-none font-mono"
                autoFocus
              />

              <button
                type="submit"
                disabled={isVerifyingSms || enteredSmsCode.length < 4}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifyingSms ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Kod tekshirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SMS Kodni Tasdiqlash</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: BIOMETRIC FACE ID SCANNER */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <FaceScanner
                existingPhoto={facePhoto}
                onFaceCaptured={(captured) => setFacePhoto(captured)}
              />

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPaymentMethod}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{facePhoto ? "Yuz Tasdiqlandi — To'lovga O'tish" : "Face ID siz davom etish"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Payment Method Selection */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xs text-slate-300 font-medium">
                To'lov usulini tanlang. Tizim to'lovni avtomatlashtirilgan tarzda qabul qiladi:
              </div>

              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPayment === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow"
                          style={{ backgroundColor: method.color }}
                        >
                          {method.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{method.name}</span>
                            <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-700 text-slate-300 rounded">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{method.description}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'border border-slate-600'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Payment Gateway Simulation */}
          {step === 6 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center py-2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  {selectedPayment.toUpperCase()} Xavfsiz Shlyuz
                </div>
                <div className="text-2xl font-black text-white mt-2">${grandTotalUSD}</div>
                <div className="text-xs text-blue-400 font-medium">≈ {grandTotalUZS} so'm</div>
              </div>

              {!cardSmsSent ? (
                <form onSubmit={handleProcessPayment} className="space-y-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Karta raqami:
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="8600 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Amal qilish muddati:
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                          setCardExpiry(val);
                        }}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tasdiqlangan telefon:
                      </label>
                      <input
                        type="text"
                        disabled
                        value={phone}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || cardNumber.length < 16}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Karta tekshirilmoqda...</span>
                      </>
                    ) : (
                      <span>To'lov Tasdiqlash Kodini Olish</span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleProcessPayment} className="space-y-4 bg-slate-800/60 p-4 rounded-2xl border border-blue-500/40 text-center">
                  <h4 className="text-sm font-bold text-white">To'lov SMS Kodingizni Kiriting</h4>
                  <p className="text-[11px] text-slate-400">
                    To'lovni tasdiqlash uchun xohlagan 4 ta raqam (masalan: <b>7788</b>) kiriting:
                  </p>

                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="7788"
                    value={cardSmsCode}
                    onChange={(e) => setCardSmsCode(e.target.value.replace(/\D/g, ''))}
                    className="w-36 mx-auto bg-slate-900 border-2 border-blue-500 text-center tracking-[10px] text-xl font-bold py-2 rounded-xl text-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={isProcessing || cardSmsCode.length < 4}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isProcessing ? "To'lov tasdiqlanmoqda..." : `To'lovni Yakunlash ($${grandTotalUSD})`}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 7: Success & Voucher */}
          {step === 7 && createdOrder && (
            <div className="space-y-4 text-center animate-fade-in py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                  {createdOrder.paymentStatus === 'paid' ? "TO'LOV MUVAFFAQIYATLI!" : "BUYURTMA QABUL QILINDI"}
                </span>
                <h3 className="text-lg font-black text-white mt-2">
                  Sayohatingiz Rasmiylashtirildi!
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Buyurtma kodi: <b className="text-white font-mono">{createdOrder.orderNumber}</b>. SMS va Face ID bilan tasdiqlangan vaucher bazada saqlandi.
                </p>
              </div>

              {/* Order Card Preview with Face ID */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                  <div className="flex items-center gap-2.5">
                    {createdOrder.facePhoto ? (
                      <img src={createdOrder.facePhoto} alt="Face" className="w-10 h-10 rounded-full object-cover border border-emerald-400" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">👤</div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">{createdOrder.customerName}</div>
                      <div className="text-[10px] text-emerald-400">✓ SMS va Face ID tasdiqlangan</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Chipta kodi:</span>
                    <div className="text-xs font-mono font-bold text-blue-400">{createdOrder.ticketCode}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Tur:</span>
                    <div className="font-semibold text-slate-200 truncate">{tour.title}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Telefon:</span>
                    <div className="font-semibold text-slate-200">{createdOrder.phone}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Sana:</span>
                    <div className="font-semibold text-slate-200">{createdOrder.travelDate}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Jami to'lov:</span>
                    <div className="font-bold text-emerald-400">${createdOrder.totalPrice}</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95"
                >
                  Buyurtmalarim bo'limida ko'rish
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Price & Navigation (Steps 1, 2, 5) */}
        {step !== 3 && step !== 4 && step !== 6 && step !== 7 && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-400">Jami to'lov:</div>
              <div className="text-lg font-black text-white">${grandTotalUSD}</div>
              <div className="text-[10px] text-blue-400">≈ {grandTotalUZS} so'm</div>
            </div>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}

              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                >
                  <span>Davom etish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={handleProceedToSms}
                  className="py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                >
                  <span>SMS Kod Olish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  onClick={handleStartPayment}
                  className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                >
                  <span>To'lovga o'tish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
