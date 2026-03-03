'use client';

import { useEffect } from 'react';

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
    <article className='relative h-[340px] w-[240px] select-none overflow-hidden rounded-lg border bg-card text-card-foreground shadow-md'>
      <div className='flex h-full w-full items-center justify-center p-3'>
        <div id={AD_CONTAINER_ID} className='ad-level-banner w-full'></div>
      </div>
      <style jsx global>{`
        .ad-level-banner [class$='__title'] {
          display: none !important;
        }
      `}</style>
    </article>
  );
}
