import React from 'react'
import { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FilterContext } from './Explore'

const Searchbar = () => {
    const [sortFilter, setSortFilter, donotApplyFilter, setDonotApplyFilter, selectedCategory, setSelectedCategory,
        selectedRatingCheckbox, setSelectedRatingCheckbox,radius, setRadius,locationFilterValue, setLocationFilterValue,
        places, setPlaces, filterLocationLongLat, setFilterLocationLongLat, currentPage, setCurrentPage, serviceList, setServiceList,
        filteredService, setFilteredService, searchInput, setSearchInput, loadingPage, setLoadingPage, mainServiceList, setMainServiceList,
        rerender, setRerender
    ] = useContext(FilterContext)

    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search')

    // Handle the search Input
    const handleSearchInput = (input) => {
        setSearchInput(input)
      }
  
      // Handle Submit search
      const handleSubmitSearch = () => {
        const result = serviceList.length === 0 ?
        filteredService.filter((item) =>
        item.basicInformation.ServiceTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchInput.toLowerCase())))
        :
        serviceList.filter((item) =>
        item.basicInformation.ServiceTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchInput.toLowerCase())))
        setServiceList(result)
      }
  return (
    <div>
        <h1 className={`${serviceList.length === 0 ? "block" : "hidden"} w-full tra text-center text-2xl`}>No Result</h1>
        <div className="w-[50%] sm:w-fit mr-5 flex space-x-2 shadow-sm self-end lg:self-start rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex w-full">
        <div className="w-full">
        <div className="relative">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <input className="bg-white h-12 w-full px-12 border rounded-lg focus:outline-none hover:cursor-arrow" value={searchInput} onChange={(e)=>{handleSearchInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter"){handleSubmitSearch();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search :searchInput, page : 1})}}} type="text"  placeholder='Search'/>
        </div> 
        
        </div>
        </div>
        </div>
    </div>
  )
}

export default Searchbar