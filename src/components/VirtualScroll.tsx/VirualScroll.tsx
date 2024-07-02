import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {Row} from './Row';
import {User} from '../../views/DemonstratePage';
import {Thead} from './thead/Thead';

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
  const viewPortContentData: Array<RowData> = [];
  return {
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    viewPortContentData,
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
  viewPortContentData: Array<RowData>;
  maxIndex: number;
  minIndex: number;
}

function uploadUsersData(users: Array<User>): Array<RowData> {
  return users.map((user) => {
    const {
      username,
      email,
      id,
      profile: {name, company, dob, address},
    } = user;
    return {username, email, id, name, company, dob, address};
  });
}

function ViewPortContent({rowsData, itemHeight}: {rowsData: Array<RowData>; itemHeight: number}): ReactElement {
  return (
    <div className='flex flex-col'>
      {rowsData.map((rowData) => {
        return <Row key={rowData.id} data={rowData} height={itemHeight} />;
      })}
    </div>
  );
}

export const VirualScroll: React.FC<VirtualScrollProps> = (props) => {
  const [rowsData, setRowsData] = useState(() => uploadUsersData(props.users));
  const [state, setState] = useState<VirtualScrollState>(() => setInitialState(props, props.users.length));
  const viewportRef = useRef<HTMLTableSectionElement>(null);
  let currentIndex = 0;

  function onUpdateSortField(rowDataOption: 'company' | 'name' | 'username', direction: 'up' | 'down') {
    console.log('onUpdateSortField', direction, rowDataOption);
    const sortedRowsData = rowsData.slice().sort((a, b) => {
      const aValue = a[rowDataOption];
      const bValue = b[rowDataOption];

      if (aValue < bValue) {
        return direction === 'up' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'up' ? 1 : -1;
      }
      return 0;
    });
    setRowsData([...sortedRowsData]);
    const curData = getViewPortContentData(sortedRowsData, currentIndex, state.bufferedItems);
    setState({
      ...state,
      viewPortContentData: [...curData],
    });
  }

  function onRemoveSortField() {
    setRowsData(uploadUsersData(props.users));
  }

  function getViewPortContentData(rowsData: Array<RowData>, offset: number, limit: number) {
    const data: Array<RowData> = [];
    const start = Math.max(state.minIndex, offset);
    const end = Math.min(offset + limit - 1, state.maxIndex);
    if (start <= end) {
      for (let i = start; i <= end; i++) {
        data.push(rowsData[i]);
      }
    }
    return data;
  }

  function handleScroll(event: React.UIEvent<HTMLTableSectionElement>) {
    currentIndex =
      state.minIndex + Math.floor((event.currentTarget.scrollTop - state.toleranceHeight) / props.itemHeight);
    const viewPortContentData = getViewPortContentData(rowsData, currentIndex, state.bufferedItems);
    if (viewPortContentData != undefined) {
      window.requestAnimationFrame(() => {
        const topPaddingHeight = Math.max((currentIndex - state.minIndex) * props.itemHeight);
        const bottomPaddingHeight = Math.max(
          state.totalHeight - topPaddingHeight - viewPortContentData.length * props.itemHeight
        );

        setState({
          ...state,
          topPaddingHeight,
          bottomPaddingHeight,
          viewPortContentData,
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
      handleScroll(fakeEvent);
    }
  }, []);

  return (
    <div className='w-full shadow overflow-hidden rounded-lg relative'>
      <div className='w-full'>
        <Thead onUpdateSortField={onUpdateSortField} onRemoveSortField={onRemoveSortField} />
        <div
          className='overflow-y-auto block w-full bg-gray-800'
          style={{height: state?.viewportHeight}}
          ref={viewportRef}
          onScroll={handleScroll}>
          <div style={{height: state?.topPaddingHeight}}></div>
          <ViewPortContent rowsData={state.viewPortContentData} itemHeight={props.itemHeight} />
          <div style={{height: state?.bottomPaddingHeight}}></div>
        </div>
      </div>
    </div>
  );
};
