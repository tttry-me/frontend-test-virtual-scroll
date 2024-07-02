import {ReactNode} from 'react';

export function SortButton({
  direction,
  handlerOnClick,
}: {
  direction: 'up' | 'down';
  handlerOnClick: () => void;
}): ReactNode {
  return (
    <div className='h-full flex flex-wrap place-content-center'>
      <button
        onClick={handlerOnClick}
        className={`ml-2 inline-block w-0 h-0 border-r-4 border-r-transparent border-l-4 border-l-transparent ${
          direction !== 'up' ? 'border-t-4 border-t-gray-200' : 'border-b-4 border-b-gray-200'
        }`}></button>
    </div>
  );
}
