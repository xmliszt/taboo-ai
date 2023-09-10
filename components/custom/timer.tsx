import _ from 'lodash';
import { cn } from '@/lib/utils';
import { Status } from 'use-timer/lib/types';
import { Badge } from '../ui/badge';

interface TimerProps {
  time: number;
  status: Status;
  className?: string;
}

export default function Timer({ time, status, className = '' }: TimerProps) {
  return (
    <Badge
      id='timer'
      className={cn(
        className,
        'transition-colors ease-in-out px-2 py-1 text-xl rounded-md border-2 border-primary',
        time > 100
          ? 'bg-red-400  text-primary'
          : time > 50
          ? 'bg-yellow-500 text-primary'
          : 'bg-card text-primary'
      )}
    >
      <pre>
        {status === 'RUNNING' ? (
          <>
            <span>{_.padStart(String(time), 4, '0')}</span>
            <span>SEC</span>
          </>
        ) : (
          <span>{status}</span>
        )}
      </pre>
    </Badge>
  );
}
