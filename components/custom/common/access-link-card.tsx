import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Construction } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { MouseEventHandler } from 'react';

interface AccessLinkCardProps {
  idx: number;
  item: MenuItem;
  onClick?: MouseEventHandler;
  className?: string;
  icon?: React.ReactNode;
}

export interface MenuItem {
  path: string; // unique identifer of each item, default should use the pathname, but not necessarily must be route path (for those non-routable items)
  title: string;
  subtitle: string;
  visible: boolean;
  isUpcoming?: boolean;
  highlight?: boolean;
  href?: string; // Convenient way for router push, if defined, router will push to this route
  onClick?: MouseEventHandler; // Additional handling when the item gets clicked, more customization
}

export default function AccessLinkCard({
  idx,
  item,
  onClick,
  className,
  icon,
}: AccessLinkCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Card
      key={`menu-${item.path}`}
      id={`menu-${idx}`}
      className={cn(
        item.highlight ? 'border-green-500' : '',
        pathname === item.path ? 'border-4 border-primary font-bold' : '',
        item.isUpcoming && 'opacity-20',
        'hover:shadow-lg hover:cursor-pointer hover:scale-105 transition-all ease-in-out',
        className
      )}
      onClick={(e) => {
        if (item.isUpcoming || item.href === pathname) {
          return;
        }
        item.onClick && item.onClick(e);
        item.href && router.push(item.href);
        onClick && onClick(e);
      }}
    >
      <CardHeader>
        {item.isUpcoming === true ? <Construction /> : icon}
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>
          {item.isUpcoming
            ? 'Taboo AI is still developing this feature for you. Stay tuned for more updates!'
            : item.subtitle}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
