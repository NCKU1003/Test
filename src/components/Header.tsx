/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b-4 border-fuji/20 px-5 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-fuji text-white p-2 rounded-2xl shadow-inner animate-pulse duration-3000">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-fuji-dark">
              澎湖・均跟豪
            </h1>
            <Sparkles className="w-4 h-4 text-coral shrink-0" />
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
    </header>
  );
}
