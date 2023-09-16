'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import IconButton from '../ui/icon-button';

interface BackButtonProps {
  customBackHref?: string;
}

export function BackButton({ customBackHref }: BackButtonProps) {
  const router = useRouter();
  return (
    <IconButton
      tooltip='Go Back'
      onClick={() => {
        customBackHref ? router.push(customBackHref) : router.back();
      }}
    >
      <ArrowLeft />
    </IconButton>
  );
}
