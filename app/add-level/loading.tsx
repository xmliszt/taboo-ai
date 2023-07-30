'use client';

import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';

export default function Loading() {
  return (
    <Box className='w-full h-auto p-8 bg-black' padding='6' bg='transparent'>
      <div className='flex flex-row gap-4 items-center justify-between h-10'>
        <SkeletonCircle size='10' dropShadow='lg' className='aspect-square' />
        <SkeletonText
          noOfLines={1}
          dropShadow='lg'
          skeletonHeight='8'
          width='full'
        />
      </div>
      <SkeletonText
        mt='4'
        noOfLines={5}
        spacing='4'
        skeletonHeight='8'
        dropShadow='lg'
      />
    </Box>
  );
}
