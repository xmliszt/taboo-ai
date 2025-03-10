'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import IconButton from '../ui/icon-button';

interface BackButtonProps {
  customBackHref?: string;
}

export function BackButton({ customBackHref }: BackButtonProps) {
  const router = useRouter();
  return (
    <IconButton
      tooltip='Go back'
      onClick={() => {
        customBackHref ? router.push(customBackHref) : router.back();
      }}
      variant='link'
      className='[&_svg]:size-5'
    >
      <ArrowLeft />
    </IconButton>
  );
}
