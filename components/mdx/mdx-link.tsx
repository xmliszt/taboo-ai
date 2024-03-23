'use client';

import Link from 'next/link';

import { CustomEventKey, EventManager } from '@/lib/event-manager';

export function MDXLink(props: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={props.href}
      onClick={() => {
        EventManager.fireEvent(CustomEventKey.CLOSE_FEATURE_POPUP);
      }}
    >
      {props.children}
    </Link>
  );
}
