import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ServerCrash } from 'lucide-react';
import { Spinner } from '../spinner';

interface ResultsUploadAlertProps {
  isUploading: boolean;
  retryUpload: () => void;
}

export default function ResultsUploadAlert({
  isUploading,
  retryUpload,
}: ResultsUploadAlertProps) {
  return (
    <Alert className='border-red-500 text-red-500'>
      <ServerCrash size={20} color='rgb(239 68 68 / var(--tw-text-opacity))' />
      <AlertTitle>
        Sorry, the results were not uploaded successfully!
      </AlertTitle>
      <AlertDescription>
        We were not able to upload your results to your profile just now due to
        network issue. But you can try again here!{' '}
        <Button disabled={isUploading} size='sm' onClick={retryUpload}>
          {isUploading ? <Spinner /> : 'Upload Again'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
