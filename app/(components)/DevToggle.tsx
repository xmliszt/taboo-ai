'use client';

import { ChangeEvent, useEffect, useState } from 'react';

const DevToggle = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(localStorage.getItem('dev') ? true : false);
  }, []);

  const onDevToggle = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      localStorage.setItem('dev', '1');
    } else {
      localStorage.removeItem('dev');
    }
    setChecked(event.target.checked);
  };

  return (
    <div className='flex flex-row gap-2 justify-center items-center'>
      <input
        type='checkbox'
        id='dev-toggle'
        aria-label='Toggle for development mode'
        name='dev-toggle'
        defaultChecked={checked}
        checked={checked}
        onChange={onDevToggle}
      />
      <label htmlFor='dev-toggle'>Dev Mode</label>
    </div>
  );
};

export default DevToggle;
