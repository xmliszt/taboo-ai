'use client';

import { FiPower } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
}

export default function BackButton(props: BackButtonProps = {}) {
  const router = useRouter();

  const back = () => {
    if (props.href !== undefined) {
      router.push(props.href);
    } else {
      router.back();
    }
  };

  return (
    <button
      id='back'
      className='fixed hover:animate-pulse z-50 top-5 left-4 lg:text-4xl hover:cursor-pointer drop-shadow-lg shadow-lg dark:text-neon-blue'
      onClick={() => {
        back();
      }}
    >
      <FiPower />
    </button>
  );
}
