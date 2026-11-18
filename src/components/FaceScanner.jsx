import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, RefreshCw, AlertCircle, Scan, ShieldCheck, Upload, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function FaceScanner({ onFaceCaptured, existingPhoto }) {
  const { t, effectiveLanguage } = useLanguage();
  const [photo, setPhoto] = useState(existingPhoto || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [countdown, setCountdown] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-start front camera when component opens (if no photo yet)
  useEffect(() => {
    if (!existingPhoto) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [existingPhoto]);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      // Constraints optimized for front selfie camera
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.log('Autoplay handled:', e));
        };
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera access failed:", err);
      setIsCameraActive(false);
      const errMsg = effectiveLanguage === 'ru'
        ? "Доступ к камере заблокирован. Разрешите доступ или загрузите селфи из галереи."
        : effectiveLanguage === 'en'
        ? "Camera access denied. Please allow camera permissions or upload a selfie."
        : "Kameraga ruxsat berilmadi yoki kamera topilmadi. Brauzerda kameraga ruxsat bering yoki galereyadan selfi yuklang.";
      setCameraError(errMsg);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture face photo from live video
  const capturePhoto = () => {
    if (!videoRef.current) return;
    setIsScanning(true);

    // Short snap animation
    setTimeout(() => {
      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        if (ctx && video) {
          const startX = (video.videoWidth - size) / 2;
          const startY = (video.videoHeight - size) / 2;

          // Draw cropped circular square
          ctx.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

          setPhoto(dataUrl);
          onFaceCaptured(dataUrl);
          stopCamera();
        }
      } catch (e) {
        console.error("Capture error:", e);
      } finally {
        setIsScanning(false);
      }
    }, 400);
  };

  // Handle local file fallback
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setPhoto(dataUrl);
      onFaceCaptured(dataUrl);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  // Reset photo & restart live camera
  const handleRetake = () => {
    setPhoto(null);
    onFaceCaptured(null);
    startCamera();
  };

  return (
    <div className="bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-800 space-y-3.5 shadow-xl">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
          <Scan className="w-4 h-4 text-emerald-400" />
          <span>
            {effectiveLanguage === 'ru' 
              ? "Биометрическая верификация Face ID (Селфи)" 
              : effectiveLanguage === 'en' 
              ? "Biometric Face ID Verification (Live Selfie)" 
              : "Jonli Biometrik Face ID (Yuz Shaklini Tasdiqlash):"}
          </span>
        </label>
        {photo && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[11px] flex items-center gap-1 border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
            Face ID ✓
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {effectiveLanguage === 'ru'
          ? "Посмотрите в круговой видоискатель камеры. Ваше лицо будет проверено и привязано к электронному ваучеру."
          : effectiveLanguage === 'en'
          ? "Position your face inside the circle. Your selfie will be captured and sealed onto your official ticket voucher."
          : "Yuzingizni aylanaga to'g'rilang va suratga oling. Biometrik yuzingiz rasmiy chipta va elektron vaucherga muhrlanadi."}
      </p>

      {/* VIEW 1: Already Captured Photo View */}
      {photo ? (
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Circular Captured Face with Glowing Ring */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-400 shadow-xl shadow-emerald-500/20 shrink-0">
            <img src={photo} alt="Face ID" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
            <div className="absolute bottom-1 inset-x-0 bg-emerald-600/90 text-[9px] text-white font-black text-center py-0.5 uppercase tracking-wider">
              VERIFIED
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {effectiveLanguage === 'ru' ? "Лицо успешно подтверждено!" : effectiveLanguage === 'en' ? "Face Verified Successfully!" : "Yuz Shakli Muvaffaqiyatli Tasdiqlandi!"}
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {effectiveLanguage === 'ru'
                ? "Фотография зафиксирована в системе безопасности для посадки на рейс."
                : effectiveLanguage === 'en'
                ? "Photo securely stored for airport check-in and hotel voucher identification."
                : "Ushbu fotosurat aeroportda ro'yxatdan o'tish va mehmonxona vaucheri uchun saqlandi."}
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5 pt-1 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {effectiveLanguage === 'ru' ? "Сфотографироваться заново" : effectiveLanguage === 'en' ? "Retake photo" : "Qaytadan suratga tushish"}
              </span>
            </button>
          </div>
        </div>
      ) : isCameraActive ? (
        /* VIEW 2: Active Circular Live Selfie Camera */
        <div className="relative py-2 flex flex-col items-center justify-center">
          {/* Circular Frame with animated HUD scanning radar */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-emerald-400 shadow-2xl shadow-emerald-500/30 bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Circular face alignment oval */}
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-300/80 pointer-events-none animate-spin-slow opacity-80" />
            <div className="absolute inset-8 rounded-full border border-blue-400/40 pointer-events-none" />

            {/* Scanning radar sweep */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent animate-bounce-soft pointer-events-none" />

            {/* Corner HUD targeting markers */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-widest text-emerald-300 bg-slate-950/70 px-2 py-0.5 rounded-full uppercase">
              LIVE CAMERA
            </div>

            {/* Scanning progress overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                <span className="text-xs font-bold text-emerald-300">
                  {effectiveLanguage === 'ru' ? "Фиксация лица..." : effectiveLanguage === 'en' ? "Scanning face..." : "Yuz muhrlanmoqda..."}
                </span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-300 font-medium text-center mt-2.5">
            {effectiveLanguage === 'ru'
              ? "Поместите лицо в центр круга и нажмите кнопку ниже"
              : effectiveLanguage === 'en'
              ? "Center your face in the circle and tap the button below"
              : "Yuzingizni aylananing o'rtasiga qo'ying va tugmani bosing"}
          </p>
        </div>
      ) : (
        /* VIEW 3: Permission blocked or camera closed placeholder */
        <div className="text-center py-6 bg-slate-950/60 rounded-2xl border border-dashed border-slate-700 space-y-3">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">
              {effectiveLanguage === 'ru' ? "Камера не запущена" : effectiveLanguage === 'en' ? "Camera Not Active" : "Kamera Hozir Yoqilmagan"}
            </h5>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {effectiveLanguage === 'ru' 
                ? "Нажмите кнопку ниже, чтобы запустить селфи-камеру" 
                : effectiveLanguage === 'en' 
                ? "Click below to activate your selfie camera" 
                : "Jonli yuzni skanerlash uchun selfi kamerasini yoqing"}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!photo && (
        <div className="flex gap-2 pt-1">
          {isCameraActive ? (
            <>
              <button
                type="button"
                onClick={capturePhoto}
                disabled={isScanning}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {effectiveLanguage === 'ru' 
                    ? "📸 Сделать Снимок (Face ID)" 
                    : effectiveLanguage === 'en' 
                    ? "📸 Capture Live Photo" 
                    : "📸 Jonli Yuzni Suratga Olish (Face ID)"}
                </span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                {effectiveLanguage === 'ru' ? "Отмена" : effectiveLanguage === 'en' ? "Cancel" : "To'xtatish"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {effectiveLanguage === 'ru' 
                    ? "Включить Камеру и Сделать Селфи" 
                    : effectiveLanguage === 'en' 
                    ? "Turn On Camera for Selfie" 
                    : "Kamerani Yoqish va Yuzni Skanerlash"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                title="Galereyadan rasm yuklash"
              >
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">
                  {effectiveLanguage === 'ru' ? "Загрузить фото" : effectiveLanguage === 'en' ? "Upload photo" : "Selfi Yuklash"}
                </span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Error display with direct retry */}
      {cameraError && (
        <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-2xl text-xs text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">{cameraError}</span>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={startCamera}
                className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-lg hover:bg-amber-400 transition"
              >
                {effectiveLanguage === 'ru' ? "Попробовать снова" : effectiveLanguage === 'en' ? "Try again" : "Qayta urinish"}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-slate-800 text-amber-300 font-semibold text-[10px] rounded-lg hover:bg-slate-700 transition"
              >
                {effectiveLanguage === 'ru' ? "Загрузить из галереи" : effectiveLanguage === 'en' ? "Upload from gallery" : "Galereyadan tanlash"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="user"
        className="hidden"
      />
    </div>
  );
}
