import React from 'react';
import { Compass, Map, Bookmark } from 'lucide-react';

export type TabRoute = 'explore' | 'map' | 'saved';

interface BottomNavProps {
  currentRoute: TabRoute;
  onChangeRoute: (route: TabRoute) => void;
  savedCount: number;
}

export default function BottomNav({ currentRoute, onChangeRoute, savedCount }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-[72px] bg-white/95 backdrop-blur-md border-t border-artistic-border flex items-center justify-around px-6 z-40 shadow-sm">
      {/* Compass / Discover Feed */}
      <button
        onClick={() => onChangeRoute('explore')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-4 rounded-xl transition-all select-none cursor-pointer relative ${
          currentRoute === 'explore'
            ? 'text-[#2C2C2C]'
            : 'text-stone-400 hover:text-stone-600'
        }`}
      >
        <Compass size={20} strokeWidth={currentRoute === 'explore' ? 2 : 1.5} />
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase">Yerinde</span>
        {currentRoute === 'explore' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A4A40] absolute -bottom-1.5" />
        )}
      </button>

      {/* Interactive Map */}
      <button
        onClick={() => onChangeRoute('map')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-4 rounded-xl transition-all select-none cursor-pointer relative ${
          currentRoute === 'map'
            ? 'text-[#2C2C2C]'
            : 'text-stone-400 hover:text-stone-600'
        }`}
      >
        <Map size={20} strokeWidth={currentRoute === 'map' ? 2 : 1.5} />
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase">Harita</span>
        {currentRoute === 'map' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A4A40] absolute -bottom-1.5" />
        )}
      </button>

      {/* Saved Notebook */}
      <button
        onClick={() => onChangeRoute('saved')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 px-4 rounded-xl transition-all select-none cursor-pointer relative ${
          currentRoute === 'saved'
            ? 'text-[#2C2C2C]'
            : 'text-stone-400 hover:text-stone-600'
        }`}
      >
        <div className="relative">
          <Bookmark size={20} strokeWidth={currentRoute === 'saved' ? 2 : 1.5} />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1.5 bg-[#4A4A40] text-stone-100 font-mono text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              {savedCount}
            </span>
          )}
        </div>
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase">Defter</span>
        {currentRoute === 'saved' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A4A40] absolute -bottom-1.5" />
        )}
      </button>
    </div>
  );
}
