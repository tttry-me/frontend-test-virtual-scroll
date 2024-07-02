import {ReactElement, useState} from 'react';
import {SortButton} from './SortButton';

interface TheadProps {
  onUpdateSortField: (label: 'company' | 'name' | 'username', direction: 'up' | 'down') => void;
  onRemoveSortField: () => void;
}

export function Thead({onUpdateSortField, onRemoveSortField}: TheadProps): ReactElement {
  const [state, setState] = useState<{[key: string]: {isUsedToSort: boolean; direction: 'up' | 'down'}}>({
    username: {
      isUsedToSort: false,
      direction: 'up',
    },
    name: {
      isUsedToSort: false,
      direction: 'up',
    },
    company: {
      isUsedToSort: false,
      direction: 'up',
    },
  });

  const getSetSortFieldByClickHandler = (label: 'company' | 'name' | 'username') => {
    return () => {
      setState((prevState) => {
        return Object.keys(prevState).reduce(
          (acc, key) => {
            acc[key] = {
              ...acc[key],
              isUsedToSort: key === label,
            };
            return acc;
          },
          {...prevState}
        );
      });
      onUpdateSortField(label, state[label].direction);
    };
  };

  const getRemoveSortFieldByClickHandler = (label: 'company' | 'name' | 'username') => {
    return () => {
      setState((prevState) => {
        return Object.keys(prevState).reduce(
          (acc, key) => {
            if (key === label) {
              acc[key] = {
                ...acc[key],
                isUsedToSort: false,
              };
            }
            return acc;
          },
          {...prevState}
        );
      });
      onRemoveSortField();
    };
  };

  const getToggleDirectionSortHandler = (label: 'company' | 'name' | 'username') => {
    return () => {
      let newDirection: 'up' | 'down' = 'down';
      const updState = Object.keys(state).reduce(
        (acc, key) => {
          if (key === label) {
            newDirection = acc[key].direction === 'up' ? 'down' : 'up';
            acc[key] = {
              ...acc[key],
              direction: newDirection,
            };
          }
          return acc;
        },
        {...state}
      );
      setState({...updState});
      onUpdateSortField(label, newDirection);
    };
  };

  return (
    <div className='flex flex-grow-0 bg-gray-800 text-gray-200 text-xs uppercase font-medium border-b-gray-950 border-b-2'>
      <div className='w-1/4 px-5 py-3 tracking-wide flex flex-nowrap place-content-center'>
        <span
          className='tracking-wide cursor-pointer'
          onClick={getSetSortFieldByClickHandler('username')}
          onDoubleClick={getRemoveSortFieldByClickHandler('username')}>
          UserName
        </span>
        {state.username.isUsedToSort ? (
          <SortButton direction={state.username.direction} handlerOnClick={getToggleDirectionSortHandler('username')} />
        ) : null}
      </div>
      <div className='w-1/4 px-5 py-3 tracking-wide flex flex-nowrap place-content-center'>
        <span
          className='tracking-wide cursor-pointer'
          onClick={getSetSortFieldByClickHandler('name')}
          onDoubleClick={getRemoveSortFieldByClickHandler('name')}>
          Name
        </span>
        {state.name.isUsedToSort ? (
          <SortButton direction={state.username.direction} handlerOnClick={getToggleDirectionSortHandler('username')} />
        ) : null}
      </div>
      <div className='w-1/4 px-5 py-3 tracking-wide flex flex-nowrap place-content-center'>Email</div>
      <div className='w-1/4 px-5 py-3 tracking-wide flex flex-nowrap place-content-center'>Dob</div>
      <div className='w-1/4 px-5 py-3 tracking-wide flex flex-nowrap place-content-center'>
        <span
          className='tracking-wide cursor-pointer'
          onClick={getSetSortFieldByClickHandler('company')}
          onDoubleClick={getRemoveSortFieldByClickHandler('company')}>
          Company
        </span>
        {state.company.isUsedToSort ? (
          <SortButton direction={state.username.direction} handlerOnClick={getToggleDirectionSortHandler('username')} />
        ) : null}
      </div>
      <div className='w-1/4 px-5 py-3 tracking-wide flex flex-nowrap place-content-center'>Address</div>
    </div>
  );
}
