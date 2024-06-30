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
}

const setInitialState = ({minIndex, maxIndex, startIndex, itemHeight, amount, tolerance}: VirtualScrollProps) => {
  const viewportHeight = amount * itemHeight;
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
  const toleranceHeight = tolerance * itemHeight;
  const bufferHeight = viewportHeight + 2 * toleranceHeight;
  const bufferedItems = amount + 2 * tolerance;
  const itemsAbove = startIndex - tolerance - minIndex;
  const topPaddingHeight = itemsAbove * itemHeight;
  const bottomPaddingHeight = totalHeight - topPaddingHeight;
  const initialPosition = topPaddingHeight + toleranceHeight;
  const data: Array<CharacterData> = [];
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
  };
};

export const VirualScroll: React.FC<VirtualScrollProps> = (props) => {
  const viewportHeight = props.amount * props.itemHeight;
  const [state, setState] = useState(() => setInitialState(props));
  const viewportRef = useRef<HTMLTableSectionElement>(null);

  async function getData(offset: number, limit: number) {
    const data: Array<CharacterData> = [];
    const start = Math.max(props.minIndex, offset);
    const end = Math.min(offset + limit - 1, props.maxIndex);
    if (start <= end) {
      try {
        for (let i = start; i <= end; i++) {
          const {name, status, species, gender, image} = await fetch(
            `https://rickandmortyapi.com/api/character/${i}`
          ).then((response) => response.json());
          data.push({name, status, species, gender, image});
        }
      } catch (err) {
        console.error(err);
      }
    }
    return data;
  }

  async function handleScroll(event: React.UIEvent<HTMLTableSectionElement>) {
    const {totalHeight, toleranceHeight, bufferedItems} = state;
    const index = props.minIndex + Math.floor((event.currentTarget.scrollTop - toleranceHeight) / props.itemHeight);
    const data = await getData(index, bufferedItems);
    const topPaddingHeight = Math.max((index - props.minIndex) * props.itemHeight, 0);
    const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * props.itemHeight, 0);

    setState({
      ...state,
      topPaddingHeight,
      bottomPaddingHeight,
      data,
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
    <div className='w-1/2 shadow overflow-hidden rounded-lg'>
      <table className='w-full'>
        <thead className='bg-gray-800 text-gray-200 text-xs uppercase font-medium border-b-gray-950 border-b-2'>
          <tr className='block'>
            <th scope='col' className='px-5 py-3 tracking-wide'>
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
            return <Row key={character.name} character={character} height={props.itemHeight} />;
          })}
          <tr style={{height: state.bottomPaddingHeight}}></tr>
        </tbody>
      </table>
    </div>
  );
};
