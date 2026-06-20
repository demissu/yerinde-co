import React, { useState } from 'react';
import { Place, Category } from '../types';
import { Compass, Sparkles, Navigation, Info, Star, ChevronRight, Check } from 'lucide-react';

interface MapPageProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

export default function MapPage({ places, onSelectPlace }: MapPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activePlace, setActivePlace] = useState<Place | null>(places[0]);

  // Translate helper for categories
  const formatCategory = (cat: string) => {
    const dict: Record<string, string> = {
      'coffee': 'KAHVE',
      'food': 'YEMEK',
      'dessert': 'TATLI',
      'bar': 'BAR',
      'breakfast': 'KAHVALTI',
      'work-friendly': 'ÇALIŞMA DOSTU',
      'date': 'BULUŞMA',
      'photogenic': 'FOTOJENİK'
    };
    return dict[cat.toLowerCase()] || cat.toUpperCase();
  };

  // Filters required by user, mapped to beautiful Turkish labels
  const filterChips = [
    { key: 'All', label: 'Tümü' },
    { key: 'Coffee', label: 'Kahve' },
    { key: 'Food', label: 'Yemek' },
    { key: 'Dessert', label: 'Tatlı' },
    { key: 'Bar', label: 'Bar' },
    { key: 'Breakfast', label: 'Kahvaltı' },
    { key: 'Work-friendly', label: 'Çalışma Dostu' },
    { key: 'Date', label: 'Buluşma' },
    { key: 'Photogenic', label: 'Fotojenik' }
  ];

  // Map Filter function matching category or attribute boolean tags
  const filteredPlacesForMap = places.filter((p) => {
    if (selectedFilter === 'All') return true;
    
    // Check if matching Category
    if (p.category.toLowerCase() === selectedFilter.toLowerCase()) return true;

    // Check if matching Attribute Flags
    if (selectedFilter === 'Work-friendly' && p.attributes.workFriendly) return true;
    if (selectedFilter === 'Date' && p.attributes.dateSpot) return true;
    if (selectedFilter === 'Photogenic' && p.attributes.photogenic) return true;

    return false;
  });

  const handleDotClick = (place: Place) => {
    setActivePlace(place);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F9F8F6] pb-24 relative select-none">
      {/* Floating Header Chip Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-[#F9F8F6] via-[#F9F8F6]/90 to-transparent z-20 space-y-4">
        <div>
          <span className="font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase">Estetik Keşif Haritası</span>
          <h1 className="font-serif italic text-2xl font-light tracking-tight text-[#2C2C2C] leading-none">
            Keşif Haritası
          </h1>
        </div>

        {/* Filters Carousel */}
        <div className="no-scrollbar overflow-x-auto flex gap-1.5 -mx-6 px-6 pt-1">
          {filterChips.map((chip) => {
            const isSelected = selectedFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => {
                  setSelectedFilter(chip.key);
                  // Update active card if the old one doesn't qualify
                  const qualifying = places.filter((p) => {
                    if (chip.key === 'All') return true;
                    if (p.category.toLowerCase() === chip.key.toLowerCase()) return true;
                    if (chip.key === 'Work-friendly' && p.attributes.workFriendly) return true;
                    if (chip.key === 'Date' && p.attributes.dateSpot) return true;
                    if (chip.key === 'Photogenic' && p.attributes.photogenic) return true;
                    return false;
                  });
                  if (qualifying.length > 0) {
                    setActivePlace(qualifying[0]);
                  } else {
                    setActivePlace(null);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4A4A40] text-stone-100 font-medium shadow-sm'
                    : 'bg-white hover:bg-[#F9F8F6] text-[#2C2C2C] border border-artistic-border'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Styled vector editorial SVG Map Canvas */}
      <div className="flex-1 flex items-center justify-center relative w-full pt-16">
        <svg
          viewBox="0 0 400 500"
          className="w-full h-[75%] opacity-90 transition-all duration-300"
          style={{ transform: 'scale(1.05)' }}
        >
          {/* Aegean Blue/Slate Sea Coordinates Background */}
          <rect width="400" height="500" fill="#EFEDE8" rx="30" />

          {/* Graticule gridlines */}
          <line x1="50" y1="0" x2="50" y2="500" stroke="#E5E2DE" strokeDasharray="3,6" />
          <line x1="150" y1="0" x2="150" y2="500" stroke="#E5E2DE" strokeDasharray="3,6" />
          <line x1="250" y1="0" x2="250" y2="500" stroke="#E5E2DE" strokeDasharray="3,6" />
          <line x1="350" y1="0" x2="350" y2="500" stroke="#E5E2DE" strokeDasharray="3,6" />
          <line x1="0" y1="100" x2="400" y2="100" stroke="#E5E2DE" strokeDasharray="3,6" />
          <line x1="0" y1="250" x2="400" y2="250" stroke="#E5E2DE" strokeDasharray="3,6" />
          <line x1="0" y1="400" x2="400" y2="400" stroke="#E5E2DE" strokeDasharray="3,6" />

          {/* Aegean Coastline land masses (represented in warm paper yellow) */}
          {/* Northern land mass around Ayvalık/Cunda */}
          <path
            d="M 120,0 C 130,15 150,22 180,24 C 210,25 240,15 260,0 L 400,0 L 400,105 C 340,90 280,100 240,90 C 220,85 200,60 170,60 C 150,60 142,75 125,70 C 110,65 105,45 80,45 C 50,45 30,25 31,0 Z"
            fill="#F9F8F6"
            stroke="#E5E2DE"
            strokeWidth="0.8"
          />

          {/* Cunda Island body */}
          <path
            d="M 210,28 C 225,28 235,32 235,42 C 235,50 215,62 195,58 C 180,55 175,44 190,34 Z"
            fill="#EFEDE8"
            stroke="#c8bead"
            strokeWidth="1.2"
          />
          <text x="215" y="52" fill="8C8880" fontSize="8" fontFamily="monospace" fontWeight="bold">CUNDA ADASI</text>

          {/* Mainland Turkey Coastline (Bostanlı / Alsancak / Urla / Alaçatı Gulf) */}
          {/* Path starts at middle right, arcs into İzmir bay, swings left for Urla, and points down most left for Çeşme */}
          <path
            d="M 400,105 C 320,110 300,140 280,150 C 260,160 250,190 210,195 C 180,200 140,160 120,180 C 105,195 110,220 90,220 C 70,220 50,230 40,250 C 30,270 20,310 10,330 C 0,340 0,380 15,395 C 30,410 45,390 60,392 C 70,393 72,408 82,410 C 92,412 110,375 125,372 C 145,368 152,382 172,370 C 185,362 180,332 195,330 C 215,328 230,350 250,342 C 270,334 265,302 288,298 C 308,294 330,312 350,300 C 375,285 365,220 400,200 Z"
            fill="#F9F8F6"
            stroke="#E5E2DE"
            strokeWidth="0.8"
          />

          {/* Gulf of Izmir inner sea body (draw a blue aesthetic hatch path to isolate) */}
          <text x="50" y="160" fill="#ac9f88" fontSize="10" fontFamily="serif" fontStyle="italic">Ege Denizi</text>
          <text x="94" y="278" fill="#bcaf98" fontSize="8" fontFamily="serif" fontStyle="italic">İzmir Körfezi</text>

          {/* District Labels */}
          <text x="14" y="365" fill="#a49781" fontSize="9" fontFamily="monospace" fontWeight="bold">ALAÇATI/ÇEŞME</text>
          <line x1="60" y1="368" x2="60" y2="385" stroke="#ac9f88" strokeWidth="0.5" />

          <text x="115" y="345" fill="#a49781" fontSize="9" fontFamily="monospace" fontWeight="bold">URLA</text>
          <line x1="130" y1="348" x2="160" y2="365" stroke="#ac9f88" strokeWidth="0.5" />

          {/* Izmir inner coordinates */}
          <text x="165" y="260" fill="#a49781" fontSize="9" fontFamily="monospace" fontWeight="bold">BOSTANLI</text>
          <line x1="205" y1="262" x2="212" y2="280" stroke="#ac9f88" strokeWidth="0.5" />

          <text x="215" y="320" fill="#a49781" fontSize="9" fontFamily="monospace" fontWeight="bold">ALSANCAK</text>
          <line x1="250" y1="312" x2="252" y2="295" stroke="#ac9f88" strokeWidth="0.5" />

          <text x="325" y="210" fill="#a49781" fontSize="9" fontFamily="monospace" fontWeight="bold">MANİSA</text>

          {/* Anchor pins/dots for matching places */}
          {filteredPlacesForMap.map((p) => {
            const isActive = activePlace?.id === p.id;
            return (
              <g
                key={p.id}
                onClick={() => handleDotClick(p)}
                className="cursor-pointer group select-none"
              >
                {/* Active Pulsed Outer Circle */}
                {isActive && (
                  <circle
                    cx={p.coordinates.x * 4}
                    cy={p.coordinates.y * 5}
                    r="14"
                    fill="#bd9a6f"
                    fillOpacity="0.25"
                    className="animate-ping"
                    style={{ animationDuration: '2.5s' }}
                  />
                )}
                
                {/* Visual Circle Indicator */}
                <circle
                  cx={p.coordinates.x * 4}
                  cy={p.coordinates.y * 5}
                  r={isActive ? '8' : '5.5'}
                  fill={isActive ? '#4A4A40' : '#bd9a6f'}
                  stroke="#ffffff"
                  strokeWidth={isActive ? '2' : '1'}
                  className="transition-all duration-300 shadow-sm"
                />

                {/* Invisible hover expanding shield */}
                <circle
                  cx={p.coordinates.x * 4}
                  cy={p.coordinates.y * 5}
                  r="18"
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic map helper text */}
        <div className="absolute top-[82px] left-6 right-6 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 border border-artistic-border flex items-center gap-1.5 w-max mx-auto shadow-sm">
          <Info size={11} className="text-[#bd9a6f]" />
          <span className="font-sans text-[10px] text-[#6A665D] font-medium tracking-wide">
            {filteredPlacesForMap.length} estetik mekan seçilen filtreyle eşleşiyor
          </span>
        </div>
      </div>

      {/* Slide-Up Place Miniature Preview Card (at the bottom) */}
      <div className="absolute bottom-24 left-6 right-6 z-30">
        {activePlace ? (
          <div
            onClick={() => onSelectPlace(activePlace)}
            className="bg-white rounded-[2rem] p-4 shadow-md border border-artistic-border flex gap-4 duration-300 hover:border-[#bd9a6f] cursor-pointer relative animate-fade-in-up"
          >
            {/* Left Image Thumbnail */}
            <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 bg-[#F1EFEC] border border-artistic-border">
              <img
                src={activePlace.image}
                alt={activePlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content description preview */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div className="space-y-0.5">
                <span className="font-mono text-[8px] font-bold text-[#bd9a6f] tracking-widest uppercase block">
                  {activePlace.district} • {formatCategory(activePlace.category)}
                </span>
                <h3 className="font-serif italic text-base font-normal text-[#2C2C2C] leading-tight truncate">
                  {activePlace.name}
                </h3>
                <p className="font-sans text-[11px] text-[#6A665D] truncate">
                  {activePlace.editorialDescription}
                </p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#8C8880]">
                  <Star size={10} className="fill-warm-brand text-warm-brand" />
                  <span>{activePlace.rating.toFixed(1)}</span>
                  <span className="text-[#E5E2DE]">•</span>
                  <span>{activePlace.priceLevel}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-[#2C2C2C] group">
                  <span>Derinlemesine inceleme</span>
                  <ChevronRight size={10} className="text-[#bd9a6f]" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 bg-white/80 rounded-2xl border border-artistic-border text-[#8C8880] font-sans text-xs flex items-center justify-center gap-2">
            <span>Seçilen filtreyle eşleşen Ege sığınağını incelemek için haritada bir noktaya tıklayın</span>
          </div>
        )}
      </div>
    </div>
  );
}
