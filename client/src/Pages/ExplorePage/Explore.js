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
import { services } from '../MainPage/Components/Services/Services';
import { categories } from '../MainPage/Components/Categories';



const Explore = () => {
  const handleFilter = (value) => {
    if(value == "Most Recent"){
      setSortFilter("Recent Services")
      setCurrentPage(1)
      const test = services.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
      setServiceList(test)
      }else if (value == "Oldest"){
        setSortFilter("Oldest")
        setCurrentPage(1)
        const test = services.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
        setServiceList(test)
      }
  }
  const [sortFilter, setSortFilter] = useState('Most Recent')
  const [serviceList, setServiceList] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Select Category')
  const [checkBoxValuesArray, setCheckBoxValuesArray] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const servicePerPage = 4
  const lastIndex = currentPage * servicePerPage
  const firstIndex = lastIndex - servicePerPage
  const page = Math.ceil(services.length / servicePerPage)
  const numbers = [...Array(page + 1).keys()].slice(1)
  const serviceOnPage = services.slice(firstIndex, lastIndex)
  const [places, setPlaces] = useState([])
  const [location, setLocation] = useState(null);
  const ratingValues = [5,4,3,2,1]
  const [search, setSearch] = useState('')
  const [locationFilterValue, setLocationFilterValue] = useState('')

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const thisDate = currentYear + "-" + currentMonth + "-" + currentDay
  
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
    
    // Utilizing speech to text
    useEffect(()=>{
        if(listening){
            setSearch(transcript)
        }else{

        }
       
      },[])

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

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

      // Handles date filter
      useEffect(()=>{
      handleFilter("Most Recent")
      },[])
      
 
        
      

      

      
      

      
  return (
    <div className=' w-full flex h-full'>
        {/* Left Section */}
        <section className='w-[500px] hidden lg:flex h-full relative flex-col space-y-5 pb-5 pt-20 lg:ps-20 pe-5 bg-[#F9F9F9]'>
        
        <div className='flex flex-col space-y-5 px-7 mt-10'>
        <h1 className='font-bold text-2xl'>Find your Service</h1>
        {/* Search box */}
        <div className="w-full shadow-sm mx-auto rounded-lg overflow-hidden md:max-w-xl">
        <h1 className='font-semibold text-lg mb-2'>Search</h1>
        <div className="md:flex">
        <div className="w-full">
        <div className="relative">
          <SearchOutlinedIcon className="absolute text-gray-400 top-[0.9rem] left-4"/>
          <input value={search} onChange={(e)=>{setSearch(e.target.value)}} type="text" className="bg-white h-12 w-full px-12 border rounded-lg focus:outline-none hover:cursor-arrow" placeholder='Search'/>
          {
            listening ?
            <span onClick={SpeechRecognition.stopListening} className="absolute cursor-pointer top-2.5 right-3 border-l pl-2"><KeyboardVoiceIcon className='text-blue-400' /></span>
            :
            <span onClick={SpeechRecognition.startListening} className="absolute cursor-pointer top-2.5 right-3 border-l pl-2"><KeyboardVoiceIcon /></span>
          }
          
        </div> 
        </div>
        </div>
        </div>

        {/* Category Filter */}

        <div className="flex-none w-full relative">
        <h1 className='font-semibold text-lg mb-2'>Categories</h1>
        <button onClick={()=>{showDropdownOptions()}} className="flex flex-row justify-between w-full px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{selectedCategory}</span>

            <svg id="arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <svg id="arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        <div id="options" className=" hidden ease-in duration-100 origin-top w-full h-[300px] overflow-auto py-2 mt-2 z-50 absolute bg-white rounded-lg shadow-xl">
          {
            categories.map((category)=>{
              return (
                <p key={category.id} onClick={()=>{setSelectedCategory(category.category_name);showDropdownOptions()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 cursor-pointer hover:text-white">{category.category_name}</p>
              )
            })
          }
            
        </div>
        </div>

        {/* Rating Filter */}
        <div className=' flex flex-col justify-start items-start'>
        <h1 className='font-semibold text-lg mb-2'>Rating</h1>
        <div className='flex flex-col space-y-3 items-center'>
        {
        ratingValues.map((rating)=>{
            return (
                <div key={rating} className='flex items-center justify-center space-x-2'>
                <input value={rating} onChange={()=>{setCheckboxValues(rating)}} className='w-5 h-5' type='checkbox'/><StyledRating className='relative'  readOnly defaultValue={rating} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
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
        <h1 className='font-semibold text-lg mb-2'>Location</h1>
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
        <button className=' bg-themeOrange text-white py-2 rounded-sm font-medium'>Apply Filters</button>
        <button className='font-medium'>Clear Filters</button>
        </div>
        </section>


        {/* Right Section */}
        
        <section className='w-[100%] grid place-items-center h-full pt-[100px] ps-2 lg:pe-20 pb-5 bg-[#F9F9F9]'>
        {/* Sort Container */}
        {
          serviceList == null ?
          (
            <div class="lds-dual-ring w-full h-screen"></div>
          )
          :
          (
            <div>
              <div className='flex flex-col w-fit items-end '>
        <div className='w-fit flex items-center space-x-3'>
          <p>Sort by:</p>

        <button onClick={()=>{showFilterOption()}} className="flex flex-row justify-between w-[160px] px-2 py-3 text-gray-700 bg-white border-2 border-white rounded-md shadow focus:outline-none focus:border-blue-600">
            <span className="select-none font-medium">{sortFilter}</span>

            <svg id="sort_arrow-down" className="hidden w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            <svg id="sort_arrow-up" className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        </button>
        </div>
        <div id="sort_options" className="hidden ease-in duration-100 origin-top absolute w-[160px] py-2 mt-14 z-50  bg-white rounded-lg shadow-xl">
            <a onClick={()=>{handleFilter("Most Recent");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Recent Services</a>
            <a onClick={()=>{handleFilter("Oldest");showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Oldest Services</a>
            <a onClick={()=>{handleFilter();showFilterOption()}} className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">Ratings</a>
        </div>
        
        </div>
        {/* Cards Container */}
        <article className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-1 h-fit  px-3 mt-5 mb-5'>
          {/* Card */}
          {
          
            serviceOnPage.map((service, index)=>{
              const ratings = service.rating; // Assuming "services" is the array of services
              const ratingTotal = ratings['5star'] + ratings['4star'] + ratings['3star'] + ratings['2star'] + ratings['1star'];
              const ratingAverage = (5 * ratings['5star'] + 4 * ratings['4star'] + 3 * ratings['3star'] + 2 * ratings['2star'] + 1 * ratings['1star']) / ratingTotal;
              const rounded = Math.round(ratingAverage * 100) / 100;
              const from = new Date(service.dateCreated);
              const to = new Date(thisDate);
              const years = to.getFullYear() - from.getFullYear();
              const months = to.getMonth() - from.getMonth();
              const days = to.getDate() - from.getDate();
            

              if(checkBoxValuesArray.includes(Math.floor(ratingAverage)))
              {
                return (
                  
                      
                  <div key={index} className='border flex flex-col items-center xl:flex-row xl:space-x-6 xl:my-5 bg-white shadow-sm rounded-lg p-3'>
                    {/* Image Container */}
                    
                    <div className='flex xl:w-[330px] xl:min-w-[330px] xl:h-[200px]'>
                    <img className='w-full h-full rounded-lg' src={service.image} alt="Cover"/>
                    </div>
                    {/* Info Container */}
                    <div className=' px-1 py-3 w-full overflow-hidden flex flex-col justify-between space-y-5'>
                      {/* Title and Reviews*/}
                      <div className='Header_Container space-y-2 xl:space-y-0 w-full flex flex-col xl:flex-row justify-between'>
                      <div>
                      
                        <h1 className='font-bold text-md md:text-xl ps-1'>{service.title}</h1>
                        <p className='text-sm md:text-md text-gray-400  flex items-center gap-1'><Person2OutlinedIcon  />{service.owner}</p>
                        {
                        years > 0 ? (<div>{years}</div>) : months > 0 ? (<div>{months} months ago</div>) : ((<div>less than a month ago</div>))
                        }
                        </div>
                      {/* Reviews */}
                      <div className='flex flex-col w-fit relative ml-0  xl:ml-3 space-x-1'>
                      <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                      <div className='flex items-center space-x-2'>
                      <p className='text-gray-400 text-sm font-medium'>({rounded.toFixed(1)})</p> 
                      <p className='text-gray-300'>|</p>
                      <p className='text-gray-700 text-sm pt-[2.5px] font-medium'>{ratingTotal + " Reviews"}</p> 
                      </div>
                      </div>
                      </div>
    
    
                      {/* Description */}
                      <div className=' p-2 w-full h-[3.2em]  overflow-hidden text-ellipsis'>
                      <p className='text-sm'>{service.description}</p>
                      </div>
    
                      {/* Location */}
                      <div className='flex space-x-1 w-[300px] xl:w-full   ml-1 xl:ml-2'>
                        <ShareLocationOutlinedIcon className='text-themeGray' />
                        <p className='text-themeGray whitespace-nowrap overflow-hidden text-ellipsis'>{service.Address}</p>
                      </div>
                      
                    </div>
                  </div>
                        )
              }else if(checkBoxValuesArray.length == 0){
                return (
                      
                  <div key={index} className='border flex flex-col items-center xl:flex-row xl:space-x-6 xl:my-5 bg-white shadow-sm rounded-lg p-3'>
                    {/* Image Container */}
                    <div className='flex xl:w-[330px] xl:min-w-[330px] xl:h-[200px]'>
                    <img className='w-full h-full rounded-lg' src={service.image} alt="Cover"/>
                    </div>
                    {/* Info Container */}
                    <div className=' px-1 py-3 w-full overflow-hidden flex flex-col justify-between space-y-5'>
                      {/* Title and Reviews*/}
                      <div className='Header_Container space-y-2 xl:space-y-0 w-full flex flex-col xl:flex-row justify-between'>
                      <div>
                        <h1 className='font-bold text-md md:text-xl ps-1'>{service.title}</h1>
                        <p className='text-sm md:text-md text-gray-400  flex items-center gap-1'><Person2OutlinedIcon  />{service.owner}</p>
                        {
                        years > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{years}{years > 1 ? " years ago" : " year ago"}</p>) : months > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{months}{months > 1 ? " months ago" : " month ago"}</p>) : days > 0  ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{days} {days > 1 ? " days ago" : " day ago"}</p>) : (<p className='text-xs text-gray-400 ml-1 mt-1'>Less than a day ago</p>)
                      }
                      </div>
                      {/* Reviews */}
                      <div className='flex flex-col w-fit relative ml-0  xl:ml-3 space-x-1'>
                      <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={rounded} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                      <div className='flex items-center space-x-2'>
                      <p className='text-gray-400 text-sm font-medium'>({rounded.toFixed(1)})</p> 
                      <p className='text-gray-300'>|</p>
                      <p className='text-gray-700 text-sm pt-[2.5px] font-medium'>{ratingTotal + " Reviews"}</p> 
                      </div>
                      </div>
                      </div>
    
    
                      {/* Description */}
                      <div className=' p-2 w-full h-[3.2em]  overflow-hidden text-ellipsis'>
                      <p className='text-sm'>{service.description}</p>
                      
                      </div>
    
                      {/* Location */}
                      <div className='flex space-x-1 w-[300px] xl:w-full   ml-1 xl:ml-2'>
                        <ShareLocationOutlinedIcon className='text-themeGray' />
                        <p className='text-themeGray whitespace-nowrap overflow-hidden text-ellipsis'>{service.Address}</p>
                      </div>
                      
                    </div>
                  </div>
                        )
              }
                
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
      <a  onClick={()=>{PrevPage()}} className="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">Previous</a>
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
      <a onClick={()=>{NextPage()}} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 cursor-pointer">Next</a>
    </li>
  </ul>
        </nav>

        </section>
    </div>
  )
}

export default Explore