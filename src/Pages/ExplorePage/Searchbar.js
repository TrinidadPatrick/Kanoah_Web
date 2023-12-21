import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { FilterContext } from './Explore'

const Searchbar = () => {
    const [sortFilter, setSortFilter, donotApplyFilter, setDonotApplyFilter, selectedCategory, setSelectedCategory,
        selectedRatingCheckbox, setSelectedRatingCheckbox,radius, setRadius,locationFilterValue, setLocationFilterValue,
        places, setPlaces, filterLocationLongLat, setFilterLocationLongLat, currentPage, setCurrentPage, serviceList, setServiceList,
        filteredService, setFilteredService, searchInput, setSearchInput, loadingPage, setLoadingPage, mainServiceList, setMainServiceList,
        rerender, setRerender
    ] = useContext(FilterContext)
    const [searchValue, setSearchValue] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search')

  
      // Handle Submit search
      const handleSubmitSearch = () => {

        if(searchValue !== undefined && searchValue !== '')
        {
          setSearchInput(searchValue)
          // const result = serviceList.length === 0 ?
          // filteredService.filter((item) =>
          // item.basicInformation.ServiceTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
          // item.tags.some((tag) => tag.toLowerCase().includes(searchValue.toLowerCase())))
          // :
          // serviceList.filter((item) =>
          // item.basicInformation.ServiceTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
          // item.tags.some((tag) => tag.toLowerCase().includes(searchValue.toLowerCase())))
          // setServiceList(result)
        }
       
      }

      const clearResult = () => {
        setServiceList(mainServiceList)
        setSearchInput('')
        setSearchValue('')
        setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search : '', page : 1})
        
      }

      useEffect(()=>{
        setSearchValue(search)
      },[])

  
  return (
    <div className='w-full flex justify-end lg:justify-start'>
        <h1 className={`${serviceList.length === 0 ? "block" : "hidden"} w-full text-center text-2xl`}>No Result</h1>
        <div className="w-[50%]  sm:w-fit mr-5 flex space-x-2 shadow-sm self-end lg:self-start rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex w-full">
        <div className="w-full">
        <div className="relative ">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <div className='absolute -right-1 top-[20%] cursor-pointer'>
          <div className={`${searchInput == '' ? 'hidden' : 'block'} group flex relative text-gray-700 top-[25%] right-4`}>
          <button onClick={()=>clearResult()}>
          <ClearOutlinedIcon className={``} />
          </button>
          <span className="group-hover:opacity-100 transition-opacity bg-gray-500 px-1 py-1 text-gray-100 whitespace-nowrap rounded-md absolute
          right-6 z-50 top-1 font-light text-xs opacity-0 mx-auto">Clear search result</span>
          </div>
          </div>
          
          {/* <button className={`${searchInput == '' ? 'hidden' : 'block'} absolute text-gray-700 top-[25%] right-4`}>
          <ClearOutlinedIcon className={``} />
          </button> */}
          <input value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} id='searchInput' className="bg-white h-12 w-full px-12 border rounded-lg outline-none" onKeyDown={(e)=>{if(e.key == "Enter"){handleSubmitSearch();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search : e.target.value, page : 1})}}} type="text"  placeholder='Search'/>
          
        </div> 
        
        </div>
        </div>
        </div>
    </div>
  )
}

export default Searchbar