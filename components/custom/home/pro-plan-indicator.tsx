'use client';

import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';

export function ProPlanIndicator() {
  const { user } = useAuth();
  if (!user || user?.subscription?.customer_plan_type === 'free') return null;
  return (
    <Badge
      className='absolute -top-6 left-0 border-primary text-center drop-shadow-lg'
      variant='outline'
    >
      Pro
    </Badge>
  );
}
