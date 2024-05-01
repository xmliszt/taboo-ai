'use client';

import { AskForFeedbackProvider } from './ask-for-feedback-provider';
import { ThemeProvider } from './theme-provider';
import { GlobalTooltipProvider } from './tooltip-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <GlobalTooltipProvider delayDuration={300}>
        <AskForFeedbackProvider>{children}</AskForFeedbackProvider>
      </GlobalTooltipProvider>
    </ThemeProvider>
  );
}
