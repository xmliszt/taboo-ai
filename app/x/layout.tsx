import React from 'react';
import { notFound } from 'next/navigation';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';

export default async function DevLayout({ children }: { children: React.ReactNode }) {
  const user = await fetchUserProfile();
  if (!user.is_dev) notFound();
  return <> {children} </>;
}
