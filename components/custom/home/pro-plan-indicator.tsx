'use client';

import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';

export function ProPlanIndicator() {
  const { userPlan } = useAuth();
  if (!userPlan || userPlan.type === 'free') return null;
  return (
    <Badge
      className='absolute -top-6 left-0 border-primary text-center drop-shadow-lg'
      variant='outline'
    >
      PRO
    </Badge>
  );
}
