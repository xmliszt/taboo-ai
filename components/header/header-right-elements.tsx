import { UserLoginPortal } from '../custom/user-login-portal';

interface HeaderRightElementsProps {
  hideUserMenu: boolean;
  additionRightItems: React.ReactElement[];
}

export default function HeaderRightElements({
  hideUserMenu,
  additionRightItems,
}: HeaderRightElementsProps) {
  return (
    <div id='right-header-slot' className='flex justify-end gap-1'>
      {additionRightItems.reverse().map((item) => item)}
      {!hideUserMenu && <UserLoginPortal />}
    </div>
  );
}
