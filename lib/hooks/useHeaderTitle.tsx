'use client';

import { useState } from 'react';

export const useHeaderTitle = () => {
  const [title, setTitle] = useState('');

  return { setTitle };
};
