interface SearchField {
  label: string;
  onInput: (event: React.UIEvent<HTMLInputElement>) => void;
}

export function SearchField({label, onInput}: SearchField) {
  return (
    <div className='pb-4 bg-white dark:bg-gray-900'>
      <label htmlFor='table-search' className='sr-only'>
        {label}
      </label>
      <div className='relative mt-1'>
        <div className='absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'>
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
          </svg>
        </div>
        <input
          type='text'
          id='table-search'
          onInput={onInput}
          className='block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          placeholder='Search by username'
        />
      </div>
    </div>
  );
}
