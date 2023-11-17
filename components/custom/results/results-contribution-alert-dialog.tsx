import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface ResultsContributionAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopicReviewSheetOpenChange: (open: boolean) => void;
}

export default function ResutlsContributionAlertDialog({
  open,
  onOpenChange,
  onTopicReviewSheetOpenChange,
}: ResultsContributionAlertDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Enjoy the game so far? Would you like to contribute this
            AI-generated topic to us?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onTopicReviewSheetOpenChange(false);
            }}
          >
            I&apos;ll decide later
          </AlertDialogCancel>
          <AlertDialogAction
            autoFocus
            onClick={() => {
              onOpenChange(false);
              onTopicReviewSheetOpenChange(true);
            }}
          >
            Sure why not
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
