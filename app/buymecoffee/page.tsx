import Image from 'next/image';
import { GiCoffeeCup } from 'react-icons/gi';
import SocialLinkButton from '../../components/custom/social-link-button';
import ReactMarkdown from 'react-markdown';
import content from './content.md';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const BuyMeCoffeeQR = '/images/bmc_qr.png';
const BuyMeCoffeePage = () => {
  return (
    <>
      <section className='w-full h-full flex flex-col gap-8 items-center overflow-y-scroll scrollbar-hide leading-normal py-20'>
        <div className='w-[300px] h-auto '>
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
                className='rounded-lg border-[10px] border-primary hover:border-[1px] hover:shadow-2xl transition-all ease-in-out hover:scale-105 hover:cursor-pointer'
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

        <article
          id='disclaimer'
          className='text-justify px-10 leading-snug text-lg lg:px-32'
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </section>
    </>
  );
};

export default BuyMeCoffeePage;
