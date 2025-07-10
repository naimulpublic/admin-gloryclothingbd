import React from 'react'

function SearchInput() {
  return (
    <div className='flex items-center gap-2 '>
      <input type="search" placeholder="Search..." className='w-full h-10 px-4 rounded-md bg-gray-50 border border-gray-300'/>
    </div>
  )
}

export default SearchInput