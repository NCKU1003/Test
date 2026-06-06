/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ITINERARY_DATA } from '../data';
import { Spot, SpotType } from '../types';
import { 
  MapPin, 
  ExternalLink, 
  Car, 
  Fuel, 
  Camera, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Shirt, 
  Waves, 
  Compass, 
  AlertTriangle,
  Sparkles,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ItineraryView() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedSpotId, setExpandedSpotId] = useState<string | null>(null);
  
  // Store user-uploaded photos in base64. Key: spotId, Value: base64 string
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('penghu_travel_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('penghu_travel_photos', JSON.stringify(uploadedPhotos));
    } catch (e) {
      console.warn("Storage quota might be exceeded", e);
    }
  }, [uploadedPhotos]);

  const activeDayData = ITINERARY_DATA.find(d => d.dayNumber === selectedDay) || ITINERARY_DATA[0];

  const handlePhotoUpload = (spotId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setUploadedPhotos(prev => ({
        ...prev,
        [spotId]: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (spotId: string) => {
    setUploadedPhotos(prev => {
      const updated = { ...prev };
      delete updated[spotId];
      return updated;
    });
  };

  const toggleExpand = (spotId: string) => {
    setExpandedSpotId(expandedSpotId === spotId ? null : spotId);
  };

  const getCategoryBadge = (type: SpotType) => {
    switch (type) {
      case 'food':
        return { label: '美食 🍖', styles: 'bg-rose-50 border border-rose-200 text-rose-500' };
      case 'activity':
        return { label: '活動 🌊', styles: 'bg-indigo-50 border border-indigo-200 text-indigo-500' };
      case 'shopping':
        return { label: '購物 🛍️', styles: 'bg-purple-50 border border-purple-200 text-purple-600' };
      case 'attraction':
        return { label: '景點 📸', styles: 'bg-teal-50 border border-teal-200 text-teal-600' };
      case 'stay':
        return { label: '住宿 🏨', styles: 'bg-amber-50 border border-amber-200 text-amber-600' };
      case 'transport':
        return { label: '交通 🛵', styles: 'bg-cyan-50 border border-cyan-200 text-cyan-600' };
      default:
        return { label: '其他 🎒', styles: 'bg-slate-50 border border-slate-200 text-slate-500' };
    }
  };

  const getHighlightBadgeClass = (tag: string) => {
    if (tag.includes('吃')) return 'bg-rose-100 text-rose-600 border border-rose-200';
    if (tag.includes('買')) return 'bg-amber-100 text-amber-600 border border-amber-200';
    if (tag.includes('拍')) return 'bg-fuji-light text-fuji-dark border border-fuji/30';
    return 'bg-coral-light text-coral border border-coral/20';
  };

  return (
    <div className="space-y-6 pb-28">
      {/* 🟢 Day Selector (Horizontal capsule tabs) */}
      <div className="bg-cream p-3 rounded-3xl border border-tea/10 shadow-sm">
        <label className="text-xs font-bold text-tea text-opacity-80 px-2 block mb-2">
          🗺️ 自由行行程天數切換
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {ITINERARY_DATA.map((day) => {
            const isSelected = day.dayNumber === selectedDay;
            return (
              <button
                key={day.dayNumber}
                onClick={() => {
                  setSelectedDay(day.dayNumber);
                  setExpandedSpotId(null);
                }}
                id={`day-select-btn-${day.dayNumber}`}
                className={`px-5 py-3 rounded-2xl text-sm font-bold shrink-0 transition-all duration-300 ${
                  isSelected
                    ? 'bg-fuji text-white shadow-md scale-[1.03]'
                    : 'bg-white border border-tea/15 text-tea hover:border-fuji hover:bg-fuji-light/40'
                }`}
              >
                Day {day.dayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔵 Day General Card Header */}
      <div className="bg-white p-5 rounded-[24px] border border-tea/10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bg-coral text-white text-xs font-bold px-4 py-1.5 rounded-bl-[16px] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          暑期主推
        </div>
        <div className="text-xs font-bold text-coral uppercase tracking-widest">
          {activeDayData.dateStr}
        </div>
        <h2 className="text-xl font-bold text-fuji-dark mt-2 flex items-center gap-2">
          {activeDayData.title}
        </h2>
      </div>

      {/* 🟠 Spots List */}
      <div className="space-y-5">
        {activeDayData.spots.map((spot, index) => {
          const category = getCategoryBadge(spot.type);
          const hasUserPhoto = !!uploadedPhotos[spot.id];
          const isExpanded = expandedSpotId === spot.id;

          return (
            <motion.div
              layout="position"
              key={spot.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="bg-white rounded-[24px] border border-tea/10 shadow-sm overflow-hidden"
            >
              {/* Card Static Section */}
              <div className="p-5 space-y-4">
                {/* Time & Category Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-fuji-light text-fuji-dark px-3 py-1 rounded-xl">
                      ⏰ {spot.time}
                    </span>
                    <span className={`text-xs font-bold py-1 px-3 rounded-full ${category.styles}`}>
                      {category.label}
                    </span>
                  </div>
                  {/* Local Highlights */}
                  <div className="flex gap-1.5">
                    {spot.highlights.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-bold py-0.5 px-2 rounded-lg ${getHighlightBadgeClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spot Name & Description */}
                <div>
                  <h3 className="text-lg font-bold text-fuji-dark flex items-center gap-1.5">
                    {spot.name}
                  </h3>
                  <p className="text-sm text-tea/90 mt-1.5 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                {/* Cover/Placeholder Photo or Custom Polaroid */}
                <div className="relative">
                  {hasUserPhoto ? (
                    /* User Polaroid Photo Frame */
                    <div className="flex justify-center py-4 bg-mugi/40 rounded-2xl border border-dashed border-tea/20">
                      <div className="polaroid relative origin-center rotate-2 transition-transform hover:rotate-0 max-w-[280px]">
                        {/* Polaroid tape effect */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 backdrop-blur-xs border-y border-white/30 rotate-1 shadow-xs" />
                        <img
                          src={uploadedPhotos[spot.id]}
                          alt={`${spot.name} 旅遊紀念`}
                          className="w-full h-44 object-cover rounded-sm border border-slate-100"
                        />
                        <div className="pt-3 text-center">
                          <p className="font-sans text-xs font-bold text-fuji-dark flex items-center justify-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-coral fill-coral" />
                            {activeDayData.dateStr.split(' ｜ ')[0]} 紀念
                          </p>
                          <button
                            onClick={() => handleRemovePhoto(spot.id)}
                            className="mt-2.5 mx-auto bg-rose-50 text-rose-500 hover:bg-rose-100 text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors border border-rose-200 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            刪除相片
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Default High-Quality Placeholder with Overlaid Camera upload button */
                    <div className="relative h-44 rounded-2xl overflow-hidden border border-tea/10 shadow-inner group">
                      <img
                        src={spot.photoPlaceholder}
                        alt={spot.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient cover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      
                      {/* Label of Photo Tip (always visible) */}
                      <div className="absolute top-3 left-3 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-fuji-dark border border-white/40 shadow-xs flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-fuji" />
                        拍客推薦
                      </div>

                      {/* Polaroid Camera upload trigger */}
                      <label className="absolute bottom-3 right-3 bg-coral hover:bg-coral/90 text-white p-2.5 rounded-full shadow-lg cursor-pointer flex items-center gap-1.5 transition-all active:scale-95">
                        <Camera className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-bold pr-1">相片旅記</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(spot.id, e)}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* 📸 拍照小技巧 (Special Photo Tips Section) */}
                {spot.photoTip && (
                  <div className="bg-fuji-light/70 border border-fuji/15 p-3.5 rounded-2xl text-xs text-fuji-dark flex gap-2.5 items-start">
                    <div className="bg-fuji text-white p-1 rounded-lg shrink-0 text-[10px] font-bold mt-0.5">
                      TIP
                    </div>
                    <div>
                      <span className="font-bold block mb-0.5">📸 拍照小技巧：</span>
                      <p className="leading-relaxed opacity-95">{spot.photoTip}</p>
                    </div>
                  </div>
                )}

                {/* Interactive Action Tab Bar */}
                <div className="flex gap-2.5 pt-1.5 border-t border-tea/10">
                  {/* Google Maps Jump Button */}
                  <a
                    href={spot.gmapUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex-1 bg-fuji-light text-fuji-dark hover:bg-fuji hover:text-white border border-fuji/20 hover:border-transparent py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    開啟導航
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  {/* Toggle Near Facilities Button */}
                  <button
                    onClick={() => toggleExpand(spot.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border shadow-sm cursor-pointer ${
                      isExpanded
                        ? 'bg-coral text-white border-transparent'
                        : 'bg-white border-tea/15 text-tea hover:bg-coral-light hover:text-coral hover:border-coral/20'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    附近車位 / 加油站
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Collapsed Near Stations Check */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-tea/10 bg-cream/70"
                  >
                    <div className="p-5 space-y-4 text-xs">
                      <h4 className="font-bold text-fuji-dark flex items-center gap-1 text-sm">
                        <Waves className="w-4 h-4 text-fuji" />
                        景點周邊基礎設施
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Parking Card */}
                        <div className="bg-white p-3.5 rounded-xl border border-tea/15 space-y-1.5 shadow-xs">
                          <div className="flex items-center gap-1.5 text-fuji font-bold">
                            <Car className="w-4 h-4 shrink-0" />
                            <span>停車場資訊</span>
                          </div>
                          <p className="text-tea leading-relaxed">{spot.parkingAndGasInfo.parking}</p>
                        </div>

                        {/* CPC Gas Card */}
                        <div className="bg-white p-3.5 rounded-xl border border-tea/15 space-y-1.5 shadow-xs">
                          <div className="flex items-center gap-1.5 text-coral font-bold">
                            <Fuel className="w-4 h-4 shrink-0" />
                            <span>中油加油站</span>
                          </div>
                          <p className="text-tea leading-relaxed">{spot.parkingAndGasInfo.gas}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* 🔴 Day Footer Tips Section  */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-coral-light/60 border-2 border-coral/15 rounded-[24px] p-5 space-y-4"
      >
        <div className="flex items-center gap-2 border-b border-coral/15 pb-2.5">
          <AlertTriangle className="text-coral w-5 h-5 shrink-0" />
          <h3 className="font-bold text-tea text-sm">
            今日（{activeDayData.dateStr.split(' ｜ ')[0]}）菊島出遊實用叮嚀
          </h3>
        </div>

        <div className="space-y-3.5 text-xs text-tea">
          {/* Clothing */}
          <div className="flex items-start gap-2.5">
            <div className="bg-coral/10 p-1.5 rounded-lg text-coral shrink-0">
              <Shirt className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-teal-800 block mb-0.5">建議穿著：</span>
              <p className="leading-relaxed leading-opacity-95">{activeDayData.clothingSuggestion}</p>
            </div>
          </div>

          {/* Sea Alert */}
          <div className="flex items-start gap-2.5">
            <div className="bg-fuji/10 p-1.5 rounded-lg text-fuji shrink-0">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-fuji-dark block mb-0.5">今日海況與紫外線預警：</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 pb-1.5 border-b border-tea/10">
                <div>今日浪高：<span className="font-bold font-mono text-fuji">{activeDayData.seaCondition.waveHeight.split('（')[0]}</span></div>
                <div>紫外線指數：<span className="font-bold font-mono text-coral">{activeDayData.seaCondition.uvIndex.split('（')[0]}</span></div>
              </div>
              <p className="mt-1.5 text-[11px] font-bold text-fuji-dark bg-white/70 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 shrink-0 text-coral" />
                出海推薦：{activeDayData.seaCondition.seaSuitability}
              </p>
              <p className="text-[11px] mt-1.5 leading-relaxed text-rose-500 font-medium">
                ⚠️ 注意：{activeDayData.seaCondition.warningNote}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
