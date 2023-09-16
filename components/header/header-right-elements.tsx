import ShareScoreButton from '../custom/share-score-button';
import { UserLoginPortal } from '../custom/user-login-portal';

interface HeaderRightElementsProps {
  hideUserMenu?: boolean;
  hideShareScoreButton?: boolean;
}

export default function HeaderRightElements({
  hideUserMenu,
  hideShareScoreButton = true,
}: HeaderRightElementsProps) {
  return (
    <div id='right-header-slot' className='flex justify-end gap-1'>
      {!hideShareScoreButton && <ShareScoreButton />}
      {!hideUserMenu && <UserLoginPortal />}
    </div>
  );
}
