import { Bot } from 'lucide-react';

interface LoadingProps {
  isLoading: boolean;
  message: string;
}
export default function LoadingMask(props: LoadingProps) {
  return props.isLoading ? (
    <div className='fixed w-screen h-screen left-0 top-0 z-[1000] flex flex-col gap-6 justify-center items-center backdrop-blur-lg'>
      <Bot size={64} className='animate-spin' strokeWidth={2} />
      <span className='text-lg text-center text-primary font-bold'>
        {props.message}
      </span>
    </div>
  ) : (
    <></>
  );
}
