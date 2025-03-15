import { cn } from '@/lib/utils';

type LevelCardBadgeProps = {
  className?: string;
  prefixIcon?: React.ReactNode;
  children: React.ReactNode;
};

export function LevelCardBadge(props: LevelCardBadgeProps) {
  return (
    <div className={cn('flex items-center gap-x-2 border-b text-sm', props.className)}>
      {props.prefixIcon}
      {props.children}
    </div>
  );
}
