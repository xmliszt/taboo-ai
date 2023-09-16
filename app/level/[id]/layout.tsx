import { Metadata, ResolvingMetadata } from 'next';
import Header from '@/components/header/header';
import DevToggle from '@/components/custom/dev-toggle';
import { getAllLevels, getLevel } from '@/lib/services/levelService';

export async function generateMetadata(
  { params: { id } }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const level = await getLevel(id);
  return {
    title: level?.name ?? 'Level',
  };
}

export async function generateStaticParams() {
  const levels = await getAllLevels();
  return levels.map((level) => ({ id: level.id }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        hideMenu
        isTransparent
        hasBackButton
        customBackHref='/levels'
        hideUserMenu
        additionLeftItems={[<DevToggle key='dev-toggle' />]}
      />
      <h1 className='fixed z-20 top-3 w-full flex justify-center'>
        <div className='rounded-lg shadow-lg px-3 py-1 w-fit'>Taboo AI</div>
      </h1>
      {children}
    </>
  );
}
