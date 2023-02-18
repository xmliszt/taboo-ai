import { Special_Elite } from '@next/font/google';
import router from 'next/router';
import './global.css';

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
});

export default function Custom404() {
  return (
    <div
      className={`${specialElite.className} font-serif w-full h-screen flex flex-col justify-center items-center gap-10 bg-black`}
    >
      <pre className='text-white text-center text-8xl lg:text-8xl'>404</pre>
      <p className='text-white text-center'>Ooops page not found &gt;_&lt;!</p>
      <button
        id='reset'
        aria-label='reset button'
        className='text-2xl lg:text-4xl text-red-light hover:text-yellow transition-all'
        onClick={() => {
          router.push('/');
        }}
      >
        Back To Home
      </button>
    </div>
  );
}
