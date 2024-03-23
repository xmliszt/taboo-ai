import PWAContentMDX from 'mdx-contents/pwa.mdx';

import InstallButton from '@/components/custom/install-button';

export default function InstallPWAPage() {
  return (
    <main className='flex flex-col items-center px-8'>
      <article
        data-testid='content-article'
        className='max-w-xl pb-20 pt-8 leading-normal lg:pb-28'
      >
        <PWAContentMDX />
        <div className='sticky bottom-4 z-40 mt-2 flex w-full justify-center gap-2 px-2'>
          <InstallButton />
        </div>
      </article>
    </main>
  );
}
