import 'server-only';

import { LogSnag } from '@logsnag/next/server';

const logSnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN!,
  project: 'taboo-ai',
});

export async function track(options: Parameters<LogSnag['track']>[number]) {
  // Environment control, only track in production
  if (process.env.VERCEL_ENV !== 'production') {
    console.log(
      `Tracking disabled in ${process.env.VERCEL_ENV} environment: ${JSON.stringify(
        options,
        null,
        2
      )}`
    );
    return;
  }
  await logSnag.track(options);
}

export default logSnag;
