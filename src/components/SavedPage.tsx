import React, { useState } from 'react';
import { Place, SavedListName } from '../types';
import { Bookmark, Star, MapPin, ChevronLeft, Trash2, Heart, Info, Sparkles } from 'lucide-react';
import PlaceCard from './PlaceCard';

interface SavedPageProps {
  places: Place[];
  savedMap: Record<string, SavedListName[]>;
  onToggleSave: (placeId: string, listName: SavedListName) => void;
  onSelectPlace: (place: Place) => void;
}

export default function SavedPage({
  places,
  savedMap,
  onToggleSave,
  onSelectPlace,
}: SavedPageProps) {
  const [selectedList, setSelectedList] = useState<SavedListName | null>(null);

  // Available defined list categories mapped to Turkish labels and descs
  const folders: { name: SavedListName; label: string; desc: string; icon: string }[] = [
    { name: 'Want to go', label: 'Gitmek İstiyorum', desc: 'Gelecek hafta sonları için yapılacaklar listesi', icon: '📍' },
    { name: 'Visited', label: 'Gittiğim Yerler', desc: 'Bizzat ziyaret edip onayladığım yerler', icon: '✓' },
    { name: 'Favorites', label: 'Süper Favorilerim', desc: 'Eşsiz lezzet ve tasarım sığınakları', icon: '★' },
    { name: 'Date spots', label: 'Buluşma Noktaları', desc: 'Loş ışıklar, mumlar ve samimi köşeler', icon: '♥' },
    { name: 'Coffee list', label: 'Kahve Defteri', desc: 'Üçüncü dalga estetik nitelikli kahveciler', icon: '☕' },
    { name: 'Weekend route', label: 'Haftasonu Kaçamağı', desc: 'Özenle seçilmiş Urla/Alaçatı rotası', icon: '🚗' },
  ];

  // Helper to get list label in Turkish
  const translateListName = (name: SavedListName) => {
    return folders.find(f => f.name === name)?.label || name;
  };

  // Map places to this specific list category
  const getPlacesInList = (listName: SavedListName) => {
    return places.filter((place) => {
      const lists = savedMap[place.id] || [];
      return lists.includes(listName);
    });
  };

  // Calculate stats
  const totalSavedCount = Object.values(savedMap).filter(lists => lists.length > 0).length;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#F9F8F6]">
      
      {/* List Header View */}
      {!selectedList ? (
        <div className="space-y-6 animate-fade-in-up">
          {/* User Profile Style Cover Header */}
          <div className="bg-warm-cream p-6 pb-8 rounded-b-[40px] border-b border-artistic-border space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#4A4A40] flex items-center justify-center border border-artistic-border shadow-sm">
                <span className="font-serif text-xl italic text-white font-light">E</span>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C8880] opacity-85 block">Kişisel Defter</span>
                <h1 className="font-serif italic text-2xl font-light tracking-tight text-[#2C2C2C] leading-tight">
                  Koleksiyon Defteri
                </h1>
                <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed">
                  Özenle seçilmiş Ege koleksiyonlarınız, koordinatlarınız ve rotalarınız.
                </p>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-2 bg-white p-3.5 rounded-2xl border border-artistic-border shadow-sm">
              <div className="text-center">
                <span className="block font-serif text-base font-normal text-[#2C2C2C]">{totalSavedCount}</span>
                <span className="font-mono text-[7.5px] uppercase tracking-wider text-[#8C8880] font-semibold">Toplam Yer</span>
              </div>
              <div className="text-center border-x border-[#E5E2DE]">
                <span className="block font-serif text-base font-normal text-[#2C2C2C]">
                  {getPlacesInList('Visited').length}
                </span>
                <span className="font-mono text-[7.5px] uppercase tracking-wider text-[#8C8880] font-semibold font-bold">Gittim</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-base font-normal text-[#2C2C2C]">
                  {folders.length}
                </span>
                <span className="font-mono text-[7.5px] uppercase tracking-wider text-[#8C8880] font-semibold">Koleksiyon</span>
              </div>
            </div>
          </div>

          {/* Folder Grid view (Instagram Saved Style Stacked Folders) */}
          <div className="px-6 space-y-4">
            <h2 className="font-serif text-lg font-normal text-[#2C2C2C] tracking-tight">
              Koleksiyonlarım
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {folders.map((folder) => {
                const listPlaces = getPlacesInList(folder.name);
                const hasSpots = listPlaces.length > 0;
                const coverImage = hasSpots ? listPlaces[0].image : null;

                return (
                  <button
                    key={folder.name}
                    onClick={() => setSelectedList(folder.name)}
                    className="flex flex-col text-left group focus:outline-none select-none cursor-pointer"
                  >
                    {/* Visual Stacked Card Container */}
                    <div className="w-full aspect-1/1 bg-[#F1EFEC] rounded-[2rem] relative overflow-hidden shadow-sm border border-artistic-border">
                      {coverImage ? (
                        <>
                          <img
                            src={coverImage}
                            alt={folder.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-[#2C2C2C]/30" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F1EFEC] to-[#F9F8F6]" />
                      )}

                      {/* Display folder icon and count inside the visual pocket */}
                      <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                        <span className="text-2xl drop-shadow-sm">{folder.icon}</span>
                        <div className="space-y-0.5">
                          <span className="font-mono text-[9px] font-bold text-stone-200 bg-[#2C2C2C]/70 backdrop-blur-[2px] px-2.5 py-1 rounded-full w-max block">
                            {listPlaces.length} mekan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata under folder card */}
                    <div className="mt-3 px-1 space-y-0.5">
                      <h3 className="font-serif text-sm font-normal text-[#2C2C2C] group-hover:text-warm-brand transition-colors">
                        {folder.label}
                      </h3>
                      <p className="font-sans text-[10px] text-[#8C8880] leading-normal line-clamp-1">
                        {folder.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Expanded Single List Detail View */
        <div className="space-y-6 animate-fade-in-up">
          {/* Back button and List title header */}
          <div className="bg-warm-cream p-6 pb-6 rounded-b-[40px] border-b border-artistic-border space-y-4">
            <button
              onClick={() => setSelectedList(null)}
              className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase hover:text-neutral-950 transition-colors cursor-pointer select-none"
            >
              <ChevronLeft size={12} strokeWidth={2.5} />
              <span>Deftere Geri Dön</span>
            </button>

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h1 className="font-serif italic text-2xl font-light tracking-tight text-[#2C2C2C]">
                  {translateListName(selectedList)}
                </h1>
                <p className="font-sans text-xs text-[#6A665D]">
                  {folders.find(f => f.name === selectedList)?.desc}
                </p>
              </div>
              <span className="bg-[#4A4A40] text-stone-100 font-mono text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full border border-artistic-border">
                {getPlacesInList(selectedList).length} Mekan
              </span>
            </div>
          </div>

          {/* List content list grid */}
          <div className="px-6 space-y-4">
            {getPlacesInList(selectedList).length === 0 ? (
              <div className="text-center py-20 px-6 bg-white rounded-[2rem] border border-artistic-border flex flex-col items-center justify-center gap-3 shadow-sm">
                <Bookmark size={36} className="text-[#8C8880]" strokeWidth={1} />
                <span className="font-serif text-sm font-normal text-[#2C2C2C]">Listeniz sizi bekliyor</span>
                <p className="font-sans text-xs text-[#8C8880] max-w-[85%] leading-relaxed">
                  Yerinde uygulamasındaki harika estetik mekanları keşfederek doğrudan <b>{translateListName(selectedList)}</b> listenize ekleyin.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {getPlacesInList(selectedList).map((place) => {
                  const savedLists = savedMap[place.id] || [];
                  const isSaved = savedLists.length > 0;
                  return (
                    <div key={place.id} className="relative group">
                      <PlaceCard
                        place={place}
                        isSaved={isSaved}
                        savedLists={savedLists}
                        onToggleSave={onToggleSave}
                        onSelect={onSelectPlace}
                      />
                      {/* Swipe / Quick trash button at top layer */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(place.id, selectedList);
                        }}
                        className="absolute bottom-6 right-6 z-20 bg-[#2C2C2C] text-red-400 hover:text-red-300 border border-artistic-border p-2.5 rounded-2xl cursor-pointer shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 font-mono text-[9px] font-bold"
                        title="Listeden Kaldır"
                      >
                        <Trash2 size={13} />
                        Kaldır
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
