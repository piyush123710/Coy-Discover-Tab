import { Compass } from 'lucide-react';

export function HomePage({ onGoToDiscover }) {
  return (
    <section
      className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center px-6 py-16 text-center"
      aria-label="Home placeholder"
    >
      <div className="max-w-sm">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#14111D]">
          Home
        </h1>
        <p className="mt-2 text-sm text-[#5A526B] leading-relaxed">
          Coy’s main home experience lives here. Switch to Discover to meet new people nearby.
        </p>
        <button
          type="button"
          onClick={onGoToDiscover}
          className="mt-6 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#F4F1FA] hover:bg-[#EDE8F8] text-sm font-semibold text-[#14111D] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D81B60]"
        >
          <Compass className="h-4 w-4 text-[#D81B60]" aria-hidden="true" />
          <span>Open Discover</span>
        </button>
      </div>
    </section>
  );
}
