import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface HomeMenuButtonProps {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
  href: string;
  'aria-label'?: string;
}

export function HomeMenuButton({
  icon,
  title,
  subtitle,
  href,
  'aria-label': ariaLabel,
}: HomeMenuButtonProps) {
  const router = useRouter();

  return (
    <Alert
      aria-label={ariaLabel}
      className='shadow-lg border-primary border-2 hover:cursor-pointer hover:scale-[1.02] transition-all ease-in-out'
      onClick={() => {
        router.push(href);
      }}
    >
      {icon}
      <AlertTitle className='font-bold'>{title}</AlertTitle>
      <AlertDescription>{subtitle}</AlertDescription>
    </Alert>
  );
}
