import { BackButton } from '../custom/back-button';
import { MenuButton } from '../custom/menu-button';
import DevToggle from '../custom/dev-toggle';
import ThemeToggle from '../custom/theme-toggle';

interface HeaderLeftElementsProps {
  hideMenu?: boolean;
  hideThemeToggle?: boolean;
  hideDevToggle?: boolean;
  hasBackButton?: boolean;
  customBackHref?: string;
}

export default function HeaderLeftElements({
  hideMenu = false,
  hideThemeToggle = false,
  hideDevToggle = true,
  hasBackButton = false,
  customBackHref,
}: HeaderLeftElementsProps) {
  return (
    <div id='left-header-slot' className='flex justify-start gap-1'>
      {!hideMenu && <MenuButton />}
      {hasBackButton === true && <BackButton customBackHref={customBackHref} />}
      {!hideThemeToggle && <ThemeToggle />}
      {!hideDevToggle && <DevToggle key='dev-toggle' />}
    </div>
  );
}
