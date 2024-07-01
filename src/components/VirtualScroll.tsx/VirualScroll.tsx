import React, {useEffect, useRef, useState} from 'react';
import {Row} from './Row';
import {User} from '../../views/DemonstratePage';

export interface RowData {
  id: string;
  company: string;
  username: string;
  name: string;
  email: string;
  dob: string;
  address: string;
}

interface VirtualScrollProps {
  startIndex: number;
  itemHeight: number;
  amount: number;
  tolerance: number;
  users: Array<User>;
}

function setInitialState({startIndex, itemHeight, amount, tolerance}: VirtualScrollProps, amountUsers: number) {
  const minIndex = 0;
  const maxIndex = amountUsers - 1;
  const viewportHeight = amount * itemHeight;
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
  const toleranceHeight = tolerance * itemHeight;
  const bufferHeight = viewportHeight + 2 * toleranceHeight;
  const bufferedItems = amount + 2 * tolerance;
  const itemsAbove = startIndex - tolerance - minIndex;
  const topPaddingHeight = itemsAbove * itemHeight;
  const bottomPaddingHeight = totalHeight - topPaddingHeight;
  const initialPosition = topPaddingHeight + toleranceHeight;
  const data: Array<RowData> = [];
  return {
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data,
    maxIndex,
    minIndex,
  };
}

interface VirtualScrollState {
  viewportHeight: number;
  totalHeight: number;
  toleranceHeight: number;
  bufferHeight: number;
  bufferedItems: number;
  topPaddingHeight: number;
  bottomPaddingHeight: number;
  initialPosition: number;
  data: Array<RowData>;
  maxIndex: number;
  minIndex: number;
}

export const VirualScroll: React.FC<VirtualScrollProps> = (props) => {
  const [state, setState] = useState<VirtualScrollState>(() => setInitialState(props, props.users.length));
  const viewportRef = useRef<HTMLTableSectionElement>(null);

  function getData(offset: number, limit: number) {
    const data: Array<RowData> = [];
    const start = Math.max(state.minIndex, offset);
    const end = Math.min(offset + limit - 1, state.maxIndex);
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        const {
          username,
          email,
          id,
          profile: {name, company, dob, address},
        } = props.users[i];
        data.push({username, email, id, name, company, dob, address});
      }
    }
    return data;
  }

  function handleScroll(event: React.UIEvent<HTMLTableSectionElement>) {
    const index =
      state.minIndex + Math.floor((event.currentTarget.scrollTop - state.toleranceHeight) / props.itemHeight);
    const data = getData(index, state.bufferedItems);
    if (data != undefined) {
      window.requestAnimationFrame(() => {
        const topPaddingHeight = Math.max((index - state.minIndex) * props.itemHeight);
        const bottomPaddingHeight = Math.max(state.totalHeight - topPaddingHeight - data.length * props.itemHeight);

        setState({
          ...state,
          topPaddingHeight,
          bottomPaddingHeight,
          data,
        });
      });
    }
  }

  useEffect(() => {
    if (viewportRef.current !== null) {
      const fakeEvent = {
        currentTarget: {
          scrollTop: 0,
        },
      } as React.UIEvent<HTMLTableSectionElement>;
      console.log(state);
      handleScroll(fakeEvent);
    }
  }, []);

  return (
    <div className='w-full shadow overflow-hidden rounded-lg relative'>
      <div className='w-full'>
        <div className='flex flex-grow-0 bg-gray-800 text-gray-200 text-xs uppercase font-medium border-b-gray-950 border-b-2'>
          <div className='w-1/4 px-5 py-3 text-center tracking-wide'>Username</div>
          <div className='w-1/4 px-5 py-3 text-center tracking-wider'>Name</div>
          <div className='w-1/4 px-5 py-3 text-center tracking-wider'>Email</div>
          <div className='w-1/4 px-5 py-3 text-center tracking-wider'>Dob</div>
          <div className='w-1/4 px-5 py-3 text-center tracking-wider'>Company</div>
          <div className='w-1/4 px-5 py-3 text-center tracking-wider'>Address</div>
        </div>

        <div
          className='overflow-y-auto block w-full bg-gray-800'
          style={{height: state?.viewportHeight}}
          ref={viewportRef}
          onScroll={handleScroll}>
          <div style={{height: state?.topPaddingHeight}}></div>
          <div className='flex flex-col'>
            {state?.data.map((user) => {
              return <Row key={user.id} data={user} height={props.itemHeight} />;
            })}
          </div>
          <div style={{height: state?.bottomPaddingHeight}}></div>
        </div>
      </div>
    </div>
  );
};
