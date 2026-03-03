'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
    <article className='group/level-card relative h-[340px] w-[240px] select-none'>
      <Card className='relative flex h-full w-full flex-col shadow-md'>
        <CardHeader>
          <div
            className={cn(
              'text-md truncate rounded-lg bg-primary px-3 py-2 font-extrabold leading-tight text-primary-foreground shadow-md'
            )}
          >
            Advertisement
          </div>
        </CardHeader>

        <CardContent className='flex flex-1 items-center justify-center p-4'>
          <div className='flex h-full w-full items-center justify-center'>
            <div className='w-full max-w-full p-2'>
              <div
                id={AD_CONTAINER_ID}
                className='ad-level-banner mx-auto aspect-square w-full'
              ></div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className='w-full text-right italic leading-snug'>
            by <span className='font-extrabold'>Adsterra</span>
          </div>
        </CardFooter>
      </Card>
      <style jsx global>{`
        .ad-level-banner [class$='__title'] {
          display: none !important;
        }

        .ad-level-banner {
          overflow: hidden;
        }
      `}</style>
    </article>
  );
}
