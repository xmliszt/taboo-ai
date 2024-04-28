import Link from 'next/link';

import { fetchCurrentAuthUser } from './profile/server/fetch-user-profile';

export async function Footer() {
  const user = await fetchCurrentAuthUser();

  return (
    <footer className='flex w-full items-center justify-center gap-4 border-t px-4 py-2 text-sm [&>*]:text-center'>
      <Link href='/' className='hover:underline'>
        Home
      </Link>
      <Link href='/levels' className='hover:underline'>
        Choose a topic
      </Link>
      <Link href='/pricing' className='hover:underline'>
        Pricing
      </Link>
      {user && (
        <Link href='/profile' className='hover:underline'>
          My profile
        </Link>
      )}
    </footer>
  );
}
