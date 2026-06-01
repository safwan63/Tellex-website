import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

type Direction = 'prev' | 'next';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: Direction;
  label: string;
};

export default function CarouselNavButton({
  direction,
  label,
  className = '',
  ...props
}: Props) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      className={`
        flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12
        rounded-full border border-[#e1cfbc]/35 bg-[#0E462B]/85 text-[#e1cfbc]
        backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.25)]
        transition-all duration-300 ease-out
        hover:bg-[#0E462B] hover:border-[#c8963e]/50 hover:scale-105
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8963e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E462B]
        disabled:opacity-40 disabled:pointer-events-none
        ${className}
      `.trim()}
      {...props}
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.25} />
    </button>
  );
}
