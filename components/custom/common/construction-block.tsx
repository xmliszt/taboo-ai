import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Construction } from 'lucide-react';

interface ConstructionBlockProps {
  title: string;
  description: string;
  className?: string;
}

export default function ConstructionBlock({
  title,
  description,
  className,
}: ConstructionBlockProps) {
  return (
    <Card className={cn(className, 'opacity-50 hover:cursor-not-allowed')}>
      <CardContent>
        <CardHeader className='p-0 my-4'>
          <Construction />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
