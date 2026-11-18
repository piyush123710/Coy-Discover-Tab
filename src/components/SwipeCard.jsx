import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { Info, MapPin, X } from 'lucide-react';
import { ProfileImage } from './ProfileImage.jsx';

const SWIPE_DISTANCE_THRESHOLD = 105;
const SWIPE_VELOCITY_THRESHOLD = 480;

export function SwipeCard({
  profile,
  isTop,
  forcedDirection,
  onSwipeComplete,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const hasTriggeredRef = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [24, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -24], [1, 0]);
  const cardOpacity = useTransform(x, [-360, -220, 0, 220, 360], [0, 0.92, 1, 0.92, 0]);

  useEffect(() => {
    setShowDetails(false);
    hasTriggeredRef.current = false;
    x.set(0);
  }, [profile.id, x]);

  const flyOut = async (direction) => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    const targetX = direction === 'like' ? 520 : -520;
    await animate(x, targetX, {
      duration: 0.24,
      ease: [0.16, 1, 0.3, 1],
    });
    onSwipeComplete(profile.id, direction);
  };

  useEffect(() => {
    if (isTop && forcedDirection && !hasTriggeredRef.current) {
      void flyOut(forcedDirection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forcedDirection, isTop]);

  const handleDragEnd = (_event, info) => {
    if (hasTriggeredRef.current) return;

    const { offset, velocity } = info;
    if (offset.x > SWIPE_DISTANCE_THRESHOLD || velocity.x > SWIPE_VELOCITY_THRESHOLD) {
      void flyOut('like');
    } else if (
      offset.x < -SWIPE_DISTANCE_THRESHOLD ||
      velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      void flyOut('pass');
    } else {
      animate(x, 0, {
        type: 'spring',
        stiffness: 380,
        damping: 28,
      });
    }
  };

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden bg-[#F4F1FA] shadow-sm scale-[0.96] translate-y-2 opacity-75 pointer-events-none select-none"
        aria-hidden="true"
      >
        <ProfileImage
          src={profile.photo}
          alt={profile.name}
          name={profile.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14111D]/70 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <motion.article
      style={{ x, rotate, opacity: cardOpacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
      className="absolute inset-0 rounded-3xl overflow-hidden bg-[#F4F1FA] shadow-[0_14px_38px_-12px_rgba(20,17,29,0.18)] cursor-grab touch-pan-y select-none"
      aria-label={`Profile card for ${profile.name}, age ${profile.age}`}
    >
      {/* Full-bleed portrait */}
      <ProfileImage
        src={profile.photo}
        alt={`${profile.name}, ${profile.age} from ${profile.location}`}
        name={profile.name}
        className="h-full w-full object-cover object-top"
      />

      {/* Directional LIKE feedback stamp */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute top-7 left-6 -rotate-12 rounded-xl border-[3px] border-[#E11D6D] bg-white/90 px-4 py-1.5 shadow-sm"
      >
        <span className="font-display text-xl font-extrabold tracking-wider text-[#D81B60]">
          LIKE
        </span>
      </motion.div>

      {/* Directional PASS feedback stamp */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute top-7 right-6 rotate-12 rounded-xl border-[3px] border-[#475569] bg-white/90 px-4 py-1.5 shadow-sm"
      >
        <span className="font-display text-xl font-extrabold tracking-wider text-[#334155]">
          PASS
        </span>
      </motion.div>

      {/* Measured contrast scrim */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14111D]/92 via-[#14111D]/40 to-transparent" />

      {/* Details toggle button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowDetails((prev) => !prev);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label={showDetails ? 'Hide full profile details' : 'Show full profile details'}
        aria-expanded={showDetails}
        className="absolute top-4 right-4 z-20 min-h-[44px] min-w-[44px] rounded-full bg-[#14111D]/45 hover:bg-[#14111D]/65 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {showDetails ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Info className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Primary Profile Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            {profile.name}
          </h2>
          <span className="font-display text-xl sm:text-2xl font-medium text-white/90 tabular-nums">
            {profile.age}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-white/85">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F9A8D4]" aria-hidden="true" />
          <span className="truncate">{profile.location}</span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/90 line-clamp-2">
          {profile.bio}
        </p>

        {/* Clean unboxed interest metadata with typographic separators */}
        <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[#F5D0FE]">
          {profile.interests.map((interest, idx) => (
            <span key={interest} className="inline-flex items-center gap-2">
              {idx > 0 && (
                <span className="text-white/40" aria-hidden="true">
                  ·
                </span>
              )}
              <span>{interest}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Expanded Lavender Bio Sheet */}
      {showDetails && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute inset-0 z-10 bg-[#F4F1FA]/98 backdrop-blur-md p-6 pt-16 flex flex-col justify-between text-[#14111D] overflow-y-auto"
        >
          <div>
            <div className="flex items-baseline gap-2.5">
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {profile.name}
              </h3>
              <span className="font-display text-xl font-medium text-[#5A526B] tabular-nums">
                {profile.age}
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#5A526B]">
              <MapPin className="h-4 w-4 shrink-0 text-[#D81B60]" aria-hidden="true" />
              <span>{profile.location}</span>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-semibold text-[#5A526B] tracking-wide">
                About
              </h4>
              <p className="mt-2 text-base leading-relaxed text-[#14111D]">
                {profile.bio}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5DFF2]">
              <h4 className="text-xs font-semibold text-[#5A526B] tracking-wide">
                Interests
              </h4>
              <p className="mt-2 text-sm font-medium text-[#14111D] leading-relaxed">
                {profile.interests.join(' · ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails(false)}
            className="mt-6 w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white border border-[#E5DFF2] text-sm font-semibold text-[#14111D] hover:bg-[#EDE8F8] transition-colors cursor-pointer"
          >
            Back to photo
          </button>
        </div>
      )}
    </motion.article>
  );
}
