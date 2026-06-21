import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import BottomNav, { TabRoute } from './components/BottomNav';
import HomeFeed from './components/HomeFeed';
import AtlasPage from './components/AtlasPage';
import SavedPage from './components/SavedPage';
import PlaceDetailSheet from './components/PlaceDetailSheet';
import AuthModal from './components/AuthModal';
import ProfileSetup from './components/ProfileSetup';
import { usePlaces } from './hooks/usePlaces';
import { useAuth } from './hooks/useAuth';
import { useSavedCollections } from './hooks/useSavedCollections';
import { Place, SavedListName } from './types';
import { RefreshCw } from 'lucide-react';
import AdminApp from './admin/AdminApp';
import { getBrowserPathname, isAdminPath } from './admin/adminRoutes';

export default function App() {
  if (isAdminPath(getBrowserPathname())) {
    return <AdminApp />;
  }

  return <PublicYerindeApp />;
}

function PublicYerindeApp() {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(false);
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [localSavedMap, setLocalSavedMap] = useState<Record<string, SavedListName[]>>({});
  const [currentRoute, setCurrentRoute] = useState<TabRoute>('explore');
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { places, isLoading: placesLoading, error: placesError } = usePlaces();
  const auth = useAuth();
  const {
    savedMap,
    isLoading: savesLoading,
    error: savesError,
    authPrompt,
    clearAuthPrompt,
    toggleSave,
  } = useSavedCollections(auth.user, localSavedMap);

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
        setLocalSavedMap(JSON.parse(storedSaves));
      } else {
        // Pre-populate some aesthetic sample list state so they start with interesting, saved spots!
        const initialSaves: Record<string, SavedListName[]> = {
          'place_als_leone': ['Want to go', 'Favorites'],
          'place_url_hic': ['Favorites', 'Weekend route'],
          'place_cun_taskahve': ['Visited', 'Weekend route'],
          'place_als_awake': ['Coffee list'],
        };
        setLocalSavedMap(initialSaves);
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
    toggleSave(placeId, listName);
  };

  // Helper calculation for global item badge counts
  const savedPlacesCount = Object.keys(savedMap).filter(key => savedMap[key] && savedMap[key].length > 0).length;

  if (!isHydrated || placesLoading || auth.isLoading || (auth.user && savesLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F8F6]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#4A4A40] border-t-transparent animate-spin" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#8C8880] mt-4 font-semibold">
            {placesLoading ? 'Seçkiler Yükleniyor...' : 'Yerinde Yükleniyor...'}
          </span>
        </div>
      </div>
    );
  }

  if (auth.needsProfileSetup) {
    return (
      <ProfileSetup
        profile={auth.profile}
        onSave={auth.saveProfile}
        onLogout={auth.signOut}
      />
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
                places={places}
                savedMap={savedMap}
                onToggleSave={handleToggleSave}
                onSelectPlace={setActivePlace}
                selectedTastes={selectedTastes}
              />
            )}

            {currentRoute === 'atlas' && (
              <AtlasPage
                places={places}
                onSelectPlace={setActivePlace}
              />
            )}

            {currentRoute === 'saved' && (
              <div className="flex-1 flex flex-col">
                <SavedPage
                  places={places}
                  savedMap={savedMap}
                  onToggleSave={handleToggleSave}
                  onSelectPlace={setActivePlace}
                  isLoggedIn={Boolean(auth.user)}
                  profile={auth.profile}
                  onOpenAuth={() => setIsAuthOpen(true)}
                  onLogout={auth.signOut}
                  syncError={savesError}
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

            {placesError && (
              <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 px-6">
                <div className="bg-white/95 border border-artistic-border rounded-2xl px-4 py-3 shadow-sm">
                  <p className="font-mono text-[8.5px] uppercase tracking-widest text-[#bd9a6f] font-bold">
                    Örnek seçkiler gösteriliyor
                  </p>
                  <p className="font-sans text-[11px] text-[#6A665D] mt-1 leading-relaxed">
                    Supabase bağlantısı tamamlanamadı; Yerinde yerel verilerle devam ediyor.
                  </p>
                </div>
              </div>
            )}

            {authPrompt && (
              <div className="fixed top-4 left-4 right-4 max-w-md mx-auto z-50 px-6">
                <div className="bg-white/95 border border-artistic-border rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
                  <p className="font-sans text-[11px] text-[#6A665D] leading-relaxed">
                    {authPrompt}
                  </p>
                  <button
                    onClick={() => {
                      clearAuthPrompt();
                      setIsAuthOpen(true);
                    }}
                    className="font-mono text-[8.5px] font-bold tracking-widest text-[#bd9a6f] uppercase shrink-0"
                  >
                    Giriş
                  </button>
                </div>
              </div>
            )}

            {/* Rich Editorial Sheet Modal overlay when place is chosen */}
            {activePlace && (
              <PlaceDetailSheet
                place={activePlace}
                savedLists={savedMap[activePlace.id] || []}
                onToggleSave={handleToggleSave}
                onClose={() => setActivePlace(null)}
              />
            )}

            {isAuthOpen && (
              <AuthModal
                onClose={() => setIsAuthOpen(false)}
                onGoogle={auth.signInWithGoogle}
                onEmailLogin={auth.signInWithEmail}
                onEmailSignup={auth.signUpWithEmail}
                error={auth.error}
              />
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
