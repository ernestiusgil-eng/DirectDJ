
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  showCount?: boolean;
  count?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 16, 
  editable = false,
  onRatingChange,
  showCount = false,
  count = 0
}) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const isFull = i <= Math.round(rating);
    const isHalf = !isFull && i === Math.ceil(rating) && rating % 1 !== 0; // Simplified logic

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!editable}
        onClick={() => editable && onRatingChange && onRatingChange(i)}
        className={`transition-transform ${editable ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
      >
        <Star 
          size={size} 
          className={`${isFull ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-white/20'}`} 
          strokeWidth={isFull ? 0 : 2}
        />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">{stars}</div>
      {showCount && (
        <span className="text-xs text-white/40 ml-2">({count})</span>
      )}
    </div>
  );
};
