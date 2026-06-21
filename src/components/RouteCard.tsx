import React from 'react';
import { Clock, MapPin, Route as RouteIcon } from 'lucide-react';
import { EditorialRoute } from '../data/routes';
import { Place } from '../types';

interface RouteCardProps {
  key?: React.Key;
  route: EditorialRoute;
  placesById: Map<string, Place>;
  onSelect: (route: EditorialRoute) => void;
}

export default function RouteCard({ route, placesById, onSelect }: RouteCardProps) {
  const previewStops = route.stops.slice(0, 3);

  return (
    <button
      onClick={() => onSelect(route)}
      className="w-72 shrink-0 bg-white border border-artistic-border rounded-[1.5rem] p-2.5 shadow-sm hover:border-[#bd9a6f]/60 transition-all duration-300 text-left cursor-pointer group"
    >
      <div className="relative w-full aspect-16/10 rounded-[1.1rem] overflow-hidden bg-[#D5D2CE]">
        <img
          src={route.coverImage}
          alt={route.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-artistic-dark font-mono text-[8px] px-2 py-0.5 rounded uppercase flex items-center gap-1">
          <MapPin size={9} />
          {route.area}
        </span>
      </div>

      <div className="mt-3 px-1 space-y-3">
        <div>
          <h3 className="font-serif italic text-xl font-light text-[#2C2C2C] line-clamp-1 group-hover:text-warm-brand transition-colors">
            {route.title}
          </h3>
          <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed line-clamp-2 mt-1">
            {route.description}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[8px] font-bold tracking-widest text-[#8C8880] uppercase">
          <span className="flex items-center gap-1">
            <Clock size={10} className="text-[#bd9a6f]" />
            {route.duration}
          </span>
          <span className="flex items-center gap-1">
            <RouteIcon size={10} className="text-[#bd9a6f]" />
            {route.stops.length} durak
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {route.moodTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[8px] text-[#8C8880] bg-[#F9F8F6] border border-artistic-border px-2 py-0.5 rounded-full"
            >
              #{tag.replace(/\s+/g, '')}
            </span>
          ))}
        </div>

        <div className="border-t border-[#F5F2EF] pt-3 space-y-1.5">
          {previewStops.map((stop, index) => {
            const place = stop.placeId ? placesById.get(stop.placeId) : null;
            return (
              <div key={`${route.id}-${index}`} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#4A4A40] text-white font-mono text-[8px] flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="font-sans text-[10px] text-[#6A665D] line-clamp-1">
                  {place?.name || stop.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
