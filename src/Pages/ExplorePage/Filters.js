import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import { categories } from '../MainPage/Components/Categories';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import { FilterContext } from './Explore'



const Filters = () => {
    const ratingValues = [5,4,3,2,1]
    const [sortFilter, setSortFilter, donotApplyFilter, setDonotApplyFilter, selectedCategory, setSelectedCategory,
        selectedRatingCheckbox, setSelectedRatingCheckbox,radius, setRadius,locationFilterValue, setLocationFilterValue,
        places, setPlaces, filterLocationLongLat, setFilterLocationLongLat, currentPage, setCurrentPage, serviceList, setServiceList,
        filteredService, setFilteredService, searchInput, setSearchInput, loadingPage, setLoadingPage, mainServiceList, setMainServiceList,
        rerender, setRerender
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


    const showFilterOption = () => {
        document.getElementById("sort_options").classList.toggle("hidden");
        document.getElementById("sort_arrow-up").classList.toggle("hidden");
        document.getElementById("sort_arrow-down").classList.toggle("hidden");
    }

    //  Set Selected Sort Filter
    const handleSort = (value) => {
        setDonotApplyFilter(true)
        setSortFilter(value)
    }

    const showDropdownOptions = () => {
        document.getElementById("options").classList.toggle("hidden");
        document.getElementById("arrow-up").classList.toggle("hidden");
        document.getElementById("arrow-down").classList.toggle("hidden");
    }

    //  Sets the selected Category
    const handleSelectCategory = (value) => {
        setDonotApplyFilter(true)
        setSelectedCategory(value)
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
        setSearchInput('')
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
  return (
    <div>
        <div className='flex flex-col space-y-5 px-7 mt-5'>
        <h1 className='font-bold text-2xl'>Find your Service</h1>
        {/* Sort box */}
        <div className='flex-none w-full relative'>
        <h1 className='font-medium text-lg mb-2'>Sort By</h1>
        <button onClick={()=>{showFilterOption()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{sortFilter}</span>

        <svg id="sort_arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        <svg id="sort_arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="sort_options" className="hidden ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl">
            <a onClick={()=>{handleSort("Recent Services");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a onClick={()=>{handleSort("Oldest Services");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
            <a onClick={()=>{handleSort("Most Rated");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Most Rated</a>
            <a onClick={()=>{handleSort("Least Rated");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Least Rated</a>
        </div>
        </div>
       
        

        {/* Category Filter */}

        <div className="flex-none w-full relative">
        <h1 className='font-medium text-lg mb-2'>Categories</h1>
        <button onClick={()=>{showDropdownOptions()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{selectedCategory}</span>

        <svg id="arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        <svg id="arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="options" className=" hidden ease-in duration-100 origin-top w-full h-[300px] overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl">
          {
            categories
            .slice() // Create a copy of the array to avoid modifying the original array
            .sort((a, b) => a.category_name.localeCompare(b.category_name))
            .map((category) => {
              return (
                <p
                  key={category.id}
                  onClick={() => {
                  handleSelectCategory(category.category_name)
                  showDropdownOptions();
                  }}
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white"
                >
                  {category.category_name}
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
       
        <select value={radius} className='outline-none ps-1 w-[60px] border border-e-0 rounded-s-lg' onChange={(e)=>{setDonotApplyFilter(true);setRadius(Number(e.target.value))}}>
          {
           radiusList().map((radius)=>(
            <option value={radius} key={radius} >{radius} km</option>
           ))
          }
        </select>
          <input onFocus={(e)=>{if(e.target.value != ""){document.getElementById('placeDropdown').classList.remove('hidden')}}} value={locationFilterValue} onChange={(e)=>{setLocationFilterValue(e.target.value)}} placeholder="Enter location" type="text" className="bg-white h-10 w-full ps-2 pe-2 text-sm border rounded-lg rounded-s-none focus:outline-none hover:cursor-arrow" />
        </div> 
        </div>
        </div>
        </div>

        <div id='placeDropdown' className={`${locationFilterValue != "" ? "relative" : "hidden"} bg-white h-44 overflow-auto flex flex-col shadow-sm border rounded-sm`}>
          {
            places.map((place, index)=>{
             return (
              <div key={index} onClick={()=>{handleLocationFilter(place);document.getElementById('placeDropdown').classList.add('hidden')}} className='m-3 flex flex-col items-start cursor-pointer '>
                <h1 className=' text-sm font-semibold'>{place.text}</h1>
                <p className=' text-[0.72rem]'>{place.place_name}</p>
              </div>
              
             )
            })
          }
          </div>
        </div>

        {/* Buttons */}
        <button onClick={()=>{setCurrentPage(0);applyFilter();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search: searchInput, longitude : filterLocationLongLat.longitude, latitude : filterLocationLongLat.latitude, rd : radius, page : 1})}} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button onClick={()=>{setCurrentPage(0);setSearchParams({rating :"", category:"", sort : "Recent Services", search, page: 1});clearFilter()}} className='font-medium'>Clear Filters</button>
        </div>
    </div>
  )
}

export default Filters