'use client';

import React from 'react';

export default function HeaderLeftElements({ children }: { children: React.ReactNode }) {
  return (
    <div id='left-header-slot' className='flex w-[120px] justify-start gap-x-1'>
      {children}
    </div>
  );
}
