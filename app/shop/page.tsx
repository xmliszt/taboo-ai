import { DiamondScene } from './diamond-scene';
import { getPrices } from './server/get-prices';
import { ShopItemCarousel } from './shop-item-carousel';

const PRICE_IDS = [
  'price_1PwjEAF1rEoFWlQgOGRo8lMd',
  'price_1PxccyF1rEoFWlQgwIAkT8it',
  'price_1PxccyF1rEoFWlQg1fvz4zyU',
];

export default async function Page() {
  const prices = await getPrices(...PRICE_IDS);
  prices.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0));

  return (
    <main className='flex flex-col items-center pt-6 md:pt-16 [&_*]:select-none'>
      <div className='h-auto w-full md:h-48 md:w-96'>
        <DiamondScene />
      </div>
      <div className='flex w-full items-center justify-center'>
        <ShopItemCarousel
          products={prices.map((price, idx) => ({
            id: idx,
            name: price.metadata.name,
            description: price.metadata.description,
            tokens: parseInt(price.metadata.tokens_granted),
            priceId: price.id,
            price: price.unitDollar,
            currency: price.currency,
          }))}
        />
      </div>
    </main>
  );
}
