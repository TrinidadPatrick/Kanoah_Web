import React, { useEffect } from 'react'
import { useState } from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import useCategory from '../../ClientCustomHook/CategoryProvider';
import PlacesAutocomplete, {geocodeByAddress,getLatLng,} from 'react-places-autocomplete';
import { useSearchParams } from 'react-router-dom';
import getDistance from 'geolib/es/getPreciseDistance';
import allServiceStore from '../../Stores/AllServiceStore';
import ExploreSearchBar from './ExploreSearchBar';

const ExploreMobileFilter = ({searchValue, setSearchValue, setShowMobileFilter}) => {
    const {services, setServices, staticServices, setStaticServices} = allServiceStore()
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
    const [search, setSearch] = useState('')
    const [showDropdowns, setShowDropdowns] = useState({sort : false, category : false, subCategory : false})
    const [settingsParamsComplete, setSettingParamsComplete] = useState(false)
    const [loadAutoComeplete, setLoadAutoComplete] = useState(false);
    const pageParams = params.get('page') || 1

    useEffect(()=>{
      if(staticServices !== null)
      {
        applyFilter()
      }
    },[searchValue])

    useEffect(() => {
      // Simulate a delay before loading the component
      const timeout = setTimeout(() => {
        setLoadAutoComplete(true);
      }, 1000); // Delay for 2 seconds (adjust as needed)
  
      return () => clearTimeout(timeout); // Clean up on component unmount
    }, []);

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

    useEffect(()=>{
      const sortParam = params.get('sort') || 'Recent Services'
      const categoryParam = params.get('category') || ''
      const subCategoryParam = params.get('subCategory') || ''
      const ratingParam = params.get('rating') || ''
      const latitudeParam = params.get('latitude') || ''
      const longitudeParam = params.get('longitude') || ''
      const addressParam = params.get('address') || ''
      const radParam = params.get('rad') || 1
      const searchParam = params.get('search') || ''

      if(services !== null && categories !== null)
      {
      const category_code = categories?.find((category)=> category.name === categoryParam)?.category_code
      setSelectedCategoryFilter((prev)=>({...prev, name : categoryParam, code : category_code || ''}))
      setSelectedSubCategoryFilter(subCategoryParam)
      setSelectedSortFilter(sortParam)
      setSelectedRatingCheckbox(ratingParam === '' ? [] : ratingParam.split(",").map(str => +str))
      setLocationFilter({address : addressParam, latitude : latitudeParam, longitude : longitudeParam})
      setRadius(radParam)
      setSearchValue(searchParam)
      setSettingParamsComplete(true)
      }

    },[categories, staticServices, services])

    useEffect(()=>{
      if(settingsParamsComplete && staticServices !== null)
      {
        applyFilter()
      }
    },[settingsParamsComplete, staticServices])

    // calculate the distance
    const calculateDistance = (serviceLat, serviceLong,FilterLat, Filterlong) => {
          return getDistance({latitude : serviceLat, longitude : serviceLong}, {latitude : FilterLat, longitude : Filterlong})
    }

    const handleSelectSort = (value) => {
      setSelectedSortFilter(value)
      setShowDropdowns({...showDropdowns, sort : false})
    }

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

    const setFilterParams = () => {
      setParams({...params, sort : selectedSortFilter ,category : selectedCategoryFilter.name, 
        subCategory : selectedSubCategoryFilter, rating : selectedRatingCheckbox.toString(), latitude : locationFilter.latitude, 
        longitude : locationFilter.longitude, rad : radius, address : locationFilter.address, search : searchValue, page : pageParams})
    }

    const applyFilter = () => {
        const initialServices = [...staticServices]

        const filteredByLocation = initialServices.filter(service => {
          const distance = calculateDistance(service.address.latitude, service.address.longitude, locationFilter.latitude, locationFilter.longitude)
          const distanceInKm = distance / 1000;

          return distanceInKm < radius
        })

        const filteredServicesByLocation = locationFilter.latitude && locationFilter.longitude != 0 ? filteredByLocation
        :
        initialServices

        const filteredServiceByCategory = selectedCategoryFilter.name === ""
        ? filteredServicesByLocation
        : filteredServicesByLocation.filter(service => service.advanceInformation.ServiceCategory.name === selectedCategoryFilter.name);

        const filteredServiceBySubcategory = selectedSubCategoryFilter === "" ? filteredServiceByCategory
        : filteredServiceByCategory.filter(service => service.advanceInformation.ServiceSubCategory.name === selectedSubCategoryFilter)

        const filteredServicesByRating = selectedRatingCheckbox.length > 0
        ? filteredServiceBySubcategory.filter(service => selectedRatingCheckbox.includes(service.ratingRounded))
        : filteredServiceBySubcategory;

        const sortedFilter = selectedSortFilter === "Recent Services"
          ? filteredServicesByRating.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : 
          selectedSortFilter === "Oldest Services"
          ?
          filteredServicesByRating.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          :
          selectedSortFilter === "Most Rated"
          ?
          filteredServicesByRating.sort((a, b) => Number(b.ratings) - Number(a.ratings))
          :
          filteredServicesByRating.sort((a, b) => Number(a.ratings) - Number(b.ratings))

          if(searchValue === "")
          {
            setServices(sortedFilter)
          }
          else
          {
            const final = sortedFilter.filter((item) =>
            item.basicInformation.ServiceTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.tags.includes(searchValue.toLowerCase()))
            setServices(final);
          }
          setFilterParams()
    }

  return (
    <div className='filterSideBar flex-none w-[280px] flex lg:hidden h-full relative flex-col space-y-3 pb-5  pe-1 bg-[#f9f9f9]'>
        <div className='filterSideBar flex-1 flex flex-col space-y-5 px-7 mt-5 overflow-auto'>
            <h1 className='font-bold text-lg'>Find your Service</h1>
            {/* Sort box */}
            <div className='flex-none w-full relative'>
            <h1 className='font-medium text-sm mb-2'>Sort By</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, sort : !showDropdowns.sort})}} className="flex flex-row justify-between w-full px-2 py-2 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none text-sm font-medium">{selectedSortFilter}</span>
            <svg id="sort_arrow-down" className=" w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <div id="sort_options" className={`${showDropdowns.sort ? "" : "hidden"} ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl`}>
            <button onClick={()=>handleSelectSort('Recent Services')} className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</button>
            <button onClick={()=>handleSelectSort('Oldest Services')} className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</button>
            <button onClick={()=>handleSelectSort('Most Rated')} className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Most Rated</button>
            <button onClick={()=>handleSelectSort('Least Rated')} className="block w-full text-start px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Least Rated</button>
            </div>
            </div>
            {/* Category Box */}
            <div className='flex-none w-full relative'>
            <h1 className='font-medium text-sm mb-2'>Categories</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, category : !showDropdowns.category})}} className="flex flex-row justify-between w-full px-2 py-2 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none text-sm font-medium">{selectedCategoryFilter.name === "" ? "Select Category" : selectedCategoryFilter.name}</span>
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
            <h1 className='font-medium text-sm mb-2'>Sub Categories</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, subCategory : !showDropdowns.subCategory})}} className="flex flex-row justify-between w-full px-2 py-2 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none text-sm font-medium">{selectedSubCategoryFilter === "" ? "Select SubCategory" : selectedSubCategoryFilter}</span>
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
            <h1 className='font-medium text-sm mb-2'>Rating</h1>
            <div className='flex flex-col space-y-3 items-center'>
            {
            ratingValues.map((rating)=>{
                return (
                    <div key={rating} className='flex items-center justify-center space-x-2'>
                    <input value={rating} checked={selectedRatingCheckbox.includes(Number(rating))} onChange={(e)=>{handleSelectCheckBox(Number(e.target.value))}}  className='chkbox w-4 h-4' type='checkbox'/>
                    <StyledRating className='relative'  readOnly defaultValue={rating} precision={0.1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
                    <p className='w-3 text-sm'>{rating}.0</p>
                    </div>
            )})
            }
            </div>
            </div>
            {/* Location Filter */}
            {
            loadAutoComeplete &&
            <div className='flex flex-col space-y-1 relative'>
            <div className="w-full mx-auto  md:max-w-xl">
            <h1 className='font-medium text-sm mb-2'>Location</h1>
            <div className="md:flex">
            <div className="w-full">
            <div className="relative flex">
            <select value={radius} className='outline-none text-xs ps-1 w-[60px] border border-e-0 rounded-s-lg' onChange={(e)=>{setRadius(Number(e.target.value))}}>
            {
            radiusList.map((radius)=>(
                <option value={radius} key={radius} >{radius} km</option>
            ))
            }
            </select>
            <PlacesAutocomplete
            value={locationFilter.address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className='w-full '>
                    <input {...getInputProps({placeholder: 'Search Places ...', className: 'location-search-input w-full py-2 px-2 text-xs border rounded-e-md text-gray-600',})}/>
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
            }
            {/* Buttons */}
            <button onClick={()=>{applyFilter();setShowMobileFilter(false)}} className=' bg-themeOrange text-sm text-white py-2 rounded-sm font-medium'>Apply Filters</button>
            <button className='font-medium text-sm'>Clear Filters</button>
        </div>
    </div>
  )
}

export default ExploreMobileFilter