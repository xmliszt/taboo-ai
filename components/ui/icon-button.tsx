import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button, ButtonProps } from './button';

interface IconButtonProps extends ButtonProps {
  tooltip: string;
}

export function IconButton({
  children,
  className,
  tooltip,
  ...props
}: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          {...props}
          asChild={false}
          className={cn(className, 'w-[40px] h-[40px] p-1')}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
