'use client';

import { ChangeEvent } from 'react';

const DevToggle = () => {
  const onDevToggle = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      localStorage.setItem('dev', '1');
    } else {
      localStorage.removeItem('dev');
    }
  };

  return (
    <div className='flex flex-row gap-2 justify-center items-center'>
      <input
        type='checkbox'
        id='dev-toggle'
        aria-label='Toggle for development mode'
        name='dev-toggle'
        onChange={onDevToggle}
      />
      <label htmlFor='dev-toggle'>Dev Mode</label>
    </div>
  );
};

export default DevToggle;
