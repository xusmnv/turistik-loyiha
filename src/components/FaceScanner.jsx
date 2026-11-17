import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, RefreshCw, AlertCircle, Scan, ShieldCheck, Upload } from 'lucide-react';

export default function FaceScanner({ onFaceCaptured, existingPhoto }) {
  const [photo, setPhoto] = useState(existingPhoto || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraError("Kameraga ruxsat berilmadi yoki kamera topilmadi. Fayldan selfi yuklashingiz mumkin.");
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture face from video
  const capturePhoto = () => {
    if (!videoRef.current) return;
    setIsScanning(true);

    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current) {
        // Draw square center crop
        const video = videoRef.current;
        const size = Math.min(video.videoWidth, video.videoHeight);
        const startX = (video.videoWidth - size) / 2;
        const startY = (video.videoHeight - size) / 2;

        ctx.drawImage(video, startX, startY, size, size, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPhoto(dataUrl);
        onFaceCaptured(dataUrl);
        stopCamera();
        setIsScanning(false);
      }
    }, 600);
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
    };
    reader.readAsDataURL(file);
  };

  // Reset photo
  const handleRetake = () => {
    setPhoto(null);
    onFaceCaptured(null);
    startCamera();
  };

  return (
    <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <Scan className="w-4 h-4 text-blue-400" />
          <span>Biometrik Yuz Shakli (Face ID Tekshiruvi):</span>
        </label>
        {photo && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
            <Check className="w-3 h-3" />
            Tasdiqlandi
          </span>
        )}
      </div>

      <p className="text-[11px] text-slate-400">
        Xavfsizlik va xalqaro turizm talablariga muvofiq, sayohatchining yuz qiyofasi olinadi va elektron vaucherga biriktiriladi.
      </p>

      {/* Captured Photo View */}
      {photo ? (
        <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-emerald-500/40">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-400 shadow-md shrink-0">
            <img src={photo} alt="Face ID" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Yuz Shakli Muvaffaqiyatli Saqlandi</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Ushbu biometrik ma'lumot sayohat vaucheri va aviatsiya xavfsizligida aks etadi.
            </p>
            <button
              type="button"
              onClick={handleRetake}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 pt-1 underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Qaytadan suratga olish</span>
            </button>
          </div>
        </div>
      ) : isCameraActive ? (
        /* Active Webcam scanner */
        <div className="relative max-w-[260px] mx-auto aspect-square rounded-full overflow-hidden border-4 border-dashed border-blue-500 shadow-2xl bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover mirror"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Face guide oval */}
          <div className="absolute inset-3 border-2 border-emerald-400 rounded-full pointer-events-none animate-pulse opacity-70" />

          {/* Scanning line animation */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce-soft pointer-events-none" />

          {isScanning && (
            <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center text-xs font-bold text-emerald-400">
              Yuz tahlil qilinmoqda...
            </div>
          )}
        </div>
      ) : (
        /* Start camera or upload placeholder */
        <div className="text-center py-4 bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 space-y-2">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-300 font-medium">
            Kamera orqali yuz shaklini tasdiqlang
          </p>
        </div>
      )}

      {/* Camera Controls */}
      {!photo && (
        <div className="flex gap-2">
          {isCameraActive ? (
            <>
              <button
                type="button"
                onClick={capturePhoto}
                disabled={isScanning}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Suratga Olish (Face ID)</span>
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Kamerani Yoqish va Yuzni Skanerlash</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1"
                title="Galereyadan selfi yuklash"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Selfi Yuklash</span>
              </button>
            </>
          )}
        </div>
      )}

      {cameraError && (
        <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl text-[11px] text-amber-300 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
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
