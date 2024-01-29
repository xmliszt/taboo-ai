'use client';

import React from 'react';

export default function HeaderLeftElements({ children }: { children: React.ReactNode }) {
  return (
    <div id='left-header-slot' className='flex justify-start gap-1'>
      {children}
    </div>
  );
}
