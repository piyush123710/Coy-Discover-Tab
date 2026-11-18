import { useState } from 'react';
import { User } from 'lucide-react';

export function ProfileImage({ src, alt, name, className = '' }) {
  const [hasError, setHasError] = useState(false);

  const initials = (name || '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EDE8F8] via-[#F4F1FA] to-[#FCE7F3] text-[#5A526B] ${className}`}
        role="img"
        aria-label={alt}
      >
        <User className="h-10 w-10 text-[#9D174D]/50 mb-2" aria-hidden="true" />
        <span className="font-display text-lg font-bold tracking-tight text-[#14111D]/70">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      draggable={false}
    />
  );
}
