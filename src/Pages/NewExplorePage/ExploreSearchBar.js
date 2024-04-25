import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const ExploreSearchBar = () => {
    const [searchValue, setSearchValue] = useState('')


  return (
    <div className='w-full flex justify-end lg:justify-start'>

        <div className="w-[50%]  sm:w-fit mr-5 flex space-x-2 shadow-sm self-end lg:self-start rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex w-full">
        <div className="w-full">
        <div className="relative ">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <div className='absolute -right-1 top-[20%] cursor-pointer'>
          <div className={`${searchValue == '' ? 'hidden' : 'block'} group flex relative text-gray-700 top-[25%] right-4`}>
          <button >
          <ClearOutlinedIcon className={``} />
          </button>
          <span className="group-hover:opacity-100 transition-opacity bg-gray-500 px-1 py-1 text-gray-100 whitespace-nowrap rounded-md absolute
          right-6 z-50 top-1 font-light text-xs opacity-0 mx-auto">Clear search result</span>
          </div>
          </div>
          
          <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} id='searchInput' className="bg-white h-12 w-full px-12 border rounded-lg outline-none"  type="text"  placeholder='Search'/>
          
        </div> 
        
        </div>
        </div>
        </div>
    </div>
  )
}

export default ExploreSearchBar