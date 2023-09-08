import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { Button, ButtonProps } from './button';
import React from 'react';

interface IconButtonProps extends ButtonProps {
  tooltip: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tooltip, className, children, asChild = false, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            {...props}
            className={cn(className, 'w-[40px] h-[40px] p-1')}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);

IconButton.displayName = 'IconButton';
export default IconButton;
