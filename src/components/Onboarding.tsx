import React, { useState } from 'react';
import { TASTE_OPTIONS } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (selectedTastes: string[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleTaste = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStart = () => {
    if (selected.length === 0) {
      // If none selected, default to all as active tastes
      onComplete(TASTE_OPTIONS.map(t => t.id));
    } else {
      onComplete(selected);
    }
  };

  return (
    <div className="flex-1 flex flex-col self-center max-w-md w-full min-h-screen bg-[#F9F8F6] p-6 relative overflow-y-auto no-scrollbar">
      {/* Editorial Decorative Background Details */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-warm-cream rounded-full blur-3xl opacity-60 -z-10" />
      <div className="absolute bottom-12 left-0 w-64 h-64 bg-stone-100/40 rounded-full blur-3xl opacity-50 -z-10" />

      {/* Decorative Brand Header */}
      <div className="flex justify-between items-center pt-6 pb-12">
        <span className="font-sans text-sm tracking-tight text-[#2C2C2C] font-black lowercase">
          [yerinde] <span className="font-mono text-[9px] text-[#8C8880] uppercase font-bold tracking-[0.15em] ml-1.5">// Tarz Seçimi</span>
        </span>
      </div>

      {/* Magazine Styled Heading */}
      <div className="space-y-3 mb-12">
        <h1 className="font-serif text-5xl font-light tracking-tight text-[#2C2C2C] leading-[1.08]">
          Türkiye'yi <br />
          <span className="font-sans font-black tracking-tighter text-[40px] text-[#2C2C2C] not-italic mr-1.5 lg:mr-2">[yerinde]</span> keşfet.
        </h1>
        <p className="font-sans text-xs text-[#6A665D] leading-relaxed max-w-[85%] font-light">
          Türkiye'nin seçilmiş mekanlarını, yerel rotalarını ve gizli keşiflerini size uygun bir akışta sunabilmemiz için tarzınızı seçin.
        </p>
      </div>

      {/* Grid of Taste Cards */}
      <div className="grid grid-cols-2 gap-3 mb-24">
        {TASTE_OPTIONS.map((taste, index) => {
          const isSelected = selected.includes(taste.id);
          return (
            <button
              key={taste.id}
              onClick={() => toggleTaste(taste.id)}
              className={`text-left p-4 rounded-[1.5rem] transition-all duration-300 cursor-pointer flex flex-col justify-between h-32 border outline-none ${
                isSelected
                  ? 'bg-[#4A4A40] border-[#4A4A40] text-stone-100 shadow-md transform -translate-y-0.5'
                  : 'bg-white border-artistic-border hover:bg-[#F9F8F6] text-[#2C2C2C]'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold">
                  0{index + 1}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bd9a6f] animate-pulse" />
                )}
              </div>
              <div>
                <h3 className="font-serif text-[15px] font-normal leading-snug">
                  {taste.label}
                </h3>
                <p className={`text-[10px] leading-relaxed font-light mt-1 line-clamp-2 ${
                  isSelected ? 'text-stone-300' : 'text-[#6A665D]'
                }`}>
                  {taste.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-gradient-to-t from-[#F9F8F6] via-[#F9F8F6]/95 to-transparent">
        <button
          onClick={handleStart}
          className="w-full bg-[#4A4A40] hover:bg-[#2C2C2C] text-stone-100 px-6 py-4 rounded-full flex items-center justify-between font-medium tracking-wide shadow-md transition-all active:scale-[0.98] group cursor-pointer border border-[#3b3b33]"
        >
          <span className="font-serif text-sm italic font-light">
            {selected.length > 0 ? `${selected.length} tarzı derle` : 'Tüm kıyıyı keşfet'}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#bd9a6f] uppercase tracking-widest group-hover:text-white transition-colors font-bold">Keşfet</span>
            <ArrowRight size={14} className="text-stone-300 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
}
