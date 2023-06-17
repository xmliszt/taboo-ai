import { RiFeedbackFill } from 'react-icons/ri';

export default function FeedbackLink() {
  return (
    <a
      aria-label='Submit your feedabck here'
      href='https://forms.gle/CqJtgmNdGC88JxYn7'
      target='__blank'
      className='text-white dark:text-neon-white hover:text-yellow hover:dark:text-neon-yellow text-center text-lg'
    >
      <RiFeedbackFill className='inline' /> Have feedbacks?
    </a>
  );
}
