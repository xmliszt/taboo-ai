'use client';

import { IconButton, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@chakra-ui/icons';
import { BiHome } from 'react-icons/bi';

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
    <Tooltip label={`${href === '/' ? 'Go to home' : 'Back'}`} hasArrow>
      <IconButton
        size='sm'
        aria-label='Click to navigate back'
        onClick={back}
        icon={customIcon ?? (href === '/' ? <BiHome /> : <ArrowLeftIcon />)}
      />
    </Tooltip>
  );
}
