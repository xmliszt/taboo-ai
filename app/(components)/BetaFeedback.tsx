import { RiQuillPenLine } from 'react-icons/ri';

export default function BetaFeedback() {
  return (
    <a
      aria-label='Submit your feedbacks here'
      href='https://forms.gle/reNUKC7CP37uWPyp6'
      target='__blank'
      className='text-white dark:text-neon-white hover:text-yellow hover:dark:text-neon-yellow text-center'
    >
      <RiQuillPenLine className='inline' /> Submit Your Feedbacks
    </a>
  );
}
