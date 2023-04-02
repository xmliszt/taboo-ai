'use client';

import { KeyboardEvent, MouseEventHandler, useState } from 'react';

interface ConfirmButtonProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface ConfirmPopUpProps {
  disabled?: boolean;
  show: boolean;
  title: string;
  content: string;
  buttons: ConfirmButtonProps[];
}

const ConfirmPopUp = (props: ConfirmPopUpProps) => {
  const [isClosed, setIsClosed] = useState<boolean>(false);

  const close = () => {
    setIsClosed(true);
  };

  const escClose = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsClosed(true);
    }
  };

  return (
    <>
      {!isClosed && props.show && (
        <div
          onClick={close}
          onKeyDown={escClose}
          className='w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm z-40 flex justify-center items-center leading-normal animate-fade-in'
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className='w-4/5 max-w-[400px] !aspect-square bg-white dark:bg-neon-black rounded-2xl p-4 text-black dark:text-neon-white drop-shadow-2xl flex flex-col gap-4'
          >
            <section className='h-12 lg:h-16 w-full rounded-2xl bg-yellow p-2 text-black drop-shadow-lg text-xl text-center'>
              {props.title}
            </section>
            <section className='flex-grow w-full overflow-y-scroll p-2 scrollbar-hide text-2xl'>
              {props.content}
            </section>
            <section className='h-12 lg:h-16 w-full flex flex-row gap-4'>
              {props.buttons.map((buttonProps, idx) => (
                <button
                  disabled={props.disabled}
                  key={idx}
                  className='h-full flex-grow !bg-black dark:!bg-neon-gray !text-white'
                  onClick={props.buttons[idx].onClick}
                >
                  {buttonProps.label}
                </button>
              ))}
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmPopUp;
