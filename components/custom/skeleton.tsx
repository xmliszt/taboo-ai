import { cn } from '@/lib/utils';

interface SkeletonProps {
  hasHearRow?: boolean;
  numberOfRows?: number;
  className?: string;
}

export function Skeleton({
  hasHearRow = true,
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
      {hasHearRow === true && (
        <div className='w-full flex flex-row gap-2'>
          <div className='h-full aspect-square bg-accent rounded-full  animate-pulse' />
          <div className='w-full h-[24px] bg-accent rounded-lg animate-pulse'></div>
        </div>
      )}
      {renderRows()}
    </div>
  );
}
