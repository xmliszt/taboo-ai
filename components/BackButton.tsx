'use client';

import { IconButton, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@chakra-ui/icons';

interface BackButtonProps {
  href?: string;
}

export function BackButton({ href }: BackButtonProps = { href: '/' }) {
  const router = useRouter();
  const back = () => {
    const link = href ?? '/';
    router.push(link);
  };

  return (
    <Tooltip label='Back' hasArrow>
      <IconButton
        size='sm'
        aria-label='Click to navigate back'
        onClick={back}
        icon={<ArrowLeftIcon />}
      />
    </Tooltip>
  );
}
