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

interface dataItem {
  index: number;
  text: string;
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
  const data: Array<dataItem> = [];
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
  const [state, setState] = useState(() => setInitialState(props));
  const viewportRef = useRef<HTMLDivElement>(null);

  const getData = (offset: number, limit: number) => {
    console.log('getData');
    const data: Array<dataItem> = [];
    const start = Math.max(props.minIndex, offset);
    const end = Math.min(offset + limit - 1, props.maxIndex);
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        data.push({index: i, text: `item ${i}`});
      }
    }
    console.log('data', data);
    return data;
  };

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    const {totalHeight, toleranceHeight, bufferedItems} = state;
    const index = props.minIndex + Math.floor((event.currentTarget.scrollTop - toleranceHeight) / props.itemHeight);
    const data = getData(index, bufferedItems);
    const topPaddingHeight = Math.max((index - props.minIndex) * props.itemHeight, 0);
    const bottomPaddingHeight = Math.max(totalHeight - topPaddingHeight - data.length * props.itemHeight, 0);

    setState({
      ...state,
      topPaddingHeight,
      bottomPaddingHeight,
      data,
    });
    console.log(state);
  }
  useEffect(() => {
    if (viewportRef.current !== null) {
      if (state.initialPosition === 0) {
        const fakeEvent = {
          currentTarget: {
            scrollTop: 0,
          },
        } as React.UIEvent<HTMLDivElement>;
        handleScroll(fakeEvent);
      } else {
        console.log('else', state.initialPosition);
        viewportRef.current.scrollTop = state.initialPosition;
      }
    }
  }, []);

  return (
    <div
      className='overflow-y-auto w-full flex-col'
      style={{height: state.viewportHeight}}
      ref={viewportRef}
      onScroll={handleScroll}>
      <div style={{height: state.topPaddingHeight}}></div>
      {state.data.map((rowData) => {
        return <Row key={rowData.index} index={rowData.index} text={rowData.text} />;
      })}
      <div style={{height: state.bottomPaddingHeight}}></div>
    </div>
  );
};
