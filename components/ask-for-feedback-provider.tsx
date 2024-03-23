'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const AskForFeedbackContext = createContext<{
  askCount: number;
  incrementAskCount: () => void;
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: Dispatch<SetStateAction<boolean>>;
}>({
  askCount: 0,
  incrementAskCount: () => {},
  isFeedbackOpen: false,
  setIsFeedbackOpen: () => {},
});

export function AskForFeedbackProvider({ children }: { children: React.ReactNode }) {
  const [askCount, setAskCount] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <AskForFeedbackContext.Provider
      value={{
        askCount,
        incrementAskCount: () => {
          setAskCount((askCount) => askCount + 1);
        },
        isFeedbackOpen,
        setIsFeedbackOpen,
      }}
    >
      {children}
    </AskForFeedbackContext.Provider>
  );
}

export function useAskForFeedbackControl() {
  const { isFeedbackOpen, setIsFeedbackOpen } = useContext(AskForFeedbackContext);

  return { isFeedbackOpen, setIsFeedbackOpen };
}

export function useAskForFeedback() {
  const MAXIMUM_ASK_COUNT = 2;
  const { askCount, incrementAskCount, setIsFeedbackOpen } = useContext(AskForFeedbackContext);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (askCount >= MAXIMUM_ASK_COUNT) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      () => {
        setIsFeedbackOpen(true);
        incrementAskCount();
      },
      1000 * 60 * 1
    ); // 1 minute
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
}
