// 'use client';

import Link from 'next/link';

const FeatureUpdatesLink = () => {
  return (
    <>
      <Link
        className='absolute left-[calc(50%+5rem)] lg:left-[calc(50%+10rem)] -top-4 text-base lg:text-2xl text-yellow hover:text-red-light transition-colors ease-in-out'
        href='/whatsnew'
        aria-label='link to latest new updates'
      >
        Features
      </Link>
    </>
  );
};

export default FeatureUpdatesLink;
