import React from 'react'
import { useState } from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import useCategory from '../../ClientCustomHook/CategoryProvider';
import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';
import { useSearchParams } from 'react-router-dom';

const ExploreFilter = () => {
    const [params, setParams] = useSearchParams()
    const radiusList = Array.from({length : 100}, (_, index)=> index + 1)
    const ratingValues = [5,4,3,2,1]
    const {categories, subCategories} = useCategory()
    const [selectedSortFilter, setSelectedSortFilter] = useState('Recent Services')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState({name : '', code : ''})
    const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState('')
    const [selectedRatingCheckbox, setSelectedRatingCheckbox] = useState([])
    const [locationFilter, setLocationFilter] = useState({address : '', longitude : 0, latitude : 0})
    const [radius, setRadius] = useState(1)
    const [showDropdowns, setShowDropdowns] = useState({sort : false, category : false, subCategory : false})

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

    //  Sets the selected Category
    const handleSelectCategory = (value, categoryCode) => {
            setSelectedCategoryFilter({name : value, code : categoryCode})
            setSelectedSubCategoryFilter('')
    }

    //  Sets the selected SubCategory
    const handleSelectSubCategory = (value) => {
        setSelectedSubCategoryFilter(value)
    }

    // Set the selected checkbox
    const handleSelectCheckBox = (selected) => {
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

    const handleChange = (addressValue) => {
        setLocationFilter({...locationFilter, address : addressValue});
    };

    const handleSelect = address => {
        // setLocationFilterValue(address)
        geocodeByAddress(address)
          .then(results => getLatLng(results[0]))
          .then(latLng => {setLocationFilter({address, longitude : latLng.lng, latitude : latLng.lat})})
          .catch(error => console.error('Error', error));
    };

    const applyFilter = () => {
        setParams({category : selectedCategoryFilter.name})
    }

  return (
    <div className='filterSideBar w-[400px] hidden lg:flex h-full relative flex-col space-y-3 pb-5 lg:ps-20 pe-5 bg-[#f9f9f9]'>
        <div className='filterSideBar flex-1 flex flex-col space-y-5 px-7 mt-5 overflow-auto'>
            <h1 className='font-bold text-2xl'>Find your Service</h1>
            {/* Sort box */}
            <div className='flex-none w-full relative'>
            <h1 className='font-medium text-lg mb-2'>Sort By</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, sort : !showDropdowns.sort})}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{selectedSortFilter}</span>
            <svg id="sort_arrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <div id="sort_options" className={`${showDropdowns.sort ? "" : "hidden"} ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl`}>
            <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
            <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Most Rated</a>
            <a className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Least Rated</a>
            </div>
            </div>
            {/* Category Box */}
            <div className='flex-none w-full relative'>
            <h1 className='font-medium text-lg mb-2'>Categories</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, category : !showDropdowns.category})}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{selectedCategoryFilter.name === "" ? "Select Category" : selectedCategoryFilter.name}</span>
            <svg id="sort_arrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <div id="sort_options" className={`${showDropdowns.category ? "" : "hidden"} h-[300px] overflow-auto  ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl`}>
                {
                categories
                .slice() // Create a copy of the array to avoid modifying the original array
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => {
                return (
                    <button
                    key={category._id}
                    onClick={() => {
                    handleSelectCategory(category.name, category.category_code)
                    setShowDropdowns({...showDropdowns, category : false});
                    }}
                    className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white"
                    >
                    {category.name}
                    </button>
                    );
                })
                }  
            </div>
            </div>
            {/* SubCategory Box */}
            <div className='flex-none w-full relative'>
            <h1 className='font-medium text-lg mb-2'>Sub Categories</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, subCategory : !showDropdowns.subCategory})}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{selectedSubCategoryFilter === "" ? "Select SubCategory" : selectedSubCategoryFilter}</span>
            <svg id="sort_arrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <div id="sort_options" className={`${showDropdowns.subCategory ? "" : "hidden"} max-h-[300px] overflow-auto  ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl`}>
                {
                subCategories?.filter((subCategory) => subCategory.parent_code === selectedCategoryFilter.code)
                .slice() // Create a copy of the array to avoid modifying the original array
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => {
                return (
                    <button
                    key={category._id}
                    onClick={() => {
                    handleSelectSubCategory(category.name)
                    setShowDropdowns({...showDropdowns, subCategory : false});
                    }}
                    className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white"
                    >
                    {category.name}
                    </button>
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
            )})
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
            <select value={radius} className='outline-none ps-1 w-[60px] border border-e-0 rounded-s-lg' onChange={(e)=>{setRadius(Number(e.target.value))}}>
            {
            radiusList.map((radius)=>(
                <option value={radius} key={radius} >{radius} km</option>
            ))
            }
            </select>
            <PlacesAutocomplete value={locationFilter.address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className='w-full '>
                    <input {...getInputProps({placeholder: 'Search Places ...', className: 'location-search-input w-full py-2 px-2 text-sm border rounded-e-md text-gray-600',})}/>
                <div className={`${suggestions.length !== 0 ? "" : "hidden"} absolute z-30 bottom-10 shadow-md rounded-md autocomplete-dropdown-container mt-1 origin-bottom h-[200px] overflow-auto`}>
                {suggestions.map((suggestion, index) => {
                return (
                <div className='bg-white' key={index} {...getSuggestionItemProps(suggestion)}>
                  <p className='py-1 px-2 text-sm cursor-pointer '>{suggestion.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </PlacesAutocomplete>
        </div> 
        </div>
        </div>
        </div>
            </div>
            {/* Buttons */}
            <button onClick={()=>applyFilter()} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
            <button className='font-medium'>Clear Filters</button>
        </div>
    </div>
  )
}

export default ExploreFilter