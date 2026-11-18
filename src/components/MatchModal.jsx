import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, X } from 'lucide-react';
import { ProfileImage } from './ProfileImage.jsx';

export function MatchModal({
  match,
  currentUser,
  onClose,
  onViewMatches,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const userName = currentUser?.name?.split(' ')[0] || 'You';
  const matchFirstName = match.profile.name.split(' ')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#14111D]/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="match-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[#F4F1FA] p-6 sm:p-8 shadow-2xl text-center"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close match dialog"
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-[#5A526B] hover:bg-[#EDE8F8] hover:text-[#14111D] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Paired portraits */}
        <div className="mt-4 flex items-center justify-center">
          <div className="relative flex items-center">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-4 ring-white shadow-md -mr-3 z-10 bg-white">
              <ProfileImage
                src={currentUser?.photo || ''}
                alt={currentUser?.name || 'Your profile'}
                name={currentUser?.name || 'You'}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="z-20 h-10 w-10 rounded-full bg-[#D81B60] text-white flex items-center justify-center ring-4 ring-[#F4F1FA] shadow-md">
              <Heart className="h-5 w-5 fill-white" aria-hidden="true" />
            </div>

            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-4 ring-white shadow-md -ml-3 z-10 bg-white">
              <ProfileImage
                src={match.profile.photo}
                alt={match.profile.name}
                name={match.profile.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        <h2
          id="match-modal-title"
          className="mt-6 font-display text-3xl font-extrabold tracking-tight text-[#14111D] text-balance"
        >
          It’s a match!
        </h2>

        <p className="mt-2 text-sm sm:text-base text-[#5A526B] leading-relaxed">
          {userName} and <span className="font-semibold text-[#14111D]">{matchFirstName}</span> liked each other.
        </p>

        <div className="mt-5 rounded-2xl bg-white p-4 text-left">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-display text-base font-bold text-[#14111D]">
              {match.profile.name},{' '}
              <span className="tabular-nums font-semibold text-[#5A526B]">
                {match.profile.age}
              </span>
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#5A526B]">
            <MapPin className="h-3.5 w-3.5 text-[#D81B60] shrink-0" aria-hidden="true" />
            <span className="truncate">{match.profile.location}</span>
          </div>
          <p className="mt-2 text-xs text-[#5A526B] leading-relaxed">
            {match.profile.interests.join(' · ')}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-[#D81B60] hover:bg-[#BE185D] text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D81B60]"
          >
            Keep Discovering
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onViewMatches();
            }}
            className="w-full min-h-[44px] py-2.5 px-6 rounded-xl bg-white hover:bg-[#EDE8F8] text-[#14111D] text-sm font-semibold border border-[#E5DFF2] transition-colors cursor-pointer"
          >
            View All Matches
          </button>
        </div>
      </motion.div>
    </div>
  );
}
