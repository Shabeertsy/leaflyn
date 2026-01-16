
import React from 'react';
import { Star } from 'lucide-react';

interface StatsBarProps {
  className?: string;
}

const StatsBar: React.FC<StatsBarProps> = ({ className }) => {
  return (
    <div className={`w-full bg-white border-b border-gray-100 py-3 px-4 ${className}`}>
      <div className="flex items-center justify-between text-xs md:text-sm font-medium text-gray-700 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 align-middle">
          <span className="font-bold text-[#2d5016]">500+</span>
          <span>Plants</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 align-middle">
          <span className="font-bold text-[#2d5016]">4.9</span>
          <Star size={12} className="fill-[#d4af37] text-[#d4af37]" />
          <span>Rating</span>
        </div>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 align-middle">
          <span>Shipping </span>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
