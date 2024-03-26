'use client';

import { ChevronsUp } from 'lucide-react';

import IconButton from '@/components/ui/icon-button';

export function ScrollToTopButton(props: { scrollAreaRef?: React.RefObject<HTMLDivElement> }) {
  const handleScrollToTop = () => {
    if (props.scrollAreaRef) {
      props.scrollAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <IconButton
      asChild
      className='fixed bottom-4 right-8 animate-fade-in'
      tooltip='Scroll to top'
      onClick={handleScrollToTop}
    >
      <ChevronsUp />
    </IconButton>
  );
}
