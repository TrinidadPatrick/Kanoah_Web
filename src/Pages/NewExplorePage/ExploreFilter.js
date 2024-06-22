import React, { useEffect } from 'react'
import { useState } from 'react';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import useCategory from '../../ClientCustomHook/CategoryProvider';
import { useSearchParams } from 'react-router-dom';
import getDistance from 'geolib/es/getPreciseDistance';
import allServiceStore from '../../Stores/AllServiceStore';
import ExploreSearchBar from './ExploreSearchBar';
import axios from 'axios';

const ExploreFilter = ({searchValue, setSearchValue}) => {
    const {services, setServices, staticServices, setStaticServices} = allServiceStore()
    const [params, setParams] = useSearchParams()
    const radiusList = Array.from({length : 100}, (_, index)=> index + 1)
    const ratingValues = [5,4,3,2,1]
    const {categories, subCategories} = useCategory()
    const [selectedSortFilter, setSelectedSortFilter] = useState('Recent Services')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState({name : '', code : ''})
    const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState('')
    const [selectedRatingCheckbox, setSelectedRatingCheckbox] = useState([])
    const [radius, setRadius] = useState(1)
    const [showDropdowns, setShowDropdowns] = useState({sort : false, category : false, subCategory : false})
    const [settingsParamsComplete, setSettingParamsComplete] = useState(false)
    const pageParams = params.get('page') || 1

    const [locationFilter, setLocationFilter] = useState({address : '', longitude : 0, latitude : 0})
    const [placesSuggestion, setPlacesSuggestion] = useState([])

    useEffect(()=>{
      if(staticServices !== null)
      {
        applyFilter()
      }
    },[searchValue])

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

    const handleSelect = address => {
      setLocationFilter({address : address.place_name, longitude : address.center[0], latitude : address.center[1]})
      setPlacesSuggestion([])
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

    const clearFilter = () => {
      setSelectedCategoryFilter({name : '', code : ''})
      setSelectedSubCategoryFilter('')
      setSelectedRatingCheckbox([])
      setSelectedSortFilter('Recent Services')
      setRadius(1)
      setLocationFilter({address : '', longitude : 0, latitude : 0})
      
      setParams({...params, sort : '' ,category : '', 
        subCategory : '', rating : '', latitude : '', 
        longitude : '', rad : 1, address : '', search : searchValue, page : 1})   

        if(searchValue === "")
          {
            setServices(staticServices)
          }
          else
          {
            const final = staticServices.filter((item) =>
            item.basicInformation.ServiceTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.tags.includes(searchValue.toLowerCase()))
            setServices(final);
          }
      
    }

    const handleInputChange = async (value) => {
      setLocationFilter({...locationFilter, address : value})
      if (value.length > 2) {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`, {
            params: {
                access_token: process.env.REACT_APP_MAPBOX_TOKEN,
                autocomplete: true,
                limit: 5
            }
        });
        setPlacesSuggestion(response.data.features);
    } else {
        setPlacesSuggestion([]);
    }
    }

  return (
    <div className='filterSideBar flex-none lg:w-[300px] xl:w-[400px] hidden lg:flex h-full relative flex-col space-y-3 pb-5 xl:ps-20 pe-5 bg-[#f9f9f9]'>
        <div className='filterSideBar flex-1 flex flex-col space-y-5 px-7 mt-5 overflow-auto'>
            <h1 className='font-bold text-2xl'>Find your Service</h1>
            {/* Sort box */}
            <div className='flex-none w-full relative'>
            <h1 className='font-medium text-lg mb-2'>Sort By</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, category : false, subCategory : false, sort : !showDropdowns.sort})}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{selectedSortFilter}</span>
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
            <h1 className='font-medium text-lg mb-2'>Categories</h1>
            <button onClick={()=>{setShowDropdowns({...showDropdowns, sort : false, subCategory : false, category : !showDropdowns.category})}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
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
            <button onClick={()=>{setShowDropdowns({...showDropdowns, sort : false, category : false, subCategory : !showDropdowns.subCategory})}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
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
                          <div className='w-full p-1 border rounded-e overflow-hidden'>
                            {
                              placesSuggestion.length !== 0 &&
                                <div className='absolute flex flex-col bg-white shadow rounded p-2 bottom-10 gap-3'>
                                {
                                placesSuggestion?.map((place, index)=>(
                                <button key={index} onClick={()=>handleSelect(place)} className='text-xs'>{place.place_name}</button>
                                ))
                                }
                                </div>
                            }
                            <input value={locationFilter.address} type='text' onChange={(e)=>handleInputChange(e.target.value)} />
                          </div>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons */}
            <button onClick={()=>applyFilter()} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
            <button onClick={()=>clearFilter()} className='font-medium'>Clear Filters</button>
        </div>
    </div>
  )
}

export default ExploreFilter