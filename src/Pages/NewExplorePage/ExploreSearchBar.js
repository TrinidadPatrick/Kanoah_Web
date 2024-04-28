import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useSearchParams } from 'react-router-dom';

const ExploreSearchBar = ({ searchValue, setSearchValue }) => {
  const [params, setParams] = useSearchParams()
  const searchParam = params.get('search') || ''
  const [search, setSearch] = useState('')
  const sortParam = params.get('sort') || 'Recent Services'
  const categoryParam = params.get('category') || ''
  const subCategoryParam = params.get('subCategory') || ''
  const ratingParam = params.get('rating') || ''
  const latitudeParam = params.get('latitude') || ''
  const longitudeParam = params.get('longitude') || ''
  const addressParam = params.get('address') || ''
  const radParam = params.get('rad') || 1

  useEffect(()=>{
    setSearch(searchParam)
  },[])

  const submitSearch= () => {

    setParams({...params, sort : sortParam ,category : categoryParam, 
      subCategory : subCategoryParam, rating : ratingParam, latitude : latitudeParam, 
      longitude : longitudeParam, rad : radParam, address : addressParam, search : search, page : 1})

      setSearchValue(search)
  }

  const clearSearch = () => {
    setParams({...params, sort : sortParam ,category : categoryParam, 
      subCategory : subCategoryParam, rating : ratingParam, latitude : latitudeParam, 
      longitude : longitudeParam, rad : radParam, address : addressParam, search : '', page : 1})
    setSearch('');setSearchValue('')
  }

  return (
    <div className='w-full ps-3 flex justify-end lg:justify-start'>

        <div className="w-[50%]  sm:w-fit mr-5 flex space-x-2 shadow-sm self-end lg:self-start rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex w-full">
        <div className="w-full">
        <div className="relative ">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <div className='absolute -right-1 top-[20%] cursor-pointer'>
          <div className={`${search == '' ? 'hidden' : 'block'} group flex relative text-gray-700 top-[25%] right-4`}>
          <button onClick={()=>{clearSearch()}} >
          <ClearOutlinedIcon className={``} />
          </button>
          <span className="group-hover:opacity-100 transition-opacity bg-gray-500 px-1 py-1 text-gray-100 whitespace-nowrap rounded-md absolute
          right-6 z-50 top-1 font-light text-xs opacity-0 mx-auto">Clear search result</span>
          </div>
          </div>
          <input value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e)=>{if(e.key === "Enter"){submitSearch()}}} id='searchInput' className="bg-white h-12 w-full px-12 border rounded-lg outline-none"  type="text"  placeholder='Search'/>
        </div> 
        
        </div>
        </div>
        </div>
    </div>
  )
}

export default ExploreSearchBar