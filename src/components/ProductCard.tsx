import { Sparkles, Gift, Search } from 'lucide-react';

interface ProductCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
  link?: string;
  cardBgColor?: string;
}

export default function ProductCard({ icon, title, description, delay: _delay, link, cardBgColor = '#FFFFFF' }: ProductCardProps) {
  const iconMap = {
    sparkles: Sparkles,
    gift: Gift,
    search: Search,
  };

  const Icon = iconMap[icon as keyof typeof iconMap];

  const cardContent = (
    <div className="rounded-2xl p-5 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col scale-[0.95] sm:scale-100"
    style={{ backgroundColor: cardBgColor }}>
      <div className="text-center flex-1">
        <div
          className="mx-auto mb-4 sm:mb-6 p-4 sm:p-6 bg-[#064d06] rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
        >
          <Icon className="text-white" size={32} />
        </div>
        <h3
          className="text-xl sm:text-2xl text-[#064d06] mb-3 sm:mb-4 font-medium"
          style={{ fontFamily: "'Phudu', sans-serif", fontWeight: 500 }}
        >
          {title}
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-tellex-black/70 leading-relaxed">

          {description}
        </p>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return cardContent;
}
