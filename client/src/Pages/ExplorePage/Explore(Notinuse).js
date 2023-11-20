import React from 'react'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useState, useEffect, useCallback, useRef } from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import 'mapbox-gl/dist/mapbox-gl.css';
// import { services } from '../MainPage/Components/Services/Services';
import { categories } from '../MainPage/Components/Categories';
import OutsideClickHandler from 'react-outside-click-handler';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import HideSourceIcon from '@mui/icons-material/HideSource';
import ReportIcon from '@mui/icons-material/Report';
import {Link} from "react-router-dom"
import http from "../../http"
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

const Explore = () => {
  // For Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort')
  const rating = searchParams.get('rating')

  const [noSearchResult, setNoSearchResult] = useState(false)
  const [mainServiceList, setMainServiceList] = useState([])
  const [rerender, setRerender] = useState(0)
  const [activeId, setActiveId] = useState(0)
  const [checkboxFilter, setCheckboxFilter] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [ratingFilterValue, setRatingFilterValue] = useState([])
  const [sortFilter, setSortFilter] = useState('Recent Services')
  const [serviceList, setServiceList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('Select Category')
  const [checkBoxValuesArray, setCheckBoxValuesArray] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const servicePerPage = 4
  const lastIndex = currentPage * servicePerPage
  const firstIndex = lastIndex - servicePerPage
  let page = 0
  let serviceOnPage = null
  let numbers = null
  
  const [places, setPlaces] = useState([])
  const [location, setLocation] = useState(null);
  const ratingValues = [5,4,3,2,1]
  const [searchInput, setSearchInput] = useState('')
  const [locationFilterValue, setLocationFilterValue] = useState('')
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const thisDate = currentYear + "-" + currentMonth + "-" + currentDay

  
    if(serviceList == []){

    }else {
      page = Math.ceil(serviceList.length / servicePerPage)
      serviceOnPage = serviceList.slice(firstIndex, lastIndex)
    }
  numbers = [...Array(page + 1).keys()].slice(1)
  
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

    const showFilterOption = () => {
      document.getElementById("sort_options").classList.toggle("hidden");
      document.getElementById("sort_arrow-up").classList.toggle("hidden");
      document.getElementById("sort_arrow-down").classList.toggle("hidden");
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

      // Change page for pagination 
      const changePage = (pageNum) => {
        setCurrentPage(pageNum)
      }
      const PrevPage = () => {
        setCurrentPage(currentPage - 1)
      }
      const NextPage = () => {
        setCurrentPage(currentPage + 1)
      }

      // Set the rating filter values
      const setCheckboxValues = (value) => {
        const verify = checkBoxValuesArray.findIndex(index => index == value)
        if(verify == -1){
        const newValue = [...checkBoxValuesArray]
        newValue.push(value)
        setCheckBoxValuesArray(newValue)
        }else{
          const newValue = [...checkBoxValuesArray]
          newValue.splice(verify, 1)
        setCheckBoxValuesArray(newValue)
        }
        
        
      }
      

      // Handles the sorting of services
      const handleSort = () => {
  
        if(sortFilter == "Recent Services"){
          setCurrentPage(1)
          const newService = [...serviceList]
          const sort = newService.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
          setServiceList(sort)
          }else if (sortFilter == "Oldest Services"){
          const newService = [...serviceList]
          const sort = newService.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setServiceList(sort)
          }

          setRerender(rerender + 1)
      }

      // Handles the value of selected category
      const handleCategory = () => {
        setCategoryFilter(selectedCategory)

      }

      // Handles date filter
      useEffect(()=>{
      handleSort("Recent Services")
      },[])
      
      // Apply the filters
      const applyFilter = () => {
        setCheckboxFilter(checkBoxValuesArray)
        handleCategory()
        setSearchParams({category : selectedCategory, search : search == null ? "" : search, sort : sortFilter, rating : checkBoxValuesArray.join(',')})
        // By default
        if(selectedCategory == 'Select Category'){
          if(sortFilter == "Recent Services"){
            const newServices = [...ratingFilterValue]
            console.log(newServices)
            const sort = newServices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setServiceList(sort)
            }else if (sortFilter == "Oldest Services"){
            const sort = serviceList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            setServiceList(sort)
            }
        }
        else{
          const filtered = mainServiceList.filter(service => service.advanceInformation.ServiceCategory == selectedCategory)
          if(filtered.length === 0){setNoSearchResult(true)}
          if(sortFilter == "Recent Services"){
            setCurrentPage(1)
            const sort = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            setServiceList(sort)
            }else if (sortFilter == "Oldest Services"){
            setCurrentPage(1)
            const sort = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            setServiceList(sort)
            }
        }


        // Rerender so that the list will rerender
        setRerender(rerender + 1)
      }

      const clearFilter = () => {
        setSearchParams({category : "Select Category", search : search == null ? "" : search, sort : "Recent Services", rating : ""})
        // Resets the checkboxes
        setCheckboxFilter([])
        setCheckBoxValuesArray([])
        const checkboxes = document.querySelectorAll(".chkbox")
        checkboxes.forEach((chk)=>{
          chk.checked = false
        })

        // Resets the sort
        setSortFilter("Recent Services")
        const newServices = [...serviceList]
        const sort = newServices.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
        setServiceList(sort)
        setCurrentPage(1)

        // Reset the category
        setSelectedCategory("Select Category")
        setCategoryFilter("Select Category")

          setRerender(rerender + 1)

          window.location.reload()
      }

      // Apply the search for service
      const SearchService = () => {
        if (search === null || mainServiceList.length === 0) {
          // Handle the case when search is null or mainServiceList is empty
          return;
        }
      
        const filteredResults = serviceList.filter((item) =>
          item.basicInformation.ServiceTitle.toLowerCase().includes(search.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
        );
      
        const sortedResults = filteredResults.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      
        setServiceList(sortedResults);
        setNoSearchResult(sortedResults.length === 0);
      };
      

      const setRatingFilter = () => {

        if(serviceList != null )
        {
          if(search == "" || search == null)
          {
            const filtered = mainServiceList.filter((service) => {
              const { ratings } = service;
            
              if (
                ratings &&
                ratings[0].count !== undefined &&
                ratings[1].count !== undefined &&
                ratings[2].count !== undefined &&
                ratings[3].count !== undefined &&
                ratings[4].count!== undefined
              ) {
                const totalStars =
                  ratings[0].count +
                  ratings[1].count +
                  ratings[2].count +
                  ratings[3].count +
                  ratings[4].count;
                const averageRating = Math.floor(
                  (5 * ratings[0].count +
                    4 * ratings[1].count +
                    3 * ratings[2].count +
                    2 * ratings[3].count +
                    1 * ratings[4].count) /
                    totalStars
                );
            
                // Check if the averageRating is included in the array [4, 3, 2]
                return checkBoxValuesArray.length == 0 ? [5,4,3,2,1,0].includes(averageRating) : checkBoxValuesArray.includes(averageRating)
              }

            });
            return filtered
          }
          else{
            
            const servicesOnSearch = mainServiceList.filter((item) =>  item.basicInformation.ServiceTitle.toLowerCase().includes(search.toLowerCase())
            || item.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
            )
            const filtered = servicesOnSearch.filter((service) => {
              const { ratings } = service;
            
              if (
                ratings &&
                ratings[0].count !== undefined &&
                ratings[1].count !== undefined &&
                ratings[2].count !== undefined &&
                ratings[3].count !== undefined &&
                ratings[4].count!== undefined
              ) {
                const totalStars =
                ratings[0].count +
                ratings[1].count +
                ratings[2].count +
                ratings[3].count +
                ratings[4].count;
                const averageRating = Math.floor(
                    (5 * ratings[0].count +
                        4 * ratings[1].count +
                        3 * ratings[2].count +
                        2 * ratings[3].count +
                        1 * ratings[4].count) /
                        totalStars
                );
                
                if(checkBoxValuesArray.length == 0)
                {
                  return [5,4,3,2,1,0].includes(averageRating)
                }
                else 
                {
                  return checkBoxValuesArray.includes(averageRating)
                }
              }
            
              return false;
            });
            return filtered
            
          }
          
        }
      }

      // Get All services
     
     
      const getServices = async () => {
        try {
          const res = await http.get("getServices");
          const services = res.data.service;
    
          setServiceList(services);
          setMainServiceList(services);
          setRatingFilterValue(services);
        } catch (err) {
          console.error("Error fetching services:", err);
        }
      };
        
      
       
      //update the filter value whenever the checkbox rating is check
      useEffect(()=>{
        // const result = setRatingFilter()
        // if(result == undefined){
        //   setRatingFilter()
        // }
        // else{
        //   setRatingFilterValue(result)
        // }
       
        
       
      }, [checkBoxValuesArray])

      // get all services
      useEffect(()=>{
        setSearchInput(search)
        if(category != null)
        {
          setSelectedCategory(category)
        }
        if(sort != null)
        {
          setSortFilter(sort)
        }
        if(rating != null)
        { 
          const array = rating.split(',')
          setCheckBoxValuesArray(array.map(Number))

          
        }
        getServices()
      },[])

      useEffect(() => {
        // console.log('sdsd')
        SearchService();
        applyFilter()
        const filter = setRatingFilter()
        setRatingFilterValue(filter)
        
        
      }, [mainServiceList, search]);


  return (
    <div className=' w-full flex h-full'>
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
            <a onClick={()=>{setSortFilter("Recent Services");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a onClick={()=>{setSortFilter("Oldest Services");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
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
                  setSelectedCategory(category.category_name);
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
        ratingValues.map((ratings)=>{
            return (
                <div key={ratings} className='flex items-center justify-center space-x-2'>

                <input checked={checkBoxValuesArray.includes(ratings)} value={ratings} onChange={()=>{setCheckboxValues(ratings)}} className='chkbox w-5 h-5' type='checkbox'/><StyledRating className='relative'  readOnly defaultValue={ratings} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                <p className='w-3'>{ratings}.0</p>
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
        <button onClick={()=>{applyFilter()}} className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button onClick={()=>{clearFilter()}} className='font-medium'>Clear Filters</button>
        </div>
        </section>

        {/* Right Section */}
        
        <section className='w-[100%] grid place-items-center h-full pt-[100px] ps-2 lg:pe-20 pb-5 bg-[#F9F9F9]'>
        {/* Sort Container */}
        {
          serviceOnPage.length == 0 ?
          (
            
              noSearchResult ? 
              (
        <div className='flex flex-col ml-2.5 w-fit items-end '>
          <p className='text-2xl text-center w-full'>No Result</p>
        <div className="w-full flex space-x-2 shadow-sm mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex">
        <div className="w-full">
        <div className="relative">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <input value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}  onKeyDown={(e)=>{if(e.key == "Enter"){setSearchParams({category : selectedCategory, search : e.target.value, sort : sortFilter, rating : checkBoxValuesArray.toString()});SearchService(e.target.value)}}} type="text" className="bg-white h-12 w-full px-12 border rounded-lg focus:outline-none hover:cursor-arrow" placeholder='Search'/>

        </div> 
        
        </div>
        </div>
        </div>
        </div>
              ) 
              :
              <div className="lds-dual-ring w-full h-screen"></div>
          )

          :
          
          (
        <div>
          {/* Search Box */}
        <div className='flex flex-col ml-2.5 w-fit items-end '>
        <div className="w-full flex space-x-2 shadow-sm mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <div className="md:flex">
        <div className="w-full">
        <div className="relative">
          <SearchOutlinedIcon className="absolute text-gray-500 top-[0.9rem] left-4"/>
          <input value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}}  onKeyDown={(e)=>{if(e.key == "Enter"){setSearchParams({category : selectedCategory, search : e.target.value, sort : sortFilter, rating : checkBoxValuesArray.join(',')});SearchService(e.target.value)}}} type="text" className="bg-white h-12 w-full px-12 border rounded-lg focus:outline-none hover:cursor-arrow" placeholder='Search'/>

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
          
            serviceOnPage.map((service, index)=>{
              const ratings = service.ratings; // Assuming "services" is the array of services
              const ratingTotal = ratings[0].count + ratings[1].count + ratings[2].count +ratings[3].count + ratings[4].count;
              const ratingAverage = (5 * ratings[0].count + 4 * ratings[1].count + 3 * ratings[2].count + 2 * ratings[3].count + 1 * ratings[4].count) / ratingTotal;
              const rounded = Math.round(ratingAverage * 100) / 100;
              const from = new Date(service.dateCreated);
              const to = new Date(thisDate);
              const years = to.getFullYear() - from.getFullYear();
              const months = to.getMonth() - from.getMonth();
              const days = to.getDate() - from.getDate();
              // console.log(service._id)
                  return (  
                           
                    <div  key={index}  className='border relative flex cursor-pointer flex-col items-center xl:flex-row xl:space-x-6 xl:my-2 bg-white shadow-sm rounded-lg p-3'>
                    {/* Image Container */}
                    <Link key={service._id} to={`/explore/viewService/${service._id}`} className='flex relative xl:w-[330px] xl:min-w-[330px] xl:h-[200px] cursor-pointer'>
                    <p className='absolute bg-white px-2 py-1 text-sm font-semibold rounded-full top-1 left-1'>{service.advanceInformation.ServiceCategory}</p>
                    <img className='w-full h-full min-h-[200px] max-h-[200px] rounded-lg' src={service.serviceProfileImage} alt="Cover"/>
                    </Link>
                    {/* Info Container */}
                    <div className=' px-1 py-3 w-full overflow-hidden flex flex-col justify-between space-y-5'>
                      {/* Title and Reviews*/}
                      <div className='Header_Container space-y-2 xl:space-y-0 w-full flex flex-col xl:flex-row justify-between'>
                      <div className='w-full overflow-hidden'>
                        <h1 className='font-bold text-md md:text-xl ps-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>{service.basicInformation.ServiceTitle}</h1>
                        <p className='text-sm md:text-md text-gray-400  flex items-center gap-1'><Person2OutlinedIcon  />{service.owner.firstname + " " + service.owner.lastname}</p>
                        {
                        years > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{years}{years > 1 ? " years ago" : " year ago"}</p>) : months > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{months}{months > 1 ? " months ago" : " month ago"}</p>) : days > 0  ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{days} {days > 1 ? " days ago" : " day ago"}</p>) : (<p className='text-xs text-gray-400 ml-1 mt-1'>Less than a day ago</p>)
                        }
                      </div>
                      {/* Reviews */}
                      <div className='flex flex-col w- whitespace-nowrap relative ml-0  xl:ml-3 mr-2 space-x-1'>
                      <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                      <div className='flex items-center space-x-2'>
                      <p className='text-gray-400 text-sm font-medium'>({ratingTotal == 0  ? "0" : rounded.toFixed(1)})</p> 
                      <p className='text-gray-300'>|</p>
                      <p className='text-gray-700 text-sm pt-[2.5px] font-medium'>{ratingTotal + " Reviews"}</p> 
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
                        <p className='text-themeGray whitespace-nowrap overflow-hidden text-ellipsis'>{service.address.barangay + ", " + service.address.municipality + ", " + service.address.province}</p>
                        </div>
                        {/* More Options Button */}
                        <OutsideClickHandler onOutsideClick={()=>{setActiveId(null)}}>
                        <MoreVertIcon onClick={()=>{openMoreOptions(service._id)}} className={` ${service._id == activeId ? "text-gray-300" : "text-gray-600"} cursor-pointer hover:text-gray-300`} />
                        <div id={service.id} className={`${service._id == activeId ? "absolute" : "hidden"} options ease-in-out duration-200 z-20  bg-gray-100 shadow-lg rounded-md right-[2rem] top-[12rem]`}>
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

                          )
                
                
              
                
            })
          }
          
        </article>
        </div>
        )
        }
        
        {/* PAGINATION */}
        <nav className='py-1 text-center' >
        <ul className="inline-flex -space-x-px text-sm">
        <li>
          {
            currentPage == 1
            ?
            (
              <button disabled="disabled" onClick={()=>{PrevPage()}} className="flex items-center justify-center disabled:bg-gray-200 disabled:hover:text-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">Previous</button>
            )
            :
            (
              <button onClick={()=>{PrevPage()}} className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">Previous</button>
            )
          }
       
        </li>
      {
      numbers.map((num, index)=>{
        return (
        <li key={index}>
        <a onClick={()=>{changePage(num)}} className={`${currentPage === num ? "bg-themeBlue" : "bg-white"} flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer`}>{num}</a>
        </li>
              )
      })
      }

      <li>
        {
          currentPage == page
          ?
          (
            <button disabled onClick={()=>{NextPage()}} className="flex items-center justify-center disabled:bg-gray-200 disabled:hover:text-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">Next</button>
          )
          :
          (
            <button onClick={()=>{NextPage()}} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">Next</button>
          )
        }
      
      </li>
      </ul>
      </nav>
      </section>
      </div>
  )
}

export default Explore