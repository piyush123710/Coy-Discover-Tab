import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Compass,
  Heart,
  RotateCcw,
  X,
} from 'lucide-react';
import { SwipeCard } from '../components/SwipeCard.jsx';
import { MatchesList } from '../components/MatchesList.jsx';
import { MatchModal } from '../components/MatchModal.jsx';

export function DiscoverPage({
  discoverView,
  onSelectDiscoverView,
  profiles,
  currentUser,
  totalProfiles,
  matches,
  loading,
  error,
  isSwiping,
  isResetting,
  activeMatch,
  onSwipe,
  onDismissMatchModal,
  onRetry,
  onResetDemo,
}) {
  const [forcedSwipe, setForcedSwipe] = useState(null);

  const topProfile = profiles[0] ?? null;
  const nextProfile = profiles[1] ?? null;

  const triggerButtonSwipe = useCallback(
    (action) => {
      if (!topProfile || isSwiping || forcedSwipe || activeMatch) return;
      setForcedSwipe({ profileId: topProfile.id, action });
    },
    [topProfile, isSwiping, forcedSwipe, activeMatch],
  );

  const handleCardSwipeComplete = useCallback(
    async (profileId, action) => {
      setForcedSwipe(null);
      await onSwipe(profileId, action);
    },
    [onSwipe],
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (discoverView !== 'swipe' || activeMatch || !topProfile) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        triggerButtonSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        triggerButtonSwipe('like');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [discoverView, activeMatch, topProfile, triggerButtonSwipe]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-24 lg:py-8">
      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] px-4 py-3 flex items-center justify-between gap-4 text-sm text-[#9F1239]"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="truncate">{error}</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 min-h-[36px] px-3 py-1.5 rounded-lg bg-white border border-[#FECDD3] text-xs font-semibold text-[#9F1239] hover:bg-[#FFE4E6] transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Mobile full-screen Matches view */}
      {discoverView === 'matches' && (
        <section className="lg:hidden" aria-label="Mutual matches">
          <div className="mb-4 flex items-baseline justify-between">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[#14111D]">
              Matches
            </h1>
            <span className="text-xs font-semibold text-[#5A526B] tabular-nums">
              {matches.length} mutual
            </span>
          </div>
          <MatchesList
            matches={matches}
            loading={loading}
            onStartSwiping={() => onSelectDiscoverView('swipe')}
          />
        </section>
      )}

      {/* Main Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Primary Stage: Swipe Card Deck */}
        <section
          className={`lg:col-span-7 flex flex-col items-center ${
            discoverView === 'matches' ? 'hidden lg:flex' : 'flex'
          }`}
          aria-label="Discovery deck"
        >
          <div className="w-full max-w-[400px] mb-3 flex items-baseline justify-between px-1">
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#14111D]">
              Discover
            </h1>
            {!loading && totalProfiles > 0 && (
              <span className="text-xs font-medium text-[#5A526B] tabular-nums">
                {profiles.length} remaining
              </span>
            )}
          </div>

          {loading ? (
            <div
              className="w-full max-w-[400px]"
              aria-busy="true"
              aria-label="Loading profiles"
            >
              <div className="h-[460px] sm:h-[520px] rounded-3xl bg-[#F4F1FA] animate-pulse" />
              <div className="mt-5 flex items-center justify-center gap-6">
                <div className="h-14 w-14 rounded-full bg-[#F4F1FA] animate-pulse" />
                <div className="h-16 w-16 rounded-full bg-[#F4F1FA] animate-pulse" />
              </div>
            </div>
          ) : topProfile ? (
            <div className="w-full max-w-[400px]">
              <div className="relative h-[460px] sm:h-[520px] w-full">
                {nextProfile && (
                  <SwipeCard
                    key={nextProfile.id}
                    profile={nextProfile}
                    isTop={false}
                    forcedDirection={null}
                    onSwipeComplete={handleCardSwipeComplete}
                  />
                )}
                <SwipeCard
                  key={topProfile.id}
                  profile={topProfile}
                  isTop={true}
                  forcedDirection={
                    forcedSwipe?.profileId === topProfile.id
                      ? forcedSwipe.action
                      : null
                  }
                  onSwipeComplete={handleCardSwipeComplete}
                />
              </div>

              {/* Action Controls */}
              <div className="mt-5 flex items-center justify-center gap-7">
                <button
                  type="button"
                  onClick={() => triggerButtonSwipe('pass')}
                  disabled={isSwiping || Boolean(forcedSwipe)}
                  aria-label={`Pass on ${topProfile.name}`}
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-white border border-[#E5DFF2] text-[#475569] shadow-sm hover:border-[#CBD5E1] hover:bg-[#F8FAFC] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#475569]"
                >
                  <X className="h-7 w-7" strokeWidth={2.4} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => triggerButtonSwipe('like')}
                  disabled={isSwiping || Boolean(forcedSwipe)}
                  aria-label={`Like ${topProfile.name}`}
                  className="h-16 w-16 sm:h-[70px] sm:w-[70px] rounded-full bg-[#D81B60] hover:bg-[#BE185D] text-white shadow-md shadow-[#D81B60]/25 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D81B60]"
                >
                  <Heart
                    className="h-7 w-7 fill-white"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <p className="hidden lg:block mt-3 text-center text-xs text-[#5A526B]">
                Drag card or press ← to pass · → to like
              </p>
            </div>
          ) : (
            <div className="w-full max-w-[400px] rounded-3xl bg-[#F4F1FA] p-8 sm:p-10 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-white flex items-center justify-center text-[#D81B60] shadow-xs">
                <Compass className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-[#14111D] text-balance">
                You’ve seen everyone nearby
              </h2>

              <p className="mt-2.5 text-sm text-[#5A526B] leading-relaxed">
                Check back later for new profiles, or catch up with your{' '}
                <span className="font-semibold text-[#14111D] tabular-nums">
                  {matches.length}
                </span>{' '}
                mutual {matches.length === 1 ? 'match' : 'matches'}.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => onSelectDiscoverView('matches')}
                  className="lg:hidden w-full min-h-[44px] py-2.5 px-5 rounded-xl bg-[#D81B60] hover:bg-[#BE185D] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  View Matches ({matches.length})
                </button>

                <button
                  type="button"
                  onClick={() => void onResetDemo()}
                  disabled={isResetting}
                  className="w-full min-h-[44px] py-2.5 px-5 rounded-xl bg-white hover:bg-[#EDE8F8] text-[#14111D] border border-[#E5DFF2] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <RotateCcw className="h-4 w-4 text-[#5A526B]" aria-hidden="true" />
                  <span>{isResetting ? 'Resetting…' : 'Reset Discovery Feed'}</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Right Column (Desktop): Soft Lavender Mutual Matches Panel */}
        <aside
          className="hidden lg:block lg:col-span-5"
          aria-label="Mutual matches panel"
        >
          <div className="rounded-3xl bg-[#F4F1FA] p-6">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-xl font-bold tracking-tight text-[#14111D]">
                Mutual Matches
              </h2>
              <span className="text-xs font-semibold text-[#D81B60] tabular-nums">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'}
              </span>
            </div>

            <MatchesList matches={matches} loading={loading} />
          </div>
        </aside>
      </div>

      {/* Celebratory Match Modal */}
      {activeMatch && (
        <MatchModal
          match={activeMatch}
          currentUser={currentUser}
          onClose={onDismissMatchModal}
          onViewMatches={() => onSelectDiscoverView('matches')}
        />
      )}
    </div>
  );
}
