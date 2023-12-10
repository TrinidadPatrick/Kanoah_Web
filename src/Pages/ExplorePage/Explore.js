import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useState, useEffect, useCallback, useRef } from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import 'mapbox-gl/dist/mapbox-gl.css';
import { categories } from '../MainPage/Components/Categories';
import OutsideClickHandler from 'react-outside-click-handler';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import HideSourceIcon from '@mui/icons-material/HideSource';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ReportIcon from '@mui/icons-material/Report';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import {Link} from "react-router-dom"
import http from "../../http"
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId, selectLoggedIn } from '../../ReduxTK/userSlice';
import getDistance from 'geolib/es/getPreciseDistance';
import ScrollToTop from "react-scroll-to-top";


const Explore = () => {
  const navigate = useNavigate()
  const userId = useSelector(selectUserId);
  const loginStatus = useSelector(selectLoggedIn);
  const [loadingPage, setLoadingPage] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const longitudeParam = parseFloat(searchParams.get('longitude')) || 0;
  const latitudeParam = parseFloat(searchParams.get('latitude')) || 0;
  const rating = searchParams.get('rating')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const search = searchParams.get('search')
  const radiusParam = searchParams.get('rd')
  const page = searchParams.get('page')
  const [rerender, setRerender] = useState(0)
  const [serviceList, setServiceList] = useState([])
  const [mainServiceList, setMainServiceList] = useState([])
  const [activeId, setActiveId] = useState(0)
  const [sortFilter, setSortFilter] = useState('Recent Services')
  const [selectedCategory, setSelectedCategory] = useState('Select Category')

  // For Pagination
  const [currentPage, setCurrentPage] = useState(Number(page - 1));
  const servicesPerPage = 4; // Number of services to display per page
  const indexOfLastService = (currentPage + 1) * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = serviceList.slice(indexOfFirstService, indexOfLastService);
  // Handle the pages for pagination
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search :searchInput, page : data.selected + 1})
    
  };

  useEffect(()=>{
    if(page == "" || page == undefined)
    {
      setCurrentPage(0)
      setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search :searchInput, page :  1})
    }
  },[])


  const [filteredService, setFilteredService] = useState([])

  // For rating Filter
  const [selectedRatingCheckbox, setSelectedRatingCheckbox] = useState([])
  const [donotApplyFilter, setDonotApplyFilter] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  
  const [places, setPlaces] = useState([])
  const [location, setLocation] = useState(null);
  const ratingValues = [5,4,3,2,1]
  const [locationFilterValue, setLocationFilterValue] = useState('')
  const [filterLocationLongLat, setFilterLocationLongLat] = useState({longitude : 0, latitude : 0})

  const [radius, setRadius] = useState(1)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const thisDate = currentYear + "-" + currentMonth + "-" + currentDay

  // For km radius
  const radiusList = () => {
    const radiusValues = []
    
    for(let i = 1;i<=100;i++)
    {
      radiusValues.push(i)
    }

    return radiusValues
  }
  // Computes the rating Average
  const ratingAverage = (services) => {
    return services.map((service, index) => {
      const ratings = service.ratings
      const totalRatings = ratings[0].count + ratings[1].count + ratings[2].count +ratings[3].count + ratings[4].count;
      const ratingAverage = (5 * ratings[0].count + 4 * ratings[1].count + 3 * ratings[2].count + 2 * ratings[3].count + 1 * ratings[4].count) / totalRatings;
      const rounded = Math.round(ratingAverage * 100) / 100;
      const average = rounded.toFixed(1)
      const from = new Date(service.createdAt);
      const to = new Date(thisDate);
      const years = to.getFullYear() - from.getFullYear();
      const months = to.getMonth() - from.getMonth();
      const days = to.getDate() - from.getDate();
      const createdAgo = years > 0 ? years + " years ago" : months > 0 ? months + `${months <= 1 ? " month ago" : " months ago"}` : days > 0  ? days + `${days <= 1 ? " day ago" : " days ago"}` : "Less than a day ago"
      return ({
        _id : service._id,
        key : index,
        basicInformation: service.basicInformation,
        advanceInformation: service.advanceInformation,
        address: service.address,
        serviceHour: service.serviceHour,
        tags: service.tags,
        owner : service.owner,
        galleryImages: service.galleryImages,
        featuredImages: service.featuredImages,
        serviceProfileImage: service.serviceProfileImage,
        ratings : average,
        ratingRounded : Math.floor(average),
        totalReviews : totalRatings,
        createdAgo : createdAgo,
        createdAt : service.createdAt
      });
    });
  };
  
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

    const openMoreOptions = (id) => {
    
        if(activeId == id){
          setActiveId(null)
        }else {
          setActiveId(id)
        }
    
    }

    const showDropdownOptions = () => {
        document.getElementById("options").classList.toggle("hidden");
        document.getElementById("arrow-up").classList.toggle("hidden");
        document.getElementById("arrow-down").classList.toggle("hidden");
    }

    const showMobileDropdownOptions = () => {
      document.getElementById("Mobileoptions").classList.toggle("hidden");
      document.getElementById("Mobilearrow-up").classList.toggle("hidden");
      document.getElementById("Mobilearrow-down").classList.toggle("hidden");
  }

    const showFilterOption = () => {
      document.getElementById("sort_options").classList.toggle("hidden");
      document.getElementById("sort_arrow-up").classList.toggle("hidden");
      document.getElementById("sort_arrow-down").classList.toggle("hidden");
  }
    
  const showMobileFilterOption = () => {
    document.getElementById("Mobilesort_options").classList.toggle("hidden");
    document.getElementById("Mobilesort_arrow-up").classList.toggle("hidden");
    document.getElementById("Mobilesort_arrow-down").classList.toggle("hidden");
}
      // Get my current location
      useEffect(() => {
        // Use the Geolocation API to get the user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
            },
            (error) => {
              // Handle any errors here
              console.error('Geolocation error:', error);
            }
          );
        } else {
          // Geolocation is not available in this browser
          console.error('Geolocation is not available.');
        }
      }, []);

      // For autofill location search
      useEffect(() => {
        const accessToken = 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw'; // Replace with your actual Mapbox access token
        const location = locationFilterValue; // Replace with your desired location
      
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw`)
          .then((res) => {
           setPlaces(res.data.features) // Logging the response data

          })
          .catch((err) => {
            console.log(err);
          });
      }, [locationFilterValue]);


      
      const getUserId = () =>{
        return new Promise((resolve,reject)=>{
          if(userId == null)
        {
          console.log("userId")
        }
        else if(userId == "loggedOut")
        {
          resolve("loggedOut")
        }
        else{
          resolve(userId)
        }
        })
      }

      const getLoginStatus = () => {
        return new Promise((resolve, reject)=>{
          if(loginStatus === true)
          {
            resolve('loggedIn')
          }
          else if(loginStatus === false)
          {
            resolve('loggedOut')
          }
        })
      }


      // Get All services
      const getServices = async () => {
       
        try {
          
          const res = await http.get("getServices");
          
          const services = res.data.service;
          
          const result = ratingAverage(services)
          const loginStatus = await getLoginStatus()
          const myId = await getUserId()

          if(loginStatus == "loggedOut")
          {
            setServiceList(result);
            setMainServiceList(result);
          }
          else if(loginStatus === "loggedIn" && myId != null)
          {
          const filteredService = result.filter(service => service.owner._id !== myId)
          setServiceList(filteredService);
          setMainServiceList(filteredService);
          }
          
          
          return result
        } catch (err) {
          console.error("Error fetching services:", err);
        }
      }
      // get all services
      useEffect(()=>{
        getServices()
      },[userId, loginStatus])

      // Apply the filteres in the searchParams
     useEffect(()=>{
              if( rating == null || rating == "")
              {

              }
              else
              {
              const ratingString = rating.split(',')
              const ratingFromParam = ratingString.map(Number)
              setSelectedRatingCheckbox(ratingFromParam)
              }
              if(category == null || category == "")
              {
                setSelectedCategory("Select Category")
              }
              else
              {
                setSelectedCategory(category)
              }
              if(sort == null || sort == "")
              {
                setSortFilter("Recent Services")
              }
              else
              {
                setSortFilter(sort)
              }
              if(search == null || search == "")
              {
                setSearchInput("")
              }
              else
              {
                setSearchInput(search)
              }
              if((longitudeParam == null || longitudeParam == "") && latitudeParam == null || latitudeParam == "")
              {
                
              }
              else
              {
                setFilterLocationLongLat({longitude : longitudeParam, latitude : latitudeParam})
              }

     },[mainServiceList])
      // Apply the filter
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

      // handle the location filter
      const handleLocationFilter = (place) => {
        setDonotApplyFilter(true)
        setLocationFilterValue(place.place_name);setFilterLocationLongLat({longitude : place.geometry.coordinates[0], latitude : place.geometry.coordinates[1]})
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

      //  Sets the selected Category
     const handleSelectCategory = (value) => {
      setDonotApplyFilter(true)
      setSelectedCategory(value)
     }

    //  Set Selected Sort Filter
    const handleSort = (value) => {
      setDonotApplyFilter(true)
      setSortFilter(value)
    }

    // Handle the search Input
    const handleSearchInput = (input) => {
      setDonotApplyFilter(true)
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

    // calculate the distance
    const calculateDistance = (serviceLat, serviceLong,FilterLat, Filterlong) => {
      return getDistance({latitude : serviceLat, longitude : serviceLong}, {latitude : FilterLat, longitude : Filterlong})
    }

      // Handle all the selected rating filter****************************************************************************
      useEffect(() => {

        const serviceListInstance = [...mainServiceList];
        const filteredByLocation = serviceListInstance.filter(service => {
          const distance = calculateDistance(service.address.latitude, service.address.longitude, filterLocationLongLat.latitude, filterLocationLongLat.longitude)
          const distanceInKm = distance / 1000;

          return distanceInKm < radius
        })

        const initialServiceList = filterLocationLongLat.latitude && filterLocationLongLat.longitude != 0 ? filteredByLocation
        :
        serviceListInstance

        const filteredServices = selectedRatingCheckbox.length > 0
          ? initialServiceList.filter(service => selectedRatingCheckbox.includes(service.ratingRounded))
          : initialServiceList;
      
        const filteredServiceByCategory = selectedCategory === "Select Category"
          ? filteredServices
          : filteredServices.filter(service => service.advanceInformation.ServiceCategory === selectedCategory);
      
        const sortedFilter = sortFilter === "Recent Services"
          ? filteredServiceByCategory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : 
          sortFilter === "Oldest Services"
          ?
          filteredServiceByCategory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          :
          sortFilter === "Most Rated"
          ?
          filteredServiceByCategory.sort((a, b) => Number(b.ratings) - Number(a.ratings))
          :
          filteredServiceByCategory.sort((a, b) => Number(a.ratings) - Number(b.ratings))

        if(search == null || search == "")
        {
          setFilteredService(sortedFilter);
        }
        else
        {
          const final = sortedFilter.filter((item) =>
          item.basicInformation.ServiceTitle.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchInput.toLowerCase())))
          setFilteredService(final);
          
        }
        
      }, [selectedRatingCheckbox, selectedCategory, mainServiceList, sortFilter, searchInput, locationFilterValue, radius]);


    //  Apply the filter onload only
     useEffect(() => {
       if(donotApplyFilter)
       {  
       }
       if(!donotApplyFilter)
       {
        applyFilter(); 
       }
    }, [filteredService, donotApplyFilter]);
    
    useEffect(()=>{
      if(serviceList.length!== 0){
        setTimeout(()=>{
          setLoadingPage(false)
        }, 200)
          
      }
    },[serviceList])

    const getPlaceName = async () => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitudeParam},${latitudeParam}.json`,
          {
            params: {
              access_token: "pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg",
            },
          }
        );
    
        // Extract the place name from the response
        const placeName = response.data.features[3].place_name;
        setLocationFilterValue(placeName)
      } catch (error) {
        console.error('Error fetching place name:', error);
        return null;
      }
    };

    useEffect(()=>{
      if(longitudeParam != 0)
      {
        getPlaceName()
      }
      if(radiusParam != null || radiusParam != "")
      {

        setRadius(Number(radiusParam))
      }

    },[])

    
    return (
        <div className=' w-full flex h-full relative'>
        {
          // Loading page
          loadingPage ? (
            <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
            </div>
          ) :
          (
            <>
            {/* Left Section */}
            <section className='w-[500px] hidden lg:flex h-full relative flex-col space-y-5 pb-5 pt-20 lg:ps-20 pe-5 bg-[#F9F9F9]'>
        
        <div className='flex flex-col space-y-5 px-7 mt-10'>
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
        <select defaultValue={radius} className='outline-none ps-1 w-[60px] border border-e-0 rounded-s-lg' onChange={(e)=>{setDonotApplyFilter(true);setRadius(Number(e.target.value))}}>
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
        <button onClick={()=>{applyFilter();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search: searchInput, longitude : filterLocationLongLat.longitude, latitude : filterLocationLongLat.latitude, rd : radius, page : page + 1})}} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button onClick={()=>{setSearchParams({rating :"", category:"", sort : "Recent Services", search, page:page + 1});clearFilter()}} className='font-medium'>Clear Filters</button>
        </div>
        </section>
        
        {/* Right Section */}
        <section onClick={()=>{document.getElementById('exploreSidebarOpen').className = "w-[300px] h-full transition duration-500 -translate-x-[100%] ease-out exploreSidebarOpen bg-white z-10 absolute"}} className='w-[100%] grid place-items-center h-full pt-[100px] ps-2 xl:pe-20 pb-5 bg-[#F9F9F9]'>
        <div>
          {/* Search Box */}
        <div className='flex flex-col ml-2.5 items-end relative w-full '>
        <h1 className={`${serviceList.length === 0 ? "block" : "hidden"} w-full tra text-center text-2xl`}>No Result</h1>
        <div className="w-[50%] sm:w-fit mr-5 flex space-x-2 shadow-sm self-end lg:self-start rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex w-full">
        <div className="w-full">
        <div className="relative">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <input className="bg-white h-12 w-full px-12 border rounded-lg focus:outline-none hover:cursor-arrow" value={searchInput} onChange={(e)=>{handleSearchInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter"){handleSubmitSearch();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search :searchInput, page : page + 1})}}} type="text"  placeholder='Search'/>
        </div> 
        
        </div>
        </div>
        </div>
        </div>
        <hr className='mt-5 mx-3'></hr>
        {/* Cards Container */}
        <article className='w-full relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-1 h-fit  px-3 mt-0 mb-5'>
          {/* Card */}
          {
            currentServices.map((service, index)=>(
              <div key={index}  className='border relative flex cursor-pointer flex-col items-center xl:flex-row xl:space-x-6 xl:my-2 bg-white shadow-sm rounded-lg p-3'>
              {/* Image Container */}
              <Link to={`/explore/viewService/${service._id}`} className='flex relative w-full h-[280px] lg:h-[200px] object-cover xl:w-[330px] xl:min-w-[330px] xl:h-[200px]'>
              <p className='absolute bg-white px-2 py-1 text-sm font-semibold rounded-full top-1 left-1'>{service.advanceInformation.ServiceCategory}</p>
              <img className='w-full h-full min-h-[200px] max-h-[280px] object-cover rounded-lg' src={service.serviceProfileImage} alt="Cover"/>
              </Link>
              {/* Info Container */}
              <div className=' px-1 py-3 w-full overflow-hidden flex flex-col justify-between space-y-5'>
                {/* Title and Reviews*/}
                <div className='Header_Container space-y-2 xl:space-y-0 w-full flex flex-col xl:flex-row justify-between'>
                <div className='w-full overflow-hidden'>
                  <h1 className='font-bold text-xl sm:text-md md:text-xl ps-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>{service.basicInformation.ServiceTitle}</h1>
                  <div className='flex items-center space-x-2'>
                  <p className='text-sm md:text-md text-gray-400  flex items-center gap-1'><Person2OutlinedIcon  />{service.owner.firstname + " " + service.owner.lastname}</p>
                  <span className='w-1 h-1 rounded-full bg-gray-500'></span>
                  <p className='text-sm text-gray-400 '>{service.createdAgo}</p>
                  </div>
                  
                </div>
                {/* Reviews */}
                <div className='flex flex-col w- whitespace-nowrap relative ml-0  xl:ml-3 mr-2 space-x-1'>
                <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={Number(service.ratings)} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                <div className='flex items-center space-x-2 pl-1'>
                <p className='text-gray-400 text-sm font-medium'>{service.ratings}</p> 
                <p className='text-gray-300'>|</p>
                <p className='text-gray-700 text-sm  font-medium'>{service.totalReviews} Reviews</p> 
                </div>
                </div>
                </div>


                {/* Description */}
                <div className=' p-2 w-full h-[3.2em]  overflow-hidden text-ellipsis'>
                <p className='text-sm'>{service.basicInformation.Description}</p>
                
                </div>

                {/* Location */}
                <div className='flex space-x-1 w-[300px] xl:w-full justify-between  ml-1 xl:ml-2 '>
                  <div className='flex space-x-1'>
                  <ShareLocationOutlinedIcon className='text-themeGray' />
                  <p className='text-themeGray whitespace-nowrap overflow-hidden text-ellipsis'>{service.address.barangay.name + ", " + service.address.municipality.name + ", " + service.address.province.name}</p>
                  </div>
                  {/* More Options Button */}
                  <OutsideClickHandler onOutsideClick={()=>{setActiveId(null)}}>
                  <MoreVertIcon onClick={()=>{openMoreOptions(service._id)}} className={` ${service._id == activeId ? "text-gray-300" : "text-gray-600"}  absolute right-1 bottom-3 cursor-pointer hover:text-gray-300`} />
                  <div id={service.id} className={`${service._id == activeId ? "absolute" : "hidden"} options ease-in-out duration-200 z-20  bg-white h-fit shadow-lg rounded-md right-[1.5rem] xl:right-[2rem] bottom-[1rem] xl:top-[12rem]`}>
                  <div id='optionMenu' className='flex  hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
                  <LibraryAddIcon />
                  <p className=' px-4  text-gray-600 rounded-md cursor-pointer py-1'>Add to Library</p>
                  </div>
                  
                  <div id='optionMenu' className='flex  hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
                  <HideSourceIcon />
                  <p className=' px-4  text-gray-600 rounded-md cursor-pointer py-1'>Do not show</p>
                  </div>
                  
                  <div id='optionMenu' className='flex  hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
                  <ReportIcon />
                  <p className=' px-4  text-gray-600 rounded-md cursor-pointer py-1'>Report</p>
                  </div>
                  </div>
                  </OutsideClickHandler>
                  
        
                </div>
                
              </div>
            </div>

            ))
          }

        </article>

        <ReactPaginate
        pageCount={Math.ceil(serviceList.length / servicesPerPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={handlePageClick}
        containerClassName={'explorePagination'}
        forcePage={Number(page) - 1}
        activeLinkClassName={'activePage'}
        pageLinkClassName={'paginationNumber'}
        previousLabel={<ArrowBackIosOutlinedIcon fontSize='small' />}
        previousClassName={'previousArrow'}
        nextClassName={'nextArrow'}
        nextLabel={<ArrowForwardIosOutlinedIcon fontSize='small' />}
      />
        </div>
        </section>
            </>
          )
        }
        
        {/* Mobile Sidebar */}
        <button onClick={()=>{document.getElementById('exploreSidebarOpen').className = 'w-[260px] transition duration-500 translate-x-[0%] exploreSidebarOpen ease-out h-full bg-white z-10 absolute'}} className='absolute top-[6.6rem] left-5 lg:hidden'><FilterListOutlinedIcon fontSize='large' /></button>
        <section id='exploreSidebarOpen' className={`hidden`}>
        <div className='flex flex-col space-y-5 px-7 mt-10'>
        <h1 className='font-bold text-2xl'>Find your Service</h1>
        {/* Sort box */}
        <div className='flex-none w-full relative'>
        <h1 className='font-medium text-lg mb-2'>Sort By</h1>
        <button onClick={()=>{showMobileFilterOption()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{sortFilter}</span>

            <svg id="Mobilesort_arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <svg id="Mobilesort_arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="Mobilesort_options" className="hidden ease-in duration-100 origin-top absolute w-full py-2 mt-1 z-50  bg-white rounded-lg shadow-xl">
            <a onClick={()=>{handleSort("Recent Services");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a onClick={()=>{handleSort("Oldest Services");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
            <a onClick={()=>{handleSort("Most Rated");showMobileFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Most Rated</a>
        </div>
        </div>
       
        

        {/* Category Filter */}

        <div className="flex-none w-full relative">
        <h1 className='font-medium text-lg mb-2'>Categories</h1>
        <button onClick={()=>{showMobileDropdownOptions()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{selectedCategory}</span>

            <svg id="Mobilearrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <svg id="Mobilearrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="Mobileoptions" className=" hidden ease-in duration-100 origin-top w-full h-[300px] overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl">
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
                  showMobileDropdownOptions();
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
        <div className="w-full shadow-sm mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <h1 className='font-medium text-lg mb-2'>Location</h1>
        <div className="md:flex">
        <div className="w-full">
        <div className="relative">
          <SearchOutlinedIcon className="absolute text-gray-400 top-[0.9rem] left-4"/>
          <input value={locationFilterValue} onChange={(e)=>{setLocationFilterValue(e.target.value)}} placeholder="Enter location" type="text" className="bg-white h-12 w-full ps-12 pe-2 text-sm border rounded-lg focus:outline-none hover:cursor-arrow" />
        </div> 
        </div>
        </div>
        </div>

        <div className={`${locationFilterValue != "" ? "relative" : "hidden"} bg-white h-44 overflow-auto flex flex-col shadow-sm border rounded-sm`}>
          {
            places.map((place, index)=>{
             return (
              <div key={index} onClick={()=>{setLocationFilterValue(place.place_name)}} className='m-3 flex flex-col items-start cursor-pointer '>
                <h1 className=' text-sm font-semibold'>{place.text}</h1>
                <p className=' text-[0.72rem]'>{place.place_name}</p>
              </div>
              
             )
            })
          }
          </div>
        </div>

        {/* Buttons */}
        <button onClick={()=>{document.getElementById('exploreSidebarOpen').className = "w-[300px] h-full transition duration-500 -translate-x-[100%] ease-out exploreSidebarOpen bg-white z-10 absolute";applyFilter();setSearchParams({rating : selectedRatingCheckbox.join(','), category : selectedCategory, sort : sortFilter, search: searchInput, page : page + 1})}} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button onClick={()=>{document.getElementById('exploreSidebarOpen').className = "w-[300px] h-full transition duration-500 -translate-x-[100%] ease-out exploreSidebarOpen bg-white z-10 absolute";setSearchParams({rating :"", category:"", sort : "Recent Services", search, page:page + 1});clearFilter()}} className='font-medium'>Clear Filters</button>
        </div>
        </section>
        {/* <ScrollToTop smooth /> */}
      </div>
      
  )
}

export default Explore

