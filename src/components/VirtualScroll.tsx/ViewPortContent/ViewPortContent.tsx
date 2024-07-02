import {ReactElement} from 'react';
import {Row} from './Row';
import {RowData} from '../VirualScroll';

interface ViewPortContentProps {
  rowsData: Array<RowData>;
  itemHeight: number;
  isEmpty: boolean;
}

export function ViewPortContent({rowsData, itemHeight, isEmpty}: ViewPortContentProps): ReactElement {
  return (
    <div className='flex flex-col'>
      {!isEmpty ? (
        rowsData.map((rowData) => {
          if (rowData != null) {
            return <Row key={rowData.id} data={rowData} height={itemHeight} />;
          } else {
            return null;
          }
        })
      ) : (
        <div className='text-gray-500 text-lg absolute left-1/2 top-1/2 uppercase tracking-wide'>Empty</div>
      )}
    </div>
  );
}
