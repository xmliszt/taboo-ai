'use client';

import React from 'react';

export default function HeaderRightElements({ children }: { children: React.ReactNode }) {
  return (
    <div id='right-header-slot' className='flex justify-end gap-1'>
      {children}
    </div>
  );
}
