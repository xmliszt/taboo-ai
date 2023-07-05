'use client';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

if (typeof window !== 'undefined') {
  LogRocket.init('rksozk/taboo-ai');
  setupLogRocketReact(LogRocket);
  console.log('LogRocket intialized');
}

export default function LogRocketInitializer() {
  return <></>;
}
