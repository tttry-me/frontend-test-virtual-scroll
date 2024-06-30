import {ReactElement} from 'react';

interface AvatarProps {
  image: string;
  size?: number;
}

export function Avatar(props: AvatarProps): ReactElement {
  const {image, size = 48} = props;

  return (
    <div
      className='rounded-full overflow-hidden'
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}>
      <img src={image} alt='Character Avatar' className='w-full h-full object-cover' />
    </div>
  );
}
