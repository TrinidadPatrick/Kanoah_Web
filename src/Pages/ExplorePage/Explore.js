import React from 'react'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useState, useEffect, useContext, useRef, useId } from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import 'mapbox-gl/dist/mapbox-gl.css';
import OutsideClickHandler from 'react-outside-click-handler';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import HideSourceIcon from '@mui/icons-material/HideSource';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import {Link} from "react-router-dom"
import http from "../../http"
import { createContext } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import getDistance from 'geolib/es/getPreciseDistance';
import Filters from './Filters';
import MobileFilter from './MobileFilter';
import Searchbar from './Searchbar';
import UseFavorite from '../../ClientCustomHook/FavoriteProvider';
import UseInfo from '../../ClientCustomHook/UseInfo';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import cloudinaryCore from '../../CloudinaryConfig';
import Alert from '@mui/material/Alert';
export const FilterContext = createContext()


const Explore = ({services}) => {
  const {authenticated, userInformation} = UseInfo()
  const {favorites, getFavorites} = UseFavorite()
  const navigate = useNavigate()
  const [loadingPage, setLoadingPage] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams();
  const longitudeParam = parseFloat(searchParams.get('longitude')) || 0;
  const latitudeParam = parseFloat(searchParams.get('latitude')) || 0;
  const rating = searchParams.get('rating')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const search = searchParams.get('search')
  const radiusParam = searchParams.get('rd')
  const page = searchParams.get('page')
  const subCategory = searchParams.get('subCategory')
  const [rerender, setRerender] = useState(0)
  const [serviceList, setServiceList] = useState([])
  const [mainServiceList, setMainServiceList] = useState([])
  const [activeId, setActiveId] = useState(0)
  const [sortFilter, setSortFilter] = useState('Recent Services')
  const [selectedCategory, setSelectedCategory] = useState('Select Category')
  const [selectedCategoryCode, setSelectedCategoryCode] = useState(0)
  const [selectedSubCategory, setSelectedSubCategory] = useState('Select Sub Category')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])

  // For Pagination
  const [currentPage, setCurrentPage] = useState(Number(page - 1));
  const servicesPerPage = 4; // Number of services to display per page
  const indexOfLastService = (currentPage + 1) * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = serviceList.length >= 5 ? serviceList.slice(indexOfFirstService, indexOfLastService) : serviceList

  const scrollableDivRef = useRef(null);
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
  const [locationFilterValue, setLocationFilterValue] = useState('')
  const [filterLocationLongLat, setFilterLocationLongLat] = useState({longitude : 0, latitude : 0})

  const [radius, setRadius] = useState(1)
  const [serviceToReport, setServiceToReport] = useState({})
  const [openReportModal, setOpenReportModal] = useState(false)
  const [openSuccessReportModal, setOpenSuccessReportModal] = useState(false)

  
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
    
        if(activeId === null){
          setActiveId(id)
        }else {
          setActiveId(null)
        }
    
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
      
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${accessToken}`)
          .then((res) => {
           setPlaces(res.data.features) // Logging the response data

          })
          .catch((err) => {
            console.log(err);
          });
  }, [locationFilterValue]);
      

  const getCategories = async () => {
        try {
          const result = await http.get('getCategories')
          const categories = result.data.filter((category)=> category.type === "Category")
          const subCategories = result.data.filter((category)=> category.type === "SubCategory")
          setCategories(categories)
          setSubCategories(subCategories)
        } catch (error) {
          console.log(error)
        }
  }

      // Get All services
  const getServices = async () => {
        
          setServiceList(services);
          setMainServiceList(services);

          return services
  }
      // get all services
  useEffect(()=>{
    if(services !== null && authenticated !== null)
    {
      getServices()
      getCategories()
    }

  },[services, authenticated])

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
              if(subCategory == null || subCategory == "")
              {
                setSelectedSubCategory("Select Sub Category")
              }
              else
              {
                setSelectedSubCategory(subCategory)
              }
              

  },[mainServiceList])

      // Apply the filter
    const applyFilter = () => {    
          setServiceList(filteredService) 
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
          : filteredServices.filter(service => service.advanceInformation.ServiceCategory.name === selectedCategory);

        const filteredServiceBySubcategory = selectedSubCategory === "Select Sub Category" ? filteredServiceByCategory
        : filteredServiceByCategory.filter(service => service.advanceInformation.ServiceSubCategory.name === selectedSubCategory)
        
        const sortedFilter = sortFilter === "Recent Services"
          ? filteredServiceBySubcategory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : 
          sortFilter === "Oldest Services"
          ?
          filteredServiceBySubcategory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          :
          sortFilter === "Most Rated"
          ?
          filteredServiceBySubcategory.sort((a, b) => Number(b.ratings) - Number(a.ratings))
          :
          filteredServiceBySubcategory.sort((a, b) => Number(a.ratings) - Number(b.ratings))

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
        
    }, [selectedRatingCheckbox, selectedCategory, mainServiceList, sortFilter, searchInput, locationFilterValue, radius, selectedSubCategory]);


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

          setLoadingPage(false)

          
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

    const removeFavorites = async (serviceId) => {

      try {
        const result = await http.delete(`removeFavorite/${serviceId}`,{withCredentials : true})
        setActiveId(null)
        getFavorites()
      } catch (error) {
        console.log(error)
      }
    }
    const addToFavorites = async (serviceId) => {
      const data = {
        serviceId,
        createdAt : new Date()
      }

      try {
        const result = await http.post('addFavorites', data, {withCredentials : true})
        setActiveId(null)
        getFavorites()
      } catch (error) {
        console.log(error)
      }
    }

    const addToDNS = async (serviceId) => {
      const newServiceList = [...serviceList]
      const index = newServiceList.findIndex((service) => service._id === serviceId)
      newServiceList.splice(index, 1)
      setServiceList(newServiceList)
      const data = {
        serviceId,
        createdAt : new Date()
      }

      try {
        const result = await http.post('addToDoNotShow', data, {withCredentials : true})
        setActiveId(null)
      } catch (error) {
        console.log(error)
      }
    }

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

    useEffect(() => {
      // Scroll to the top of the scrollable div with smooth animation when the component mounts
      if (scrollableDivRef.current) {
        scrollableDivRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, [currentPage]);

    return (
      <FilterContext.Provider value={[sortFilter, setSortFilter, donotApplyFilter, setDonotApplyFilter, selectedCategory, setSelectedCategory,
      selectedRatingCheckbox, setSelectedRatingCheckbox,radius, setRadius,locationFilterValue, setLocationFilterValue,places, setPlaces,
      filterLocationLongLat, setFilterLocationLongLat, currentPage, setCurrentPage, serviceList, setServiceList, filteredService, setFilteredService,
      searchInput, setSearchInput, loadingPage, setLoadingPage, mainServiceList, setMainServiceList, rerender, setRerender, selectedCategoryCode, setSelectedCategoryCode, selectedSubCategory, setSelectedSubCategory,
      categories, subCategories
      ]} >
        <div className='w-full flex h-full overflow-hidden relative'>
        {/* Report Modal */}
        <div style={{backgroundColor : 'rgba(0,0,0,0.5)'}} className={`w-full ${openReportModal ? "flex" : "hidden"} items-center justify-center h-full absolute bg-black z-50`}>
        <ReportModal setOpenReportModal={setOpenReportModal} setOpenSuccessReportModal={setOpenSuccessReportModal} serviceToReport={serviceToReport} setServiceToReport={setServiceToReport} />
        </div>
        {/* Success Report Modal */}
        <div style={{backgroundColor : 'rgba(0,0,0,0.5)'}} className={`w-full ${openSuccessReportModal ? "flex" : "hidden"} items-center justify-center h-full absolute bg-black z-50`}>
        <div className="card overflow-hidden relative text-left border rounded-md w-[300px] pb-4 shadow-lg bg-white">
        <div className="header py-5 px-4">
        <div className="image flex mx-auto bg-green-200 flex-shrink-0 justify-center items-center w-12 h-12 rounded-full animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-8 h-8 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              stroke="#000000"
              d="M20 7L9.00004 18L3.99994 13"
            ></path>
          </svg>
        </div>
        <div className="content mt-3 text-center">
          <span className="title text-green-900 text-lg font-semibold">
            Report Submitted
          </span>
          <p className="message text-gray-600 text-sm mt-2">
            Thank you for your concern. We promise to get back to you as soon as possible. Mwuah
          </p>
        </div>
        </div>
        <div className="actions mt-3 px-4">
        <button
        onClick={()=>setOpenSuccessReportModal(false)}
          type="button"
          className="history inline-flex justify-center items-center p-2 bg-green-600 text-white text-lg font-medium w-full rounded-md border-none shadow-sm transition duration-300 ease-in-out hover:bg-green-700"
        >
          Confirm
        </button>
        </div>
        </div>
        </div>
        
        <>
        {/* Left Section */}
        <section className='filterSideBar w-[500px] hidden lg:flex h-full overflow-y-scroll relative flex-col space-y-3 pb-5 lg:ps-20 pe-5 bg-[#F9F9F9]'>
        <Filters />
        </section>
        
        {/* Right Section */}
        <section ref={scrollableDivRef} className='w-[100%] h-full overflow-auto pt-5 ps-2 xl:pe-20 pb-5 bg-[#f9f9f9]' onClick={()=>{document.getElementById('exploreSidebarOpen').className = "w-[300px] h-full transition duration-500 -translate-x-[100%] ease-out exploreSidebarOpen bg-white z-10 absolute"}} >
        {
          loadingPage ? 
          (
            <div className='w-full h-full flex flex-col items-start p-10 gap-5 justify-between animate-pulse'>
            <div className='flex w-full space-x-3'>
            <div className='w-[90px] h-[80px] semiSm:w-[150px] semiSm:h-[120px] md:w-[200px] md:h-[150px] rounded-md bg-gray-300'></div>
            <div className='w-full h-[80px] semiSm:h-[120px] md:h-[150px] justify-between flex flex-col'>
            <div className='w-[100%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[70%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[85%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[80%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            </div>
            </div>
            <div className='flex w-full space-x-3'>
            <div className='w-[90px] h-[80px] semiSm:w-[150px] semiSm:h-[120px] md:w-[200px] md:h-[150px] rounded-md bg-gray-300'></div>
            <div className='w-full h-[80px] semiSm:h-[120px] md:h-[150px] justify-between flex flex-col'>
            <div className='w-[100%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[70%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[85%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[80%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            </div>
            </div>
            <div className='flex w-full space-x-3'>
            <div className='w-[90px] h-[80px] semiSm:w-[150px] semiSm:h-[120px] md:w-[200px] md:h-[150px] rounded-md bg-gray-300'></div>
            <div className='w-full h-[80px] semiSm:h-[120px] md:h-[150px] justify-between flex flex-col'>
            <div className='w-[100%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[70%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[85%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            <div className='w-[80%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
            </div>
            </div>
            
          </div>
          )
          :
          <div>
          {/* Search Box */}
          <div className='flex flex-col ml-2.5 items-end relative w-full '>
          <Searchbar />
          </div>
          <hr className='mt-5 mx-3'></hr>
          {/* Cards Container */}
          <article className='w-full relative z-10 bg-[#f9f9f9] grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-1 h-fit  px-3 mt-0 mb-5'>
            {/* Card */}
            {
              currentServices.map((service, index)=>(
                <div key={index}  className='border relative flex cursor-pointer flex-col items-center xl:flex-row xl:space-x-6 xl:my-2 bg-white shadow-sm rounded-lg p-3'>
                {/* Image Container */}
                <Link to={`/explore/viewService/${service._id}`} className='flex relative w-full h-[280px] lg:h-[200px] object-cover xl:w-[330px] xl:min-w-[330px] xl:h-[200px]'>
                <p className='absolute bg-white px-2 py-1 text-sm font-semibold rounded-full top-1 left-1'>{service.advanceInformation.ServiceCategory.name}</p>
                <img className='w-full h-full min-h-[200px] max-h-[280px] object-cover rounded-lg' src={service.serviceProfileImage} alt="Cover"/>
                </Link>
                {/* Info Container */}
                <div className=' px-1 py-3 w-full overflow-hidden flex flex-col justify-between space-y-5'>
                  {/* Title and Reviews*/}
                  <div className='Header_Container space-y-2 xl:space-y-0 w-full flex flex-col xl:flex-row justify-between'>
                  <div className='w-full overflow-hidden'>
                    <h1 onClick={()=>{navigate(`/explore/viewService/${service._id}`)}} className='font-bold text-xl sm:text-md md:text-xl ps-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>{service.basicInformation.ServiceTitle}</h1>
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
                  <div className='flex space-x-1  w-[300px] xl:w-full justify-between  ml-1 xl:ml-2 '>
                    <div className='flex space-x-1'>
                    <ShareLocationOutlinedIcon className='text-themeGray' />
                    <p className='text-themeGray whitespace-nowrap overflow-hidden text-ellipsis'>{service.address.barangay.name + ", " + service.address.municipality.name + ", " + service.address.province.name}</p>
                    </div>
                    {/* More Options Button */}
                    <OutsideClickHandler onOutsideClick={(e)=>{setActiveId(null);e.stopPropagation()}}>
                    <div onClick={(e)=>{openMoreOptions(service._id);e.stopPropagation()}} className='w-fit p-0  absolute right-2 cursor-pointer'>
                    <MoreVertIcon  className={` ${service._id == activeId ? "text-gray-300" : "text-gray-600"}  cursor-pointer hover:text-gray-300`} />
                    </div>
                    </OutsideClickHandler>
                    <div id={service.id} className={`${service._id == activeId ? "absolute" : "hidden"} options  z-20  bg-white h-fit shadow-lg rounded-md right-[1.5rem] xl:right-[2rem] bottom-[1rem] xl:top-[12rem]`}>
  
                    <div id='optionMenu' className={`${authenticated ? "flex" : "hidden"} hover:bg-gray-300 cursor-pointer items-center px-2 py-2`}>             
                    {
                      
                      favorites?.some((favorite) => favorite.service?._id === service._id) ?
                      <div className='flex items-center'><PlaylistRemoveOutlinedIcon className='text-red-500 p-0.5' fontSize='small' /><p onClick={()=>{removeFavorites(service._id)}} className=' px-2  text-red-500 text-sm rounded-md cursor-pointer py-1'>Remove from Favorites</p></div> :
                      <div className='flex items-center'><LibraryAddIcon className='p-0.5' fontSize='small' /><p onClick={()=>{addToFavorites(service._id)}} className=' px-2  text-gray-600 rounded-md cursor-pointer py-1 text-sm'>Add to Favorites</p></div>
                    }
  
                    </div>
                    
                    <div id='optionMenu' className={`${authenticated ? "flex" : "hidden"}  hover:bg-gray-300 cursor-pointer items-center px-2 py-2`}>
                    <HideSourceIcon className='p-0.5' fontSize='small' />
                    <p onClick={()=>{addToDNS(service._id)}} className=' px-2 text-sm text-gray-600 rounded-md cursor-pointer py-1'>Do not show</p>
                    </div>
                    
                    <button onClick={()=>{setOpenReportModal(true);setServiceToReport({name : service.basicInformation.ServiceTitle, _id : service._id, owner : service.owner})}} id='optionMenu' className='flex w-full hover:bg-gray-300 cursor-pointer items-center px-2 py-2'>
                    <ReportGmailerrorredOutlinedIcon className='p-0.5' fontSize='small' />
                    <p className=' px-2 text-sm text-gray-600 rounded-md cursor-pointer py-1'>Report</p>
                    </button>
                    </div>
                    
                    
          
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
        }
        </section>
        </>        
        
        
        {/* Mobile Sidebar */}
        <button onClick={()=>{document.getElementById('exploreSidebarOpen').className = 'w-[260px] transition duration-500 translate-x-[0%] exploreSidebarOpen ease-out h-screen overflow-y-scroll bg-white z-10 absolute'}} className='absolute top-[1.6rem] left-5 lg:hidden'><FilterListOutlinedIcon fontSize='large' /></button>
        <section id='exploreSidebarOpen' className={`hidden`}>
        <MobileFilter />
        </section>
        {/* <ScrollToTop smooth /> */}
      </div>
      </FilterContext.Provider>
  )
}

const ReportModal = ({serviceToReport, setServiceToReport, setOpenSuccessReportModal, setOpenReportModal}) => {
  const [reportObject, setReportObject] = useState({
    service : serviceToReport,
    reasons : [],
    textDetails : '',
    photos : [],
    createdAt : new Date()
  })

  const submitReport = async () => {
    try {
      const result = await http.post('AddReport', reportObject, {withCredentials : true})
      if(result.data.message === "Reported successfull")
      {
        setOpenSuccessReportModal(true)
        setOpenReportModal(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    setReportObject({...reportObject, service : serviceToReport})
  },[serviceToReport])

  return (
    <section className='w-[500px] h-fit relative bg-white flex flex-col p-3 rounded-md overflow-auto'>
        <header>
          <h1 className='text-lg font-medium text-gray-600'>Service Report</h1>
        </header>

        {/* Name of Service */}
        <div className='flex items-center mt-2'>
          <h1 className='text-red-500'>{reportObject.service.name}</h1>
          <WarningAmberRoundedIcon className='text-red-500' fontSize='small' />
        </div>

        {/* Reason */}
        <div className='w-full flex flex-col mt-3'>
        <label className='text-sm font-medium text-gray-700'>Reason for reporting this service?</label>
        <ReportReasonsButton setReportObject={setReportObject} reportObject={reportObject} />
        </div>

        {/* Text Area */}
        <div className='w-full flex flex-col mt-5'>
        <label className='text-sm font-medium text-gray-700'>Can you provide a detailed explanation about the issue?</label>
        <p className='text-[0.69rem] text-gray-400'>Provide a detailed description of your encounter with the service, it will
        greatly help us to process your request faster.
        </p>
        <textarea maxLength={5000} value={reportObject.textDetails} onChange={(e)=>setReportObject({...reportObject, textDetails : e.target.value})} rows={4} className='border resize-none p-1 text-sm text-gray-600 mt-2' />
        </div>

        {/* Report Pictures */}
        <div className='w-full flex flex-col mt-5'>
        <label className='text-sm font-medium text-gray-700'>Attach Photos</label>
        <ReportPictures setReportObject={setReportObject} reportObject={reportObject} />
        </div>

        <button onClick={()=>submitReport()} className='px-3 mt-2 hover:bg-orange-300 rounded-md py-2 text-white bg-themeOrange w-fit text-sm'>Submit report</button>

        </section>
  )
}

const ReportReasonsButton = ({setReportObject, reportObject}) => {
  const [selectedReasons, setSelectedReasons] = useState([])
  const reasons = ['Explicit Content', 'Fake Information/False Claims', 'Hate Speech/Bullying', 'Violence/Threats', 
                    'Spam/Scams', 'Non-Compliance with Terms of Service', 'Terrorism', 'Involves a child', 'Nudity']

  const handleSelectReason = (value) => {
    const newSelectedReasons = [...reportObject.reasons]
    const checkIndex = newSelectedReasons.findIndex((reason)=>reason === value)
    if(checkIndex == -1)
    {
      newSelectedReasons.push(value)
      setReportObject({...reportObject, reasons : newSelectedReasons})
      return
    }
    newSelectedReasons.splice(checkIndex, 1)
    setReportObject({...reportObject, reasons : newSelectedReasons})
    
  }
  return (
    <div className='w-full flex flex-wrap gap-2 mt-2'>
                      {
                        reasons.map((reason, index) => {
                          return (
                            <button onClick={(e)=>handleSelectReason(e.target.value)} key={index} value={reason} className={`text-xs px-3 py-1 ${reportObject.reasons.includes(reason) ? " bg-teal-600 text-white" : "bg-gray-100"}`}>{reason}</button>
                          )
                        })
                      }
    </div>
  )
}

const ReportPictures = ({setReportObject, reportObject}) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  const generateId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  };

  const handleAddImage = async (files) => {
    let imageToAdd = []
    const totalFiles = files.length;

    if(files){
      // Loop through selected files
  for (const file of files) {
    try {
      // Upload each file to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', "Kanoah_ReportImages");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.min(
              100,
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            setUploadProgress((prevProgress) =>
              Math.round((prevProgress + progress / totalFiles) * 10) / 10
            );
          },
        }
      );
      const imageUrl = response.data.secure_url;
      const id = generateId(20)
      imageToAdd.push({imageId : id, src : imageUrl, TimeStamp : new Date()})
      setReportObject({...reportObject, photos : imageToAdd})
      // Save the imageUrl or perform further actions
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
  }

  }
  return (
    <div className='w-full pt-1'>   
    <input onChange={(e)=>{handleAddImage(e.target.files)}} className="block w-full text-sm text-gray-900  overflow-hidden cursor-pointer bg-gray-50  focus:outline-none " id="multiple_files" type="file" multiple />
    <p>{uploadProgress}</p>
    <div className='w-full h-[70px] object-contain flex flex-row gap-3 border rounded-sm p-1.5 overflow-auto mt-2'>
    {
      reportObject?.photos.map((photo, index)=>{
        return (
          <div className='w-14 aspect-square object-contain'>
            <img key={index} src={photo.src} className='w-full' />
          </div>
        )
      })
    }
    </div>
    </div>
  )
}
  

export default Explore

