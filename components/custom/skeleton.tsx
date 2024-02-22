import { cn } from '@/lib/utils';

interface SkeletonProps {
  hasHeaderRow?: boolean;
  numberOfRows?: number;
  className?: string;
}

export function Skeleton({
  hasHeaderRow = true,
  numberOfRows = 3,
  className = 'w-full max-w-xl',
}: SkeletonProps) {
  const renderRows = () => {
    const rows: React.ReactElement[] = [];
    for (let i = 0; i < numberOfRows; i++) {
      rows.push(<div key={i} className='h-[24px] w-full animate-pulse rounded-lg bg-accent'></div>);
    }
    return rows;
  };

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      {hasHeaderRow && (
        <div className='flex w-full flex-row gap-2'>
          <div className='aspect-square h-[24px] animate-pulse rounded-full bg-accent' />
          <div className='h-[24px] flex-grow animate-pulse rounded-lg bg-accent'></div>
        </div>
      )}
      {renderRows()}
    </div>
  );
}
