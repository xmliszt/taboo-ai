import { Construction } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
        <CardHeader className='my-4 p-0'>
          <Construction />
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
