import {ReactElement} from 'react';
import {RowData} from '../VirualScroll';

interface RowProps {
  data: RowData;
  height: number;
}

export function Row(props: RowProps): ReactElement {
  return (
    <div className='text-white w-full flex flex-grow-0 gap-4 ' style={{height: props.height}}>
      <div
        title={props.data.username}
        className='text-left w-1/4 px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis'>
        {props.data.username}
      </div>
      <div
        title={props.data.name}
        className='text-left w-1/4 px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis'>
        {props.data.name}
      </div>
      <div className='text-left w-1/4 h-full px-6 py-4 overflow-hidden whitespace-nowrap text-ellipsis'>
        {props.data.email}
      </div>
      <div className='text-left w-1/4 h-full px-6 py-4 overflow-hidden whitespace-nowrap text-ellipsis'>
        {props.data.dob}
      </div>
      <div className='text-left w-1/4 h-full px-6 py-4 overflow-hidden whitespace-nowrap text-ellipsis'>
        {props.data.company}
      </div>
      <div className='text-left w-1/4 h-full px-6 py-4 overflow-hidden whitespace-nowrap text-ellipsis'>
        {props.data.address}
      </div>
    </div>
  );
}
