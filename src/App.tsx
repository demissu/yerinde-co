import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import BottomNav, { TabRoute } from './components/BottomNav';
import HomeFeed from './components/HomeFeed';
import MapPage from './components/MapPage';
import SavedPage from './components/SavedPage';
import PlaceDetailSheet from './components/PlaceDetailSheet';
import { SAMPLE_PLACES } from './data/places';
import { Place, SavedListName } from './types';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [savedMap, setSavedMap] = useState<Record<string, SavedListName[]>>({});
  const [currentRoute, setCurrentRoute] = useState<TabRoute>('explore');
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync state with localStorage safely on mount
  useEffect(() => {
    try {
      const storedOnboarding = localStorage.getItem('yerinde_onboarding');
      const storedTastes = localStorage.getItem('yerinde_tastes');
      const storedSaves = localStorage.getItem('yerinde_saves');

      if (storedOnboarding === 'true') {
        setOnboardingCompleted(true);
      }
      if (storedTastes) {
        setSelectedTastes(JSON.parse(storedTastes));
      }
      if (storedSaves) {
        setSavedMap(JSON.parse(storedSaves));
      } else {
        // Pre-populate some aesthetic sample list state so they start with interesting, saved spots!
        const initialSaves: Record<string, SavedListName[]> = {
          'place_als_leone': ['Want to go', 'Favorites'],
          'place_url_hic': ['Favorites', 'Weekend route'],
          'place_cun_taskahve': ['Visited', 'Weekend route'],
          'place_als_awake': ['Coffee list'],
        };
        setSavedMap(initialSaves);
        localStorage.setItem('yerinde_saves', JSON.stringify(initialSaves));
      }
    } catch (e) {
      console.error('Error hydrating Yerinde state: ', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Set onboarding completion state
  const handleOnboardingComplete = (tastes: string[]) => {
    setSelectedTastes(tastes);
    setOnboardingCompleted(true);
    localStorage.setItem('yerinde_onboarding', 'true');
    localStorage.setItem('yerinde_tastes', JSON.stringify(tastes));
  };

  // Re-onboard/Reset state handler
  const handleResetTasteProfile = () => {
    setOnboardingCompleted(false);
    setSelectedTastes([]);
    setCurrentRoute('explore');
  };

  // Toggle saving spot in specific list folders
  const handleToggleSave = (placeId: string, listName: SavedListName) => {
    setSavedMap((prev) => {
      const currentLists = prev[placeId] || [];
      let updatedLists: SavedListName[];

      if (currentLists.includes(listName)) {
        // Remove from list
        updatedLists = currentLists.filter((l) => l !== listName);
      } else {
        // Add to list
        updatedLists = [...currentLists, listName];
      }

      const updatedMap = {
        ...prev,
        [placeId]: updatedLists,
      };

      // Persist in localStorage
      localStorage.setItem('yerinde_saves', JSON.stringify(updatedMap));
      return updatedMap;
    });
  };

  // Helper calculation for global item badge counts
  const savedPlacesCount = Object.keys(savedMap).filter(key => savedMap[key] && savedMap[key].length > 0).length;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F8F6]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#4A4A40] border-t-transparent animate-spin" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#8C8880] mt-4 font-semibold">Yerinde Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex justify-center items-start">
      {/* Phone device viewport boundaries */}
      <div 
        id="yerinde_container"
        className="relative w-full max-w-md min-h-screen bg-[#F9F8F6] shadow-2xl border-x border-artistic-border flex flex-col justify-between overflow-hidden"
      >
        {/* Onboarding Taste Check Wrapper */}
        {!onboardingCompleted ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <div className="flex-1 flex flex-col min-h-screen pb-[72px] bg-[#F9F8F6] relative">
            
            {/* Conditional route views */}
            {currentRoute === 'explore' && (
              <HomeFeed
                places={SAMPLE_PLACES}
                savedMap={savedMap}
                onToggleSave={handleToggleSave}
                onSelectPlace={setActivePlace}
                selectedTastes={selectedTastes}
              />
            )}

            {currentRoute === 'map' && (
              <MapPage 
                places={SAMPLE_PLACES}
                onSelectPlace={setActivePlace}
              />
            )}

            {currentRoute === 'saved' && (
              <div className="flex-1 flex flex-col">
                <SavedPage
                  places={SAMPLE_PLACES}
                  savedMap={savedMap}
                  onToggleSave={handleToggleSave}
                  onSelectPlace={setActivePlace}
                />
                
                {/* Embedded Quick Preference Reset inside Portfolio Footer */}
                <div className="px-6 pb-8 pt-4 bg-[#F9F8F6] flex justify-center">
                  <button
                    onClick={handleResetTasteProfile}
                    className="flex items-center gap-1.5 font-mono text-[8.5px] font-bold text-[#8C8880] hover:text-[#2C2C2C] uppercase border-b border-artistic-border transition-colors select-none py-0.5 cursor-pointer"
                  >
                    <RefreshCw size={10} className="stroke-[2.5]" />
                    <span>Zevk tercihlerini sıfırla</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sticky Bottom Navigation Utility */}
            <BottomNav
              currentRoute={currentRoute}
              onChangeRoute={setCurrentRoute}
              savedCount={savedPlacesCount}
            />

            {/* Rich Editorial Sheet Modal overlay when place is chosen */}
            {activePlace && (
              <PlaceDetailSheet
                place={activePlace}
                savedLists={savedMap[activePlace.id] || []}
                onToggleSave={handleToggleSave}
                onClose={() => setActivePlace(null)}
              />
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
