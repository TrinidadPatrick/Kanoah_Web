import React, { useEffect, useState } from 'react'
import UseFavorite from '../../../ClientCustomHook/FavoriteProvider'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';

const UserFavorites = ({authenticated}) => {
    const navigate = useNavigate()
    const {getFavorites} = UseFavorite()
    const UFsortOption = localStorage.getItem("UFsortOption")
    const [loading, setLoading] = useState(true)
    const [favoriteList, setFavoriteList] = useState([])
    const [openDirection, setOpenDirection] = useState("down")
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [showFilter, setShowFilter] = useState(false)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    // Update window width on resize
    const handleResize = () => {
    setWindowWidth(window.innerWidth);
    };

    const finalize_list = (favorites) => {
      return favorites?.map((favorite)=>{

          const currentDate = new Date();
          const thisDate = currentDate.toISOString().split('T')[0]; // Extract only the date part
          const from = new Date(favorite.service.createdAt);
          const to = new Date(thisDate);
          const years = to.getFullYear() - from.getFullYear();
          const months = to.getMonth() - from.getMonth();
          const days = to.getDate() - from.getDate();
          const createdAgo =  years > 0 ? `${years} ${years === 1 ? 'year' : 'years'} ago` : months > 0 ? `${months} ${months === 1 ? 'month' : 'months'} ago` : days > 0 ? `${days} ${days === 1 ? 'day' : 'days'} ago` : 'Less than a day ago';
        return {
          key : favorite._id,
          _id : favorite._id,
          serviceId : favorite.service._id,
          serviceProfileImage : favorite.service.serviceProfileImage,
          serviceTitle : favorite.service.basicInformation.ServiceTitle,
          owner : favorite.service.owner.firstname + " " + favorite.service.owner.lastname,
          createdAgo,
          createdAt : favorite.createdAt,
        }
      })
    }

    const getFavoritesFunction = async () => {
      const favorites = await getFavorites()
      setFavoriteList(finalize_list(favorites))  
      setLoading(false)    
    }

    const addToDNS = async (serviceId) => { 
      const data = {
        serviceId,
        createdAt : new Date()
      }

      try {
        const result = await http.post('addToDoNotShow', data, {withCredentials : true})
        removeFavorites(serviceId)
        getFavoritesFunction() 
      } catch (error) {
        console.log(error)
      }
    }

    const removeFavorites = async (serviceId) => {
      const favoriteInstance = [...favoriteList]
      const index = favoriteInstance.findIndex((favorite) => favorite.serviceId === serviceId)
      favoriteInstance.splice(index, 1)
      setFavoriteList(favoriteInstance)
      try {
        const result = await http.delete(`removeFavorite/${serviceId}`,{withCredentials : true})
        getFavoritesFunction()
      } catch (error) {
        console.log(error)
      }
    }
    
    useEffect(()=>{
        if(authenticated)
        {
          getFavoritesFunction()
        }
        
    },[authenticated])

    useEffect(()=>{
      if(favoriteList.length !== 0)
      {
        if(UFsortOption != undefined || UFsortOption != null)
        {
          sortList(UFsortOption)
        }
        else
        {
          
          sortList('newestAdded')
          localStorage.setItem("UFsortOption","newestAdded" )
        }
        
      }
    },[loading])

   // Attach event listener on component mount and clean up on unmount
   useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
   }, []);

    const handleOpenMoreOption = (index) => {
      setSelectedIndex(index)
      index === selectedIndex && setSelectedIndex(null)
      if(index === favoriteList.length - 1 && favoriteList.length > 3)
      {
        setOpenDirection("up")
      }
      else{
        setOpenDirection("down")
      }
      
    }

    const sortList = (option) => {
      localStorage.setItem("UFsortOption", option)
      const favoriteInstance = [...favoriteList]
      const convertedFavorite = favoriteInstance.map((favorite) => ({...favorite, createdAt : new Date(favorite.createdAt)}))
      switch (option)
      {
        case "newestAdded" :
        
        const newestSorted = convertedFavorite.sort((a,b) => a.createdAt - b.createdAt)
        setFavoriteList(newestSorted)
        break

        case "oldestAdded" :
        const oldestSorted = convertedFavorite.sort((a,b) => b.createdAt - a.createdAt)
        setFavoriteList(oldestSorted)
        break

        case "MostRated" :
        const mostRatedSorted = convertedFavorite.sort((a,b) => Number(b.ratings) - Number(a.ratings))
        setFavoriteList(mostRatedSorted)
        break

        case "LeastRated" :
        const leastRatedSorted = convertedFavorite.sort((a,b) => Number(a.ratings) - Number(b.ratings))
        setFavoriteList(leastRatedSorted)
        break
      }
      
    }

    const copyToClipboard = (textToCopy) => {
      navigator.clipboard.writeText(textToCopy)
    };
    
  return (
    <>
    {
      loading ?
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
      :
      <div onClick={()=>{setSelectedIndex(null);setShowFilter(false)}} className='w-full semiMd:pl-10 h-full flex flex-col p-3'>
      <h1 className='mt-5 text-2xl font-semibold text-gray-800'>My Favorites</h1>
        <hr className='my-3'></hr>
          <nav className='px-2 py-1 flex items-center space-x-2 relative'>
            <button className='bg-gray-100 border border-[#e1e1e1] rounded-sm px-0.5' onClick={(e)=>{setShowFilter(!showFilter);e.stopPropagation()}}>
              <SortOutlinedIcon />
            </button>
            <span className='text-sm font-medium text-gray-600 mt-1'>Showing {favoriteList.length} results</span>
              <SortDropdown sortOption={UFsortOption} setShowFilter={setShowFilter} sortList={sortList} showFilter={showFilter} />
          </nav>
          <div onClick={()=>{setSelectedIndex(null);setShowFilter(false)}} className='w-full text-ellipsis overflow-x-hidden h-full relative z-0 flex flex-col space-y-6 overflow-auto max-h-full'>
          {
            favoriteList?.map((favorite, index)=>{
              return (
              <div onMouseLeave={()=>setHoveredIndex(null)} onMouseEnter={()=>{setHoveredIndex(index)}} key={favorite._id} className='serviceItem w-full relative flex items-stretch bg-white gap-2 semiSm:gap-5 hover:bg-gray-100 p-2 rounded-md cursor-pointer'>
                <div id='imageContainer' className='flex bg-stone-300 shadow-sm rounded-md  items-center justify-center h-[70px] semiSm:h-[80px] md:h-[100px] xl:h-[120px] aspect-video'>
                  <img className='w-full h-full object-contain rounded-md ' src={favorite.serviceProfileImage} />
                </div>
                <div onClick={()=>{navigate(`/explore/viewService/${favorite.serviceId}`)}} id='infoContainer' className='flex flex-col w-full items-start justify-between'>
                  <div id='Header' className='w-full  flex flex-col'><h1 className='text-base whitespace-nowrap  semiSm:text-xl text-gray-800 font-semibold'>{favorite.serviceTitle}</h1>
                    <div id='nameAndYear' className='flex items-center gap-2'>
                      <h2 className='text-semiXs semiSm:text-semiSm whitespace-nowrap text-gray-500 font-medium'>{favorite.owner}</h2>
                        <span className='w-1 h-1 rounded-full bg-gray-500'></span>
                      <h2 className='text-semiXs semiSm:text-semiSm whitespace-nowrap text-gray-500 font-medium'>{favorite.createdAgo}</h2>
                    </div>
                  </div>
                  
                </div>
                  <div className={`w-[70px] relative top-0 right-0 h-full flex items-center justify-center`}>
                    <button onClick={(e)=>{handleOpenMoreOption(index);e.stopPropagation()}} className={`${index === hoveredIndex ? "flex" : "hidden"}  cursor-pointer p-2`}>
                    <MoreVertOutlinedIcon  className='text-gray-700 cursor-pointer hover:text-gray-500' />
                    </button>
                    <MoreOption copyToClipboard={copyToClipboard} selectedIndex={selectedIndex} removeFavorites={removeFavorites} serviceId={favorite.serviceId} index={index} openDirection={openDirection} addToDNS={addToDNS}  />
                  </div>
              </div>
            )})
          }
          </div>
    </div>
    }
   
    </>
  )
}

