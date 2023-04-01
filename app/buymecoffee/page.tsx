import Image from 'next/image';
const BuyMeCoffeeQR = '/images/bmc_qr.png';
import { GiCoffeeCup } from 'react-icons/gi';
import SocialLinkButton from '../(components)/SocialLinkButton';
import ReactMarkdown from 'react-markdown';
import content from './content.md';
import style from './style.module.css';

const BuyMeCoffeePage = () => {
  return (
    <>
      <section className='w-full h-full flex flex-col gap-8 items-center overflow-y-scroll scrollbar-hide leading-normal'>
        <a
          href='/images/bmc_qr.png'
          download='BuyMeCoffee-TabooAI_by_LiYuxuan.png'
          className='mt-16 lg:mt-24'
        >
          <Image
            width={200}
            height={200}
            src={BuyMeCoffeeQR}
            alt='Buy Me Coffee QR Code. Scan to buy me a coffee!'
            className='drop-shadow-2xl transition-all ease-in-out hover:scale-105 hover:cursor-pointer hover:drop-shadow-[0_5px_15px_rgba(229,229,4,0.6)]'
          />
        </a>
        <SocialLinkButton
          content='Buy Me Coffee'
          newTab={true}
          icon={<GiCoffeeCup />}
          href='https://www.buymeacoffee.com/yuxuanli'
          customClass='text-2xl'
        />

        <article
          id='disclaimer'
          className='text-justify px-10 lg:px-32 !leading-[1.3rem] lg:!leading-[2rem] text-sm lg:text-3xl pb-8'
        >
          <ReactMarkdown className={`${style.markdown}`}>
            {content}
          </ReactMarkdown>
        </article>
      </section>
    </>
  );
};

export default BuyMeCoffeePage;
