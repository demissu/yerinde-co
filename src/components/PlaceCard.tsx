import React, { useState } from 'react';
import { Place, SavedListName } from '../types';
import { Bookmark, Star, MapPin, Plus, Check } from 'lucide-react';

interface PlaceCardProps {
  key?: string;
  place: Place;
  isSaved: boolean;
  savedLists: SavedListName[];
  onToggleSave: (placeId: string, listName: SavedListName) => void;
  onSelect: (place: Place) => void;
}

export default function PlaceCard({
  place,
  isSaved,
  savedLists,
  onToggleSave,
  onSelect,
}: PlaceCardProps) {
  const [showQuickSaveMenu, setShowQuickSaveMenu] = useState(false);

  // Available lists to save to
  const availableLists: SavedListName[] = [
    'Want to go',
    'Visited',
    'Favorites',
    'Date spots',
    'Coffee list',
    'Weekend route'
  ];

  // Translators for Turkish list names
  const translateListName = (list: string): string => {
    const dictionary: Record<string, string> = {
      'Want to go': 'Gitmek İstiyorum',
      'Visited': 'Gittim',
      'Favorites': 'Favorilerim',
      'Date spots': 'Buluşma Mekanları',
      'Coffee list': 'Kahve Listem',
      'Weekend route': 'Haftasonu Rotası'
    };
    return dictionary[list] || list;
  };

  // Translators for Turkish category labels
  const formatCategory = (cat: string): string => {
    const dictionary: Record<string, string> = {
      'coffee': 'KAHVE',
      'food': 'YEMEK',
      'dessert': 'TATLI',
      'bar': 'BAR',
      'breakfast': 'KAHVALTI',
      'work-friendly': 'ÇALIŞMA DOSTU',
      'date': 'BULUŞMA',
      'photogenic': 'FOTOJENİK'
    };
    return dictionary[cat.toLowerCase()] || cat.toUpperCase();
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQuickSaveMenu(!showQuickSaveMenu);
  };

  const selectList = (e: React.MouseEvent, list: SavedListName) => {
    e.stopPropagation();
    onToggleSave(place.id, list);
  };

  return (
    <div
      onClick={() => onSelect(place)}
      className="bg-white group rounded-[2rem] overflow-hidden border border-artistic-border hover:border-[#bd9a6f]/60 transition-all duration-300 cursor-pointer flex flex-col relative w-full mb-6 self-stretch shadow-sm"
    >
      {/* Editorial Aspect-Ratio Thumbnail Container (4:3 is elite) */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-[#D5D2CE]">
        <img
          src={place.image}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Shadow Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-65" />

        {/* Float tags: Category + Price */}
        <div className="absolute bottom-4 left-4 flex gap-1.5 items-center z-10">
          <span className="bg-white/90 backdrop-blur-sm text-artistic-dark border border-artistic-border font-mono text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm">
            {formatCategory(place.category)}
          </span>
          <span className="bg-neutral-900/80 backdrop-blur-sm text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full">
            {place.priceLevel}
          </span>
        </div>

        {/* Float Save Bookmark with interactive dropdown lists */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleSaveClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
              isSaved
                ? 'bg-[#4A4A40] text-[#bd9a6f] border border-[#2C2C2C]'
                : 'bg-white/90 hover:bg-white text-artistic-dark border border-artistic-border'
            }`}
          >
            <Bookmark
              size={18}
              className={isSaved ? 'fill-[#bd9a6f]' : ''}
              strokeWidth={2}
            />
          </button>

          {/* Micro-Dropdown overlay for quick lists */}
          {showQuickSaveMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-[#2C2C2C] text-stone-100 rounded-2xl p-2.5 z-50 shadow-xl border border-stone-800 font-sans animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-stone-800">
                <span className="font-mono text-[8px] tracking-widest uppercase text-stone-400">Deftere Kaydet...</span>
                <button
                  onClick={() => setShowQuickSaveMenu(false)}
                  className="font-mono text-[10px] text-stone-400 hover:text-white"
                >
                  Bitti
                </button>
              </div>
              <div className="space-y-0.5 max-h-40 overflow-y-auto no-scrollbar">
                {availableLists.map((list) => {
                  const isInList = savedLists.includes(list);
                  return (
                    <button
                      key={list}
                      onClick={(e) => selectList(e, list)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isInList
                          ? 'bg-neutral-800 text-white font-medium'
                          : 'hover:bg-neutral-800/50 text-stone-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${isInList ? 'bg-warm-brand animate-pulse' : 'bg-transparent'}`} />
                        {translateListName(list)}
                      </span>
                      {isInList ? (
                        <Check size={12} className="text-warm-brand shrink-0" />
                      ) : (
                        <Plus size={10} className="text-stone-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Floating rating badge if premium */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-artistic-dark border border-artistic-border font-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star size={10} className="fill-warm-brand text-warm-brand" />
          <span className="font-bold">{place.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Editorial Copy Meta Section */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Street & Location Track */}
          <div className="flex items-center gap-1 font-mono text-[10px] font-bold tracking-widest text-[#8C8880] uppercase">
            <MapPin size={11} className="text-warm-brand shrink-0" />
            <span>
              {place.district}, {place.city}
            </span>
          </div>

          {/* Place Title */}
          <h2 className="font-serif text-2xl font-normal tracking-tight text-[#2C2C2C] group-hover:text-warm-brand transition-colors line-clamp-1">
            {place.name}
          </h2>

          {/* Editorial Short Review Block */}
          <p className="font-sans text-xs text-[#6A665D] font-light leading-relaxed line-clamp-2">
            {place.editorialDescription}
          </p>
        </div>

        {/* Atmosphere Hashtags */}
        <div className="flex flex-wrap gap-1.5 mt-6 pt-6 border-t border-[#F5F2EF]">
          {place.atmosphereTags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[9px] px-2.5 py-1 rounded-full border border-artistic-border text-[#8C8880] bg-[#F9F8F6] font-mono"
            >
              #{tag.toLowerCase().replace(/\s+/g, '')}
            </span>
          ))}
          {place.atmosphereTags.length > 3 && (
            <span className="font-mono text-[8px] text-[#8C8880] px-1.5 py-1">
              +{place.atmosphereTags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
