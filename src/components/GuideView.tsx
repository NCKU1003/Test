/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
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
  Info,
  Plus,
  Trash2,
  X,
  Camera,
  Eye,
  ImageIcon
} from 'lucide-react';

const CATEGORY_MAP = [
  { id: 'safety', iconName: 'ShieldAlert', title: '其他資訊' },
  { id: 'essential', iconName: 'Briefcase', title: '島上必備裝備' },
  { id: 'gourmet', iconName: 'UtensilsCrossed', title: '打卡菊島美食推薦' },
];

export default function GuideView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // States for Add Custom Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('safety');
  const [newItemLink, setNewItemLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Screenshot upload & viewer states
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('app-viewport'));
  }, []);

  // Autofill cleanup when modal is closed
  useEffect(() => {
    if (!showAddModal) {
      setNewItemName('');
      setNewItemDesc('');
      setNewItemCategory('safety');
      setNewItemLink('');
      setScreenshotData('');
      setScreenshotLoading(false);
    }
  }, [showAddModal]);

  // Client-side quick compression to ensure image fits in Firestore limit (<300KB)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 720;
        const MAX_HEIGHT = 720;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
          resolve(compressedBase64);
        } else {
          resolve(img.src);
        }
      };

      reader.onerror = (error) => reject(error);
      img.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleScreenshotFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value to allow selecting same file if desired
    event.target.value = '';

    try {
      setScreenshotLoading(true);
      const compressedBase64 = await compressImage(file);
      setScreenshotData(compressedBase64);
    } catch (error) {
      console.error("Failed to compress screenshot:", error);
    } finally {
      setScreenshotLoading(false);
    }
  };

  useEffect(() => {
    const q = collection(db, 'guide_items');
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedItems: any[] = [];
      snapshot.forEach(doc => {
        fetchedItems.push(doc.data());
      });

      // Sort items: newly created or by default ID alphabetically to prevent shuffling
      fetchedItems.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        if (timeA !== timeB) {
          return timeA - timeB;
        }
        return a.id.localeCompare(b.id);
      });

      if (fetchedItems.length === 0) {
        // If empty, initialize with standard GUIDE_CATEGORIES in Firestore
        try {
          let itemIdx = 0;
          for (const cat of GUIDE_CATEGORIES) {
            for (const item of cat.items) {
              const itemId = `seed_${cat.id}_${itemIdx}`;
              itemIdx++;
              const itemRef = doc(db, 'guide_items', itemId);
              await setDoc(itemRef, {
                id: itemId,
                categoryId: cat.id,
                name: item.name,
                desc: item.desc,
                checked: !!item.checked,
                tag: item.tag || '',
                createdAt: serverTimestamp()
              });
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, 'guide_items_init');
        }
      } else {
        setItems(fetchedItems);
        setLoading(false);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'guide_items');
    });

    return unsubscribe;
  }, []);

  const handleToggleCheck = async (itemId: string, currentChecked: boolean) => {
    try {
      await updateDoc(doc(db, 'guide_items', itemId), {
        checked: !currentChecked
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `guide_items/${itemId}`);
    }
  };

  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling checkbox
    e.preventDefault();
    if (deleteConfirmId === itemId) {
      try {
        await deleteDoc(doc(db, 'guide_items', itemId));
        setDeleteConfirmId(null);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `guide_items/${itemId}`);
      }
    } else {
      setDeleteConfirmId(itemId);
    }
  };

  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    // Alphanumeric id safe for isValidId rules
    const itemId = `guide_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    try {
      await setDoc(doc(db, 'guide_items', itemId), {
        id: itemId,
        categoryId: newItemCategory,
        name: newItemName.trim(),
        desc: newItemDesc.trim(),
        checked: false,
        link: newItemLink.trim() || '',
        screenshot: screenshotData || '',
        createdAt: serverTimestamp()
      });
      
      // Reset input fields
      setNewItemName('');
      setNewItemDesc('');
      setNewItemCategory('safety');
      setNewItemLink('');
      setScreenshotData('');
      setShowAddModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `guide_items/${itemId}`);
    } finally {
      setIsSubmitting(false);
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

  // Group fetched items into categories
  const categories: GuideCategory[] = CATEGORY_MAP.map(cat => {
    return {
      id: cat.id,
      iconName: cat.iconName,
      title: cat.title,
      items: items.filter(item => item.categoryId === cat.id)
    };
  });

  // Filter based on search query
  const filteredCategories = categories.map(cat => {
    const filteredItems = cat.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.link && item.link.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return {
      ...cat,
      items: filteredItems
    };
  }).filter(cat => cat.items.length > 0 || searchQuery === ''); // Keep original structure if search is empty

  return (
    <div className="space-y-6 pb-28">
      {/* 🟢 Guide Search & Action Header */}
      <div className="bg-white p-5 rounded-[24px] border border-tea/10 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-fuji-dark flex items-center gap-1.5">
              <Sparkles className="text-coral w-5 h-5 animate-pulse" />
              菊島夏日旅途生存指南
            </h2>
            <p className="text-xs text-tea mt-1">
              出發澎湖前的準備清單、島上吃喝玩樂，與豪均的安全注意事項。
            </p>
          </div>
          
          <button
            onClick={() => {
              setNewItemCategory('safety');
              setShowAddModal(true);
            }}
            className="shrink-0 bg-fuji hover:bg-fuji-dark text-white rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>新增旅途資訊</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-tea/60" />
          <input
            type="text"
            placeholder="搜尋備忘資訊、美食特產、防護貼紙..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-mugi/50 border border-tea/15 focus:border-fuji hover:border-tea/25 outline-none pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-tea placeholder-tea/55 transition-colors"
          />
        </div>
      </div>

      {/* 🔵 Checklist Items Lists */}
      <div className="space-y-5">
        {loading ? (
          <div className="bg-white p-12 rounded-[24px] border border-tea/10 shadow-sm text-center">
            <RefreshCw className="w-6 h-6 text-fuji mx-auto animate-spin" />
            <p className="text-xs text-tea mt-3 font-semibold">同步雲端清單中...</p>
          </div>
        ) : filteredCategories.some(cat => cat.items.length > 0) ? (
          filteredCategories.map((cat, catIdx) => {
            const completedCount = cat.items.filter(item => item.checked).length;
            const totalCount = cat.items.length;

            return (
              <div
                key={cat.id}
                style={{ animationDelay: `${catIdx * 60}ms` }}
                className="bg-white rounded-[24px] border border-tea/10 shadow-sm overflow-hidden animate-fade-in"
              >
                {/* Section Header */}
                <div className="bg-cream/45 px-5 py-4 border-b border-tea/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-tea/10">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-fuji-dark text-sm">{cat.title}</h3>
                      <p className="text-[10px] text-tea opacity-85 mt-0.5">Penghu Cloud Guide</p>
                    </div>
                  </div>

                  {/* Progress Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-fuji bg-fuji-light border border-fuji/20 px-2.5 py-1 rounded-xl">
                      ✓ {completedCount} / {totalCount}
                    </span>
                  </div>
                </div>

                {/* Checklist Items list */}
                <div className="divide-y divide-tea/10">
                  {cat.items.length > 0 ? (
                    cat.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleCheck(item.id, !!item.checked)}
                        className={`flex items-start justify-between gap-3.5 px-5 py-4 cursor-pointer transition-colors group relative ${
                          item.checked 
                            ? 'bg-fuji-light/25 hover:bg-fuji-light/35' 
                            : 'hover:bg-cream/30'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* Checked Checkbox Indicator */}
                          <div className={`mt-0.5 w-5.5 h-5.5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                            item.checked 
                              ? 'bg-fuji border-fuji text-white shadow-xs scale-105' 
                              : 'border-tea/25 bg-white'
                          }`}>
                            {item.checked && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>

                          {/* Info text */}
                          <div className="space-y-1 select-none flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs font-bold transition-all break-words ${
                                item.checked ? 'text-tea/60 line-through' : 'text-fuji-dark'
                              }`}>
                                {item.name}
                              </span>
                              
                              {item.link && (
                                <a
                                  href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-lg border shrink-0 transition-all ${
                                    item.checked 
                                      ? 'bg-slate-100 text-slate-400 border-slate-200' 
                                      : 'bg-fuji-light/75 text-fuji border-fuji/15 hover:bg-fuji/10 hover:border-fuji-dark/35'
                                  }`}
                                  title={item.link}
                                >
                                  <span>🔗 相關資訊 / 網址</span>
                                </a>
                              )}

                              {item.tag && (
                                <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                                  item.checked 
                                    ? 'bg-slate-100 text-slate-400' 
                                    : 'bg-coral-light text-coral border border-coral/15'
                                }`}>
                                  {item.tag}
                                </span>
                              )}
                            </div>
                            {item.desc && (
                              <p className={`text-[11px] leading-relaxed break-words ${
                                item.checked ? 'text-tea/50 line-through' : 'text-tea/85'
                              }`}>
                                {item.desc}
                              </p>
                            )}

                            {item.screenshot && (
                              <div className="pt-2 flex items-center gap-2">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setPreviewScreenshot(item.screenshot);
                                  }}
                                  className="relative group w-11 h-11 rounded-lg overflow-hidden border border-tea/15 bg-slate-50 cursor-zoom-in hover:shadow-xs transition-shadow shrink-0 pointer-events-auto"
                                >
                                  <img 
                                    src={item.screenshot} 
                                    alt="screenshot" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-3.5 h-3.5 text-white" />
                                  </div>
                                </div>
                                <span className="text-[10px] text-tea/60 font-semibold select-none">📸 點擊放大參考圖</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Inline Delete Button with Confirm Step */}
                        <div className="shrink-0 flex items-center">
                          {deleteConfirmId === item.id ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteItem(item.id, e);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] px-2 py-1 rounded-lg transition-all shadow-xs shrink-0 select-none cursor-pointer"
                            >
                              確、定、刪、除
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setDeleteConfirmId(item.id);
                              }}
                              className="p-1 rounded-lg text-tea/20 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              title="刪除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-tea/50 text-xs font-semibold">
                      本類別目前尚無自訂資訊
                    </div>
                  )}
                </div>
              </div>
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

      {/* 💖 Add Item Modal */}
      {showAddModal && portalTarget && createPortal(
        <div className="absolute inset-0 z-55 flex items-start justify-center p-5 pt-[12%] md:pt-[15%] overflow-hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-fuji-dark/45 backdrop-blur-xs transition-opacity cursor-pointer"
          />
          
          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-tea/10 flex flex-col max-h-[82vh] space-y-4 animate-scale-up z-10">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-base font-extrabold text-fuji-dark flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-coral" />
                新增旅途重要指南
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-tea/5 text-tea/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddItemSubmit} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
              {/* Item Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-tea/80">事項名稱 *</label>
                <input
                  type="text"
                  required
                  placeholder="如: 吹風機、必去仙人掌冰、機車防曬"
                  maxLength={150}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-mugi/30 border border-tea/15 focus:border-fuji hover:border-tea/25 outline-none px-3.5 py-2.5 rounded-xl font-medium text-tea placeholder-tea/40 transition-colors"
                />
              </div>

              {/* Item Category Select */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-tea/80">歸屬分類 *</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-mugi/30 border border-tea/15 focus:border-fuji hover:border-tea/25 outline-none px-3.5 py-2.5 rounded-xl font-bold text-tea cursor-pointer transition-colors"
                >
                  <option value="safety">💡 其他資訊</option>
                  <option value="essential">🎒 島上必備裝備</option>
                  <option value="gourmet">🦪 打卡美食推薦</option>
                </select>
              </div>

              {/* Item Link */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-tea/80">相關資訊 (放網址 / 連結 - 選填)</label>
                <input
                  type="url"
                  placeholder="如: https://google.com 或是 Google Map 店家連結"
                  maxLength={500}
                  value={newItemLink}
                  onChange={(e) => setNewItemLink(e.target.value)}
                  className="w-full bg-mugi/30 border border-tea/15 focus:border-fuji hover:border-tea/25 outline-none px-3.5 py-2.5 rounded-xl font-medium text-tea placeholder-tea/40 transition-colors"
                />
              </div>

              {/* Item Description (Remarks) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-tea/80">備註 (備註補充說明 - 選填)</label>
                <textarea
                  placeholder="補充細部事項，如: 電話/訂位時間..."
                  maxLength={1000}
                  rows={3}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-mugi/30 border border-tea/15 focus:border-fuji hover:border-tea/25 outline-none px-3.5 py-2.5 rounded-xl font-medium text-tea placeholder-tea/40 transition-colors resize-none"
                />
              </div>

              {/* Screenshot Attachment (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-tea/80 block">上傳截圖 / 相關照片 (選填)</label>
                
                {screenshotData ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-tea/15 bg-slate-50 group">
                    <img 
                      src={screenshotData} 
                      alt="Selected Screenshot" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshotData('')}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors cursor-pointer flex items-center justify-center shadow-md"
                      title="移除相片"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <label
                      htmlFor="guide-screenshot-upload"
                      className="w-full h-11 border border-dashed border-tea/25 hover:border-fuji/50 bg-mugi/20 hover:bg-mugi/40 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors text-tea/75 font-semibold"
                    >
                      {screenshotLoading ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-fuji border-t-transparent" />
                          <span className="text-[11.5px] text-fuji">圖片編碼壓縮中...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 text-fuji" />
                          <span className="text-[11px]">選擇截圖或拍照上傳</span>
                        </>
                      )}
                    </label>
                    <input
                      id="guide-screenshot-upload"
                      type="file"
                      accept="image/*"
                      disabled={screenshotLoading}
                      className="hidden"
                      onChange={handleScreenshotFileChange}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 shrink-0">
                <button
                  type="button"
                  disabled={isSubmitting || screenshotLoading}
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!newItemName.trim() || isSubmitting || screenshotLoading}
                  className="w-1/2 bg-fuji hover:bg-fuji-dark disabled:bg-tea/20 disabled:text-tea/40 cursor-pointer disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/80 border-t-transparent" />
                      <span>新增中...</span>
                    </>
                  ) : (
                    <span>新增此欄</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        portalTarget
      )}

      {/* 📸 Screenshot Zoom Viewer Modal */}
      {previewScreenshot && portalTarget && createPortal(
        <div className="absolute inset-0 z-60 flex items-center justify-center p-4 overflow-hidden pointer-events-auto">
          {/* Backdrop */}
          <div 
            onClick={() => setPreviewScreenshot(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-zoom-out"
          />
          
          {/* Main Zoomed Image Container */}
          <div className="relative max-w-lg w-full flex flex-col items-center justify-center pointer-events-none md:p-6 animate-scale-up z-10">
            <div className="relative pointer-events-auto max-w-[90vw] max-h-[80vh]">
              <img 
                src={previewScreenshot} 
                alt="Enlarged Screenshot" 
                className="rounded-2xl shadow-2xl max-w-full max-h-[75vh] object-contain border-2 border-white/95"
                referrerPolicy="no-referrer"
              />
              
              {/* Close Button top-right over the image container */}
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/25 active:scale-95 text-white p-2 rounded-full shadow-lg cursor-pointer transition-all border border-white/20"
                title="關閉"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Download/Indicator text */}
            <p className="text-white/60 text-xs font-semibold mt-4 text-center pointer-events-auto select-none bg-black/45 px-4 py-1.5 rounded-full backdrop-blur-xs">
              💡 雲端備份圖片偏好 點頁面外側即可關閉
            </p>
          </div>
        </div>,
        portalTarget
      )}
    </div>
  );
}
