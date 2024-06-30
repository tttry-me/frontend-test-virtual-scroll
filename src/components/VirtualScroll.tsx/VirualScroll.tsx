import React, {useEffect, useRef, useState} from 'react';
import {Row} from './Row';

interface VirtualScrollProps {
  minIndex: number;
  maxIndex: number;
  startIndex: number;
  itemHeight: number;
  amount: number;
  tolerance: number;
}

export interface CharacterData {
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  key: string;
}

const setInitialState = (
  {minIndex, startIndex, itemHeight, tolerance}: VirtualScrollProps,
  totalHeight: number,
  toleranceHeight: number
) => {
  const itemsAbove = startIndex - tolerance - minIndex;
  const topPaddingHeight = itemsAbove * itemHeight;
  const bottomPaddingHeight = totalHeight - topPaddingHeight;
  const data: Array<CharacterData> = [];
  const initialPosition = topPaddingHeight + toleranceHeight;

  return {
    topPaddingHeight,
    bottomPaddingHeight,
    data,
    initialPosition,
  };
};

const Spinner: React.FC = () => {
  return (
    <div role='status' className='absolute left-1/2 top-1/2'>
      <svg
        aria-hidden='true'
        className='w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};
export const VirualScroll: React.FC<VirtualScrollProps> = (props) => {
  const {itemHeight, amount, maxIndex, minIndex, tolerance} = props;
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
  const toleranceHeight = tolerance * itemHeight;
  const viewportHeight = amount * itemHeight;
  const bufferedItems = amount + 2 * tolerance;
  const [state, setState] = useState(() => setInitialState(props, totalHeight, toleranceHeight));
  const viewportRef = useRef<HTMLTableSectionElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getData(offset: number, limit: number) {
    const data: Array<CharacterData> = [];
    const start = Math.max(props.minIndex, offset);
    const end = Math.min(offset + limit - 1, props.maxIndex);
    if (start <= end) {
      try {
        for (let i = start; i <= end; i++) {
          const {name, status, species, gender, image, created} = await fetch(
            `https://rickandmortyapi.com/api/character/${i}`
          ).then((response) => response.json());
          const key = created + name;
          data.push({name, status, species, gender, image, key});
        }
      } catch (err) {
        console.error(err);
      }
    }
    return data;
  }

  async function handleScroll(event: React.UIEvent<HTMLTableSectionElement>) {
    const index = props.minIndex + Math.floor((event.currentTarget.scrollTop - toleranceHeight) / props.itemHeight);
    setIsLoading(true);
    const data = await getData(index, bufferedItems);

    window.requestAnimationFrame(() => {
      const topPaddingHeight = Math.floor((index - props.minIndex) * props.itemHeight);
      const bottomPaddingHeight = Math.floor(totalHeight - topPaddingHeight - data.length * props.itemHeight);

      setState({
        ...state,
        topPaddingHeight,
        bottomPaddingHeight,
        data,
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });
  }

  useEffect(() => {
    if (viewportRef.current !== null) {
      if (state.initialPosition === 0) {
        const fakeEvent = {
          currentTarget: {
            scrollTop: 0,
          },
        } as React.UIEvent<HTMLTableSectionElement>;
        handleScroll(fakeEvent);
      } else {
        viewportRef.current.scrollTop = state.initialPosition;
      }
    }
  }, []);

  return (
    <div className='w-1/2 shadow overflow-hidden rounded-lg relative'>
      {isLoading ? <Spinner /> : null}
      <table className='w-full'>
        <thead className='bg-gray-800 text-gray-200 text-xs uppercase font-medium border-b-gray-950 border-b-2'>
          <tr className='flex gap-4'>
            <th scope='col' className='w-1/4  px-5 py-3 tracking-wide'>
              Avatar
            </th>
            <th scope='col ' className='w-1/4 px-5 py-3 text-left tracking-wider'>
              Name
            </th>
            <th scope='col' className='w-1/4 px-5 py-3 text-left tracking-wider'>
              Status
            </th>
            <th scope='col' className='w-1/4 px-5 py-3 text-left tracking-wider'>
              Species
            </th>
            <th scope='col' className='w-1/4 px-5 py-3 text-left tracking-wider'>
              Gender
            </th>
          </tr>
        </thead>
        <tbody
          className='overflow-y-auto block w-full flex-col bg-gray-800'
          style={{height: viewportHeight}}
          ref={viewportRef}
          onScroll={handleScroll}>
          <tr style={{height: state.topPaddingHeight}}></tr>
          {state.data.map((character) => {
            return <Row key={character.key} character={character} height={props.itemHeight} />;
          })}
          <tr style={{height: state.bottomPaddingHeight}}></tr>
        </tbody>
      </table>
    </div>
  );
};
