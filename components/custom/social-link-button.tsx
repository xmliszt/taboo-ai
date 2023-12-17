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
    <Button className={`shadow-md ${className}`} aria-label={`Link to ${content}`}>
      <Link className='!no-underline' href={href} target={newTab ? '_blank' : ''}>
        <div className='flex flex-row items-center justify-center gap-2'>
          <span>{icon}</span>
          <span>{content}</span>
        </div>
      </Link>
    </Button>
  );
};

export default SocialLinkButton;
