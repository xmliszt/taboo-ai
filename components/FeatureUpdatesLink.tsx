// 'use client';

import Link from 'next/link';

const FeatureUpdatesLink = () => {
  return (
    <>
      <Link
        className='absolute left-[60%] -top-10 lg:-top-12 text-base lg:text-2xl text-yellow dark:text-neon-yellow hover:text-red-light hover:dark:text-neon-red transition-colors ease-in-out'
        href='/whatsnew'
        aria-label='link to latest new updates'
      >
        What&apos;s New?
      </Link>
    </>
  );
};

export default FeatureUpdatesLink;
