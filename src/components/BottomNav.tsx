/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Map, BookOpen, Sun, Waves, Sparkles } from 'lucide-react';

export type TabType = 'itinerary' | 'guide' | 'weather' | 'wishlist';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    {
      id: 'itinerary' as TabType,
      label: '行程 Itinerary',
      icon: Map,
      color: 'bg-fuji/10 text-fuji',
    },
    {
      id: 'guide' as TabType,
      label: '指南 Guide',
      icon: BookOpen,
      color: 'bg-coral/10 text-coral',
    },
    {
      id: 'weather' as TabType,
      label: '天氣 Weather',
      icon: Sun,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 'wishlist' as TabType,
      label: '許願 Wish',
      icon: Sparkles,
      color: 'bg-pink-500/10 text-pink-600',
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[450px] px-2 py-1.5 bg-cream/75 backdrop-blur-xl border border-tea/10 rounded-[28px] shadow-[0_12px_40px_-12px_rgba(59,122,158,0.25)] flex items-center justify-around transition-all duration-300">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            id={`nav-btn-${item.id}`}
            className={`flex flex-col items-center justify-center py-2 px-3 rounded-[20px] transition-all duration-300 relative cursor-pointer ${
              isActive 
                ? 'bg-fuji text-white shadow-[0_5px_15px_-3px_rgba(59,122,158,0.4)] scale-102 font-bold' 
                : 'text-tea hover:text-fuji hover:bg-fuji-light/50'
            }`}
          >
            <div className="flex items-center gap-1">
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-white' : ''}`} />
              <span className="text-[11px] tracking-wide">
                {item.label.split(' ')[0]}
              </span>
            </div>
            
            {/* Active state is fully represented by the background color change, so we don't need the dot */}
          </button>
        );
      })}
    </div>
  );
}
