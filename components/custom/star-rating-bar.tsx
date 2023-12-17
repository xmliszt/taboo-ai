import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StarRatingBarProps {
  rating: number;
  maxRating: number;
  size?: number;
  className?: string;
}

export const StarRatingBar = (props: StarRatingBarProps) => {
  const { rating, maxRating, size, className } = props;
  const stars = [];
  for (let i = 0; i < maxRating; i++) {
    const fill = Math.min(Math.max(rating - i + 1, 0), 1);
    stars.push(
      <Star
        key={i}
        size={size ?? 20}
        fill={fill === 1 ? '#FFE629' : 'transparent'}
        stroke='#FFDC00'
      />
    );
  }

  return <div className={cn('flex flex-row items-center gap-1', className)}>{stars}</div>;
};
