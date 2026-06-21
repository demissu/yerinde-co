import React, { useMemo, useState } from 'react';
import { ArrowLeft, Clock, MapPin, Route, Search, Sparkles } from 'lucide-react';
import {
  cityRegionByName,
  regionCoverImages,
  TURKEY_CITIES,
  TURKEY_REGION_FILTERS,
  TurkeyRegionName,
} from '../data/turkeyCities';
import { useAtlasContent } from '../hooks/useAtlasContent';
import { Place } from '../types';

interface AtlasPageProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

type AtlasSelection = {
  title: string;
  eyebrow: string;
  description: string;
  places: Place[];
  coverImage?: string;
};

type AtlasRouteItem = {
  title: string;
  area: string;
  description: string;
  image: string;
  duration: string;
  stops: number;
  tags: string[];
  placeIds: string[];
};

type AtlasCityView = {
  plateCode: string;
  name: string;
  region: TurkeyRegionName;
  why: string;
  coverImage: string;
  tags: string[];
  placeCount: number;
  routeCount: number;
};

const getRegionForPlace = (place: Place): TurkeyRegionName =>
  cityRegionByName[place.city] || cityRegionByName[place.district] || 'Ege';

const coverImages = {
  marmara: regionCoverImages.Marmara,
  ege: regionCoverImages.Ege,
  akdeniz: regionCoverImages.Akdeniz,
  anadolu: regionCoverImages['İç Anadolu'],
  karadeniz: regionCoverImages.Karadeniz,
  dogu: regionCoverImages['Doğu Anadolu'],
  guneydogu: regionCoverImages['Güneydoğu Anadolu'],
};

const regionMeta: {
  name: TurkeyRegionName;
  description: string;
  coverImage: string;
  routeCount: number;
  moodTags: string[];
}[] = [
  {
    name: 'Marmara',
    description: 'Tarihi yarımadalar, ada kaçamakları ve şehirli sofralar arasında rafine bir kuzeybatı rotası.',
    coverImage: coverImages.marmara,
    routeCount: 5,
    moodTags: ['ada', 'şehir', 'tarih'],
  },
  {
    name: 'Ege',
    description: 'Taş sokaklar, nitelikli kahve durakları, kıyı kasabaları ve yavaş sofralar.',
    coverImage: coverImages.ege,
    routeCount: 8,
    moodTags: ['kıyı', 'kahve', 'tasarım'],
  },
  {
    name: 'Akdeniz',
    description: 'Ilık koylar, beyaz badanalı pansiyonlar ve gün batımı etrafında kurulan uzun günler.',
    coverImage: coverImages.akdeniz,
    routeCount: 6,
    moodTags: ['deniz', 'güneş', 'yavaş'],
  },
  {
    name: 'İç Anadolu',
    description: 'Bozkır ışığı, çağdaş şehir molaları ve Kapadokya çevresinde büyüyen destinasyonlar.',
    coverImage: coverImages.anadolu,
    routeCount: 4,
    moodTags: ['bozkır', 'müze', 'hafta sonu'],
  },
  {
    name: 'Karadeniz',
    description: 'Sisli yamaçlar, sahil şehirleri ve yağmurlu günlere yakışan sıcak planlar.',
    coverImage: coverImages.karadeniz,
    routeCount: 3,
    moodTags: ['yağmur', 'orman', 'çay'],
  },
  {
    name: 'Doğu Anadolu',
    description: 'Geniş ufuklar, yüksek rakımlı kaçamaklar ve güçlü yerel hafıza.',
    coverImage: coverImages.dogu,
    routeCount: 3,
    moodTags: ['yüksek', 'sakin', 'manzara'],
  },
  {
    name: 'Güneydoğu Anadolu',
    description: 'Taş mimari, baharatlı sofralar ve akşam ışığında yürüyen kadim şehirler.',
    coverImage: coverImages.guneydogu,
    routeCount: 5,
    moodTags: ['taş', 'sofra', 'gece'],
  },
];

