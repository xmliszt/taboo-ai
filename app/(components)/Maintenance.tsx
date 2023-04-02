import Image from 'next/image';
import maintenanceRobot from '../../public/images/maintenance.png';

const Maintenance = () => {
  return (
    <article className='flex flex-col gap-4 justify-center items-center leading-normal h-full w-full p-16 text-center overflow-hidden'>
      <Image
        src={maintenanceRobot}
        alt='Taboo AI is under maintenance'
        width={400}
      />
      <p className='text-base lg:text-2xl'>
        Taboo.AI is working hard to resolve the unexpected issue {'>_<!'} It
        might be because OpenAI API is currently experiencing an unexpected
        outage. We will be back once the issue has been resolved. Thank you for
        your patience!
      </p>
    </article>
  );
};

export default Maintenance;
