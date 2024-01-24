import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useSearchParams } from 'react-router-dom';
import { FilterContext } from './Explore'

const MobileFilter = () => {
    const ratingValues = [5,4,3,2,1]
    const [subCategoryList, setSubCategoryList] = useState([])
    const [sortFilter, setSortFilter, donotApplyFilter, setDonotApplyFilter, selectedCategory, setSelectedCategory,
      selectedRatingCheckbox, setSelectedRatingCheckbox,radius, setRadius,locationFilterValue, setLocationFilterValue,
      places, setPlaces, filterLocationLongLat, setFilterLocationLongLat, currentPage, setCurrentPage, serviceList, setServiceList,
      filteredService, setFilteredService, searchInput, setSearchInput, loadingPage, setLoadingPage, mainServiceList, setMainServiceList,
      rerender, setRerender, selectedCategoryCode, setSelectedCategoryCode  , selectedSubCategory, setSelectedSubCategory, categories, subCategories
  ] = useContext(FilterContext)

    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search')
    const radiusParam = searchParams.get('rd')

    const StyledRating = styled(Rating)({
        '& .MuiRating-iconFilled': {
          color: '#ffa534',
          fontSize: "medium"
        },
        '& .MuiRating-iconHover': {
          color: '#ffa534',
          
        },
        '& .MuiRating-iconEmpty': {
          color: '#ffa534',
          fontSize: "large"
          
        },
    
    });

  // For km radius
    const radiusList = () => {
    const radiusValues = []
    
    for(let i = 1;i<=100;i++)
    {
      radiusValues.push(i)
    }

    return radiusValues
    }


    const showMobileDropdownOptions = () => {
      document.getElementById("Mobileoptions").classList.toggle("hidden");
      document.getElementById("Mobilearrow-up").classList.toggle("hidden");
      document.getElementById("Mobilearrow-down").classList.toggle("hidden");
  }


    
  const showMobileFilterOption = () => {
    document.getElementById("Mobilesort_options").classList.toggle("hidden");
    document.getElementById("Mobilesort_arrow-up").classList.toggle("hidden");
    document.getElementById("Mobilesort_arrow-down").classList.toggle("hidden");
}

    //  Set Selected Sort Filter
    const handleSort = (value) => {
        setDonotApplyFilter(true)
        setSortFilter(value)
    }


    const showMobileSCDropdownOptions = () => {
      document.getElementById("MobileSCoptions").classList.toggle("hidden");
      document.getElementById("SCarrow-up").classList.toggle("hidden");
      document.getElementById("MobileSCarrow-down").classList.toggle("hidden");
  }

    //  Sets the selected Category
    const handleSelectCategory = (value, categoryCode) => {
        setSelectedCategoryCode(categoryCode)
        setDonotApplyFilter(true)
        setSelectedCategory(value)
        setSelectedSubCategory("Select Sub Category")
    }

    // Set the selected checkbox***************************************************************************************
    const handleSelectCheckBox = (selected) => {
        setDonotApplyFilter(true)
        const checkDuplicate = selectedRatingCheckbox.includes(selected)
        if(checkDuplicate)
        {
          // Removes the duplicate and save the new data
          const filtered = selectedRatingCheckbox.filter(selectedCHK => selectedCHK != selected)
          setSelectedRatingCheckbox(filtered)
        }
        // If there is not duplicate
        else
        {
          setSelectedRatingCheckbox((prevSelectedRatingCheckbox) => [...prevSelectedRatingCheckbox, selected]);
        }
    
    }

      // handle the location filter
    const handleLocationFilter = (place) => {
        setDonotApplyFilter(true)
        setLocationFilterValue(place.place_name);setFilterLocationLongLat({longitude : place.geometry.coordinates[0], latitude : place.geometry.coordinates[1]})
    }

    const applyFilter = () => {    
        setServiceList(filteredService) 
    }

    // Clears the filter
    const clearFilter = () => {
        setRadius(1)
        setLoadingPage(true)
        setLocationFilterValue('')
        setDonotApplyFilter(false)
        setSelectedRatingCheckbox([])
        setSelectedCategory('Select Category')
        setSortFilter("Recent Services")
        setServiceList(mainServiceList)
        setFilterLocationLongLat({latitude : 0, longitude : 0})
        setTimeout(()=>{
          setLoadingPage(false)
          setRerender(prevRerender => prevRerender + 1)
        },200)
        
       
    }

    useEffect(()=>{
      if(radiusParam !== null || radiusParam !== '')
      {
        setRadius(Number(radiusParam))
      }
    },[])

    useEffect(()=>{
      if(mainServiceList.length !== 0)
      {
        const categoryCode = categories.find(category => category.name === selectedCategory)?.category_code
        setSelectedCategoryCode(categoryCode)
      }
    },[serviceList])

    useEffect(()=>{
      if(subCategories.length !== 0)
      {
        const filtered = subCategories.filter((subCategory) => subCategory.parent_code === selectedCategoryCode)
        if(filtered)
        {
          setSubCategoryList(filtered)
        }
      }
    
      
    },[selectedCategoryCode])

    const handleSelectSubCategory = (value) => {
      setDonotApplyFilter(true)
      setSelectedSubCategory(value)
    }

  return (
    <div>
     <div className='flex flex-col space-y-5 px-7 mt-10'>
        <h1 className='font-bold text-2xl'>Find your Service</h1>
        {/* Sort box */}
        <div className='flex-none w-full relative'>
        <h1 className='font-medium text-lg mb-2'>Sort By</h1>
        <button onClick={()=>{showMobileFilterOption()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{sortFilter}</span>

        <svg id="sort_arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        <svg id="sort_arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="sort_options" className="hidden ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl">
            <a onClick={()=>{handleSort("Recent Services");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a onClick={()=>{handleSort("Oldest Services");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
            <a onClick={()=>{handleSort("Most Rated");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Most Rated</a>
            <a onClick={()=>{handleSort("Least Rated");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Least Rated</a>
        </div>
        </div>
       
        

        {/* Category Filter */}

        <div className="flex-none w-full relative">
        <h1 className='font-medium text-lg mb-2'>Categories</h1>
        <button onClick={()=>{showMobileDropdownOptions()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{selectedCategory}</span>

        <svg id="arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        <svg id="arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="options" className=" hidden ease-in duration-100 origin-top w-full h-[300px] overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl">
          {
            categories
            .slice() // Create a copy of the array to avoid modifying the original array
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => {
              return (
                <p
                  key={category._id}
                  onClick={() => {
                  handleSelectCategory(category.name, category.category_code)
                  showMobileDropdownOptions();
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white"
                >
                  {category.name}
                </p>
              );
            })
          }   
        </div>
        </div>

        {/* Sub Category Filter */}
        <div className="flex-none w-full relative">
        <h1 className='font-medium text-lg mb-2'>Sub Categories</h1>
        <button onClick={()=>{showMobileSCDropdownOptions()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{selectedSubCategory}</span>

        <svg id="MobileSCarrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        <svg id="MobileSCarrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="MobileSCoptions" className={`hidden ease-in duration-100 origin-top w-full ${subCategoryList.length === 0 ? 'h-fit' : 'h-[300px]'} overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl`}>
          {
          subCategoryList.length === 0 ? 
          <p
                 
                  onClick={() => {
                  showMobileSCDropdownOptions();
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white"
                >
                  Select Sub Category
                </p>
                :
           subCategoryList
            .slice() // Create a copy of the array to avoid modifying the original array
            .sort((a, b) => a?.name.localeCompare(b?.name))
            .map((category) => {
              return (
                <p
                  key={category._id}
                  onClick={() => {
                  handleSelectSubCategory(category?.name)
                  showMobileSCDropdownOptions();
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white"
                >
                  {category?.name}
                </p>
              );
            })
          }   
        </div>
        </div>

        {/* Rating Filter */}
        <div className=' flex flex-col justify-start items-start'>
        <h1 className='font-medium text-lg mb-2'>Rating</h1>
        <div className='flex flex-col space-y-3 items-center'>
        {
        ratingValues.map((rating)=>{
            return (
              
                <div key={rating} className='flex items-center justify-center space-x-2'>
                <input value={rating} checked={selectedRatingCheckbox.includes(Number(rating))} onChange={(e)=>{handleSelectCheckBox(Number(e.target.value))}}  className='chkbox w-5 h-5' type='checkbox'/><StyledRating className='relative'  readOnly defaultValue={rating} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                <p className='w-3'>{rating}.0</p>
                </div>
            )
        })
        }
        
        
        </div>
        </div>

        {/* Location Filter */}
        <div className='flex flex-col space-y-1'>
        <div className="w-full mx-auto  overflow-hidden md:max-w-xl">
        <h1 className='font-medium text-lg mb-2'>Location</h1>
        <div className="md:flex">
        <div className="w-full">
        <div className="relative flex">
        {/* <input type='number' /> */}
        <select value={parseInt(radius)} className='outline-none ps-1 w-[60px] border border-e-0 rounded-s-lg' onChange={(e)=>{setDonotApplyFilter(true);setRadius(Number(e.target.value))}}>
          {
           radiusList().map((radiuss)=>(
            <option value={radiuss} key={radiuss} >{radiuss} km</option>
           ))
          }
        </select>
          <input onFocus={(e)=>{if(e.target.value != ""){document.getElementById('placeDropdown').classList.remove('hidden')}}} value={locationFilterValue} onChange={(e)=>{setLocationFilterValue(e.target.value)}} placeholder="Enter location" type="text" className="bg-white h-10 w-full ps-2 pe-2 text-sm border rounded-lg rounded-s-none focus:outline-none hover:cursor-arrow" />
        </div> 
        </div>
        </div>
        </div>

        <div id='MobileplaceDropdown' className={`${locationFilterValue != "" ? "relative" : "hidden"} bg-white h-44 overflow-auto flex flex-col shadow-sm border rounded-sm`}>
          {
            places.map((place, index)=>{
             return (
              <div key={index} onClick={()=>{handleLocationFilter(place);document.getElementById('MobileplaceDropdown').classList.add('hidden')}} className='m-3 flex flex-col items-start cursor-pointer '>
                <h1 className=' text-sm font-semibold'>{place.text}</h1>
                <p className=' text-[0.72rem]'>{place.place_name}</p>
              </div>
              
             )
            })
          }
          </div>
        </div>

        {/* Buttons */}
        <button onClick={()=>{setCurrentPage(0);document.getElementById('exploreSidebarOpen').className = "w-[300px] h-full transition duration-500 -translate-x-[100%] ease-out exploreSidebarOpen bg-white z-10 absolute";applyFilter();;setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search: searchInput, longitude : filterLocationLongLat.longitude, latitude : filterLocationLongLat.latitude, rd : radius, page : 1})}} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button onClick={()=>{setCurrentPage(0);document.getElementById('exploreSidebarOpen').className = "w-[300px] h-full transition duration-500 -translate-x-[100%] ease-out exploreSidebarOpen bg-white z-10 absolute";setSearchParams({rating :"", category:"", sort : "Recent Services", search, page: 1});clearFilter()}} className='font-medium'>Clear Filters</button>
        </div>
    </div>
  )
}

export default MobileFilter