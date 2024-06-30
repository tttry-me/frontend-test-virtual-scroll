import React from 'react';
import {VirualScroll} from '../components/VirtualScroll.tsx/VirualScroll';

export function DemonstratePage(): React.ReactElement {
  return (
    <div className='flex flex-col items-center justify-center w-screen min-h-screen bg-gray-900 py-10'>
      <h1 className='text-lg text-gray-400 font-medium'>Virtual Scroll</h1>
      <VirualScroll maxIndex={30} minIndex={1} startIndex={6} itemHeight={20} amount={5} tolerance={2} />
    </div>
  );
}
