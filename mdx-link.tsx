'use client';

import Link from 'next/link';

import { CustomEventKey, EventManager } from './lib/event-manager';

export function MDXLink(props: { href: string; children: React.ReactNode }) {
  return (
    <span className='ml-1 font-bold'>
      <Link
        href={props.href ?? ''}
        style={{
          textUnderlineOffset: '0.4em',
          textDecorationStyle: 'wavy',
          transition: 'text-decoration-style 0.5s ease-out',
        }}
        onClick={() => {
          EventManager.fireEvent(CustomEventKey.CLOSE_FEATURE_POPUP);
        }}
      >
        {props.children}
      </Link>
    </span>
  );
}
