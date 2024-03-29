import React, { useEffect } from 'react'
import { useState, useContext } from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { FilterContext } from './Explore'



const Filters = () => {
    const ratingValues = [5,4,3,2,1]
    const [subCategoryList, setSubCategoryList] = useState([])
    const [sortFilter, setSortFilter, donotApplyFilter, setDonotApplyFilter, selectedCategory, setSelectedCategory,
        selectedRatingCheckbox, setSelectedRatingCheckbox,radius, setRadius,locationFilterValue, setLocationFilterValue,
        places, setPlaces, filterLocationLongLat, setFilterLocationLongLat, currentPage, setCurrentPage, serviceList, setServiceList,
        filteredService, setFilteredService, searchInput, setSearchInput, loadingPage, setLoadingPage, mainServiceList, setMainServiceList,
        rerender, setRerender, selectedCategoryCode, setSelectedCategoryCode  , selectedSubCategory, setSelectedSubCategory, categories, subCategories
    ] = useContext(FilterContext)
    const [showDropdownOptions, setShowDropdownOptions] = useState(false)
    const [showSCDropdownOptions, setShowSCDropdownOptions] = useState(false)
    const [showSortOptions, setShowSortOptions] = useState(false)
    const [address, setAddress] = useState('');
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
        setSearchInput('')
        setSelectedCategory('Select Category')
        setSortFilter("Recent Services")
        setServiceList(mainServiceList)
        setFilterLocationLongLat({latitude : 0, longitude : 0})
        setSelectedSubCategory("Select Sub Category")
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

    
  const handleChange = address => {
    setAddress(address);
  };

  const handleSelect = address => {
    setAddress(address)
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {setFilterLocationLongLat({longitude : latLng.lng, latitude : latLng.lat})})
      .catch(error => console.error('Error', error));
  };

  return (
    <div>
        <div className='flex flex-col space-y-5 px-7 mt-5'>
        <h1 className='font-bold text-2xl'>Find your Service</h1>
        {/* Sort box */}
        <div className='flex-none w-full relative'>
        <h1 className='font-medium text-lg mb-2'>Sort By</h1>
        <button onClick={()=>{setShowSortOptions(!showSortOptions);setShowDropdownOptions(false);setShowSCDropdownOptions(false)}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{sortFilter}</span>

        <svg id="sort_arrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="sort_options" className={`${showSortOptions ? "" : "hidden"} ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl`}>
            <a onClick={()=>{handleSort("Recent Services");setShowSortOptions(false)}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a onClick={()=>{handleSort("Oldest Services");setShowSortOptions(false)}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
            <a onClick={()=>{handleSort("Most Rated");setShowSortOptions(false)}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Most Rated</a>
            <a onClick={()=>{handleSort("Least Rated");setShowSortOptions(false)}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Least Rated</a>
        </div>
        </div>
       
        

        {/* Category Filter */}
        <div className="flex-none w-full relative">
        <h1 className='font-medium text-lg mb-2'>Categories</h1>
        <button onClick={()=>{setShowDropdownOptions(!showDropdownOptions);setShowSCDropdownOptions(false);setShowSortOptions(false)}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{selectedCategory}</span>
        
        <svg id="arrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="options" className={`${showDropdownOptions ? "" : "hidden"} ease-in duration-100 origin-top w-full h-[300px] overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl`}>
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
                  setShowDropdownOptions(false);
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
        <button onClick={()=>{setShowSCDropdownOptions(!showSCDropdownOptions);setShowDropdownOptions(false);setShowSortOptions(false)}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
        <span className="select-none font-medium">{selectedSubCategory}</span>

        <svg id="SCarrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="SCoptions" className={`${showSCDropdownOptions ? "" : "hidden"} ease-in duration-100 origin-top w-full ${subCategoryList.length === 0 ? 'h-fit' : 'h-[300px]'} overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl`}>
          {
          subCategoryList.length === 0 ? 
          <p
                 
                  onClick={() => {
                  setShowDropdownOptions(false);
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
                  setShowSCDropdownOptions(false);
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
        <div className='flex flex-col space-y-1 relative'>
        <div className="w-full mx-auto  md:max-w-xl">
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
        <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className='w-full '>
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input w-full py-2 px-2 text-sm border rounded-e-md text-gray-600',
            })}
          />
          <div className={`${suggestions.length !== 0 ? "" : "hidden"} absolute z-30 bottom-10 shadow-md rounded-md autocomplete-dropdown-container mt-1 origin-bottom h-[200px] overflow-auto`}>
            {suggestions.map((suggestion, index) => {
              return (
                <div
                className='bg-white'
                key={index}
                {...getSuggestionItemProps(suggestion)}
                >
                  <p className='py-1 px-2 text-sm cursor-pointer '>{suggestion.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </PlacesAutocomplete>
          {/* <input onFocus={(e)=>{if(e.target.value != ""){document.getElementById('placeDropdown').classList.remove('hidden')}}} value={locationFilterValue} onChange={(e)=>{setLocationFilterValue(e.target.value)}} placeholder="Enter location" type="text" className="bg-white h-10 w-full ps-2 pe-2 text-sm border rounded-lg rounded-s-none focus:outline-none hover:cursor-arrow" /> */}
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
        <button onClick={()=>{setCurrentPage(0);applyFilter();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, subCategory : selectedSubCategory, sort : sortFilter, search: searchInput, longitude : filterLocationLongLat.longitude, latitude : filterLocationLongLat.latitude, rd : radius, page : 1})}} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button onClick={()=>{setCurrentPage(0);setSearchParams({rating :"", category:"", subCategory : "", sort : "Recent Services", search, page: 1});clearFilter()}} className='font-medium'>Clear Filters</button>
        </div>
    </div>
  )
}

export default Filters