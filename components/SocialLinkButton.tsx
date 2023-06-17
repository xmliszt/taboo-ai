import Link from 'next/link';
import { BiLink } from 'react-icons/bi';

interface SocialLinkButtonProps {
  content: string;
  icon?: JSX.Element;
  href: string;
  newTab?: boolean;
  customClass?: string;
  accentColorClass?: string;
  dropShadowClass?: string;
}

const SocialLinkButton = ({
  content = '🔗',
  icon = <BiLink />,
  href = '',
  newTab = false,
  customClass = undefined,
  accentColorClass = 'bg-yellow dark:bg-neon-yellow',
  dropShadowClass = 'hover:drop-shadow-[0_5px_15px_rgba(229,229,4,0.6)]',
}: SocialLinkButtonProps) => {
  return (
    <div>
      <Link
        href={href}
        target={newTab ? '_blank' : ''}
        className={`flex flex-row gap-2 w-fit justify-center items-center p-2 rounded-xl drop-shadow-2xl text-black dark:text-neon-gray transition-all ease-in-out hover:scale-105 hover:cursor-pointer ${dropShadowClass} ${accentColorClass} ${customClass}`}
        aria-label={`Link to ${content}`}
      >
        <div className='flex grow flex-row gap-2 items-center justify-center'>
          <span>{icon}</span>
          <span>{content}</span>
        </div>
      </Link>
    </div>
  );
};

export default SocialLinkButton;
