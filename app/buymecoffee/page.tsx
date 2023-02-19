import Image from 'next/image';
import Link from 'next/link';
const BuyMeCoffeeQR = '/images/bmc_qr.png';
import { GiCoffeeCup } from 'react-icons/gi';
import BackButton from '../(components)/BackButton';
import SocialLinkButton from '../(components)/SocialLinkButton';

const BuyMeCoffeePage = () => {
  return (
    <section className='w-full h-full flex flex-col gap-8 justify-center items-center'>
      <BackButton href='/' />
      <a
        href='/images/bmc_qr.png'
        download='BuyMeCoffee-TabooAI_by_LiYuxuan.png'
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
        className='text-center px-8 lg:px-16 leading-normal text-sm lg:text-3xl'
      >
        <p>
          Taboo.AI is made possible with the integration with{' '}
          <b>OpenAI GPT API services</b>. To provide you with the smooth
          gameplay experience without{' '}
          <b>frequent internet hiccups and API overloads</b>, a paid
          subscription to <b>the Curie Model</b> API service was made monthly by
          the developer. Your coffee bought for the developer will definitely
          help him continue maintain and update the game to bring more fun and
          interesting components to you in the future!{' '}
        </p>
        <p>❤️ Thanks in advance!</p>
      </article>
    </section>
  );
};

export default BuyMeCoffeePage;
