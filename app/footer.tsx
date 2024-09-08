import Link from 'next/link';

import { fetchCurrentAuthUser } from './profile/server/fetch-user-profile';

export async function Footer() {
  const user = await fetchCurrentAuthUser();

  return (
    <footer className='pointer-events-none fixed bottom-0 z-[99999] flex h-16 w-full translate-y-2 select-none items-center justify-center gap-4 bg-transparent px-4 py-2 text-sm backdrop-blur-md [mask-image:linear-gradient(transparent_0%,black_80%)] [&>*]:text-center [&>a]:opacity-0'>
      <Link href='/' className='hover:underline'>
        Home
      </Link>
      <Link href='/levels' className='hover:underline'>
        Choose a topic
      </Link>
      {user && (
        <Link href='/profile' className='hover:underline'>
          My profile
        </Link>
      )}
    </footer>
  );
}
