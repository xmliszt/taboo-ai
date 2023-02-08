import { RiQuillPenLine } from 'react-icons/ri';

export default function CustomWordListLink() {
  return (
    <a
      aria-label='Submit your feedbacks here'
      href='https://forms.gle/mfAdSeDNaxtXvPJE8'
      target='__blank'
      className='text-white dark:text-neon-white hover:text-yellow hover:dark:text-neon-yellow text-center animate-pulse text-lg'
    >
      <RiQuillPenLine className='inline' /> Create Your Own Word List!
    </a>
  );
}
