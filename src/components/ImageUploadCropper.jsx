import React, { useState, useRef } from 'react';
import { Upload, Scissors, ZoomIn, ZoomOut, Check, X, RotateCcw, Image as ImageIcon } from 'lucide-react';

export default function ImageUploadCropper({ onImageSelected, currentImage }) {
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // Crop / Zoom / Pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // Handle file selection from local device / laptop
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Iltimos, faqat rasm faylini tanlang (JPEG, PNG, WEBP)!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImageSrc(event.target.result);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
    // reset input so same file can be selected again
    e.target.value = '';
  };

  // Mouse / Touch Drag handlers for positioning image inside crop box
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile phones
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // Perform canvas crop
  const handleConfirmCrop = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    // Target 16:10 tour card resolution (e.g. 800x500)
    const targetWidth = 800;
    const targetHeight = 500;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    // Crop container size on screen
    const containerWidth = 360;
    const containerHeight = 225; // 16:10

    // Render cropped view using current transform
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate drawing parameters
    const factor = targetWidth / containerWidth;

    ctx.save();
    ctx.scale(factor, factor);
    ctx.translate(position.x + containerWidth / 2, position.y + containerHeight / 2);
    ctx.scale(scale, scale);
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2
    );
    ctx.restore();

    // Export optimized JPEG data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onImageSelected(croppedDataUrl);
    setShowCropModal(false);
    setSelectedImageSrc(null);
  };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp, image/jpg"
        className="hidden"
      />

      {/* Upload button and current preview */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Preview box */}
        <div className="w-full sm:w-40 aspect-[16/10] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative flex items-center justify-center shrink-0">
          {currentImage ? (
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2 text-slate-500">
              <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-60" />
              <span className="text-[10px]">Rasm tanlanmagan</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-2 w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Qurilmadan rasm yuklash (Laptop / Telefon)</span>
          </button>

          <p className="text-[10px] text-slate-400">
            Telefon yoki noutbuk xotirasidagi rasmni tanlang. Yuklagach, kerakli qismini qirqib olish oynasi ochiladi.
          </p>
        </div>
      </div>

      {/* INTERACTIVE CROP MODAL */}
      {showCropModal && selectedImageSrc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in">
          <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-blue-500/40 shadow-2xl p-5 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-sm text-white">Rasmni Qirqish & Moslashtirish</h4>
              </div>
              <button
                type="button"
                onClick={() => { setShowCropModal(false); setSelectedImageSrc(null); }}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crop Viewport Box (16:10 format) */}
            <div className="relative w-full max-w-[360px] mx-auto aspect-[16/10] bg-black rounded-2xl overflow-hidden border-2 border-dashed border-blue-400 shadow-inner flex items-center justify-center select-none cursor-move">
              
              <div
                className="absolute inset-0 flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={selectedImageSrc}
                  alt="Crop target"
                  draggable={false}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    maxWidth: 'none',
                    transition: isDragging ? 'none' : 'transform 0.05s ease-out'
                  }}
                  className="pointer-events-none select-none max-w-none origin-center"
                />
              </div>

              {/* Grid guide overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/40">
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-white"></div>
                <div className="border-r border-white"></div>
                <div></div>
              </div>

              {/* Helper badge */}
              <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-[10px] text-blue-300 px-2 py-0.5 rounded-md pointer-events-none border border-white/10">
                16:10 Tur kartasi formati
              </span>
            </div>

            {/* Zoom Slider and reset */}
            <div className="space-y-1.5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 text-[11px]">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-400" />
                  Masshtab (Zoom):
                </span>
                <span className="font-mono text-[11px] text-blue-400 font-bold">{Math.round(scale * 100)}%</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.4"
                  max="3"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />

                <button
                  type="button"
                  onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }}
                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300"
                  title="Qayta tiklash"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-0.5">
                💡 Rasmni sichqoncha yoki barmoq bilan surib, kerakli qismini ramkaga moslang.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmCrop}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Qirqishni Tasdiqlash va Saqlash</span>
              </button>
              <button
                type="button"
                onClick={() => { setShowCropModal(false); setSelectedImageSrc(null); }}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-700 transition"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
