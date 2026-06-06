/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WEATHER_FORECAST } from '../data';
import { 
  Sun, 
  Wind, 
  Waves, 
  Thermometer, 
  AlertTriangle, 
  Sparkles,
  Compass,
  Umbrella,
  Shield,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

export default function WeatherView() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  
  // Interactive Tide Simulator State (0: High Tide, 5: Mid, 10: Dry Low Tide)
  const [tideLevel, setTideLevel] = useState<number>(3); 

  // UV Exposure calculation parameters
  const [spf, setSpf] = useState<number>(30); // SPF multiplier
  const [skinToneColor, setSkinToneColor] = useState<string>('light'); // sensitivity

  const selectedWeather = WEATHER_FORECAST[selectedDayIndex];

  // Calculate safe exposure minutes
  // Base time: sensitive light skin gets sunburned in 10 mins under SPF-null, normal skin in 15 mins, dark skin in 25 mins.
  const getExposureMinutes = () => {
    let baseMinutes = 12;
    if (skinToneColor === 'medium') baseMinutes = 18;
    if (skinToneColor === 'dark') baseMinutes = 28;

    const multiplier = spf === 1 ? 1 : spf;
    return baseMinutes * multiplier;
  };

  const getTideSimulationLabel = (lvl: number) => {
    if (lvl <= 2) return { status: '🌊 滿潮階段', desc: '海水完全淹沒步道。此時絕對禁止下水，岸邊欣賞平靜海色。', color: 'text-indigo-600' };
    if (lvl > 2 && lvl <= 5) return { status: '🌊 退潮中 (水深)', desc: '海水開始逐漸往兩側退開，小部分礫石已露出。請依從巡邏員安全警戒線，稍候片刻。', color: 'text-cyan-600' };
    if (lvl > 5 && lvl <= 8) return { status: '🚶 分海形成 (推薦！)', desc: '礫石黃金步道逐漸完全成形！水深僅及腳踝，微風徐徐，是步行及觀察潮間帶的最佳時刻！', color: 'text-teal-600' };
    return { status: '🏝️ 乾潮階段 (完全分開)', desc: '步道完全乾燥且寬逾6公尺！你可以安然步行直奔赤嶼，在潮間帶水窪看野生海星、螃蟹。', color: 'text-emerald-600' };
  };

  const tideSim = getTideSimulationLabel(tideLevel);

  return (
    <div className="space-y-6 pb-28">
      {/* 🟢 Main Island Weather Card Header */}
      <div className="bg-white p-5 rounded-[24px] border border-tea/10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bg-fuji text-white text-xs font-bold px-4 py-1.5 rounded-bl-[16px] flex items-center gap-1">
          <Waves className="w-3.5 h-3.5 animate-bounce" />
          海象預報
        </div>

        <div className="flex items-center gap-4">
          <div 
            className="text-4xl text-amber-500 bg-amber-50 p-3 rounded-2xl border border-amber-100 shadow-inner transition-transform duration-300 hover:scale-105"
          >
            {selectedWeather.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-fuji-dark">澎湖本島即時海候</h2>
              <span className="text-[10px] text-coral bg-coral-light font-bold border border-coral/15 px-2 py-0.5 rounded-md">
                最新發佈
              </span>
            </div>
            <p className="text-xs text-tea mt-0.5">
              氣象觀測點：馬公港觀音庭 ｜ 當前日期：{selectedWeather.date} ({selectedWeather.dayName})
            </p>
          </div>
        </div>

        {/* Highlight meteorological details */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4.5 border-t border-tea/10">
          <div className="bg-cream/55 p-3 rounded-2xl flex items-center gap-2.5">
            <Thermometer className="w-5 h-5 text-coral shrink-0" />
            <div>
              <span className="block text-[10px] text-tea opacity-80 font-bold">預估溫度</span>
              <span className="font-mono text-sm font-bold text-fuji-dark">{selectedWeather.temp}</span>
            </div>
          </div>

          <div className="bg-cream/55 p-3 rounded-2xl flex items-center gap-2.5">
            <Wind className="w-5 h-5 text-fuji shrink-0" />
            <div>
              <span className="block text-[10px] text-tea opacity-80 font-bold">島嶼風向風速</span>
              <span className="text-xs font-bold text-fuji-dark leading-tight">{selectedWeather.windSpeed}</span>
            </div>
          </div>

          <div className="bg-cream/55 p-3 rounded-2xl flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-teal-500 shrink-0" />
            <div>
              <span className="block text-[10px] text-tea opacity-80 font-bold">大潮潮汐預報</span>
              <span className="text-xs font-bold text-fuji-dark break-all leading-tight">{selectedWeather.tideTimeText}</span>
            </div>
          </div>

          <div className="bg-cream/55 p-3 rounded-2xl flex items-center gap-2.5">
            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <span className="block text-[10px] text-tea opacity-80 font-bold">防曬警戒指數</span>
              <span className="text-xs font-bold text-coral leading-tight">{selectedWeather.uvLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 Toggleable Day Tabs Forecast List */}
      <div className="bg-white rounded-[24px] border border-tea/10 shadow-sm p-4.5">
        <label className="text-xs font-bold text-tea text-opacity-80 px-1 block mb-3">
          🗓️ 澎湖多日海候預估
        </label>
        <div className="grid grid-cols-4 gap-2">
          {WEATHER_FORECAST.map((forecast, fIdx) => {
            const isSelected = selectedDayIndex === fIdx;
            return (
              <button
                key={forecast.date}
                onClick={() => setSelectedDayIndex(fIdx)}
                id={`weather-day-tab-${fIdx}`}
                className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-fuji-light text-fuji-dark border-fuji/40 shadow-sm scale-102 font-bold'
                    : 'bg-white border-tea/15 text-tea hover:border-tea/25'
                }`}
              >
                <span className="text-[10px] font-bold block">{forecast.dayName}</span>
                <span className="text-xs text-tea font-mono block">{forecast.date.split('/')[1]}日</span>
                <span className="text-lg block leading-none pt-0.5">{forecast.emoji}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🏖️ Interactive Moses Parting the Sea simulator */}
      <div className="bg-white rounded-[24px] border border-tea/10 shadow-sm p-5 space-y-5">
        <div>
          <h3 className="font-bold text-fuji-dark flex items-center gap-1.5 text-base">
            <Compass className="w-5 h-5 text-coral" />
            摩西分海 ｜ 潮汐對比模擬器
          </h3>
          <p className="text-xs text-tea mt-1">
            澎湖奎壁山分海由潮汐掌控，請利用下方模擬滑條，提早感受漲潮與安全過海的奇景契機。
          </p>
        </div>

        {/* Graphic display of Moses parting the sea */}
        <div className="relative h-28 bg-sky-100 rounded-2xl flex items-center justify-between px-6 border border-sky-200 overflow-hidden shadow-inner">
          {/* Waves background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-300/40 to-blue-400/30" />
          
          {/* Left land (Mainland) */}
          <div className="w-16 h-full bg-slate-400 border-r border-slate-500 rounded-r-3xl z-10 flex items-center justify-center text-white font-bold text-xs select-none">
            奎壁山
          </div>

          {/* Center pebble gravel pathway */}
          <div className="flex-1 h-full relative flex items-center justify-center">
            {/* Water overlay on path */}
            {tideLevel <= 5 && (
              <div 
                style={{ opacity: 1 - (tideLevel / 10) }}
                className="absolute inset-x-0 inset-y-0 bg-blue-500/50 backdrop-blur-[1px] z-10 flex items-center justify-center text-[10px] font-bold text-white text-center transition-opacity duration-300"
              >
                🌊 海水蓋過步道 ({Math.max(0, 150 - tideLevel * 15)} cm)
              </div>
            )}

            {/* Pebble Pathway gravel design */}
            <div className="w-full h-8 bg-amber-800/80 border-y-2 border-amber-900 rounded-md flex items-center justify-center text-[9px] font-mono text-amber-200 font-bold z-0 tracking-wider">
              礫石步道 S PATH
            </div>
          </div>

          {/* Right land (Chi Island) */}
          <div className="w-16 h-full bg-slate-500 border-l border-slate-600 rounded-l-3xl z-10 flex items-center justify-center text-white font-bold text-xs select-none">
            赤嶼
          </div>
        </div>

        {/* Slider input */}
        <div className="space-y-2 pb-1">
          <div className="flex items-center justify-between text-xs font-bold text-tea/85">
            <span>🌊 滿潮海深 0m (淹沒)</span>
            <span>🏝️ 乾潮見底 3.0m (分開)</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={tideLevel}
            onChange={(e) => setTideLevel(Number(e.target.value))}
            className="w-full accent-fuji h-2.5 bg-mugi rounded-lg appearance-none cursor-pointer border border-tea/15 shadow-inner"
          />
        </div>

        {/* Status result card */}
        <div className="bg-mugi/40 border border-tea/15 rounded-2xl p-4 space-y-1.5">
          <div className={`font-bold text-sm ${tideSim.color} flex items-center gap-1.5`}>
            <Sparkles className="w-4 h-4 shrink-0" />
            模擬狀態：{tideSim.status}
          </div>
          <p className="text-xs text-tea leading-relaxed">{tideSim.desc}</p>
        </div>
      </div>

      {/* 💛 UV Sunscreen Timer Utility */}
      <div className="bg-white rounded-[24px] border border-tea/10 shadow-sm p-5 space-y-5">
        <div>
          <h3 className="font-bold text-fuji-dark flex items-center gap-1.5 text-base">
            <Umbrella className="w-5 h-5 text-coral" />
            澎湖烈日防晒計時器 🧴
          </h3>
          <p className="text-xs text-tea mt-1">
            澎湖紫外線在夏日一般達到危機級。輸入防曬乳與膚色，計算你在烈日下「安全無紅腫」的沙灘暴晒極限時間！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SPF choosing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-tea block">1️⃣ 當前防曬乳係數（SPF）</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { value: 1, label: '無防曬' },
                { value: 15, label: 'SPF15' },
                { value: 30, label: 'SPF30' },
                { value: 50, label: 'SPF50+' }
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setSpf(item.value)}
                  className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                    spf === item.value
                      ? 'bg-coral text-white border-transparent shadow-xs'
                      : 'bg-white border-tea/15 text-tea hover:bg-mugi/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skin sensitivity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-tea block">2️⃣ 個人膚色曬傷耐受係數</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'light', label: '敏感偏白' },
                { id: 'medium', label: '普通黃調' },
                { id: 'dark', label: '健康黑麥' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSkinToneColor(item.id)}
                  className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                    skinToneColor === item.id
                      ? 'bg-fuji text-white border-transparent shadow-xs'
                      : 'bg-white border-tea/15 text-tea hover:bg-mugi/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estimated Safety minutes progress card */}
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-fuji-dark font-mono font-bold tracking-wider block bg-sky-100 px-2.5 py-1 rounded-full w-max">
              🔥 曬傷臨界防護限額
            </span>
            <div className="text-2xl font-black text-fuji-dark">
              {getExposureMinutes() >= 60 
                ? `${Math.floor(getExposureMinutes() / 60)} 小時 ${getExposureMinutes() % 60} 分鐘`
                : `${getExposureMinutes()} 分鐘`}
            </div>
            <p className="text-[11px] text-tea opacity-90 leading-relaxed max-w-[260px] pt-1.5">
              {spf === 1 
                ? '⚠️ 天天暴曬極度容易起水泡脫皮！請立刻在外套裡加塗 SPF 30 或以上的防曬乳。' 
                : '✓ 防護尚佳。但出汗、踏海海浪拍打後防曬係數會減弱，建議每 2 小時重新補擦！'}
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-full shadow-md border border-sky-150 shrink-0">
            <Shield className={`w-8 h-8 ${spf === 1 ? 'text-red-400 animate-pulse' : 'text-fuji'}`} />
          </div>
        </div>

        {/* Environmental reminder note */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-[11px] text-amber-800 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <p>
            海洋保護小提醒：體驗潮間帶、抱墩及浮潛等活動時，推薦擦拭標示為<strong>「海洋友善 (Ocean Friendly)」</strong>的防曬乳，或是全程著長袖物理性防曬外套代步，共同守護澎湖美麗斑斕的珊瑚礁生態！
          </p>
        </div>
      </div>
    </div>
  );
}
