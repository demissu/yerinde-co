import React, { useEffect, useState } from 'react';
import { X, Clock, MapPin, Route as RouteIcon, Bookmark, Check, ChevronRight } from 'lucide-react';
import { EditorialRoute } from '../data/routes';
import { Place } from '../types';

interface RouteDetailSheetProps {
  route: EditorialRoute;
  placesById: Map<string, Place>;
  onClose: () => void;
  onSelectPlace: (place: Place) => void;
}

const storageKey = 'yerinde_saved_routes';

const getSavedRouteIds = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]') as string[];
  } catch {
    return [];
  }
};

export default function RouteDetailSheet({ route, placesById, onClose, onSelectPlace }: RouteDetailSheetProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(getSavedRouteIds().includes(route.id));
  }, [route.id]);

  const toggleRouteSave = () => {
    const current = getSavedRouteIds();
    const next = current.includes(route.id)
      ? current.filter((routeId) => routeId !== route.id)
      : [...current, route.id];
    localStorage.setItem(storageKey, JSON.stringify(next));
    setIsSaved(next.includes(route.id));
  };

  return (
    <div className="fixed inset-0 bg-[#2C2C2C]/50 backdrop-blur-sm z-50 flex justify-end items-end max-w-md mx-auto">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="w-full bg-[#F9F8F6] rounded-t-[2.5rem] overflow-hidden relative z-10 max-h-[92vh] flex flex-col shadow-xl border-t border-artistic-border">
        <div className="w-full flex justify-center py-3.5 shrink-0 bg-[#F9F8F6]">
          <div className="w-12 h-1 bg-[#E5E2DE] rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="relative w-full aspect-16/10 bg-[#D5D2CE]">
            <img
              src={route.coverImage}
              alt={route.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C2C2C]/70 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2C2C2C] flex items-center justify-center transition-colors shadow-sm border border-artistic-border cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-5 left-6 right-6 text-white space-y-1.5">
              <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-stone-200">
                Keşif Rotası
              </span>
              <h2 className="font-serif italic text-3xl font-light leading-tight">
                {route.title}
              </h2>
            </div>
          </div>

          <div className="px-6 pt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-widest uppercase text-[#bd9a6f]">
                <MapPin size={11} />
                {route.area}
              </div>
              <p className="font-sans text-sm text-[#6A665D] leading-relaxed font-light">
                {route.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white border border-artistic-border rounded-full px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[#6A665D] flex items-center gap-1.5">
                  <Clock size={11} className="text-[#bd9a6f]" />
                  {route.duration}
                </span>
                <span className="bg-white border border-artistic-border rounded-full px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase text-[#6A665D] flex items-center gap-1.5">
                  <RouteIcon size={11} className="text-[#bd9a6f]" />
                  {route.stops.length} durak
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {route.moodTags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] text-[#8C8880] bg-white border border-artistic-border px-2.5 py-1 rounded-full"
                  >
                    #{tag.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={toggleRouteSave}
              className={`w-full rounded-2xl border px-4 py-3 font-mono text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 ${
                isSaved
                  ? 'bg-[#4A4A40] border-[#4A4A40] text-white'
                  : 'bg-white border-artistic-border text-[#2C2C2C]'
              }`}
            >
              {isSaved ? <Check size={13} className="text-[#bd9a6f]" /> : <Bookmark size={13} className="text-[#bd9a6f]" />}
              {isSaved ? 'Rota kaydedildi' : 'Rotayı sonra için kaydet'}
            </button>

            <div className="space-y-3">
              <h3 className="font-serif text-md font-normal text-[#2C2C2C]">Duraklar</h3>
              <div className="space-y-3">
                {route.stops.map((stop, index) => {
                  const place = stop.placeId ? placesById.get(stop.placeId) : null;
                  const content = (
                    <>
                      <span className="w-8 h-8 rounded-full bg-[#4A4A40] text-white font-mono text-[10px] flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {stop.time && (
                            <span className="font-mono text-[8px] font-bold tracking-widest text-[#bd9a6f] uppercase">
                              {stop.time}
                            </span>
                          )}
                          {place && (
                            <span className="font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">
                              Yerinde
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif italic text-lg text-[#2C2C2C] line-clamp-1 mt-0.5">
                          {place?.name || stop.title}
                        </h4>
                        <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2 mt-0.5">
                          {stop.note}
                        </p>
                      </div>
                      {place && <ChevronRight size={14} className="text-[#bd9a6f] shrink-0" />}
                    </>
                  );

                  return place ? (
                    <button
                      key={`${route.id}-${index}`}
                      onClick={() => onSelectPlace(place)}
                      className="w-full bg-white border border-artistic-border rounded-[1.5rem] p-3 flex gap-3 text-left shadow-sm hover:border-[#bd9a6f]/60 transition-colors cursor-pointer items-center"
                    >
                      {content}
                    </button>
                  ) : (
                    <div
                      key={`${route.id}-${index}`}
                      className="w-full bg-white border border-artistic-border rounded-[1.5rem] p-3 flex gap-3 text-left shadow-sm items-center"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
