'use client';

import Link from 'next/link';
import { BiLink } from 'react-icons/bi';
import { Button } from '../ui/button';

interface SocialLinkButtonProps {
  content: string;
  icon?: JSX.Element;
  href: string;
  newTab?: boolean;
  className?: string;
}

const SocialLinkButton = ({
  content = '🔗',
  icon = <BiLink />,
  href = '',
  newTab = false,
  className = '',
}: SocialLinkButtonProps) => {
  return (
    <Button
      className={`shadow-2xl transition-transform hover:scale-105 ease-in-out ${className}`}
      aria-label={`Link to ${content}`}
    >
      <Link href={href} target={newTab ? '_blank' : ''}>
        <div className='flex grow flex-row gap-2 items-center justify-center'>
          <span>{icon}</span>
          <span>{content}</span>
        </div>
      </Link>
    </Button>
  );
};

export default SocialLinkButton;
