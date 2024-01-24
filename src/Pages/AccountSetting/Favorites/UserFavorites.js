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

const UserFavorites = () => {
    const navigate = useNavigate()
    const {getFavorites} = UseFavorite()
    const [favoriteList, setFavoriteList] = useState([])
    const [openDirection, setOpenDirection] = useState("down")
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [showFilter, setShowFilter] = useState(false)

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

    const finalize_list = (favorites) => {
      return favorites?.map((favorite)=>{
          const ratings = favorite.service.ratings
          const totalRatings = ratings[0].count + ratings[1].count + ratings[2].count +ratings[3].count + ratings[4].count;
          const ratingAverage = (5 * ratings[0].count + 4 * ratings[1].count + 3 * ratings[2].count + 2 * ratings[3].count + 1 * ratings[4].count) / totalRatings;
          const rounded = Math.round(ratingAverage * 100) / 100;
          const average = rounded.toFixed(1)

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
          ratings : average,
          totalReviews : totalRatings
        }
      })
    }

    const getFavoritesFunction = async () => {
      const favorites = await getFavorites()
      setFavoriteList(finalize_list(favorites))      
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
        getFavoritesFunction()
    },[])

    const handleOpenMoreOption = (index) => {
      setSelectedIndex(index)
      index === selectedIndex && setSelectedIndex(null)
      if(index === favoriteList.length - 1)
      {
        setOpenDirection("up")
      }
      else{
        setOpenDirection("down")
      }
      
    }

    const sortList = (option) => {
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
      setShowFilter(false)
    }

    
  return (
    <div onClick={()=>{setSelectedIndex(null);setShowFilter(false)}} className='w-full pl-10 h-full flex flex-col p-3'>
      <h1 className='mt-5 text-2xl font-semibold text-gray-800'>My Favorites</h1>
        <hr className='my-3'></hr>
          <nav className='px-2 py-1 flex items-center space-x-2 relative'>
            <button onClick={(e)=>{setShowFilter(!showFilter);e.stopPropagation()}}>
              <SortOutlinedIcon />
            </button>
            <span className='text-sm font-medium text-gray-600 mt-1'>Showing {favoriteList.length} results</span>
              <SortDropdown sortList={sortList} showFilter={showFilter} />
          </nav>
          <div onClick={()=>{setSelectedIndex(null);setShowFilter(false)}} className='w-full h-full relative z-0 flex flex-col space-y-6 overflow-auto max-h-full'>
          {
            favoriteList?.map((favorite, index)=>{
              return (
              <div  onMouseEnter={()=>{setHoveredIndex(index)}} key={favorite._id} className='serviceItem relative flex items-stretch bg-white gap-5 hover:bg-gray-100 p-2 rounded-md cursor-pointer'>
                <div id='imageContainer' className='flex bg-stone-300 shadow-sm rounded-md items-center justify-center h-[80px] md:h-[100px] xl:h-[120px] aspect-video'>
                  <img className='w-full h-full object-scale-down ' src={favorite.serviceProfileImage} />
                </div>
                <div onClick={()=>{navigate(`/explore/viewService/${favorite.serviceId}`)}} id='infoContainer' className='flex flex-col w-full items-start justify-between'>
                  <div id='Header' className='flex flex-col'><h1 className='text-xl text-gray-800 font-semibold'>{favorite.serviceTitle}</h1>
                    <div id='nameAndYear' className='flex items-center gap-2'>
                      <h2 className='text-semiSm text-gray-500 font-medium'>{favorite.owner}</h2>
                        <span className='w-1 h-1 rounded-full bg-gray-500'></span>
                      <h2 className='text-semiSm text-gray-500 font-medium'>{favorite.createdAgo}</h2>
                    </div>
                  </div>
                  <div id='rating container'>
                    <div className='flex whitespace-nowrap relative ml-0 items-center'>
                      <StyledRating className='relative '  readOnly defaultValue={Number(favorite.ratings)} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
                        <div className='flex items-center space-x-2 pl-1'>
                          <p className='text-gray-400 text-sm font-medium'>{favorite.ratings}</p> 
                          <p className='text-gray-300'>|</p>
                          <p className='text-gray-500 text-semiSm mt-0.5 font-medium'>{favorite.totalReviews} Reviews</p> 
                        </div>
                    </div>
                  </div>
                </div>
                  <div className={`w-[70px] relative top-0 right-0 h-full flex items-center justify-center`}>
                    <button onClick={(e)=>{handleOpenMoreOption(index);e.stopPropagation()}} className={`${index === hoveredIndex ? "flex" : "hidden"}  cursor-pointer p-2`}>
                    <MoreVertOutlinedIcon  className='text-gray-700 cursor-pointer hover:text-gray-500' />
                    </button>
                    <MoreOption selectedIndex={selectedIndex} removeFavorites={removeFavorites} serviceId={favorite.serviceId} index={index} openDirection={openDirection} addToDNS={addToDNS}  />
                  </div>
              </div>
            )})
          }
          </div>
    </div>
  )
}

const MoreOption = ({selectedIndex, index, openDirection, serviceId, removeFavorites, addToDNS}) => {
  return (
    <div className={`w-fit ${selectedIndex === index ? '' : 'hidden'} flex flex-col z-20 rounded-md absolute bg-white shadow-md ${openDirection === "up" ? "-left-[10rem] -top-[6rem]" : "-left-[10rem] top-[4.5rem]"}`}>
      <button className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><ContentCopyOutlinedIcon fontSize='small' className='p-0.5' />Copy link address</button>
      <button onClick={()=>removeFavorites(serviceId)} className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><RemoveCircleOutlineOutlinedIcon fontSize='small' className='p-0.5' />Remove from favorites</button>
      <button onClick={()=>addToDNS(serviceId)} className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><BlockOutlinedIcon fontSize='small' className='p-0.5' />Do not show</button>
    </div>
  )
}

const SortDropdown = ({sortList, showFilter}) => {
  return (
    <div className={`w-fit ${showFilter ? "flex" : "hidden"} flex-col z-20 -bottom-[9rem] left-0 rounded-md absolute bg-[#f9f9f9] shadow-md`}>
      <button onClick={()=>sortList('newestAdded')} className='text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'>Date added (newest)</button>
      <button onClick={()=>sortList('oldestAdded')}  className='text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'>Date added (oldest)</button>
      <button onClick={()=>sortList('MostRated')} className='text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'>Most Rated</button>
      <button onClick={()=>sortList('LeastRated')} className='text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'>Least Rated</button>
    </div>
  )
}

export default UserFavorites