const MoreOption = ({selectedIndex, index, openDirection, serviceId, removeFavorites, addToDNS, copyToClipboard}) => {
  return (
    <div className={`w-fit ${selectedIndex === index ? '' : 'hidden'} flex flex-col z-20 rounded-md absolute bg-white shadow-md ${openDirection === "up" ? "-left-[10rem] -top-[4rem]" : "-left-[10rem] top-[4.5rem]"}`}>
      <button onClick={()=>copyToClipboard(`https://web-based-service-finder.vercel.app/explore/viewService/${serviceId}`)} className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><ContentCopyOutlinedIcon fontSize='small' className='p-0.5' />Copy link address</button>
      <button onClick={()=>removeFavorites(serviceId)} className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><RemoveCircleOutlineOutlinedIcon fontSize='small' className='p-0.5' />Remove from favorites</button>
      <button onClick={()=>addToDNS(serviceId)} className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><BlockOutlinedIcon fontSize='small' className='p-0.5' />Do not show</button>
    </div>
  )
}

const SortDropdown = ({sortList, showFilter, setShowFilter, UFsortOption}) => {
  return (
    <div className={`w-fit ${showFilter ? "flex" : "hidden"} flex-col z-20 -bottom-[9rem] left-0 rounded-md absolute overflow-hidden bg-[#f9f9f9] shadow-md`}>
      <button onClick={()=>{sortList('newestAdded');setShowFilter(false)}} className={`${UFsortOption === "newestAdded" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Date added (newest)</button>
      <button onClick={()=>{sortList('oldestAdded');setShowFilter(false)}} className={`${UFsortOption === "oldestAdded" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Date added (oldest)</button>
      <button onClick={()=>{sortList('MostRated');setShowFilter(false)}}   className={` ${UFsortOption === "MostRated" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Most Rated</button>
      <button onClick={()=>{sortList('LeastRated');setShowFilter(false)}} className={` ${UFsortOption === "LeastRated" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Least Rated</button>
    </div>
  )
}

export default UserFavorites