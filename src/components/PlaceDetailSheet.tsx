import React, { useState } from 'react';
import { Place, SavedListName } from '../types';
import { X, Bookmark, Compass, Check, Plus, Copy, Star, MapPin, Sparkles, BookOpen, ExternalLink, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface PlaceDetailSheetProps {
  place: Place;
  savedLists: SavedListName[];
  onToggleSave: (placeId: string, listName: SavedListName) => void;
  onClose: () => void;
}

export default function PlaceDetailSheet({
  place,
  savedLists,
  onToggleSave,
  onClose,
}: PlaceDetailSheetProps) {
  const [copied, setCopied] = useState(false);
  const designScore = place.designScore ?? place.attributes.designFactor;
  const espressoScore = place.espressoScore ?? place.attributes.coffeeRating;
  const quietnessScore = place.quietnessScore ?? place.attributes.quietScore;
  const aestheticViewScore =
    place.aestheticViewScore ??
    place.attributes.aestheticViewScore ??
    (place.attributes.photogenic ? 4.8 : 3.0);
  const editorReview = place.editorReview || place.longDescription;
  const bestFor = place.bestFor ?? [];
  const contactLinks = [
    place.googleMapsUrl ? { label: 'Haritada aç', href: place.googleMapsUrl, icon: ExternalLink } : null,
    place.websiteUrl ? { label: 'Website', href: place.websiteUrl, icon: ExternalLink } : null,
    place.instagramUrl ? { label: 'Instagram', href: place.instagramUrl, icon: ExternalLink } : null,
  ].filter((link): link is { label: string; href: string; icon: typeof ExternalLink } => Boolean(link));

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.address || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#2C2C2C]/50 backdrop-blur-sm z-50 flex justify-end items-end max-w-md mx-auto">
      {/* Click outside to close wrapper */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Drawer Card */}
      <div 
        className="w-full bg-[#F9F8F6] rounded-t-[2.5rem] overflow-hidden relative z-10 max-h-[92vh] flex flex-col shadow-xl border-t border-artistic-border"
      >
        {/* Top Centered Notch / Handle Bar for dragging feel */}
        <div className="w-full flex justify-center py-3.5 shrink-0 bg-[#F9F8F6]">
          <div className="w-12 h-1 bg-[#E5E2DE] rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {/* Header Image Frame */}
          <div className="relative w-full aspect-16/10 bg-[#D5D2CE]">
            <img
              src={place.image}
              alt={place.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Soft gradient bottom layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/65 via-transparent to-transparent" />

            {/* Float Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2C2C2C] flex items-center justify-center transition-colors shadow-sm border border-artistic-border cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Category Marker inside Image lower-left */}
            <div className="absolute bottom-4 left-6 z-10 flex gap-2 items-center">
              <span className="bg-white/95 text-artistic-dark border border-artistic-border font-mono text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                {formatCategory(place.category)}
              </span>
              <span className="bg-neutral-900/80 text-stone-200 font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full">
                {place.priceLevel}
              </span>
            </div>
          </div>

          {/* Core Content Body */}
          <div className="px-6 pt-6 space-y-6">
            
            {/* Header Identity */}
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-[#bd9a6f] uppercase">
                    <MapPin size={11} />
                    <span>{place.district}, {place.city}</span>
                  </div>
                  <h1 className="font-serif italic text-3xl font-light tracking-tight text-[#2C2C2C] leading-tight">
                    {place.name}
                  </h1>
                </div>

                <div className="flex items-center gap-1 bg-white border border-artistic-border font-mono text-xs font-bold px-3 py-1.5 rounded-full shadow-sm text-[#2C2C2C]">
                  <Star size={11} className="fill-warm-brand text-warm-brand" />
                  <span>{place.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Atmosphere Horizontal Pills */}
            <div className="flex flex-wrap gap-1.5">
              {place.atmosphereTags.map((tag, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] text-[#2C2C2C] bg-white border border-artistic-border px-3 py-1 rounded-full font-medium shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                >
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>

            {/* Main Editorial Story Feature */}
            <div className="space-y-2.5 bg-[#F1EFEC] p-6 rounded-[1.5rem] border border-artistic-border shadow-sm">
              <div className="flex items-center gap-1.5 text-[#6A665D]">
                <BookOpen size={14} className="text-[#bd9a6f]" />
                <span className="font-mono text-[9px] font-semibold tracking-widest uppercase">Editör İncelemesi</span>
              </div>
              <p className="font-sans text-[#2C2C2C] text-sm leading-relaxed font-light first-letter:text-3xl first-letter:font-serif italic first-letter:float-left first-letter:mr-2.5 first-letter:text-[#bd9a6f] first-letter:font-light">
                {editorReview}
              </p>
            </div>

            {(bestFor.length > 0 || place.mood) && (
              <div className="space-y-3">
                {place.mood && (
                  <div className="font-mono text-[10px] font-bold tracking-widest text-[#bd9a6f] uppercase">
                    Ruh hali: {place.mood}
                  </div>
                )}
                {bestFor.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {bestFor.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[9px] text-[#8C8880] bg-white border border-artistic-border px-2.5 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Interactive Design & Vibe Scorecard */}
            <div className="space-y-4">
              <h3 className="font-serif text-md font-normal text-[#2C2C2C] flex items-center gap-2">
                <Sparkles size={15} className="text-[#bd9a6f]" />
                <span>Atmosfer Değerlendirmesi</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 bg-white p-5 rounded-[1.5rem] border border-artistic-border shadow-sm">
                {/* Score 1 */}
                <div className="p-1.5 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-[#8C8880] uppercase">
                    <span>Tasarım Faktörü</span>
                    <span className="font-bold text-[#2C2C2C]">
                      {designScore ? `${designScore.toFixed(1)}/5` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-[#F1EFEC] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4A4A40] h-full rounded-full"
                      style={{ width: `${(designScore || 4.5) * 20}%` }}
                    />
                  </div>
                </div>

                {/* Score 2 */}
                <div className="p-1.5 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-[#8C8880] uppercase">
                    <span>Espresso Puanı</span>
                    <span className="font-bold text-[#2C2C2C]">
                      {espressoScore ? `${espressoScore.toFixed(1)}/5` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-[#F1EFEC] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#bd9a6f] h-full rounded-full"
                      style={{ width: `${(espressoScore || 4.0) * 20}%` }}
                    />
                  </div>
                </div>

                {/* Score 3 */}
                <div className="p-1.5 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-[#8C8880] uppercase">
                    <span>Sessizlik Oranı</span>
                    <span className="font-bold text-[#2C2C2C]">
                      {quietnessScore ? `${quietnessScore.toFixed(1)}/5` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-[#F1EFEC] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4A4A40] h-full rounded-full"
                      style={{ width: `${(quietnessScore || 3.5) * 20}%` }}
                    />
                  </div>
                </div>

                {/* Score 4 */}
                <div className="p-1.5 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-[#8C8880] uppercase">
                    <span>Estetik / Manzara</span>
                    <span className="font-bold text-[#2C2C2C]">
                      {aestheticViewScore ? `${aestheticViewScore.toFixed(1)}/5` : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-[#F1EFEC] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[#bd9a6f] h-full rounded-full"
                      style={{ width: `${(aestheticViewScore || 3.0) * 20}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Features List */}
            <div className="space-y-3">
              <h3 className="font-serif text-md font-normal text-[#2C2C2C]">Özellikler</h3>
              <div className="flex flex-wrap gap-2">
                {place.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 bg-[#4A4A40] text-stone-100 text-xs px-3 py-1.5 rounded-full font-light border border-neutral-700"
                  >
                    <Check size={12} className="text-[#bd9a6f]" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Organize in Saved Defter Folders */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif text-md font-normal text-[#2C2C2C] flex items-center gap-2">
                <Bookmark size={15} className="text-[#bd9a6f] fill-current" />
                <span>Defterlerinize kaydedin</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {availableLists.map((list) => {
                  const isInList = savedLists.includes(list);
                  return (
                    <button
                      key={list}
                      onClick={() => onToggleSave(place.id, list)}
                      className={`p-3 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer outline-none ${
                        isInList
                          ? 'bg-[#4A4A40] border-[#4A4A40] text-white'
                          : 'bg-white border-artistic-border text-[#2C2C2C] hover:border-neutral-300'
                      }`}
                    >
                      <span className="font-sans text-xs truncate font-medium">
                        {translateListName(list)}
                      </span>
                      {isInList ? (
                        <Check size={14} className="text-[#bd9a6f] shrink-0" />
                      ) : (
                        <Plus size={12} className="text-[#8C8880] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address copy layout */}
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-md font-normal text-[#2C2C2C]">Adres</h3>
              <div className="bg-[#F1EFEC] border border-artistic-border rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
                <div className="flex items-start gap-2 max-w-[80%]">
                  <MapPin size={16} className="text-[#8C8880] shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-[#6A665D] leading-relaxed font-light">
                    {place.address}
                  </p>
                </div>
                <button
                  onClick={handleCopyAddress}
                  className="bg-white hover:bg-[#F9F8F6] border border-artistic-border p-2.5 rounded-xl text-[#2C2C2C] flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title="Adresi kopyala"
                >
                  {copied ? (
                    <span className="font-mono text-[9px] font-bold text-emerald-600">Kopyalandı</span>
                  ) : (
                    <Copy size={14} className="text-[#8C8880]" />
                  )}
                </button>
              </div>
              {(contactLinks.length > 0 || place.phone) && (
                <div className="flex flex-wrap gap-2">
                  {contactLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white border border-artistic-border rounded-full px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#6A665D] flex items-center gap-1.5"
                      >
                        <Icon size={11} />
                        {link.label}
                      </a>
                    );
                  })}
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="bg-white border border-artistic-border rounded-full px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase text-[#6A665D] flex items-center gap-1.5"
                    >
                      <Phone size={11} />
                      {place.phone}
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
