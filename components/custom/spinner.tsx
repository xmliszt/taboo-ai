import { ImSpinner2 } from 'react-icons/im';

interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 32 }: SpinnerProps) {
  return <ImSpinner2 className='animate-spin' size={size} />;
}
