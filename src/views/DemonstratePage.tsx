import React, {useEffect, useState} from 'react';
import {VirualScroll} from '../components/VirtualScroll.tsx/VirualScroll';
import {Spinner} from '../components/Spinner';

interface Profile {
  about: string;
  address: string;
  company: string;
  dob: string;
  location: {
    lat: number;
    long: number;
  };
  name: string;
}
export interface User {
  username: string;
  email: string;
  id: string;
  profile: Profile;
}

export function DemonstratePage(): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(function () {
    setIsLoading(true);
    fetch('https://api.json-generator.com/templates/JkCYDXMnbh2Y/data', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer e3tb74ovco3fqe5srouorb9ljdbc1md67l8c982l',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((users) => {
        setUsers(users);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className='flex flex-col items-center justify-center w-screen min-h-screen bg-gray-900 p-10'>
      <h1 className='text-lg text-gray-400 font-medium pb-3'>Virtual Scroll</h1>
      {isLoading ? (
        <div
          className='w-full shadow overflow-hidden rounded-lg  bg-gray-800 flex-wrap flex place-content-center '
          style={{height: 378}}>
          <Spinner />
        </div>
      ) : (
        <VirualScroll startIndex={0} itemHeight={56} amount={6} tolerance={3} users={users} />
      )}
    </div>
  );
}
