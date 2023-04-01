import { AlertStatus, useToast as useChakraToast } from '@chakra-ui/react';

export default function useToast() {
  const chakraToast = useChakraToast();

  const toast = ({
    title,
    status,
    duration,
  }: {
    title: string;
    status: AlertStatus;
    duration?: number;
  }) => {
    chakraToast({
      title: title,
      status: status,
      position: 'top',
      duration: duration ?? 3000,
    });
  };

  return { toast };
}
