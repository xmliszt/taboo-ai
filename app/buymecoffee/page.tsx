import Image from 'next/image';
import MDXContent from 'mdx-contents/buymecoffee.mdx';
import { GiCoffeeCup } from 'react-icons/gi';

import SocialLinkButton from '@/components/custom/social-link-button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const BuyMeCoffeeQR = '/images/bmc_qr.png';
const BuyMeCoffeePage = () => {
  return (
    <>
      <main className='flex h-full w-full flex-col items-center gap-8 overflow-y-scroll py-20 leading-normal scrollbar-hide'>
        <div className='h-auto w-[300px] '>
          <a
            href='/images/bmc_qr.png'
            download='BuyMeCoffee-TabooAI_by_LiYuxuan.png'
            className='mt-16 lg:mt-24'
          >
            <AspectRatio ratio={1}>
              <Image
                fill
                src={BuyMeCoffeeQR}
                alt='Buy Me Coffee QR Code. Scan to buy me a coffee!'
                className='rounded-lg border-[10px] border-primary transition-all ease-in-out hover:scale-105 hover:cursor-pointer hover:border-[1px] hover:shadow-2xl'
              />
            </AspectRatio>
          </a>
        </div>
        <SocialLinkButton
          content='Buy Me Coffee'
          newTab={true}
          icon={<GiCoffeeCup />}
          href='https://www.buymeacoffee.com/yuxuanli'
          className='text-2xl'
        />

        <article id='disclaimer' className='max-w-xl px-10 text-justify text-lg leading-snug'>
          <MDXContent />
        </article>
      </main>
    </>
  );
};

export default BuyMeCoffeePage;
