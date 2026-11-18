import { useState } from 'react';
import { ChevronRight, Heart, Lock, MapPin, X } from 'lucide-react';
import { ProfileImage } from './ProfileImage.jsx';

function formatMatchedTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function MatchesList({
  matches,
  loading,
  onStartSwiping,
  compact = false,
}) {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading matches">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-20 rounded-2xl bg-[#EDE8F8]/70 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {matches.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center border border-[#E5DFF2]">
          <div className="mx-auto h-11 w-11 rounded-full bg-[#F4F1FA] flex items-center justify-center text-[#D81B60]">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="mt-3 font-display text-base font-bold text-[#14111D]">
            No mutual matches yet
          </h3>
          <p className="mt-1.5 text-sm text-[#5A526B] leading-relaxed">
            When you and someone else both like each other, they’ll appear right here.
          </p>
          {onStartSwiping && (
            <button
              type="button"
              onClick={onStartSwiping}
              className="mt-4 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D81B60] hover:bg-[#BE185D] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Start Discovering
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-[#E5DFF2] rounded-2xl bg-white border border-[#E5DFF2] overflow-hidden">
          {matches.map((match) => (
            <li key={match.id}>
              <button
                type="button"
                onClick={() => setSelectedMatch(match)}
                className="w-full p-4 flex items-center gap-3.5 text-left hover:bg-[#F4F1FA]/60 transition-colors min-h-[68px] cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#D81B60]"
              >
                <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 bg-[#F4F1FA]">
                  <ProfileImage
                    src={match.profile.photo}
                    alt={match.profile.name}
                    name={match.profile.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-base font-bold text-[#14111D] truncate">
                      {match.profile.name},{' '}
                      <span className="tabular-nums font-semibold text-[#5A526B]">
                        {match.profile.age}
                      </span>
                    </p>
                    <span className="text-xs text-[#5A526B] shrink-0 tabular-nums">
                      {formatMatchedTime(match.matchedAt)}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-[#5A526B] truncate">
                    {match.profile.location}
                  </p>

                  {!compact && (
                    <p className="mt-1 text-xs font-medium text-[#9D174D] truncate">
                      {match.profile.interests.join(' · ')}
                    </p>
                  )}
                </div>

                <ChevronRight
                  className="h-4 w-4 text-[#5A526B] shrink-0"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Privacy guarantee note */}
      <div className="mt-4 flex items-start gap-2.5 text-xs text-[#5A526B] leading-relaxed px-1">
        <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#5A526B]" aria-hidden="true" />
        <p>
          Coy’s privacy promise: incoming likes are never revealed unless both people like each other.
        </p>
      </div>

      {/* Match Profile Detail Modal */}
      {selectedMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14111D]/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="selected-match-title"
          onClick={() => setSelectedMatch(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white overflow-hidden shadow-2xl"
          >
            <div className="relative h-72 bg-[#F4F1FA]">
              <ProfileImage
                src={selectedMatch.profile.photo}
                alt={selectedMatch.profile.name}
                name={selectedMatch.profile.name}
                className="h-full w-full object-cover object-top"
              />
              <button
                type="button"
                onClick={() => setSelectedMatch(null)}
                aria-label="Close match details"
                className="absolute top-4 right-4 min-h-[44px] min-w-[44px] rounded-full bg-[#14111D]/50 hover:bg-[#14111D]/70 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-baseline justify-between gap-2">
                <h3
                  id="selected-match-title"
                  className="font-display text-2xl font-bold text-[#14111D]"
                >
                  {selectedMatch.profile.name},{' '}
                  <span className="tabular-nums font-medium text-[#5A526B]">
                    {selectedMatch.profile.age}
                  </span>
                </h3>
                <span className="text-xs font-semibold text-[#D81B60]">
                  Matched {formatMatchedTime(selectedMatch.matchedAt)}
                </span>
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#5A526B]">
                <MapPin className="h-4 w-4 text-[#D81B60] shrink-0" aria-hidden="true" />
                <span>{selectedMatch.profile.location}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#14111D]">
                {selectedMatch.profile.bio}
              </p>

              <p className="mt-4 pt-4 border-t border-[#EDE8F8] text-xs font-medium text-[#5A526B]">
                {selectedMatch.profile.interests.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
