import {ReactElement} from 'react';

export function Row(props: {index: number; text: string}): ReactElement {
  return (
    <tr className='text-white w-full'>
      <td>{props.text}</td>
    </tr>
  );
}
