import {ReactElement} from 'react';
import {CharacterData} from './VirualScroll';
import {Avatar} from './Avatar';

interface RowProps {
  character: CharacterData;
  height: number;
}

export function Row(props: RowProps): ReactElement {
  return (
    <tr className='text-white w-full flex gap-4' style={{height: `${props.height}`}}>
      <td className='w-12 px-6 py-4 whitespace-nowrap'>
        <Avatar image={props.character.image} size={40} />
      </td>
      <td className='w-1/4 px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis'>{props.character.name}</td>
      <td className='w-1/4 px-6 py-4 whitespace-nowrap'>{props.character.status}</td>
      <td className='w-1/4 px-6 py-4 whitespace-nowrap'>{props.character.species}</td>
      <td className='w-1/4 px-6 py-4 whitespace-nowrap'>{props.character.gender}</td>
    </tr>
  );
}
