'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { HoverPerspectiveContainer } from '@/components/custom/common/hover-perspective-container';
import { cn } from '@/lib/utils';

const AD_CONTAINER_ID = 'container-d743f129b71ea38d5f36f459ef5b855e';
const AD_TITLE_CLASS = `${AD_CONTAINER_ID}__title`;

function hideAdTitleText() {
  document.querySelectorAll(`.${AD_TITLE_CLASS}`).forEach((node) => {
    if (node instanceof HTMLElement) {
      node.style.display = 'none';
    }
  });
}

export function AdLevelCard() {
  useEffect(() => {
    const sourceContainer = document.getElementById(AD_CONTAINER_ID);
    if (!sourceContainer) return;

    hideAdTitleText();

    const observer = new MutationObserver(() => {
      hideAdTitleText();
    });

    observer.observe(sourceContainer, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <HoverPerspectiveContainer
      className={cn('group/level-card relative select-none', 'w-[240px]', 'h-[340px]')}
    >
      <Card
        title='Advertisement'
        className={cn(
          'z-10',
          'relative flex h-full w-full flex-col shadow-md transition-all ease-in-out group-hover/level-card:scale-[1.02]'
        )}
      >
        <CardHeader>
          <div
            className={cn(
              'text-md truncate rounded-lg bg-primary px-3 py-2 font-extrabold leading-tight text-primary-foreground shadow-md',
              'transition-transform ease-in-out',
              'group-hover/level-card:-translate-y-[32px] group-hover/level-card:scale-150'
            )}
          >
            Advertisement
          </div>
        </CardHeader>

        <CardContent className='relative flex min-h-0 flex-1 items-center justify-center'>
          <div className='flex h-full w-full items-center justify-center p-2'>
            <div className='h-full w-full max-w-full'>
              <div
                id={AD_CONTAINER_ID}
                className='ad-level-banner mx-auto aspect-square max-h-full w-full'
              ></div>
            </div>
          </div>
        </CardContent>

        <div className='h-auto w-full flex-grow'></div>

        <CardFooter className='shrink-0'>
          <div className='w-full text-right italic leading-snug'>
            by <span className='font-extrabold'>Adsterra</span>
          </div>
        </CardFooter>
      </Card>

      <span
        className={cn(
          'rotating-mono-border-trace absolute left-0 top-0 -z-10 h-full w-full rounded-lg bg-card opacity-0 transition-[transform_opacity_0.3s_ease-in-out] after:blur-sm group-hover/level-card:scale-[1.02] group-hover/level-card:opacity-70'
        )}
      ></span>

      <style jsx global>{`
        .ad-level-banner [class$='__title'] {
          display: none !important;
        }

        .ad-level-banner {
          overflow: hidden;
        }
      `}</style>
    </HoverPerspectiveContainer>
  );
}
