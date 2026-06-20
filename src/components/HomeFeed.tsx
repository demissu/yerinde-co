import React, { useState } from 'react';
import { Place, SavedListName } from '../types';
import { Search, Sparkles, Coffee, Heart, Camera, Gift, Flame, Compass, ChevronRight } from 'lucide-react';
import PlaceCard from './PlaceCard';

interface HomeFeedProps {
  places: Place[];
  savedMap: Record<string, SavedListName[]>;
  onToggleSave: (placeId: string, listName: SavedListName) => void;
  onSelectPlace: (place: Place) => void;
  selectedTastes: string[];
}

export default function HomeFeed({
  places,
  savedMap,
  onToggleSave,
  onSelectPlace,
  selectedTastes,
}: HomeFeedProps) {
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  // District options
  const subRegions = ['Tümü', 'Alsancak', 'Bostanlı', 'Urla', 'Alaçatı', 'Cunda', 'Manisa'];

  // Filter places based on search/subregion
  const filteredPlaces = places.filter((place) => {
    const matchesRegion = selectedSubRegion === 'Tümü' || place.district === selectedSubRegion || place.city === selectedSubRegion;
    const matchesQuery = searchQuery === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.atmosphereTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesQuery;
  });

  // Curations definitions:
  // 1. "Near you today": Spots in the selected region or first 4 places matching tastes
  const nearYouList = filteredPlaces.slice(0, 4);

  // 2. "Quiet coffee spots": Filter places with quietScore >= 4.0 / category is Coffee
  const quietCoffeeList = places.filter(p => p.category === 'Coffee' && (p.attributes.quietScore && p.attributes.quietScore >= 3.8));

  // 3. "Date spots": Filter places with dateSpot rating / category is Food/Bar matching cozy ambiance
  const dateSpotsList = places.filter(p => p.attributes.dateSpot || p.category === 'Bar');

  // 4. "Aesthetic places": Filter places with high design factor or photogenic flag
  const aestheticList = places.filter(p => p.attributes.photogenic || (p.attributes.designFactor && p.attributes.designFactor >= 4.8));

  // 5. "New openings": We designate specific places as fresh/distinctive new openings
  const newOpeningsList = places.filter(p => p.id.includes('awake') || p.id.includes('bake') || p.id.includes('spil'));

  // 6. "Yerinde picks": Highly rated, Michelin/artisanal level picks (Hiç Urla, Ayna Cunda, Leone)
  const yerindePicksList = places.filter(p => (p.attributes.premium || p.rating >= 4.8));

  // Highlight Place (Hero Banner) - Leone or Hiç Tadım Atölyesi
  const heroPlace = places.find(p => p.id === 'place_url_hic') || places[0];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-warm-beige">
      {/* Decorative Header */}
      <div className="bg-warm-cream p-6 pb-8 rounded-b-[40px] border-b border-artistic-border space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-sans font-black text-3.5xl tracking-tighter text-[#2C2C2C] lowercase">
              [yerinde]
            </h1>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8C8880] opacity-85 mt-0.5">
              Lokal Seçkiler ve Keşif
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] text-[#8C8880] uppercase tracking-wider font-semibold">İzmir, TR</span>
            {selectedTastes.length > 0 && (
              <span className="text-[10px] text-[#bd9a6f] font-medium flex items-center gap-1 mt-0.5">
                <Sparkles size={10} className="animate-pulse" />
                Tarzlar Ayarlandı
              </span>
            )}
          </div>
        </div>

        {/* Elegant Minimal Search Field */}
        <div className="relative">
          <input
            type="text"
            placeholder="Sıcak kafeler, semtler, etiketler ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs text-[#2C2C2C] placeholder-stone-400 pl-10 pr-4 py-3.5 rounded-2xl border border-artistic-border focus:outline-none focus:border-[#4A4A40] transition-colors shadow-sm"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        </div>

        {/* Category horizontal scrolling selector */}
        <div className="no-scrollbar overflow-x-auto flex gap-2 -mx-6 px-6 pt-1">
          {subRegions.map((region) => {
            const isSelected = selectedSubRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedSubRegion(region)}
                className={`px-4 py-1.5 rounded-full text-[11px] cursor-pointer transition-all duration-200 shrink-0 select-none whitespace-nowrap tracking-wide border ${
                  isSelected
                    ? 'bg-[#4A4A40] text-white border-[#4A4A40] font-medium'
                    : 'bg-white hover:bg-[#F9F8F6] text-[#6A665D] border-artistic-border'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="px-6 py-6 space-y-9">
        
        {/* If searching, render clean grid of results instead of sections */}
        {searchQuery && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="font-serif text-xl font-medium tracking-tight text-[#2C2C2C]">
              Arama Sonuçları ({filteredPlaces.length})
            </h2>
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-12 text-stone-400 font-light text-sm">
                "{searchQuery}" ile eşleşen estetik sığınak bulunamadı
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredPlaces.map((place) => {
                  const savedLists = savedMap[place.id] || [];
                  const isSaved = savedLists.length > 0;
                  return (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isSaved={isSaved}
                      savedLists={savedLists}
                      onToggleSave={onToggleSave}
                      onSelect={onSelectPlace}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Standard Editorial curations stream (if no search) */}
        {!searchQuery && (
          <>
            {/* Editor's Featured Pick Banner */}
            <div 
              onClick={() => onSelectPlace(heroPlace)}
              className="bg-neutral-900 rounded-[2rem] overflow-hidden aspect-16/10 relative shadow-md cursor-pointer group border border-artistic-border"
            >
              <img
                src={heroPlace.image}
                alt={heroPlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/90 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 bg-white/95 text-artistic-dark font-mono text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-sm border border-artistic-border">
                [yerinde] Önerisi
              </div>
              <div className="absolute bottom-6 left-6 right-6 space-y-1 text-white">
                <span className="font-mono text-[9px] font-medium tracking-widest text-stone-300 uppercase">
                  {heroPlace.district} • {heroPlace.category.toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-light leading-tight group-hover:text-[#bd9a6f] transition-colors">
                  {heroPlace.name}
                </h3>
                <p className="font-sans text-[11px] text-stone-100 font-light line-clamp-1 opacity-90">
                  {heroPlace.editorialDescription}
                </p>
              </div>
            </div>

            {/* CURATION 1: Near you today */}
            <div className="space-y-5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                    <Compass size={18} className="text-[#bd9a6f]" />
                    <span>Sizin İçin</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
                    {selectedSubRegion === 'Tümü' ? 'Ziyaret etmeniz gereken yerel seçkiler ve gizli hazineler' : `${selectedSubRegion} bölgesinde özenle seçilmiş mekanlar`}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">01</span>
              </div>

              {nearYouList.length === 0 ? (
                <div className="text-center p-6 bg-warm-cream/35 rounded-2xl text-[#8C8880] text-xs">
                  Bugün bu bölgede belirlenmiş mekan bulunamadı. Üstten "Tümü" seçeneğini seçebilirsiniz!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {nearYouList.map((place) => {
                    const savedLists = savedMap[place.id] || [];
                    const isSaved = savedLists.length > 0;
                    return (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        isSaved={isSaved}
                        savedLists={savedLists}
                        onToggleSave={onToggleSave}
                        onSelect={onSelectPlace}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* CURATION 2: Quiet coffee spots */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                    <Coffee size={18} className="text-[#4A4A40]" />
                    <span>Nitelikli Kahve Rotası</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
                    Okumak, tasarlamak ve odaklanmak için özel olarak yaratılmış üçüncü nesil sığınaklar.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">02</span>
              </div>

              <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                {quietCoffeeList.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="w-64 flex-shrink-0 cursor-pointer group bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300"
                  >
                    <div className="w-full aspect-16/10 rounded-[1.1rem] overflow-hidden bg-[#D5D2CE] relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-artistic-dark font-mono text-[8px] px-2 py-0.5 rounded uppercase">
                        {place.district}
                      </span>
                    </div>
                    <div className="mt-3 px-1 space-y-1">
                      <h4 className="font-serif text-md font-normal text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
                        {place.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
                        {place.editorialDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CURATION 3: Date spots */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                    <Heart size={18} className="text-[#bd9a6f] fill-current" />
                    <span>Estetik Buluşma Akşamları</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
                    Yumuşak sıcak ışıklar, mum ışığında masalar ve enfes tını estetiği.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">03</span>
              </div>

              <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                {dateSpotsList.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="w-64 flex-shrink-0 cursor-pointer group bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300"
                  >
                    <div className="w-full aspect-16/10 rounded-[1.1rem] overflow-hidden bg-[#D5D2CE] relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-artistic-dark font-mono text-[8px] px-2 py-0.5 rounded uppercase">
                        {place.district}
                      </span>
                    </div>
                    <div className="mt-3 px-1 space-y-1">
                      <h4 className="font-serif text-md font-normal text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
                        {place.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
                        {place.editorialDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CURATION 4: Aesthetic places */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                    <Camera size={18} className="text-[#bd9a6f]" />
                    <span>Estetik Tasarım Alanları</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
                    Göz alıcı mimari geometriyle dolu, fotojenik tasarım mekanları.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">04</span>
              </div>

              <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                {aestheticList.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="w-64 flex-shrink-0 cursor-pointer group bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300"
                  >
                    <div className="w-full aspect-16/10 rounded-[1.1rem] overflow-hidden bg-[#D5D2CE] relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-artistic-dark font-mono text-[8px] px-2 py-0.5 rounded uppercase">
                        {place.district}
                      </span>
                    </div>
                    <div className="mt-3 px-1 space-y-1">
                      <h4 className="font-serif text-md font-normal text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
                        {place.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
                        {place.editorialDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CURATION 5: New openings */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                    <Gift size={18} className="text-[#4A4A40]" />
                    <span>Estetik Keşifler</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
                    Ege kıyılarından tasarım kataloğumuza eklenen en yeni üyeler.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">05</span>
              </div>

              <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                {newOpeningsList.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="w-64 flex-shrink-0 cursor-pointer group bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300"
                  >
                    <div className="w-full aspect-16/10 rounded-[1.1rem] overflow-hidden bg-[#D5D2CE] relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-artistic-dark font-mono text-[8px] px-2 py-0.5 rounded uppercase">
                        {place.district}
                      </span>
                    </div>
                    <div className="mt-3 px-1 space-y-1">
                      <h4 className="font-serif text-md font-normal text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
                        {place.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
                        {place.editorialDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CURATION 6: Yerinde picks */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                    <Flame size={18} className="text-[#bd9a6f]" />
                    <span>Öne Çıkan Editör Seçkileri</span>
                  </h2>
                  <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
                    Ege mimarisini ve Akdeniz lezzetlerini tanımlayan en seçkin elit mekanlar.
                  </p>
                </div>
                <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">06</span>
              </div>

              <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                {yerindePicksList.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="w-64 flex-shrink-0 cursor-pointer group bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300"
                  >
                    <div className="w-full aspect-16/10 rounded-[1.1rem] overflow-hidden bg-[#D5D2CE] relative">
                      <img
                        src={place.image}
                        alt={place.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-artistic-dark font-mono text-[8px] px-2 py-0.5 rounded uppercase">
                        {place.district}
                      </span>
                    </div>
                    <div className="mt-3 px-1 space-y-1">
                      <h4 className="font-serif text-md font-normal text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
                        {place.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
                        {place.editorialDescription}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
