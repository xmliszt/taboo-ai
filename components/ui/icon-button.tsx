import React from 'react';

import { cn } from '@/lib/utils';

import { Button, ButtonProps } from './button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface IconButtonProps extends ButtonProps {
  tooltip?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ tooltip, className, children, asChild = false, ...props }, ref) => {
    const renderButton = () => (
      <Button
        ref={ref}
        {...props}
        className={cn(className, 'h-[32px] w-[32px] p-1', 'group/icon-button')}
      >
        <div
          className='transition-transform ease-in-out group-hover/icon-button:scale-110'
          id='icon-wrapper'
        >
          {children}
        </div>
      </Button>
    );
    return tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{renderButton()}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    ) : (
      renderButton()
    );
  }
);

IconButton.displayName = 'IconButton';
export default IconButton;
