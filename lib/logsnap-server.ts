import 'server-only';

import { LogSnag } from '@logsnag/next/server';

const logSnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN!,
  project: 'taboo-ai',
});

export async function trackNavigation(route: string) {
  await logSnag.track({
    channel: 'navigation',
    event: 'navigate',
    icon: '🔍',
    notify: false,
    tags: {
      route: route,
    },
  });
}

export default logSnag;
