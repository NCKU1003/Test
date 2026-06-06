/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GUIDE_CATEGORIES } from '../data';
import { GuideCategory } from '../types';
import { 
  CheckCircle,
  Briefcase, 
  UtensilsCrossed, 
  ShieldAlert, 
  Search, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export default function GuideView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<GuideCategory[]>(() => {
    try {
      const saved = localStorage.getItem('penghu_guide_checklist');
      return saved ? JSON.parse(saved) : GUIDE_CATEGORIES;
    } catch {
      return GUIDE_CATEGORIES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('penghu_guide_checklist', JSON.stringify(categories));
    } catch (e) {
      console.error("Failed to save checklist state", e);
    }
  }, [categories]);

  const handleToggleCheck = (catId: string, itemName: string) => {
    setCategories(prev => 
      prev.map(cat => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          items: cat.items.map(item => 
            item.name === itemName 
              ? { ...item, checked: !item.checked }
              : item
          )
        };
      })
    );
  };

  const handleReset = () => {
    if (window.confirm("確定要把清單恢復成初始預設狀態嗎？")) {
      setCategories(GUIDE_CATEGORIES);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-fuji" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-coral" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      default:
        return <Briefcase className="w-5 h-5 text-tea" />;
    }
  };

  // Filter checklist items based on search query
  const filteredCategories = categories.map(cat => {
    const filteredItems = cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return {
      ...cat,
      items: filteredItems
    };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="space-y-6 pb-28">
      {/* 🟢 Guide Search & Helper Header */}
      <div className="bg-white p-5 rounded-[24px] border border-tea/10 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-fuji-dark flex items-center gap-1.5">
            <Sparkles className="text-coral w-5 h-5" />
            菊島夏秀旅途生存指南
          </h2>
          <p className="text-xs text-tea mt-1">
            出發澎湖前的行李清單，與島上吃喝玩樂、安全騎乘的小叮嚀。
          </p>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-tea/60" />
          <input
            type="text"
            placeholder="搜尋物品、美食或備註資訊..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-mugi/50 border border-tea/15 focus:border-fuji hover:border-tea/25 outline-none pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-tea placeholder-tea/55 transition-colors"
          />
        </div>
      </div>

      {/* 🔵 Checklist Items Lists */}
      <div className="space-y-5">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, catIdx) => {
            const completedCount = cat.items.filter(item => item.checked).length;
            const totalCount = cat.items.length;
            const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: catIdx * 0.08 }}
                className="bg-white rounded-[24px] border border-tea/10 shadow-sm overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-cream/45 px-5 py-4 border-b border-tea/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-tea/10">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-fuji-dark text-sm">{cat.title}</h3>
                      <p className="text-[10px] text-tea opacity-85 mt-0.5">Penghu Local Tips</p>
                    </div>
                  </div>

                  {/* Progress Badge */}
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-fuji bg-fuji-light border border-fuji/20 px-2.5 py-1 rounded-xl">
                      ✓ {completedCount} / {totalCount}
                    </span>
                  </div>
                </div>

                {/* Checklist Items list */}
                <div className="divide-y divide-tea/10">
                  {cat.items.map((item) => (
                    <label
                      key={item.name}
                      id={`chk-lbl-${cat.id}-${item.name.replace(/\s+/g, '')}`}
                      className={`flex items-start gap-3.5 px-5 py-4 cursor-pointer transition-colors ${
                        item.checked 
                          ? 'bg-fuji-light/25 hover:bg-fuji-light/35' 
                          : 'hover:bg-cream/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.checked}
                        onChange={() => handleToggleCheck(cat.id, item.name)}
                        className="sr-only"
                      />
                      
                      {/* Check circle block */}
                      <div className={`mt-0.5 w-5.5 h-5.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                        item.checked 
                          ? 'bg-fuji border-fuji text-white shadow-xs scale-105' 
                          : 'border-tea/25 bg-white hover:border-tea'
                      }`}>
                        {item.checked && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>

                      {/* Info text */}
                      <div className="space-y-1 select-none flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold transition-all ${
                            item.checked ? 'text-tea/60 line-through' : 'text-fuji-dark'
                          }`}>
                            {item.name}
                          </span>
                          
                          {item.tag && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              item.checked 
                                ? 'bg-slate-100 text-slate-400' 
                                : 'bg-coral-light text-coral border border-coral/15'
                            }`}>
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] leading-relaxed transition-all ${
                          item.checked ? 'text-tea/50 line-through' : 'text-tea/85'
                        }`}>
                          {item.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-[24px] border border-tea/10 shadow-sm text-center">
            <Info className="w-8 h-8 text-tea/40 mx-auto" />
            <p className="text-sm font-bold text-tea/75 mt-3">找不到符合條件的生存叮嚀</p>
            <p className="text-xs text-tea/55 mt-1">請試試其他搜尋關鍵字</p>
          </div>
        )}
      </div>

      {/* 🧡 Reset Button */}
      <div className="flex justify-center">
        <button
          onClick={handleReset}
          className="bg-white hover:bg-mugi/40 border border-tea/15 text-tea/80 hover:text-tea text-[11px] font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置清單狀態
        </button>
      </div>
    </div>
  );
}
