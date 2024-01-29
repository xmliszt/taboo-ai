import React from 'react';
import { notFound } from 'next/navigation';

import { fetchCurrentAuthUser } from '@/app/profile/server/fetch-user-profile';
import { AdminManager } from '@/lib/admin-manager';

export default async function DevLayout({ children }: { children: React.ReactNode }) {
  const authUser = await fetchCurrentAuthUser();
  const isUserWhitelisted = AdminManager.checkIsAdmin(authUser.id);
  if (!isUserWhitelisted) notFound();
  return <> {children} </>;
}
