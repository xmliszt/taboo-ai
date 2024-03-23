import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

import { HoverPerspectiveContainer } from './components/custom/common/hover-perspective-container';
import { MDXLink } from './components/mdx/mdx-link';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    ...components,
    img: (props) => (
      <HoverPerspectiveContainer className='flex flex-col items-stretch' clipping>
        <Image
          src={props.src ?? ''}
          alt={props.alt ?? ''}
          width={100}
          height={100}
          layout={'responsive'}
          style={{
            maxWidth: '100%',
            padding: 0,
            margin: 0,
          }}
        />
      </HoverPerspectiveContainer>
    ),
    a: (props) => <MDXLink href={props.href ?? '#'}>{props.children}</MDXLink>,
    em: (props) => <span className='italic text-muted-foreground'>{props.children}</span>,
  };
}
