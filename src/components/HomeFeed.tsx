import React, { useMemo, useState } from 'react';
import { Place, SavedListName } from '../types';
import {
  Search,
  Sparkles,
  Coffee,
  Heart,
  Waves,
  Laptop,
  Flame,
  Clock,
  NotebookText,
  Bookmark,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import PlaceCard from './PlaceCard';

interface HomeFeedProps {
  places: Place[];
  savedMap: Record<string, SavedListName[]>;
  onToggleSave: (placeId: string, listName: SavedListName) => void;
  onSelectPlace: (place: Place) => void;
  selectedTastes: string[];
}

type PersonalCollection = {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  places: Place[];
};

type EditorialStory = {
  title: string;
  description: string;
  label: string;
  image?: string;
  places: Place[];
};

type DiscoveryFilter =
  | 'Tümü'
  | 'Kahve'
  | 'Yemek'
  | 'Tatlı'
  | 'Bar'
  | 'Kahvaltı'
  | 'Çalışmalık'
  | 'Manzara'
  | 'Konaklama';

const discoveryFilters: DiscoveryFilter[] = [
  'Tümü',
  'Kahve',
  'Yemek',
  'Tatlı',
  'Bar',
  'Kahvaltı',
  'Çalışmalık',
  'Manzara',
  'Konaklama',
];

const getPlaceText = (place: Place) =>
  `${place.category} ${place.name} ${place.city} ${place.district} ${place.editorialDescription} ${place.longDescription} ${place.atmosphereTags.join(' ')} ${place.features.join(' ')}`.toLowerCase();

const matchesDiscoveryFilter = (place: Place, filter: DiscoveryFilter) => {
  if (filter === 'Tümü') return true;

  const text = getPlaceText(place);

  if (filter === 'Kahve') {
    return place.category === 'Coffee' || text.includes('kahve') || text.includes('coffee');
  }

  if (filter === 'Yemek') {
    return place.category === 'Food' || place.category === 'Date' || text.includes('restoran') || text.includes('sofra');
  }

  if (filter === 'Tatlı') {
    return place.category === 'Dessert' || text.includes('tatlı') || text.includes('dessert') || text.includes('pasta');
  }

  if (filter === 'Bar') {
    return place.category === 'Bar' || text.includes('bar') || text.includes('kokteyl');
  }

  if (filter === 'Kahvaltı') {
    return place.category === 'Breakfast' || text.includes('kahvaltı') || text.includes('brunch') || text.includes('breakfast');
  }

  if (filter === 'Çalışmalık') {
    return place.category === 'Work-friendly' || place.attributes.workFriendly || (place.attributes.quietScore ?? 0) >= 3.8;
  }

  if (filter === 'Manzara') {
    return place.attributes.seaView || text.includes('manzara') || text.includes('deniz') || text.includes('gün batımı') || text.includes('view');
  }

  return text.includes('konaklama') || text.includes('otel') || text.includes('hotel') || text.includes('pansiyon') || text.includes('stay');
};

export default function HomeFeed({
  places,
  savedMap,
  onToggleSave,
  onSelectPlace,
  selectedTastes,
}: HomeFeedProps) {
  const [selectedDiscoveryFilter, setSelectedDiscoveryFilter] = useState<DiscoveryFilter>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePersonalKey, setActivePersonalKey] = useState('coffee');

  // Filter places based on search/discovery category
  const filteredPlaces = places.filter((place) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchesDiscovery = matchesDiscoveryFilter(place, selectedDiscoveryFilter);
    const matchesQuery =
      searchQuery === '' ||
      place.name.toLowerCase().includes(normalizedQuery) ||
      place.district.toLowerCase().includes(normalizedQuery) ||
      place.city.toLowerCase().includes(normalizedQuery) ||
      place.atmosphereTags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
    return matchesDiscovery && matchesQuery;
  });

  const visiblePlaces = filteredPlaces;

  const getSavedLists = (placeId: string) => savedMap[placeId] || [];
  const getSaveScore = (place: Place) => getSavedLists(place.id).length;

  const dailyPick = useMemo(() => {
    return (
      visiblePlaces.find((place) => place.attributes.premium) ||
      [...visiblePlaces].sort((a, b) => b.rating - a.rating)[0] ||
      places[0]
    );
  }, [places, visiblePlaces]);

  const personalCollections = useMemo<PersonalCollection[]>(() => {
    const byTags = (keywords: string[]) =>
      visiblePlaces.filter((place) => {
        const haystack = `${place.category} ${place.name} ${place.editorialDescription} ${place.atmosphereTags.join(' ')} ${place.features.join(' ')}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
      });

    return [
      {
        key: 'coffee',
        title: 'Kahve',
        description: 'Nitelikli kahve ve sakin masalar.',
        icon: Coffee,
        places: byTags(['coffee', 'kahve']).concat(visiblePlaces.filter((place) => place.category === 'Coffee')),
      },
      {
        key: 'brunch',
        title: 'Brunch',
        description: 'Geç başlayan günler için uzun masalar.',
        icon: Clock,
        places: byTags(['brunch', 'breakfast', 'kahvaltı']).concat(visiblePlaces.filter((place) => place.category === 'Breakfast')),
      },
      {
        key: 'date',
        title: 'Date Night',
        description: 'Loş ışık, iyi tabak ve yürüyüş sonrası.',
        icon: Heart,
        places: visiblePlaces.filter((place) => place.attributes.dateSpot || place.category === 'Date' || place.category === 'Bar'),
      },
      {
        key: 'sea',
        title: 'Deniz Kenarı',
        description: 'Tuzlu rüzgar, sahil ve gün batımı.',
        icon: Waves,
        places: visiblePlaces.filter((place) => place.attributes.seaView || byTags(['deniz', 'sahil', 'kıyı', 'ada']).includes(place)),
      },
      {
        key: 'work',
        title: 'Çalışmalık Mekanlar',
        description: 'Odaklanmak, okumak ve laptop açmak için.',
        icon: Laptop,
        places: visiblePlaces.filter(
          (place) =>
            place.attributes.workFriendly ||
            place.category === 'Work-friendly' ||
            (place.attributes.quietScore ?? 0) >= 3.8,
        ),
      },
    ].map((collection) => ({
      ...collection,
      places: Array.from(new Map(collection.places.map((place) => [place.id, place])).values()).slice(0, 6),
    }));
  }, [visiblePlaces]);

  const activePersonalCollection =
    personalCollections.find((collection) => collection.key === activePersonalKey) || personalCollections[0];

  const trendingPlaces = useMemo(() => {
    return [...visiblePlaces]
      .sort((a, b) => {
        const scoreDifference = getSaveScore(b) - getSaveScore(a);
        if (scoreDifference !== 0) return scoreDifference;
        return b.rating - a.rating;
      })
      .slice(0, 3);
  }, [savedMap, visiblePlaces]);

  const newestPlaces = useMemo(() => [...visiblePlaces].slice(-5).reverse(), [visiblePlaces]);

  const editorialStories = useMemo<EditorialStory[]>(() => {
    const findStoryPlaces = (keywords: string[]) =>
      visiblePlaces.filter((place) => {
        const haystack = `${place.name} ${place.city} ${place.district} ${place.editorialDescription} ${place.atmosphereTags.join(' ')} ${place.features.join(' ')}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
      });

    return [
      {
        title: 'İzmir’de yağmurlu günler',
        description: 'Sıcak içecek, iç mekan ve acele etmeyen masalar.',
        label: 'Hava kapalı',
        places: findStoryPlaces(['izmir', 'alsancak', 'bostanlı', 'kahve']),
      },
      {
        title: 'Cunda’da gün batımı',
        description: 'Taş sokaklar, ada kahvesi ve akşam ışığı.',
        label: 'Ada notu',
        places: findStoryPlaces(['cunda', 'ada', 'gün batımı']),
      },
      {
        title: 'Urla’da uzun öğle yemekleri',
        description: 'Bağ rotaları, sakin sofralar ve iyi ürün.',
        label: 'Öğle planı',
        places: findStoryPlaces(['urla', 'gastronomi', 'sofra', 'bağ']),
      },
    ].map((story) => ({
      ...story,
      places: story.places.slice(0, 4),
      image: story.places[0]?.image,
    }));
  }, [visiblePlaces]);

  const savedPreviewPlaces = useMemo(() => {
    const wantToGo = places.filter((place) => getSavedLists(place.id).includes('Want to go'));
    const anySaved = places.filter((place) => getSavedLists(place.id).length > 0);
    return (wantToGo.length > 0 ? wantToGo : anySaved).slice(0, 3);
  }, [places, savedMap]);

  const renderPlaceCard = (place: Place) => {
    const savedLists = getSavedLists(place.id);
    return (
      <PlaceCard
        key={place.id}
        place={place}
        isSaved={savedLists.length > 0}
        savedLists={savedLists}
        onToggleSave={onToggleSave}
        onSelect={onSelectPlace}
      />
    );
  };

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
          {discoveryFilters.map((filter) => {
            const isSelected = selectedDiscoveryFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedDiscoveryFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-[11px] cursor-pointer transition-all duration-200 shrink-0 select-none whitespace-nowrap tracking-wide border ${
                  isSelected
                    ? 'bg-[#4A4A40] text-white border-[#4A4A40] font-medium'
                    : 'bg-white hover:bg-[#F9F8F6] text-[#6A665D] border-artistic-border'
                }`}
              >
                {filter}
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
            <SectionHeader title={`Arama Sonuçları (${filteredPlaces.length})`} index="Ara" />
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-12 text-stone-400 font-light text-sm">
                "{searchQuery}" ile eşleşen estetik sığınak bulunamadı
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {filteredPlaces.map(renderPlaceCard)}
              </div>
            )}
          </div>
        )}

        {!searchQuery && (
          <>
            {/* 1. Günün Seçkisi */}
            {dailyPick && (
              <section className="space-y-4 animate-fade-in-up">
                <SectionHeader
                  title="Günün Seçkisi"
                  description="Bugün için kısa, editoryal bir öneri."
                  index="01"
                />
                <button
                  onClick={() => onSelectPlace(dailyPick)}
                  className="w-full bg-white border border-artistic-border rounded-[2rem] p-3 text-left shadow-sm cursor-pointer group hover:border-[#bd9a6f]/60 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="w-24 h-28 rounded-[1.4rem] overflow-hidden bg-[#D5D2CE] shrink-0 relative">
                      <img
                        src={dailyPick.image}
                        alt={dailyPick.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    </div>
                    <div className="min-w-0 flex-1 py-1.5 pr-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="font-mono text-[8px] font-bold tracking-widest text-[#bd9a6f] uppercase">
                          {dailyPick.district} • {dailyPick.category}
                        </span>
                        <h2 className="font-serif italic text-xl font-light tracking-tight text-[#2C2C2C] line-clamp-1">
                          {dailyPick.name}
                        </h2>
                        <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
                          {dailyPick.editorialDescription}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3">
                        <span className="font-mono text-[8px] text-[#8C8880] tracking-widest uppercase">
                          {dailyPick.rating.toFixed(1)} puan
                        </span>
                        <ChevronRight size={14} className="text-[#bd9a6f]" />
                      </div>
                    </div>
                  </div>
                </button>
              </section>
            )}

            {/* 2. Sana Özel */}
            <section className="space-y-4">
              <SectionHeader
                title="Sana Özel"
                description="Moduna göre hızlı keşif başlıkları."
                index="02"
              />
              <div className="no-scrollbar overflow-x-auto flex gap-3 -mx-6 px-6">
                {personalCollections.map((collection) => {
                  const Icon = collection.icon;
                  const isActive = activePersonalKey === collection.key;
                  return (
                    <button
                      key={collection.key}
                      onClick={() => setActivePersonalKey(collection.key)}
                      className={`w-40 shrink-0 rounded-[1.5rem] border p-4 text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#4A4A40] text-white border-[#4A4A40] shadow-sm'
                          : 'bg-white text-[#2C2C2C] border-artistic-border hover:border-[#bd9a6f]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon size={17} className={isActive ? 'text-[#bd9a6f]' : 'text-[#bd9a6f]'} />
                        <span className={`font-mono text-[8px] font-bold ${isActive ? 'text-stone-300' : 'text-[#8C8880]'}`}>
                          {collection.places.length}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-normal line-clamp-1">{collection.title}</h3>
                      <p className={`font-sans text-[10px] leading-relaxed mt-1 line-clamp-2 ${isActive ? 'text-stone-300' : 'text-[#8C8880]'}`}>
                        {collection.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {activePersonalCollection.places.length === 0 ? (
                <EmptyState text="Bu seçki yakında." />
              ) : (
                <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                  {activePersonalCollection.places.slice(0, 5).map((place) => (
                    <CompactPlaceTile key={place.id} place={place} onSelectPlace={onSelectPlace} />
                  ))}
                </div>
              )}
            </section>

            {/* 3. Bu Hafta Trend */}
            <section className="space-y-4">
              <SectionHeader
                title="Bu Hafta Trend"
                description="Defterlere en çok giren ve öne çıkan yerler."
                index="03"
              />
              <div className="grid grid-cols-1 gap-2">
                {trendingPlaces.map(renderPlaceCard)}
              </div>
            </section>

            {/* 4. Yeni Eklenenler */}
            <section className="space-y-4">
              <SectionHeader
                title="Yeni Eklenenler"
                description="Supabase seçkisinden feed’e en son düşen mekanlar."
                index="04"
              />
              {newestPlaces.length === 0 ? (
                <EmptyState text="Yeni eklenenler yakında." />
              ) : (
                <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
                  {newestPlaces.map((place) => (
                    <CompactPlaceTile key={place.id} place={place} onSelectPlace={onSelectPlace} />
                  ))}
                </div>
              )}
            </section>

            {/* 5. Editörün Defterinden */}
            <section className="space-y-4">
              <SectionHeader
                title="Editörün Defterinden"
                description="Kısa hikayeler ve küçük rota fikirleri."
                index="05"
              />
              <div className="space-y-3">
                {editorialStories.map((story) => (
                  <button
                    key={story.title}
                    onClick={() => story.places[0] && onSelectPlace(story.places[0])}
                    className="w-full bg-white border border-artistic-border rounded-[1.5rem] p-3 flex gap-3 text-left shadow-sm hover:border-[#bd9a6f]/60 transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-[1.1rem] overflow-hidden bg-[#F1EFEC] shrink-0">
                      {story.image ? (
                        <img
                          src={story.image}
                          alt={story.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <NotebookText size={18} className="text-[#bd9a6f]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <span className="font-mono text-[8px] font-bold tracking-widest text-[#bd9a6f] uppercase">
                        {story.label}
                      </span>
                      <h3 className="font-serif italic text-lg text-[#2C2C2C] line-clamp-1 mt-0.5">
                        {story.title}
                      </h3>
                      <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2 mt-0.5">
                        {story.places.length > 0 ? story.description : 'Bu seçki yakında.'}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-[#bd9a6f] self-center shrink-0" />
                  </button>
                ))}
              </div>
            </section>

            {/* 6. Yakında Gideceklerim */}
            <section className="space-y-4">
              <SectionHeader
                title="Yakında Gideceklerim"
                description="Defterinden hızlı bir sonraki durak önizlemesi."
                index="06"
              />
              {savedPreviewPlaces.length === 0 ? (
                <EmptyState text="Henüz yakına aldığın bir yer yok." />
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {savedPreviewPlaces.map(renderPlaceCard)}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  index,
}: {
  title: string;
  description?: string;
  index: string;
}) {
  return (
    <div className="flex justify-between items-end">
      <div className="space-y-1">
        <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
          {index === '03' && <Flame size={18} className="text-[#bd9a6f]" />}
          {index === '06' && <Bookmark size={18} className="text-[#bd9a6f]" />}
          <span>{title}</span>
        </h2>
        {description && (
          <p className="font-sans text-[11px] text-[#8C8880] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider uppercase">{index}</span>
    </div>
  );
}

function CompactPlaceTile({
  place,
  onSelectPlace,
}: {
  key?: React.Key;
  place: Place;
  onSelectPlace: (place: Place) => void;
}) {
  return (
    <button
      onClick={() => onSelectPlace(place)}
      className="w-64 flex-shrink-0 cursor-pointer group bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300 text-left"
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
        <div className="flex items-center gap-1 font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">
          <MapPin size={9} className="text-[#bd9a6f]" />
          <span>{place.city}</span>
        </div>
        <h4 className="font-serif text-md font-normal text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
          {place.name}
        </h4>
        <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">
          {place.editorialDescription}
        </p>
      </div>
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center p-6 bg-warm-cream/35 rounded-2xl text-[#8C8880] text-xs border border-artistic-border/60">
      {text}
    </div>
  );
}
