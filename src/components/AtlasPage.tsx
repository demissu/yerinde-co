import React, { useMemo, useState } from 'react';
import { ArrowLeft, Clock, MapPin, Route, Sparkles } from 'lucide-react';
import { Place } from '../types';

interface AtlasPageProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

type TurkeyRegion =
  | 'Marmara'
  | 'Ege'
  | 'Akdeniz'
  | 'İç Anadolu'
  | 'Karadeniz'
  | 'Doğu Anadolu'
  | 'Güneydoğu Anadolu';

type AtlasSelection = {
  title: string;
  eyebrow: string;
  description: string;
  places: Place[];
  coverImage?: string;
};

const regionByCity: Record<string, TurkeyRegion> = {
  İstanbul: 'Marmara',
  Balıkesir: 'Marmara',
  Cunda: 'Marmara',
  Çanakkale: 'Marmara',
  İzmir: 'Ege',
  Muğla: 'Ege',
  Manisa: 'Ege',
  Antalya: 'Akdeniz',
  Ankara: 'İç Anadolu',
  Eskişehir: 'İç Anadolu',
  Nevşehir: 'İç Anadolu',
  Trabzon: 'Karadeniz',
  Mardin: 'Güneydoğu Anadolu',
  Gaziantep: 'Güneydoğu Anadolu',
};

const getRegionForPlace = (place: Place): TurkeyRegion =>
  regionByCity[place.city] || regionByCity[place.district] || 'Ege';

const coverImages = {
  marmara: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80',
  ege: 'https://images.unsplash.com/photo-1567996603104-4b98a8e475bb?auto=format&fit=crop&w=900&q=80',
  akdeniz: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80',
  anadolu: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=900&q=80',
  karadeniz: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=900&q=80',
  dogu: 'https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=900&q=80',
  guneydogu: 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?auto=format&fit=crop&w=900&q=80',
};

