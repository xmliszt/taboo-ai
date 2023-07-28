'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader,
} from '@chakra-ui/react';
import { BsInfoSquareFill } from 'react-icons/bs';

interface InfoButtonProps {
  title: string;
  message: string;
}

const InfoButton = (props: InfoButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <button
          data-style='none'
          className='hover:opacity-50 transition-opacity ease-in mx-1 mt-1'
        >
          <BsInfoSquareFill />
        </button>
      </PopoverTrigger>
      <PopoverContent className='text-black'>
        <PopoverArrow />
        <PopoverCloseButton
          data-style='none'
          className='hover:opacity-50 transition-opacity ease-in'
        />
        <PopoverHeader>{props.title}</PopoverHeader>
        <PopoverBody className=' leading-5'>{props.message}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default InfoButton;
