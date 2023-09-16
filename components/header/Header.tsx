import { cn } from '@/lib/utils';
import HeaderLeftElements from './header-left-elements';
import HeaderRightElements from './header-right-elements';

interface HeaderProps {
  title?: string;
  hideMenu?: boolean;
  hideUserMenu?: boolean;
  hideThemeToggle?: boolean;
  isTransparent?: boolean;
  hasBackButton?: boolean;
  customBackHref?: string;
  additionLeftItems?: React.ReactElement[];
  additionRightItems?: React.ReactElement[];
}

const Header = ({
  title = '',
  hideUserMenu = false,
  isTransparent = false,
  additionRightItems = [],
  hideMenu = false,
  hideThemeToggle = false,
  hasBackButton = false,
  customBackHref,
  additionLeftItems = [],
}: HeaderProps) => {
  return (
    <header
      id='header-section'
      className={cn(
        isTransparent ? '' : 'bg-card',
        'w-full fixed top-0 h-16 gap-2 z-40 p-4 flex flex-row justify-between text-center items-center'
      )}
    >
      <HeaderLeftElements
        hideMenu={hideMenu}
        hideThemeToggle={hideThemeToggle}
        hasBackButton={hasBackButton}
        customBackHref={customBackHref}
        additionLeftItems={additionLeftItems}
      />
      <h1
        data-testid='heading-rule-title'
        className='absolute -z-10 left-0 w-full text-center text-xl'
      >
        {title}
      </h1>
      <HeaderRightElements
        hideUserMenu={hideUserMenu}
        additionRightItems={additionRightItems}
      />
    </header>
  );
};

export default Header;
