'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ArrowLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface BackButtonProps {
  href?: string;
  customIcon?: React.ReactElement;
}

export function BackButton({ href, customIcon }: BackButtonProps) {
  const router = useRouter();
  const back = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button aria-label='Click to navigate back' onClick={back}>
          {customIcon ?? (href === '/' ? <Home /> : <ArrowLeft />)}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {`${href === '/' ? 'Go to home' : 'Back'}`}
      </TooltipContent>
    </Tooltip>
  );
}
