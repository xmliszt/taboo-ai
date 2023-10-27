import { Coffee, Github } from 'lucide-react';
import { BsDiscord } from 'react-icons/bs';

import SocialLinkButton from '../social-link-button';

interface HomeSocialLinkButtonData {
  key: string;
  content: string;
  icon: React.ReactElement;
  href: string;
  newTab?: boolean;
}

const homeSocialLinkButtonData: HomeSocialLinkButtonData[] = [
  {
    key: 'buy me coffee',
    content: 'Buy Me Coffee',
    icon: <Coffee />,
    href: '/buymecoffee',
  },
  {
    key: 'join discord',
    content: 'Join Discord!',
    icon: <BsDiscord />,
    href: 'https://discord.gg/dgqs29CHC2',
    newTab: true,
  },
  {
    key: 'open source',
    content: 'Open Source',
    icon: <Github />,
    href: 'https://github.com/xmliszt/Taboo-AI',
    newTab: true,
  },
];

export default function HomeSocialLinkButtonArray() {
  return (
    <div className='px-4 my-2 w-full flex flex-col lg:flex-row gap-2 justify-center'>
      {homeSocialLinkButtonData.map((data) => (
        <SocialLinkButton
          key={data.key}
          content={data.content}
          icon={data.icon}
          href={data.href}
          newTab={data.newTab}
        />
      ))}
    </div>
  );
}
