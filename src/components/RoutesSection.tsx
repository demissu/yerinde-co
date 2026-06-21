import React from 'react';
import { EditorialRoute } from '../data/routes';
import { Place } from '../types';
import RouteCard from './RouteCard';

interface RoutesSectionProps {
  routes: EditorialRoute[];
  placesById: Map<string, Place>;
  onSelectRoute: (route: EditorialRoute) => void;
  header: React.ReactNode;
}

export default function RoutesSection({ routes, placesById, onSelectRoute, header }: RoutesSectionProps) {
  return (
    <section className="space-y-4">
      {header}
      <div className="no-scrollbar overflow-x-auto flex gap-4 -mx-6 px-6 pt-1">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            placesById={placesById}
            onSelect={onSelectRoute}
          />
        ))}
      </div>
    </section>
  );
}
