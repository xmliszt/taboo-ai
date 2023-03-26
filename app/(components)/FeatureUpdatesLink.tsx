// 'use client';

import Link from 'next/link';
// import { useEffect, useState } from 'react';

const FeatureUpdatesLink = () => {
  // const [whatsnewVisible, setWhatsnewVisible] = useState(true);
  // const [upcomingVisible, setUpcomingVisible] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setWhatsnewVisible((v) => !v);
  //     setUpcomingVisible((v) => !v);
  //   }, 5000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <>
      <Link
        className='absolute left-[60%] -top-10 lg:-top-12 text-base lg:text-2xl text-yellow dark:text-neon-yellow hover:text-red-light hover:dark:text-neon-red transition-colors ease-in-out'
        href='/whatsnew'
        aria-label='link to latest new updates'
      >
        What&apos;s New?
      </Link>
      {/* <Link
        className={`${
          upcomingVisible ? 'visible' : 'invisible'
        } opacity-0 absolute left-[60%] -top-10 lg:-top-12 text-base lg:text-2xl text-yellow dark:text-neon-yellow animate-fade-inout-delay-loop hover:text-red-light hover:dark:text-neon-red transition-colors ease-in-out`}
        href='/upcoming'
        aria-label='link to upcoming feature'
      >
        Upcoming Features!
      </Link> */}
    </>
  );
};

export default FeatureUpdatesLink;
