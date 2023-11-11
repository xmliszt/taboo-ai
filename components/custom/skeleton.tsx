import { cn } from '@/lib/utils';

interface SkeletonProps {
  hasHeaderRow?: boolean;
  numberOfRows?: number;
  className?: string;
}

export function Skeleton({
  hasHeaderRow = true,
  numberOfRows = 3,
  className = 'w-full',
}: SkeletonProps) {
  const renderRows = () => {
    const rows: React.ReactElement[] = [];
    for (let i = 0; i < numberOfRows; i++) {
      rows.push(
        <div
          key={i}
          className='w-full h-[24px] bg-accent rounded-lg animate-pulse'
        ></div>
      );
    }
    return rows;
  };

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      {hasHeaderRow && (
        <div className='w-full flex flex-row gap-2'>
          <div className='h-[24px] aspect-square bg-accent rounded-full animate-pulse' />
          <div className='flex-grow h-[24px] bg-accent rounded-lg animate-pulse'></div>
        </div>
      )}
      {renderRows()}
    </div>
  );
}