const regionMeta: {
  name: TurkeyRegion;
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

const cityMeta = [
  { name: 'İzmir', region: 'Ege', why: 'Kahve, sahil, tasarım ve gastronomi arasında dengeli bir başlangıç.', tags: ['kahve', 'kıyı', 'tasarım'] },
  { name: 'İstanbul', region: 'Marmara', why: 'Mahalle mahalle değişen kültür, yemek ve çağdaş şehir enerjisi.', tags: ['şehir', 'galeri', 'sofra'] },
  { name: 'Ankara', region: 'İç Anadolu', why: 'Sakin kafeler, müzeler ve yalın şehir ritmi için iyi bir merkez.', tags: ['müze', 'sakin', 'şehir'] },
  { name: 'Antalya', region: 'Akdeniz', why: 'Kaleiçi sokakları, koylar ve güneşli uzun gün planları.', tags: ['deniz', 'tarih', 'gün batımı'] },
  { name: 'Muğla', region: 'Ege', why: 'Datça, Göcek ve kıyı kasabalarıyla yavaş rota omurgası.', tags: ['koy', 'tekne', 'yavaş'] },
  { name: 'Balıkesir', region: 'Marmara', why: 'Cunda, Ayvalık ve ada ruhuyla kuzey Ege geçişi.', tags: ['ada', 'zeytin', 'kahve'] },
  { name: 'Çanakkale', region: 'Marmara', why: 'Bozcaada ve kıyı kasabalarıyla hafif, rüzgarlı bir kaçış.', tags: ['ada', 'şarap', 'rüzgar'] },
  { name: 'Eskişehir', region: 'İç Anadolu', why: 'Genç şehir enerjisi, yürünebilir sokaklar ve kahve molaları.', tags: ['kahve', 'nehir', 'şehir'] },
  { name: 'Nevşehir', region: 'İç Anadolu', why: 'Kapadokya deneyiminin vadiler, taş oteller ve gün doğumuyla merkezi.', tags: ['vadi', 'taş', 'balon'] },
  { name: 'Mardin', region: 'Güneydoğu Anadolu', why: 'Taş teraslar, dar sokaklar ve altın saat yürüyüşleri.', tags: ['taş', 'teras', 'tarih'] },
  { name: 'Gaziantep', region: 'Güneydoğu Anadolu', why: 'Sofra kültürü, bakır çarşısı ve yoğun lezzet hafızası.', tags: ['sofra', 'baharat', 'çarşı'] },
  { name: 'Trabzon', region: 'Karadeniz', why: 'Yağmur, yayla hissi ve Karadeniz kıyısında sıcak molalar.', tags: ['yağmur', 'yayla', 'çay'] },
] as const;

const destinationMeta = [
  { name: 'Kapadokya', city: 'Nevşehir', tags: ['vadi', 'balon', 'taş otel'], image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=900&q=80' },
  { name: 'Alaçatı', city: 'İzmir', tags: ['taş sokak', 'rüzgar', 'akşam'], image: 'https://images.unsplash.com/photo-1567996603104-4b98a8e475bb?auto=format&fit=crop&w=900&q=80' },
  { name: 'Urla', city: 'İzmir', tags: ['gastronomi', 'bağ', 'yavaş'], image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80' },
  { name: 'Cunda', city: 'Balıkesir', tags: ['ada', 'taş', 'kahve'], image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=80' },
  { name: 'Bozcaada', city: 'Çanakkale', tags: ['ada', 'bağ', 'rüzgar'], image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
  { name: 'Kaş', city: 'Antalya', tags: ['koy', 'dalış', 'gün batımı'], image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=80' },
  { name: 'Datça', city: 'Muğla', tags: ['badem', 'koy', 'sakin'], image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80' },
  { name: 'Göcek', city: 'Muğla', tags: ['tekne', 'mavi', 'premium'], image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80' },
  { name: 'Mardin', city: 'Mardin', tags: ['taş', 'teras', 'gece'], image: 'https://images.unsplash.com/photo-1574192324001-ee41e18ed679?auto=format&fit=crop&w=900&q=80' },
  { name: 'Abant', city: 'Bolu', tags: ['göl', 'orman', 'hafta sonu'], image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80' },
];

const routeMeta = [
  { title: 'Hafta Sonu Kaçamakları', area: 'Ege', description: 'Cuma akşamından pazar kahvesine uzanan kısa ve rafine kaçışlar.', image: coverImages.ege, duration: '2 gün', stops: 5, tags: ['yavaş', 'butik', 'kıyı'], placeIds: ['place_url_hic', 'place_url_liman', 'place_ala_imren'] },
  { title: 'Kahve Rotaları', area: 'İzmir', description: 'Nitelikli kahve, sakin masa ve iyi ışık arayanlara özel duraklar.', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=80', duration: '1 gün', stops: 4, tags: ['kahve', 'odak', 'minimal'], placeIds: ['place_als_awake', 'place_bos_punta', 'place_man_sultan'] },
  { title: 'Date Night Seçkileri', area: 'Ege', description: 'Loş ışıklar, iyi masa ve yürüyüşle tamamlanan akşam planları.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=900&q=80', duration: '1 akşam', stops: 3, tags: ['romantik', 'bar', 'sofra'], placeIds: ['place_als_lapuerta', 'place_ala_fiko', 'place_cun_ayna'] },
  { title: 'Deniz Kenarı Günleri', area: 'Kıyı şehirleri', description: 'Sahil masaları, ada kahveleri ve tuzlu rüzgarla sakinleşen günler.', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=900&q=80', duration: '1-2 gün', stops: 4, tags: ['deniz', 'ada', 'sahil'], placeIds: ['place_url_liman', 'place_cun_taskahve', 'place_ala_windmill'] },
  { title: 'Yağmurlu Gün Planları', area: 'Karadeniz & şehir içi', description: 'Sıcak içecek, iç mekan ve uzun sohbet isteyen kapalı hava planı.', image: coverImages.karadeniz, duration: 'yarım gün', stops: 3, tags: ['yağmur', 'sıcak', 'sakin'], placeIds: ['place_als_awake', 'place_bos_bake', 'place_man_sultan'] },
  { title: 'Fotoğraf Çekmelik Yerler', area: 'Türkiye', description: 'Güzel ışık, doku ve mimari arayanlara görsel yoğunluğu yüksek seçki.', image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=900&q=80', duration: '1 gün', stops: 6, tags: ['fotojenik', 'ışık', 'mimari'], placeIds: ['place_ala_windmill', 'place_url_dam', 'place_cun_ayna'] },
];

function includesDestination(place: Place, destination: string) {
  const haystack = `${place.name} ${place.city} ${place.district} ${place.address} ${place.atmosphereTags.join(' ')}`.toLowerCase();
  return haystack.includes(destination.toLowerCase());
}

export default function AtlasPage({ places, onSelectPlace }: AtlasPageProps) {
  const [selection, setSelection] = useState<AtlasSelection | null>(null);

  const regionCounts = useMemo(() => {
    return regionMeta.reduce<Record<TurkeyRegion, number>>((acc, region) => {
      acc[region.name] = places.filter((place) => getRegionForPlace(place) === region.name).length;
      return acc;
    }, {} as Record<TurkeyRegion, number>);
  }, [places]);

  const getCityPlaces = (city: string) =>
    places.filter((place) => place.city === city || (city === 'Balıkesir' && place.city === 'Cunda'));

  const showSelection = (nextSelection: AtlasSelection) => {
    setSelection(nextSelection);
  };

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
          <AtlasSectionTitle title="Bölgeler" count={regionMeta.length} />
          <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6">
            {regionMeta.map((region) => {
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
                    <MetaRow placeCount={regionCounts[region.name]} routeCount={region.routeCount} />
                    <TagRow tags={region.moodTags} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <AtlasSectionTitle title="Şehirler" count={cityMeta.length} />
          <div className="grid grid-cols-1 gap-3">
            {cityMeta.map((city) => {
              const cityPlaces = getCityPlaces(city.name);
              return (
                <button
                  key={city.name}
                  onClick={() => showSelection({
                    title: city.name,
                    eyebrow: city.region,
                    description: city.why,
                    places: cityPlaces,
                  })}
                  className="bg-white border border-artistic-border rounded-[1.5rem] p-4 text-left shadow-sm hover:border-[#bd9a6f]/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[8px] font-bold text-[#bd9a6f] tracking-widest uppercase">{city.region}</span>
                      <h3 className="font-serif italic text-xl text-[#2C2C2C] mt-0.5">{city.name}</h3>
                    </div>
                    <span className="font-mono text-[9px] text-[#8C8880] border border-artistic-border rounded-full px-2.5 py-1">
                      {cityPlaces.length} mekan
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6A665D] leading-relaxed mt-2">{city.why}</p>
                  <TagRow tags={[...city.tags]} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <AtlasSectionTitle title="Öne Çıkan Destinasyonlar" count={destinationMeta.length} />
          <div className="grid grid-cols-2 gap-4">
            {destinationMeta.map((destination) => {
              const destinationPlaces = places.filter((place) => includesDestination(place, destination.name) || place.city === destination.city || place.district === destination.name);
              return (
                <button
                  key={destination.name}
                  onClick={() => showSelection({
                    title: destination.name,
                    eyebrow: 'Destinasyon',
                    description: `${destination.name} çevresinde editör seçkileri ve yakın duraklar.`,
                    places: destinationPlaces,
                    coverImage: destination.image,
                  })}
                  className="text-left group"
                >
                  <div className="aspect-1/1 rounded-[2rem] overflow-hidden bg-[#F1EFEC] border border-artistic-border shadow-sm">
                    <img src={destination.image} alt={destination.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="font-serif italic text-base text-[#2C2C2C] mt-3 px-1">{destination.name}</h3>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-[#8C8880] px-1 mt-0.5">
                    {destinationPlaces.length} mekan
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <AtlasSectionTitle title="Rotalar" count={routeMeta.length} />
          <div className="space-y-4">
            {routeMeta.map((route) => {
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
