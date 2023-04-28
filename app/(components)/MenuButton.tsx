'use client';

import { Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface MenuButtonProps {
  id: string;
  href: string;
  disabled?: boolean;
  tooltipLabel?: string;
  children: React.ReactNode;
}

const MenuButton = (props: MenuButtonProps) => {
  const router = useRouter();
  return props.tooltipLabel ? (
    <Tooltip
      hasArrow
      id={props.id}
      bg='gray.300'
      color='blackAlpha.800'
      placement='top'
      fontSize='md'
      lineHeight='5'
      closeDelay={500}
      label={props.tooltipLabel}
      aria-label={`Tooltip label: ${props.tooltipLabel}`}
    >
      <button
        onClick={() => {
          router.push(props.href);
        }}
        disabled={props.disabled ?? false}
        data-style='none'
      >
        <div className='btn-menu'>{props.children}</div>
      </button>
    </Tooltip>
  ) : (
    <button
      id={props.id}
      onClick={() => {
        router.push(props.href);
      }}
      disabled={props.disabled ?? false}
      data-style='none'
    >
      <div className='btn-menu'>{props.children}</div>
    </button>
  );
};

export default MenuButton;
