import Link from 'next/link';

import { fetchCurrentAuthUser } from './profile/server/fetch-user-profile';

export async function Footer() {
  let isUserLoggedIn = false;
  try {
    await fetchCurrentAuthUser();
    isUserLoggedIn = true;
  } catch (error) {
    isUserLoggedIn = false;
  }

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
      {isUserLoggedIn && (
        <Link href='/profile' className='hover:underline'>
          My profile
        </Link>
      )}
    </footer>
  );
}
