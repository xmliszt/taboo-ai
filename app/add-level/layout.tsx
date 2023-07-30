import { Metadata } from 'next';
import InfoButton from '../../components/InfoButton';

export const metadata: Metadata = {
  title: 'Add Custom Topics',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className='flex justify-center w-full h-full'>
      <h1 className='fixed top-0 h-20 py-4 text-center z-50'>
        Add Custom Topics
      </h1>
      <div className='w-full px-2 flex flex-row justify-center items-center gap-2 fixed top-14 lg:top-20 h-20 text-center z-50 text-sm lg:text-lg bg-black gradient-blur-mask-down'>
        <div className='leading-4 backdrop-blur-lg'>
          You can create your custom topics here! Fill up the fields below and
          submit your topics. Your topic will be reviewed and uploaded to Taboo
          AI within 3 working days!{' '}
          <span>
            <InfoButton
              title='Taboo AI Content Policy'
              message='Taboo AI, our innovative web application, is designed to ensure a safe and respectful user experience for everyone. As part of our commitment to maintaining a positive online environment, all content submitted by users will be carefully reviewed. Any content found to be explicit, offensive, sexually explicit, violent, discriminatory, or harmful in nature will be automatically filtered and prevented from being uploaded. By implementing these measures, we aim to create a platform where users can freely express themselves while upholding a responsible and respectful community.'
            />
          </span>
        </div>
      </div>
      <section className='w-full h-full pt-36 lg:pt-44 flex flex-col justify-start items-center'>
        {children}
      </section>
    </section>
  );
}
