import Image from 'next/image';
import { Alert, AlertDescription } from '../ui/alert';
import { AspectRatio } from '../ui/aspect-ratio';

const Maintenance = () => {
  return (
    <article className='flex flex-col gap-2 justify-center items-center leading-normal h-full w-full py-16 px-8 text-center overflow-hidden'>
      <h1>Maintenance</h1>
      <div className='w-4/5'>
        <AspectRatio ratio={1}>
          <Image
            fill
            src='https://i.ibb.co/7zJ4yHD/maintenance.png'
            alt='Taboo AI is under maintenance'
            className='animate-pulse'
          />
        </AspectRatio>
      </div>
      <Alert>
        <AlertDescription className='font-bold animate-fade-in'>
          Taboo AI is working hard to resolve the unexpected issue {'>_<!'} It
          might be because the AI services we are using are currently experiencing an unexpected
          outage. We will be back once the issue has been resolved. Thank you
          for your patience!
        </AlertDescription>
      </Alert>
    </article>
  );
};

export default Maintenance;
