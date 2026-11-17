import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Phone, Check } from 'lucide-react';
import { COUNTRIES, DEFAULT_COUNTRY } from '../data/countries';
import { useLanguage } from '../context/LanguageContext';

export default function PhoneInput({ 
  value = '', 
  onChange, 
  placeholder = '90 123 45 67',
  required = true,
  className = ''
}) {
  const { effectiveLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Determine initial country from value or default
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (value && typeof value === 'string') {
      const match = COUNTRIES.find(c => value.trim().startsWith(c.dial));
      if (match) return match;
    }
    return DEFAULT_COUNTRY;
  });

  // Extract phone number part without the dial code
  const getNumberPart = (fullVal, country) => {
    if (!fullVal) return '';
    let val = fullVal.trim();
    if (val.startsWith(country.dial)) {
      return val.slice(country.dial.length).trim();
    }
    // If it starts with + but different country
    return val.replace(/^\+\d+\s*/, '');
  };

  const [numberPart, setNumberPart] = useState(() => getNumberPart(value, selectedCountry));

  // Sync when value prop changes externally
  useEffect(() => {
    if (value && typeof value === 'string') {
      const foundCountry = COUNTRIES.find(c => value.trim().startsWith(c.dial));
      if (foundCountry && foundCountry.code !== selectedCountry.code) {
        setSelectedCountry(foundCountry);
        setNumberPart(getNumberPart(value, foundCountry));
      }
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery('');
    const fullNumber = numberPart.trim() ? `${country.dial} ${numberPart.trim()}` : `${country.dial} `;
    onChange && onChange(fullNumber);
  };

  const handleNumberChange = (e) => {
    const rawVal = e.target.value;
    // Allow digits, spaces, and hyphens
    const cleanDigits = rawVal.replace(/[^\d\s-]/g, '');
    setNumberPart(cleanDigits);
    const fullNumber = `${selectedCountry.dial} ${cleanDigits}`.trim();
    onChange && onChange(fullNumber);
  };

  // Localized country name
  const getCountryName = (c) => {
    if (effectiveLanguage === 'ru') return c.nameRu;
    if (effectiveLanguage === 'en') return c.nameEn;
    return c.nameUz;
  };

  const filteredCountries = COUNTRIES.filter(c => {
    const q = searchQuery.toLowerCase();
    const name = getCountryName(c).toLowerCase();
    return name.includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q);
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 focus-within:border-blue-500 transition overflow-hidden">
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800/90 hover:bg-slate-700/80 border-r border-slate-700 text-xs text-white transition shrink-0 select-none"
          title={`${getCountryName(selectedCountry)} (${selectedCountry.dial})`}
        >
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="font-semibold text-slate-200">{selectedCountry.dial}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Input for the rest of the phone number */}
        <div className="relative flex-1">
          <input
            type="tel"
            required={required}
            value={numberPart}
            onChange={handleNumberChange}
            placeholder={placeholder}
            className="w-full bg-transparent px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Dropdown Menu for Countries */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-72 max-w-[90vw] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Search box inside dropdown */}
          <div className="p-2 border-b border-slate-800 bg-slate-950/80">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={effectiveLanguage === 'ru' ? "Поиск страны или кода..." : effectiveLanguage === 'en' ? "Search country or code..." : "Mamlakat yoki kodni qidiring..."}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/60 p-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition ${
                      isSelected ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base shrink-0">{country.flag}</span>
                      <span className="truncate">{getCountryName(country)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[11px] font-mono text-slate-400">{country.dial}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                {effectiveLanguage === 'ru' ? "Страна не найдена" : effectiveLanguage === 'en' ? "No country found" : "Mamlakat topilmadi"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
