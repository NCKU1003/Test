/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Compass, Sparkles, Heart, X, Gift, Calendar } from 'lucide-react';

export default function Header() {
  const [clickCount, setClickCount] = useState(0);
  const [showEgg, setShowEgg] = useState(false);
  const clickTimeoutRef = useRef<any>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('app-viewport'));
  }, []);

  const handleCompassClick = () => {
    if (showEgg) return;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const newCount = clickCount + 1;
    if (newCount >= 10) {
      setClickCount(0);
      setShowEgg(true);
    } else {
      setClickCount(newCount);
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const getDaysTogether = () => {
    const start = new Date('2026-05-20T00:00:00');
    const today = new Date();
    const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = todayMidnight.getTime() - startMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = getDaysTogether();

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b-4 border-fuji/20 px-5 py-4 flex items-center justify-between shadow-sm">
      <style>{`
        @keyframes float-heart {
          0% {
            transform: translateY(60px) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-160px) scale(1.3) rotate(25deg);
            opacity: 0;
          }
        }
        .animate-float-1 { animation: float-heart 3.2s ease-in-out infinite; }
        .animate-float-2 { animation: float-heart 4.1s ease-in-out infinite 0.7s; }
        .animate-float-3 { animation: float-heart 2.8s ease-in-out infinite 1.4s; }
        .animate-float-4 { animation: float-heart 3.6s ease-in-out infinite 2.1s; }
        .animate-float-5 { animation: float-heart 4.5s ease-in-out infinite 0.3s; }
      `}</style>

      <div className="flex items-center gap-3">
        <div 
          onClick={handleCompassClick}
          className="bg-fuji text-white p-2 rounded-2xl shadow-inner cursor-pointer hover:bg-fuji-dark active:scale-90 transition-all select-none group relative"
          title="均跟豪的愛情指標🧭 連按10下查看彩蛋！"
        >
          <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-fuji-dark">
              澎湖・均跟豪❤
            </h1>
          </div>
          <p className="text-xs text-tea font-medium mt-0.5 tracking-wider bg-fuji-light px-2 py-0.5 rounded-full inline-block">
            SUMMER VACATION
          </p>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="text-xs sm:text-sm font-bold text-coral bg-coral-light border border-coral/20 px-2 sm:px-3 py-1.5 rounded-2xl block shadow-sm whitespace-nowrap">
          4 Days / 3 Nights
        </span>
        <span className="text-[10px] text-tea text-opacity-85 mt-2 block font-mono">
          2026.06.06 - 06.09
        </span>
      </div>

      {/* 💖 Sweet Anniversary Easter Egg Modal */}
      {showEgg && portalTarget && createPortal(
        <div className="absolute inset-0 z-55 flex items-center justify-center p-5 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center p-5 pointer-events-auto w-full h-full animate-fade-in">
            {/* Backdrop */}
            <div 
              onClick={() => setShowEgg(false)}
              className="absolute inset-0 bg-fuji-dark/45 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
            />

            {/* Modal Container */}
            <div className="relative bg-white rounded-[32px] p-6 max-w-[325px] w-full shadow-2xl border border-pink-100 flex flex-col items-center text-center space-y-4 animate-scale-up z-10">
              
              {/* Close Button */}
              <button
                onClick={() => setShowEgg(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-tea/40 hover:bg-tea/5 hover:text-tea transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glowing Icon */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-500 animate-pulse">
                  <Heart className="w-9 h-9 fill-pink-500 text-pink-500" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
              </div>

              {/* Float Hearts decoration */}
              <div className="absolute inset-x-0 bottom-10 h-0 pointer-events-none overflow-visible flex justify-center">
                <span className="animate-float-1 text-pink-500 text-xl absolute left-[15%]">❤️</span>
                <span className="animate-float-2 text-rose-500 text-2xl absolute left-[30%]">💖</span>
                <span className="animate-float-3 text-pink-400 text-lg absolute right-[25%]">💕</span>
                <span className="animate-float-4 text-heart text-xl absolute right-[10%]">🌸</span>
                <span className="animate-float-5 text-coral text-2xl absolute left-[45%]">💝</span>
              </div>

              {/* Message Body */}
              <div className="space-y-2 relative z-10">
                <h3 className="text-tea/60 text-[10px] uppercase tracking-widest font-black flex items-center justify-center gap-1">
                  <span>✨ 專屬戀愛旅行彩蛋 ✨</span>
                </h3>
                <div className="py-2.5">
                  <p className="text-xl font-extrabold text-fuji-dark flex items-center justify-center gap-2">
                    <span>豪</span>
                    <span className="animate-pulse text-pink-500">❤️</span>
                    <span>均</span>
                  </p>
                  <div className="mt-3 bg-pink-50/50 rounded-2xl border border-pink-200/30 p-3">
                    <p className="text-xs text-tea font-bold">520❤️</p>
                    <p className="text-sm font-extrabold text-pink-600 mt-0.5 flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 2026 年 5 月 20 日
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl p-4 shadow-md space-y-1">
                  <p className="text-[11px] font-medium opacity-90">目前在一起已經</p>
                  <p className="text-3xl font-black font-mono tracking-tight animate-bounce">
                    {days} <span className="text-sm font-black">天</span>
                  </p>
                  <p className="text-[10px] opacity-80 font-semibold">每一天，都比昨天更愛妳 🦕🌿</p>
                </div>

                <p className="text-xs font-bold leading-relaxed text-tea/90 px-1 pt-2">
                  這次的 4 天 3 夜澎湖回憶之旅，也要牽好彼此的手，拍滿滿照片，寫下最浪漫的新篇章！🌊⛵️
                </p>
              </div>

              {/* Footer decoration */}
              <div className="flex items-center gap-1.5 text-[10px] text-pink-500/80 font-bold bg-pink-50/40 px-3 py-1 rounded-full relative z-10">
                <Gift className="w-3 h-3" />
                <span>祝我們澎湖之旅超級順利快樂！</span>
              </div>
            </div>
          </div>
        </div>,
        portalTarget
      )}
    </header>
  );
}

