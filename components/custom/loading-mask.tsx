import { Bot } from 'lucide-react';

interface LoadingProps {
  isLoading: boolean;
  message: string;
}
export default function LoadingMask(props: LoadingProps) {
  return props.isLoading ? (
    <div className='fixed left-0 top-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center gap-6 backdrop-blur-lg'>
      <Bot size={64} className='animate-spin' strokeWidth={2} />
      <span className='text-center text-lg font-bold text-primary'>{props.message}</span>
    </div>
  ) : (
    <></>
  );
}
