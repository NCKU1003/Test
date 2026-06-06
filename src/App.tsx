/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav, { TabType } from './components/BottomNav';
import ItineraryView from './components/ItineraryView';
import GuideView from './components/GuideView';
import WeatherView from './components/WeatherView';
import { AnimatePresence, motion } from 'framer-motion';
import { Waves } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'itinerary':
        return <ItineraryView key="itinerary" />;
      case 'guide':
        return <GuideView key="guide" />;
      case 'weather':
        return <WeatherView key="weather" />;
      default:
        return <ItineraryView key="itinerary" />;
    }
  };

  return (
    <div className="min-h-screen bg-mugi py-0 md:py-8 flex flex-col justify-center items-center relative overflow-x-hidden antialiased">
      {/* Wave pattern decorative background for desktop viewports */}
      <div className="fixed inset-0 opacity-15 wave-texture pointer-events-none hidden md:block" />

      {/* Decorative beach cloud decorations on desktop */}
      <div className="fixed -top-12 -left-12 w-64 h-64 bg-fuji/10 rounded-full blur-3xl pointer-events-none hidden lg:block" />
      <div className="fixed -bottom-12 -right-12 w-80 h-80 bg-coral/10 rounded-full blur-3xl pointer-events-none hidden lg:block" />

      {/* Primary Mobile Container Viewport */}
      <main className="w-full max-w-[480px] min-h-screen md:min-h-[840px] bg-cream md:rounded-[36px] md:shadow-[0_25px_60px_-15px_rgba(59,122,158,0.22)] border-x border-y-0 md:border-y border-tea/10 flex flex-col relative overflow-hidden">
        {/* Header Section */}
        <Header />

        {/* Content Section with motion route changes */}
        <section className="flex-1 overflow-y-auto px-5 py-6 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.22 }}
              className="w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Floating Bottom Nav bar */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>

      {/* Desktop Helper Status Rail (Safe and unobtrusive) */}
      <div className="mt-4 text-center hidden md:block select-none pointer-events-none">
        <p className="text-[11px] font-bold text-tea/60 tracking-wider flex items-center justify-center gap-1">
          <Waves className="w-3.5 h-3.5 text-fuji/80" />
          MOBILE VIEW OPTIMIZATION — 菊島夏日散策
        </p>
      </div>
    </div>
  );
}

