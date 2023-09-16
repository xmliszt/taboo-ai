import { ThemeToggle } from '../custom/theme-toggle';
import { BackButton } from '../custom/back-button';
import { MenuButton } from '../custom/menu-button';

interface HeaderLeftElementsProps {
  hideMenu?: boolean;
  hideThemeToggle?: boolean;
  hasBackButton?: boolean;
  customBackHref?: string;
  additionLeftItems?: React.ReactElement[];
}

export default function HeaderLeftElements({
  hideMenu = false,
  hideThemeToggle = false,
  hasBackButton = false,
  customBackHref,
  additionLeftItems = [],
}: HeaderLeftElementsProps) {
  return (
    <div id='left-header-slot' className='flex justify-start gap-1'>
      {!hideMenu && <MenuButton />}
      {hasBackButton === true && <BackButton customBackHref={customBackHref} />}
      {!hideThemeToggle && <ThemeToggle />}
      {additionLeftItems.map((item) => item)}
    </div>
  );
}
