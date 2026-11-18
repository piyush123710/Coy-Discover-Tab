import { useState } from 'react';
import { Navigation } from './components/Navigation.jsx';
import { useDiscover } from './hooks/useDiscover.js';
import { DiscoverPage } from './pages/DiscoverPage.jsx';
import { HomePage } from './pages/HomePage.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [discoverView, setDiscoverView] = useState('swipe');

  const {
    profiles,
    currentUser,
    totalProfiles,
    matches,
    loading,
    error,
    isSwiping,
    isResetting,
    activeMatch,
    performSwipe,
    dismissMatchModal,
    retry,
    resetDemo,
  } = useDiscover();

  return (
    <div className="min-h-screen bg-white text-[#14111D]">
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        discoverView={discoverView}
        onSelectDiscoverView={setDiscoverView}
        matchesCount={matches.length}
        currentUser={currentUser}
      />

      <main>
        {activeTab === 'home' ? (
          <HomePage onGoToDiscover={() => setActiveTab('discover')} />
        ) : (
          <DiscoverPage
            discoverView={discoverView}
            onSelectDiscoverView={setDiscoverView}
            profiles={profiles}
            currentUser={currentUser}
            totalProfiles={totalProfiles}
            matches={matches}
            loading={loading}
            error={error}
            isSwiping={isSwiping}
            isResetting={isResetting}
            activeMatch={activeMatch}
            onSwipe={performSwipe}
            onDismissMatchModal={dismissMatchModal}
            onRetry={retry}
            onResetDemo={resetDemo}
          />
        )}
      </main>
    </div>
  );
}
