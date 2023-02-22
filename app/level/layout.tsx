import BackButton from '../(components)/BackButton';
import DevToggle from '../(components)/DevToggle';

export default function LevelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const environment = process.env.VERCEL_ENV;
  return (
    <>
      {(environment === 'preview' || environment === 'development') && (
        <div className='fixed z-50 w-full top-32 lg:top-44 flex justify-center'>
          <DevToggle />
        </div>
      )}
      <BackButton href='/levels' />
      {children}
    </>
  );
}