const routeMeta = [
  { title: 'Hafta Sonu Kaçamakları', area: 'Ege', description: 'Cuma akşamından pazar kahvesine uzanan kısa ve rafine kaçışlar.', image: coverImages.ege, duration: '2 gün', stops: 5, tags: ['yavaş', 'butik', 'kıyı'], placeIds: ['place_url_hic', 'place_url_liman', 'place_ala_imren'] },
  { title: 'Kahve Rotaları', area: 'İzmir', description: 'Nitelikli kahve, sakin masa ve iyi ışık arayanlara özel duraklar.', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80', duration: '1 gün', stops: 4, tags: ['kahve', 'odak', 'minimal'], placeIds: ['place_als_awake', 'place_bos_punta', 'place_man_sultan'] },
  { title: 'Date Night Seçkileri', area: 'Ege', description: 'Loş ışıklar, iyi masa ve yürüyüşle tamamlanan akşam planları.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80', duration: '1 akşam', stops: 3, tags: ['romantik', 'bar', 'sofra'], placeIds: ['place_als_lapuerta', 'place_ala_fiko', 'place_cun_ayna'] },
  { title: 'Deniz Kenarı Günleri', area: 'Kıyı şehirleri', description: 'Sahil masaları, ada kahveleri ve tuzlu rüzgarla sakinleşen günler.', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=900&q=80', duration: '1-2 gün', stops: 4, tags: ['deniz', 'ada', 'sahil'], placeIds: ['place_url_liman', 'place_cun_taskahve', 'place_ala_windmill'] },
  { title: 'Yağmurlu Gün Planları', area: 'Karadeniz & şehir içi', description: 'Sıcak içecek, iç mekan ve uzun sohbet isteyen kapalı hava planı.', image: coverImages.karadeniz, duration: 'yarım gün', stops: 3, tags: ['yağmur', 'sıcak', 'sakin'], placeIds: ['place_als_awake', 'place_bos_bake', 'place_man_sultan'] },
  { title: 'Fotoğraf Çekmelik Yerler', area: 'Türkiye', description: 'Güzel ışık, doku ve mimari arayanlara görsel yoğunluğu yüksek seçki.', image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=900&q=80', duration: '1 gün', stops: 6, tags: ['fotojenik', 'ışık', 'mimari'], placeIds: ['place_ala_windmill', 'place_url_dam', 'place_cun_ayna'] },
];

export default function AtlasPage({ places, onSelectPlace }: AtlasPageProps) {
  const [selection, setSelection] = useState<AtlasSelection | null>(null);
  const [selectedCity, setSelectedCity] = useState<AtlasCityView | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState('');
  const [cityRegionFilter, setCityRegionFilter] = useState<(typeof TURKEY_REGION_FILTERS)[number]>('Tümü');
  const [showAllCities, setShowAllCities] = useState(false);
  const atlasContent = useAtlasContent();
  const atlasRegions = atlasContent.regions.length > 0 ? atlasContent.regions : regionMeta;
  const atlasRoutes = atlasContent.routes.length > 0 ? atlasContent.routes : routeMeta;

  const regionCounts = useMemo(() => {
    return atlasRegions.reduce<Record<string, number>>((acc, region) => {
      acc[region.name] = places.filter((place) => getRegionForPlace(place) === region.name).length;
      return acc;
    }, {});
  }, [atlasRegions, places]);

  const getCityPlaces = (city: string) =>
    places.filter((place) => place.city === city || (city === 'Balıkesir' && place.city === 'Cunda'));

  const atlasCities = useMemo(() => {
    const cityContentByName = new Map(
      atlasContent.cities.map((city) => [city.name.toLocaleLowerCase('tr-TR'), city])
    );

    return TURKEY_CITIES.map((city) => {
      const content = cityContentByName.get(city.name.toLocaleLowerCase('tr-TR'));
      const cityPlaces = getCityPlaces(city.name);
      const cityPlaceIds = new Set(cityPlaces.map((place) => place.id));
      const routeCount = atlasRoutes.filter((route) => {
        const area = route.area.toLocaleLowerCase('tr-TR');
        return (
          area === city.name.toLocaleLowerCase('tr-TR') ||
          route.placeIds.some((placeId) => cityPlaceIds.has(placeId))
        );
      }).length;

      return {
        ...city,
        plateCode: content?.plateCode || city.plateCode,
        region: (content?.region || city.region) as TurkeyRegionName,
        why: content?.why || city.why,
        coverImage: content?.coverImage || city.coverImage,
        tags: content?.tags.length ? content.tags : city.tags,
        placeCount: cityPlaces.length,
        routeCount,
      };
    });
  }, [atlasContent.cities, atlasRoutes, places]);

  const filteredCities = useMemo(() => {
    const query = citySearch.trim().toLocaleLowerCase('tr-TR');

    return atlasCities
      .filter((city) => cityRegionFilter === 'Tümü' || city.region === cityRegionFilter)
      .filter((city) =>
        query
          ? `${city.name} ${city.plateCode} ${city.region}`.toLocaleLowerCase('tr-TR').includes(query)
          : true
      )
      .sort((a, b) => {
        if (b.placeCount !== a.placeCount) return b.placeCount - a.placeCount;
        if (b.routeCount !== a.routeCount) return b.routeCount - a.routeCount;
        return a.name.localeCompare(b.name, 'tr-TR');
      });
  }, [atlasCities, cityRegionFilter, citySearch]);

  const visibleCities = showAllCities ? filteredCities : filteredCities.slice(0, 20);

  const showSelection = (nextSelection: AtlasSelection) => {
    setSelection(nextSelection);
  };

  const getRoutePlaces = (route: AtlasRouteItem) =>
    places.filter((place) => route.placeIds.includes(place.id));

  const getRoutesForCity = (city: AtlasCityView) => {
    const cityPlaces = getCityPlaces(city.name);
    const cityPlaceIds = new Set(cityPlaces.map((place) => place.id));
    const cityName = city.name.toLocaleLowerCase('tr-TR');

    return atlasRoutes.filter((route) => {
      const routeArea = route.area.toLocaleLowerCase('tr-TR');
      return routeArea.includes(cityName) || route.placeIds.some((placeId) => cityPlaceIds.has(placeId));
    });
  };

  const openCityDetail = (city: AtlasCityView) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
  };

  if (selectedCity) {
    const cityPlaces = getCityPlaces(selectedCity.name);
    const cityRoutes = getRoutesForCity(selectedCity);
    const visibleCityPlaces = selectedDistrict
      ? cityPlaces.filter((place) => place.district === selectedDistrict)
      : cityPlaces;
    const districts = Array.from(new Set(cityPlaces.map((place) => place.district).filter(Boolean)))
      .map((district) => {
        const districtPlaces = cityPlaces.filter((place) => place.district === district);
        const districtPlaceIds = new Set(districtPlaces.map((place) => place.id));
        const routeCount = cityRoutes.filter((route) => {
          const area = route.area.toLocaleLowerCase('tr-TR');
          return (
            area.includes(district.toLocaleLowerCase('tr-TR')) ||
            route.placeIds.some((placeId) => districtPlaceIds.has(placeId))
          );
        }).length;
        const moodText =
          districtPlaces
            .flatMap((place) => place.atmosphereTags)
            .filter(Boolean)
            .slice(0, 3)
            .join(', ') || 'Seçkiler hazırlanıyor';

        return {
          name: district,
          placeCount: districtPlaces.length,
          routeCount,
          moodText,
        };
      })
      .sort((a, b) => b.placeCount - a.placeCount || a.name.localeCompare(b.name, 'tr-TR'));

    return (
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#F9F8F6]">
        <div className="bg-warm-cream p-6 pb-8 rounded-b-[40px] border-b border-artistic-border space-y-5">
          <button
            onClick={() => {
              setSelectedCity(null);
              setSelectedDistrict(null);
            }}
            className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase cursor-pointer"
          >
            <ArrowLeft size={12} />
            Atlas'a dön
          </button>

          <div className="bg-white border border-artistic-border rounded-[2rem] overflow-hidden shadow-sm">
            <div className="relative aspect-16/10 bg-[#F1EFEC]">
              <img
                src={selectedCity.coverImage}
                alt={selectedCity.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute left-4 top-4 bg-warm-cream/95 border border-artistic-border rounded-full px-3 py-1.5 font-mono text-[11px] font-bold text-[#2C2C2C] shadow-sm">
                {selectedCity.plateCode}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <span className="font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase">
                {selectedCity.region}
              </span>
              <h1 className="font-serif italic text-3xl font-light tracking-tight text-[#2C2C2C]">
                {selectedCity.name}
              </h1>
              <p className="font-sans text-xs text-[#6A665D] leading-relaxed">
                {selectedCity.why}
              </p>
              <MetaRow placeCount={cityPlaces.length} routeCount={cityRoutes.length} />
              <TagRow tags={selectedCity.tags.slice(0, 4)} />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-9">
          <section className="space-y-4">
            <AtlasSectionTitle title="İlçeler" count={districts.length} />
            {districts.length === 0 ? (
              <EmptyAtlasState text="Bu şehir için seçkiler yakında." />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {districts.map((district) => (
                  <button
                    key={district.name}
                    onClick={() =>
                      setSelectedDistrict((current) => (current === district.name ? null : district.name))
                    }
                    className={`bg-white border rounded-[1.35rem] p-3 text-left shadow-sm transition-colors ${
                      selectedDistrict === district.name
                        ? 'border-[#bd9a6f]'
                        : 'border-artistic-border hover:border-[#bd9a6f]/70'
                    }`}
                  >
                    <h3 className="font-serif italic text-lg text-[#2C2C2C] leading-tight">{district.name}</h3>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[8px] text-[#8C8880] mt-2">
                      <span>{district.placeCount} mekan</span>
                      <span className="text-[#E5E2DE]">•</span>
                      <span>{district.routeCount} rota</span>
                    </div>
                    <p className="text-[10px] text-[#6A665D] leading-relaxed mt-2 line-clamp-2">
                      {district.moodText}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <AtlasSectionTitle title={`${selectedCity.name} Rotaları`} count={cityRoutes.length} />
            {cityRoutes.length === 0 ? (
              <EmptyAtlasState text="Bu şehir için seçkiler yakında." />
            ) : (
              <div className="space-y-4">
                {cityRoutes.map((route) => (
                  <button
                    key={route.title}
                    onClick={() => {
                      setSelectedCity(null);
                      setSelectedDistrict(null);
                      showSelection({
                        title: route.title,
                        eyebrow: route.area,
                        description: route.description,
                        places: getRoutePlaces(route),
                        coverImage: route.image,
                      });
                    }}
                    className="w-full bg-white border border-artistic-border rounded-[2rem] overflow-hidden text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
                  >
                    <img src={route.image} alt={route.title} className="w-full aspect-16/9 object-cover bg-[#F1EFEC]" />
                    <div className="p-4 space-y-2">
                      <span className="font-mono text-[8px] font-bold text-[#bd9a6f] tracking-widest uppercase">{route.area}</span>
                      <h3 className="font-serif italic text-xl text-[#2C2C2C]">{route.title}</h3>
                      <p className="text-[11px] text-[#6A665D] leading-relaxed">{route.description}</p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#8C8880]">
                        <span className="flex items-center gap-1"><Clock size={11} />{route.duration}</span>
                        <span className="flex items-center gap-1"><Route size={11} />{route.stops} durak</span>
                      </div>
                      <TagRow tags={route.tags} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <AtlasSectionTitle
              title={selectedDistrict ? `${selectedDistrict} Mekanları` : `${selectedCity.name} Mekanları`}
              count={visibleCityPlaces.length}
            />
            {visibleCityPlaces.length === 0 ? (
              <EmptyAtlasState text="Bu şehir için seçkiler yakında." />
            ) : (
              <div className="space-y-4">
                {visibleCityPlaces.map((place) => (
                  <PlaceListButton key={place.id} place={place} onSelectPlace={onSelectPlace} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  if (selection) {
    return (
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#F9F8F6]">
        <div className="bg-warm-cream p-6 pb-8 rounded-b-[40px] border-b border-artistic-border space-y-5">
          <button
            onClick={() => setSelection(null)}
            className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase cursor-pointer"
          >
            <ArrowLeft size={12} />
            Atlas'a dön
          </button>
          <div>
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase">{selection.eyebrow}</span>
            <h1 className="font-serif italic text-3xl font-light tracking-tight text-[#2C2C2C] mt-1">
              {selection.title}
            </h1>
            <p className="font-sans text-xs text-[#6A665D] leading-relaxed mt-2 max-w-[90%]">
              {selection.description}
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {selection.places.length === 0 ? (
            <div className="bg-white border border-artistic-border rounded-[2rem] p-10 text-center shadow-sm">
              <Sparkles size={24} className="text-[#bd9a6f] mx-auto mb-3" />
              <h2 className="font-serif italic text-xl text-[#2C2C2C]">Bu seçki yakında.</h2>
              <p className="text-xs text-[#8C8880] mt-2 leading-relaxed">
                Bu rota için editör seçkileri hazırlanıyor.
              </p>
            </div>
          ) : (
            selection.places.map((place) => (
              <button
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className="w-full bg-white border border-artistic-border rounded-[1.5rem] p-3 flex gap-3 text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
              >
                <img
                  src={place.image}
                  alt={place.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-[1.1rem] object-cover bg-[#F1EFEC] shrink-0"
                />
                <div className="min-w-0 flex-1 py-1">
                  <span className="font-mono text-[8px] font-bold text-[#bd9a6f] tracking-widest uppercase">
                    {place.district}, {place.city}
                  </span>
                  <h3 className="font-serif italic text-lg text-[#2C2C2C] truncate mt-0.5">{place.name}</h3>
                  <p className="text-[11px] text-[#6A665D] line-clamp-2 leading-relaxed mt-1">{place.editorialDescription}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-[#F9F8F6]">
      <div className="bg-warm-cream p-6 pb-8 rounded-b-[40px] border-b border-artistic-border space-y-4">
        <span className="font-mono text-[9px] font-bold tracking-widest text-[#bd9a6f] uppercase">Türkiye Keşif Atlası</span>
        <h1 className="font-serif italic text-3xl font-light tracking-tight text-[#2C2C2C] leading-tight">
          Yerinde Atlas
        </h1>
        <p className="font-sans text-xs text-[#6A665D] leading-relaxed max-w-[88%]">
          Bölgeler, şehirler, destinasyonlar ve editör rotaları üzerinden Türkiye'yi daha yavaş, daha seçici keşfedin.
        </p>
      </div>

      <div className="px-6 py-6 space-y-9">
        <section className="space-y-4">
          <AtlasSectionTitle title="Bölgeler" count={atlasRegions.length} />
          <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6">
            {atlasRegions.map((region) => {
              const regionPlaces = places.filter((place) => getRegionForPlace(place) === region.name);
              return (
                <button
                  key={region.name}
                  onClick={() => showSelection({
                    title: region.name,
                    eyebrow: 'Bölge seçkisi',
                    description: region.description,
                    places: regionPlaces,
                    coverImage: region.coverImage,
                  })}
                  className="w-72 shrink-0 bg-white border border-artistic-border rounded-[2rem] overflow-hidden text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
                >
                  <img src={region.coverImage} alt={region.name} className="w-full aspect-16/10 object-cover bg-[#F1EFEC]" />
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif italic text-xl text-[#2C2C2C]">{region.name}</h3>
                    <p className="text-[11px] text-[#6A665D] leading-relaxed line-clamp-2">{region.description}</p>
                    <MetaRow placeCount={regionCounts[region.name] ?? 0} routeCount={region.routeCount} />
                    <TagRow tags={region.moodTags} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-end justify-between">
              <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
                <MapPin size={16} className="text-[#bd9a6f]" />
                <span>Şehirler</span>
              </h2>
              <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">81</span>
            </div>
            <p className="font-sans text-xs text-[#6A665D] leading-relaxed">
              Türkiye'nin dört bir yanındaki şehirleri keşfet.
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#bd9a6f]" />
            <input
              value={citySearch}
              onChange={(event) => {
                setCitySearch(event.target.value);
                setShowAllCities(false);
              }}
              placeholder="Şehir ara..."
              className="w-full bg-white border border-artistic-border rounded-full pl-9 pr-4 py-3 text-xs text-[#2C2C2C] placeholder:text-[#A8A39B] focus:outline-none focus:border-[#bd9a6f] shadow-sm"
            />
          </div>

          <div className="no-scrollbar overflow-x-auto flex gap-2 -mx-6 px-6">
            {TURKEY_REGION_FILTERS.map((region) => (
              <button
                key={region}
                onClick={() => {
                  setCityRegionFilter(region);
                  setShowAllCities(false);
                }}
                className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[9px] font-bold tracking-widest uppercase transition-colors ${
                  cityRegionFilter === region
                    ? 'border-[#bd9a6f] bg-[#bd9a6f] text-white'
                    : 'border-artistic-border bg-white text-[#8C8880]'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {visibleCities.map((city) => {
              const cityPlaces = getCityPlaces(city.name);
              return (
                <button
                  key={city.name}
                  onClick={() => openCityDetail(city)}
                  className="bg-white border border-artistic-border rounded-[1.35rem] overflow-hidden text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
                >
                  <div className="relative aspect-4/3 bg-[#F1EFEC] overflow-hidden">
                    <img
                      src={city.coverImage}
                      alt={city.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute left-2.5 top-2.5 bg-warm-cream/95 border border-artistic-border rounded-full px-2 py-1 font-mono text-[10px] font-bold text-[#2C2C2C] shadow-sm">
                      {city.plateCode}
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    <span className="font-mono text-[7px] font-bold text-[#bd9a6f] tracking-widest uppercase line-clamp-1">
                      {city.region}
                    </span>
                    <h3 className="font-serif italic text-lg text-[#2C2C2C] leading-tight">{city.name}</h3>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[8px] text-[#8C8880]">
                      <span>{city.placeCount} mekan</span>
                      <span className="text-[#E5E2DE]">•</span>
                      <span>{city.routeCount} rota</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {visibleCities.length === 0 && (
            <div className="bg-white border border-artistic-border rounded-[2rem] p-8 text-center shadow-sm">
              <Sparkles size={22} className="text-[#bd9a6f] mx-auto mb-3" />
              <h3 className="font-serif italic text-lg text-[#2C2C2C]">Şehir bulunamadı.</h3>
              <p className="text-xs text-[#8C8880] mt-2">Arama veya bölge filtresini değiştirmeyi dene.</p>
            </div>
          )}

          {!showAllCities && filteredCities.length > visibleCities.length && (
            <button
              onClick={() => setShowAllCities(true)}
              className="w-full bg-white border border-artistic-border rounded-full px-4 py-3 font-mono text-[10px] font-bold tracking-widest uppercase text-[#bd9a6f] shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
            >
              Tüm şehirleri göster
            </button>
          )}
        </section>

        <section className="space-y-4">
          <AtlasSectionTitle title="Rotalar" count={atlasRoutes.length} />
          <div className="space-y-4">
            {atlasRoutes.map((route) => {
              const routePlaces = places.filter((place) => route.placeIds.includes(place.id));
              return (
                <button
                  key={route.title}
                  onClick={() => showSelection({
                    title: route.title,
                    eyebrow: route.area,
                    description: route.description,
                    places: routePlaces,
                    coverImage: route.image,
                  })}
                  className="w-full bg-white border border-artistic-border rounded-[2rem] overflow-hidden text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
                >
                  <img src={route.image} alt={route.title} className="w-full aspect-16/9 object-cover bg-[#F1EFEC]" />
                  <div className="p-4 space-y-2">
                    <span className="font-mono text-[8px] font-bold text-[#bd9a6f] tracking-widest uppercase">{route.area}</span>
                    <h3 className="font-serif italic text-xl text-[#2C2C2C]">{route.title}</h3>
                    <p className="text-[11px] text-[#6A665D] leading-relaxed">{route.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#8C8880]">
                      <span className="flex items-center gap-1"><Clock size={11} />{route.duration}</span>
                      <span className="flex items-center gap-1"><Route size={11} />{route.stops} durak</span>
                    </div>
                    <TagRow tags={route.tags} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function AtlasSectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="font-serif text-xl font-normal text-[#2C2C2C] flex items-center gap-2">
        <MapPin size={16} className="text-[#bd9a6f]" />
        <span>{title}</span>
      </h2>
      <span className="font-mono text-[10px] text-[#8C8880] font-semibold tracking-wider">{count}</span>
    </div>
  );
}

function MetaRow({ placeCount, routeCount }: { placeCount: number; routeCount: number }) {
  return (
    <div className="flex gap-2 text-[10px] font-mono text-[#8C8880]">
      <span>{placeCount} mekan</span>
      <span className="text-[#E5E2DE]">•</span>
      <span>{routeCount} rota</span>
    </div>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-1">
      {tags.map((tag) => (
        <span key={tag} className="text-[8px] px-2 py-1 rounded-full border border-artistic-border text-[#8C8880] bg-[#F9F8F6] font-mono">
          #{tag}
        </span>
      ))}
    </div>
  );
}

function PlaceListButton({
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
      className="w-full bg-white border border-artistic-border rounded-[1.5rem] p-3 flex gap-3 text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
    >
      <img
        src={place.image}
        alt={place.name}
        referrerPolicy="no-referrer"
        className="w-20 h-20 rounded-[1.1rem] object-cover bg-[#F1EFEC] shrink-0"
      />
      <div className="min-w-0 flex-1 py-1">
        <span className="font-mono text-[8px] font-bold text-[#bd9a6f] tracking-widest uppercase">
          {place.district}, {place.city}
        </span>
        <h3 className="font-serif italic text-lg text-[#2C2C2C] truncate mt-0.5">{place.name}</h3>
        <p className="text-[11px] text-[#6A665D] line-clamp-2 leading-relaxed mt-1">{place.editorialDescription}</p>
      </div>
    </button>
  );
}

function EmptyAtlasState({ text }: { text: string }) {
  return (
    <div className="bg-white border border-artistic-border rounded-[2rem] p-8 text-center shadow-sm">
      <Sparkles size={22} className="text-[#bd9a6f] mx-auto mb-3" />
      <h3 className="font-serif italic text-lg text-[#2C2C2C]">{text}</h3>
    </div>
  );
}
