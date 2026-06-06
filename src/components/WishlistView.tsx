/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  getFirestore 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { 
  Sparkles, 
  Heart, 
  Plus, 
  MapPin, 
  User, 
  ExternalLink, 
  Trash2, 
  Search, 
  Compass, 
  Utensils, 
  Bike, 
  ShoppingBag, 
  Home, 
  Car,
  CheckCircle,
  HelpCircle,
  X,
  Calendar,
  Clock
} from 'lucide-react';
import { SpotType } from '../types';

interface WishItem {
  id: string;
  name: string;
  notes: string;
  category: SpotType;
  author: string;
  likes: number;
  likedBy: string[];
  gmapUrl: string;
  createdAt: any;
}

export default function WishlistView() {
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState<boolean>(false);
  const [spotName, setSpotName] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [category, setCategory] = useState<SpotType>('attraction');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Add to Itinerary Modal States
  const [addingWishToItinerary, setAddingWishToItinerary] = useState<WishItem | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [visitTime, setVisitTime] = useState<string>('12:00');
  const [isAddingToItinerary, setIsAddingToItinerary] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('app-viewport'));
  }, []);

  const handleAddToItineraryConfirm = async () => {
    if (!addingWishToItinerary) return;
    setIsAddingToItinerary(true);
    setErrorText(null);

    const suffix = Math.random().toString(36).substring(2, 8);
    const customSpotId = `custom_${addingWishToItinerary.id}_${Date.now()}_${suffix}`.replace(/[^a-zA-Z0-9_\-]/g, '');

    try {
      const docRef = doc(db, 'custom_spots', customSpotId);
      await setDoc(docRef, {
        id: customSpotId,
        wishId: addingWishToItinerary.id || '',
        dayNumber: Number(selectedDayNumber),
        time: visitTime || '12:00',
        name: (addingWishToItinerary.name || '').substring(0, 150),
        description: (addingWishToItinerary.notes || '').substring(0, 1000),
        type: addingWishToItinerary.category || 'attraction',
        gmapUrl: addingWishToItinerary.gmapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((addingWishToItinerary.name || '').trim())}`,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage(`已經成功將「${addingWishToItinerary.name}」排入 Day ${selectedDayNumber} 的行程囉！✨`);
      setTimeout(() => {
        setSuccessMessage(null);
        setAddingWishToItinerary(null);
      }, 2000);
    } catch (e: any) {
      console.error(e);
      setErrorText("加入行程時發生錯誤，請稍後重試！");
      handleFirestoreError(e, OperationType.WRITE, `custom_spots/${customSpotId}`);
    } finally {
      setIsAddingToItinerary(false);
    }
  };

  // Local state for checking who voted currently to avoid flickering
  const currentUserId = auth.currentUser?.uid || 'anonymous_user';

  // Load wishlist items synced from Firestore
  useEffect(() => {
    setLoading(true);
    const wishlistCollection = collection(db, 'wishlist');
    
    const unsubscribe = onSnapshot(
      wishlistCollection, 
      (snapshot) => {
        const loadedWishes: WishItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedWishes.push({
            id: docSnap.id,
            name: data.name || '',
            notes: data.notes || '',
            category: (data.category || 'attraction') as SpotType,
            author: data.author || '',
            likes: data.likes || 0,
            likedBy: data.likedBy || [],
            gmapUrl: data.gmapUrl || '',
            createdAt: data.createdAt,
          });
        });
        
        // Sort: primary by likes count desc, secondary by createdAt time desc
        loadedWishes.sort((a, b) => {
          if (b.likes !== a.likes) {
            return b.likes - a.likes;
          }
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setWishes(loadedWishes);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading wishlist from Firestore:", error);
        setErrorText(`無法連接到雲端許願池: ${error instanceof Error ? error.message : String(error)}`);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Submit new wish
  const handleAddWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim()) return;

    // Enforce 100 items limit
    if (wishes.length >= 100) {
      setErrorText("許願池已達上限 100 個願望囉！請刪除一些非必要的願望後再投遞新願望。");
      return;
    }
    
    // Default author to "大家" if blank
    const finalAuthor = authorName.trim() || '神秘旅客';

    // Google Maps Search Query fallback: open Google maps query directly using Google maps Web Intent API
    // This allows accurate searches for any locations
    const finalGMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotName.trim())}`;

    const wishId = `wish_${Date.now()}`;
    const newWishPayload = {
      id: wishId,
      name: spotName.trim(),
      notes: notes.trim(),
      category: category,
      author: finalAuthor,
      likes: 1, // Author instantly upvotes
      likedBy: [currentUserId],
      gmapUrl: finalGMapUrl,
      createdAt: serverTimestamp()
    };

    setSubmitting(true);
    try {
      await setDoc(doc(db, 'wishlist', wishId), newWishPayload);
      
      // Reset form setup
      setSpotName('');
      setNotes('');
      setAuthorName('');
      setCategory('attraction');
      setShowForm(false);
    } catch (error: any) {
      console.error("Failed to add wish:", error);
      try {
        handleFirestoreError(error, OperationType.CREATE, `wishlist/${wishId}`);
      } catch (e: any) {
        try {
          const parsed = JSON.parse(e.message);
          setErrorText(`上傳許願失敗: ${parsed.error || parsed.message || e.message}`);
        } catch {
          setErrorText(`上傳許願失敗: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Upvote / Toggle Me Too vote count
  const toggleLike = async (wish: WishItem) => {
    const isLiked = wish.likedBy.includes(currentUserId);
    const newLikedBy = isLiked 
      ? wish.likedBy.filter(id => id !== currentUserId)
      : [...wish.likedBy, currentUserId];
    
    const newLikesVal = newLikedBy.length;

    try {
      await updateDoc(doc(db, 'wishlist', wish.id), {
        likes: newLikesVal,
        likedBy: newLikedBy
      });
    } catch (error) {
      console.error("Failed to update vote:", error);
      try {
        handleFirestoreError(error, OperationType.UPDATE, `wishlist/${wish.id}`);
      } catch (e: any) {
        try {
          const parsed = JSON.parse(e.message);
          setErrorText(`點選支持失敗: ${parsed.error || parsed.message || e.message}`);
        } catch {
          setErrorText(`點選支持失敗: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }
  };

  // Delete wish spot (Only show option or allow anyone to help curate/prune spam)
  const handleDeleteWish = async (wishId: string) => {
    try {
      await deleteDoc(doc(db, 'wishlist', wishId));
    } catch (error) {
      console.error("Failed to remove wish:", error);
      try {
        handleFirestoreError(error, OperationType.DELETE, `wishlist/${wishId}`);
      } catch (e: any) {
        try {
          const parsed = JSON.parse(e.message);
          setErrorText(`刪除卡片失敗: ${parsed.error || parsed.message || e.message}`);
        } catch {
          setErrorText(`刪除卡片失敗: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
    }
  };

  // Group helpers for colors and icons
  const getCategoryDetails = (cat: SpotType) => {
    switch (cat) {
      case 'food':
        return { label: '美食', color: 'bg-amber-100 text-amber-700 border-amber-200/50', icon: Utensils };
      case 'activity':
        return { label: '活動', color: 'bg-emerald-100 text-emerald-700 border-emerald-200/50', icon: Bike };
      case 'shopping':
        return { label: '伴手禮', color: 'bg-coral-light text-coral border-coral/15', icon: ShoppingBag };
      case 'stay':
        return { label: '住宿', color: 'bg-indigo-100 text-indigo-700 border-indigo-200/50', icon: Home };
      case 'transport':
        return { label: '交通', color: 'bg-sky-100 text-sky-700 border-sky-200/50', icon: Car };
      default:
        return { label: '美景', color: 'bg-fuji-light text-fuji border-fuji/10', icon: Compass };
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* 🔮 Top Wishpool Intro Billboard */}
      <div className="bg-gradient-to-br from-pink-500/5 via-fuji/5 to-cream p-5 rounded-[24px] border border-pink-200/25 shadow-xs relative overflow-hidden">
        <div className="absolute -right-3 -top-3 text-pink-500/10 pointer-events-none">
          <Sparkles className="w-24 h-24" />
        </div>

        <div className="flex items-start gap-3.5">
          <div className="bg-pink-100 border border-pink-200 p-3 rounded-2xl text-pink-600 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-lg font-black text-fuji-dark">菊島夏日 ｜ 景點許願池</h2>
              <span className="text-[10px] text-pink-600 bg-pink-50 font-bold border border-pink-100 px-1.5 py-0.5 rounded-md">
                即時同步
              </span>
            </div>
            <p className="text-xs text-tea leading-relaxed mt-1">
              由<strong>均、豪及大家</strong>共同維護的想去清單（容量上限：100 個願望）！看到想去的地點，點擊 <strong>❤️ 我也想去</strong> 來增加排程熱度；也可以新增自己心儀的<strong>任何澎湖景點或店家</strong>！
            </p>
          </div>
        </div>
      </div>

      {errorText && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3.5 text-xs text-center flex items-center justify-center gap-2">
          <X className="w-4 h-4 cursor-pointer" onClick={() => setErrorText(null)} />
          {errorText}
        </div>
      )}

      {/* ➕ Add New Wish Floating trigger block (Collapsible Card Form) */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 px-5 rounded-[22px] bg-white border border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50/20 text-pink-600 font-bold text-sm tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-xs group"
        >
          <Plus className="w-5 h-5 group-hover:scale-115 transition-transform" />
          新增我想去的地方 (投遞許願卡)
        </button>
      ) : (
        <div className="bg-white rounded-[24px] border border-pink-200 p-5 space-y-4 shadow-md relative animate-fade-in">
          <div className="flex items-center justify-between border-b border-tea/5 pb-2.5">
            <h3 className="font-black text-fuji-dark text-base flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-pink-500" />
              寫下新的澎湖渴望
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setSpotName('');
              }}
              className="p-1 px-2 rounded-lg text-xs text-tea hover:bg-mugi/50 cursor-pointer"
            >
              關閉
            </button>
          </div>

          <form onSubmit={handleAddWish} className="space-y-4.5">
            {/* Input Name (Direct typing, any location/shop name) */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-tea block">📍 景點 / 商家名稱</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="請輸入任何你想去的澎湖景點 / 美食餐飲 / 住宿等... (無限制)"
                  value={spotName}
                  onChange={(e) => setSpotName(e.target.value)}
                  className="w-full p-2.5 bg-mugi/40 border border-tea/15 rounded-xl text-xs text-fuji-dark focus:outline-none focus:border-pink-400 font-medium"
                />
                <div className="absolute right-3 top-2.5 text-tea/50">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Google Search Link Intent feedback helper */}
            {spotName.trim() && (
              <div className="bg-sky-50 border border-sky-100 p-2.5 rounded-xl flex items-center justify-between gap-2.5">
                <span className="text-[10px] text-sky-700 leading-tight">
                  📌 送出後將自動鏈結 <strong>Google Maps 頁面</strong> 
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spotName.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1 bg-white border border-sky-200 text-[10px] text-sky-600 font-bold px-2 py-1 rounded-lg hover:bg-sky-100"
                >
                  <ExternalLink className="w-3 h-3" />
                  試查地圖 GMap 🔍
                </a>
              </div>
            )}

            {/* Author Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tea block">👤 許願人 / 提案人</label>
              <div className="grid grid-cols-4 gap-2">
                {['均', '豪', '均與豪'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setAuthorName(name)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      authorName === name 
                        ? 'bg-fuji text-white border-transparent' 
                        : 'bg-mugi/20 border-tea/15 text-tea hover:bg-mugi/50'
                    }`}
                  >
                    {name}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="自訂名字"
                  value={['均', '豪', '均與豪'].includes(authorName) ? '' : authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="p-2 border border-tea/15 rounded-xl text-xs focus:outline-none bg-mugi/20 text-fuji-dark"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-tea block">🗂️ 景點分類</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SpotType)}
                  className="w-full p-2.5 bg-mugi/40 border border-tea/15 rounded-xl text-xs text-fuji-dark focus:outline-none"
                >
                  <option value="attraction">🗻 熱門美景</option>
                  <option value="food">🍱 在地美食</option>
                  <option value="activity">🏄 刺激活動</option>
                  <option value="shopping">🛍️ 伴手特產</option>
                  <option value="stay">🏡 住宿選擇</option>
                  <option value="transport">🚗 交通租車</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-tea block">❤️ 熱度增幅</label>
                <div className="p-2 bg-pink-50 border border-pink-100 rounded-xl text-center text-xs text-pink-600 font-bold flex items-center justify-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-bounce" />
                  自己搶先 +1
                </div>
              </div>
            </div>

            {/* Notes / Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-tea block">📝 想去的原因 / 推薦點</label>
              <textarea
                placeholder="例：聽說他的仙人掌汁特別純，好想拍照打卡。或者是：想去一趟浮潛看珊瑚礁。"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-mugi/40 border border-tea/15 rounded-xl text-xs text-fuji-dark focus:outline-none focus:border-pink-400"
              />
            </div>

            <div className="flex gap-2.5 pt-1 border-t border-tea/5">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSpotName('');
                }}
                className="flex-1 py-3 text-xs font-bold text-tea/80 bg-mugi/50 rounded-xl border border-tea/10 hover:bg-mugi cursor-pointer transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting || !spotName.trim()}
                className="flex-1 py-3 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
              >
                {submitting ? '發放卡片中...' : '🎉 投遞許願！'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 List of Wished items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-xs font-black text-tea bg-cream px-2 py-0.5 rounded border border-tea/10">
            📊 許願人氣排行榜 
          </label>
          <span className="text-[10px] text-tea/55 font-bold">按人氣排序 🥇</span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-tea/70">正在載入雲端許願池...</p>
          </div>
        ) : wishes.length === 0 ? (
          <div className="bg-white border border-dashed border-tea/10 rounded-[24px] p-8 text-center space-y-3">
            <p className="text-xs text-tea/80">目前還沒有人許願喔，真希望趕快有人寫第一個願望 ❤️</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl text-xs font-bold border border-pink-200 cursor-pointer"
            >
              馬上當第一個許願家！
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {wishes.map((wish, index) => {
              const catDet = getCategoryDetails(wish.category);
              const CatIcon = catDet.icon;
              const hasVoted = wish.likedBy.includes(currentUserId);

              return (
                <div 
                  key={wish.id}
                  className="bg-white border rounded-[22px] p-4 shadow-xs hover:shadow-md transition-all border-tea/10 flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Top Rank Badge */}
                  {index < 3 && (
                    <div className="absolute right-0 top-0 text-[10px] font-black px-3.5 py-1 rounded-bl-xl bg-amber-400 text-amber-950 flex items-center gap-0.5">
                      🥇 Top {index + 1}
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Badge Category & Author info */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${catDet.color}`}>
                        <CatIcon className="w-2.5 h-2.5" />
                        {catDet.label}
                      </span>
                      
                      <span className="text-[10px] text-tea bg-mugi/55 px-2 py-0.5 border border-tea/5 rounded-md flex items-center gap-1">
                        <User className="w-2.5 h-2.5" />
                        {wish.author} 提案
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {/* Name with custom Google Maps Search intent */}
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="font-extrabold text-fuji-dark text-sm md:text-base group-hover:text-pink-600 transition-colors">
                          {wish.name}
                        </h4>
                        
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wish.name.trim())}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tea/60 hover:text-fuji shrink-0 flex items-center gap-0.5 text-xs bg-cream border border-tea/10 hover:border-fuji/30 px-1.5 py-0.5 rounded-lg transition-colors"
                          title="在 Google Maps 上打開搜尋"
                        >
                          <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                          <span className="text-[10px] font-bold">地圖</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Notes / Why */}
                      {wish.notes && (
                        <p className="text-xs text-tea leading-relaxed border-l-2 border-pink-100 pl-2 bg-pink-50/10 py-1 rounded-r">
                          {wish.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar (Likes and Curator Delete) */}
                  <div className="flex items-center justify-between border-t border-tea/5 mt-3.5 pt-2.5 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Support Button (Heart count) */}
                      <button
                        onClick={() => toggleLike(wish)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                          hasVoted 
                            ? 'bg-pink-500 text-white border-transparent shadow-xs font-extrabold' 
                            : 'bg-cream text-pink-600 border-pink-300/40 hover:bg-pink-50/20'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white' : 'fill-pink-500 text-pink-500'}`} />
                        <span className="text-[11px] font-bold">{hasVoted ? '想去' : '想去'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${hasVoted ? 'bg-white/20' : 'bg-pink-100 text-pink-600'}`}>
                          {wish.likes}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setAddingWishToItinerary(wish);
                          setSelectedDayNumber(1);
                          setVisitTime('12:00');
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-fuji-light hover:bg-fuji/20 text-fuji border border-fuji/15 transition-all text-[11px] font-extrabold cursor-pointer active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5 text-fuji" />
                        <span>排入行程</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-tea/40 font-mono text-[9px]">
                      {/* Inline deletion confirmation */}
                      {deletingId === wish.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-lg animate-fade-in shadow-xs">
                          <span className="text-[9px] text-rose-600 font-bold scale-90">確定刪除？</span>
                          <button
                            onClick={() => {
                              handleDeleteWish(wish.id);
                              setDeletingId(null);
                            }}
                            className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded hover:bg-rose-600 transition-colors cursor-pointer"
                          >
                            是
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="bg-tea/10 text-tea text-[9px] font-bold px-1.5 py-0.5 rounded hover:bg-tea/20 transition-colors cursor-pointer"
                          >
                            否
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(wish.id)}
                          className="p-1 text-tea/50 hover:text-rose-500 rounded cursor-pointer transition-colors"
                          title="清退此景點"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🏮 Add to Itinerary Portal Modal */}
      {portalTarget && createPortal(
        <div className="absolute inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
          {addingWishToItinerary && (
            <div className="absolute inset-0 flex items-center justify-center p-5 pointer-events-auto w-full h-full">
              {/* Backdrop */}
              <div
                onClick={() => {
                  if (!isAddingToItinerary) setAddingWishToItinerary(null);
                }}
                className="absolute inset-0 bg-fuji-dark/30 backdrop-blur-xs transition-opacity duration-300"
              />

              {/* Modal window */}
              <div className="relative bg-white rounded-[28px] p-5.5 shadow-2xl max-w-[340px] w-full border border-tea/10 space-y-4 z-10 animate-fade-in flex flex-col">
                <div className="flex items-center justify-between border-b border-tea/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-fuji-light p-1.5 rounded-xl text-fuji shrink-0">
                      <Calendar className="w-4 h-4" />
                    </span>
                    <h3 className="font-extrabold text-fuji-dark text-sm sm:text-base">
                      排入澎湖回憶行程
                    </h3>
                  </div>
                  <button
                    onClick={() => setAddingWishToItinerary(null)}
                    disabled={isAddingToItinerary}
                    className="p-1 rounded-lg text-tea/50 hover:bg-tea/5 hover:text-tea cursor-pointer disabled:opacity-40"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {successMessage ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200 animate-bounce">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <p className="text-xs font-bold text-emerald-600 leading-relaxed max-w-[240px] mx-auto">
                      {successMessage}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-tea/60 tracking-wider">排定景點名稱</span>
                      <p className="font-bold text-fuji-dark text-sm mt-0.5">{addingWishToItinerary.name}</p>
                    </div>

                    {/* Day select */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-tea/60 tracking-wider">選擇第幾天遊玩？</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[1, 2, 3, 4].map((day) => {
                          const isSelected = selectedDayNumber === day;
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setSelectedDayNumber(day)}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-fuji text-white border-transparent shadow-xs'
                                  : 'bg-cream text-tea border-tea/15 hover:bg-tea/5'
                              }`}
                            >
                              Day {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Visit Time input */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-tea/60 tracking-wider">預計到達時間 (Time)</span>
                      <div className="flex gap-2">
                        <select
                          value={visitTime}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="flex-1 bg-cream border border-tea/15 rounded-xl px-2.5 py-2 font-bold text-tea focus:outline-none focus:border-fuji/60 text-xs shadow-2xs"
                        >
                          <option value="08:00">08:00 (晨起)</option>
                          <option value="09:30">09:30 (上午)</option>
                          <option value="11:00">11:00 (午餐前)</option>
                          <option value="12:30">12:30 (午餐後)</option>
                          <option value="14:00">14:00 (午後)</option>
                          <option value="15:30">15:30 (下午茶)</option>
                          <option value="17:00">17:00 (黃昏踏浪)</option>
                          <option value="18:30">18:30 (晚餐)</option>
                          <option value="20:00">20:00 (夜宵/散步)</option>
                        </select>
                        <input
                          type="text"
                          value={visitTime}
                          onChange={(e) => setVisitTime(e.target.value)}
                          placeholder="或自訂，如 15:00"
                          className="w-[120px] bg-cream border border-tea/15 rounded-xl px-2.5 py-2 font-bold text-tea focus:outline-none focus:border-fuji/60 text-xs shadow-2xs"
                        />
                      </div>
                    </div>

                    {errorText && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-2.5 text-[11px] text-rose-500 font-bold">
                        ⚠️ {errorText}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setAddingWishToItinerary(null)}
                        disabled={isAddingToItinerary}
                        className="flex-1 py-2.5 rounded-xl border border-tea/15 hover:bg-tea/5 text-tea font-bold cursor-pointer transition-colors active:scale-95 disabled:opacity-40"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleAddToItineraryConfirm}
                        disabled={isAddingToItinerary}
                        className="flex-1 py-2.5 rounded-xl bg-fuji text-white font-bold cursor-pointer transition-colors hover:bg-fuji/95 active:scale-95 shadow-sm disabled:opacity-40 flex items-center justify-center gap-1.5"
                      >
                        {isAddingToItinerary ? (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        ) : null}
                        確認加入
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>,
        portalTarget
      )}
    </div>
  );
}
