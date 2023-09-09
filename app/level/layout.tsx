import { Metadata } from 'next';
import Header from '@/components/header/Header';
import DevToggle from '@/components/custom/dev-toggle';
export const metadata: Metadata = {
  title: 'Level',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        hideMenu
        isTransparent
        hasBackButton
        hideUserMenu
        additionLeftItems={[<DevToggle key='dev-toggle' />]}
      />
      {children}
    </>
  );
}
