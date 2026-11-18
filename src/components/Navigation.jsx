import { Compass, Heart, Home } from 'lucide-react';
import { ProfileImage } from './ProfileImage.jsx';

export function Navigation({
  activeTab,
  onSelectTab,
  discoverView,
  onSelectDiscoverView,
  matchesCount,
  currentUser,
}) {
  const handleMatchesClick = () => {
    onSelectTab('discover');
    onSelectDiscoverView('matches');
  };

  return (
    <>
      {/* Desktop Top Navigation — 3-Zone Contract */}
      <header className="hidden lg:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE8F8]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              onSelectTab('discover');
              onSelectDiscoverView('swipe');
            }}
            className="font-display text-2xl font-extrabold tracking-tight text-[#14111D] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D6D] cursor-pointer"
          >
            Coy
          </button>

          {/* Zone 2: Primary Navigation Tabs */}
          <nav className="flex items-center gap-8" aria-label="Primary navigation">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`relative py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D6D] ${
                activeTab === 'home'
                  ? 'text-[#14111D]'
                  : 'text-[#5A526B] hover:text-[#14111D]'
              }`}
            >
              Home
              {activeTab === 'home' && (
                <span className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-[#E11D6D]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectTab('discover');
                onSelectDiscoverView('swipe');
              }}
              className={`relative py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E11D6D] ${
                activeTab === 'discover'
                  ? 'text-[#14111D]'
                  : 'text-[#5A526B] hover:text-[#14111D]'
              }`}
            >
              Discover
              {activeTab === 'discover' && (
                <span className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-[#E11D6D]" />
              )}
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleMatchesClick}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#F4F1FA] hover:bg-[#EDE8F8] text-sm font-semibold text-[#14111D] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D6D]"
            >
              {currentUser && (
                <ProfileImage
                  src={currentUser.photo}
                  alt={currentUser.name}
                  name={currentUser.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <span>Matches</span>
              <span className="font-mono text-xs font-bold text-[#D81B60] tabular-nums">
                {matchesCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top App Bar (48px) */}
      <header className="lg:hidden sticky top-0 z-40 h-12 bg-white/95 backdrop-blur-md border-b border-[#EDE8F8] px-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            onSelectTab('discover');
            onSelectDiscoverView('swipe');
          }}
          className="font-display text-xl font-extrabold tracking-tight text-[#14111D] whitespace-nowrap shrink-0"
        >
          Coy
        </button>

        {activeTab === 'discover' && (
          <div
            className="flex items-center gap-1 p-1 rounded-xl bg-[#F4F1FA]"
            role="tablist"
            aria-label="Discover sections"
          >
            <button
              type="button"
              role="tab"
              aria-selected={discoverView === 'swipe'}
              onClick={() => onSelectDiscoverView('swipe')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[30px] ${
                discoverView === 'swipe'
                  ? 'bg-white text-[#14111D] shadow-xs'
                  : 'text-[#5A526B] hover:text-[#14111D]'
              }`}
            >
              Swipe
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={discoverView === 'matches'}
              onClick={() => onSelectDiscoverView('matches')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[30px] flex items-center gap-1.5 ${
                discoverView === 'matches'
                  ? 'bg-white text-[#14111D] shadow-xs'
                  : 'text-[#5A526B] hover:text-[#14111D]'
              }`}
            >
              <span>Matches</span>
              <span className="tabular-nums text-[#D81B60] font-bold">
                {matchesCount}
              </span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Tab Bar (56px) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE8F8] pb-safe"
        aria-label="Mobile bottom navigation"
      >
        <div className="grid grid-cols-2 h-14 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'home'
                ? 'text-[#D81B60]'
                : 'text-[#5A526B] hover:text-[#14111D]'
            }`}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <Home
              className="h-5 w-5"
              strokeWidth={activeTab === 'home' ? 2.4 : 1.8}
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold tracking-tight mt-0.5 whitespace-nowrap">
              Home
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('discover')}
            className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
              activeTab === 'discover'
                ? 'text-[#D81B60]'
                : 'text-[#5A526B] hover:text-[#14111D]'
            }`}
            aria-current={activeTab === 'discover' ? 'page' : undefined}
          >
            <div className="relative">
              <Compass
                className="h-5 w-5"
                strokeWidth={activeTab === 'discover' ? 2.4 : 1.8}
                aria-hidden="true"
              />
              {matchesCount > 0 && activeTab !== 'discover' && (
                <Heart
                  className="h-2.5 w-2.5 text-[#D81B60] fill-[#D81B60] absolute -top-0.5 -right-1.5"
                  aria-hidden="true"
                />
              )}
            </div>
            <span className="text-[11px] font-semibold tracking-tight mt-0.5 whitespace-nowrap">
              Discover
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
