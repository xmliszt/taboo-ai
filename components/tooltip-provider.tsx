import { TooltipProviderProps } from '@radix-ui/react-tooltip';

import { TooltipProvider } from './ui/tooltip';

export const GlobalTooltipProvider = ({ children, ...props }: TooltipProviderProps) => {
  return <TooltipProvider {...props}>{children}</TooltipProvider>;
};
