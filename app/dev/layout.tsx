import BackButton from '../(components)/BackButton';

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const environment = process.env.VERCEL_ENV;
  return (
    <>
      {(environment === 'preview' || environment === 'development') && children}
      <BackButton href='/' />
    </>
  );
}
