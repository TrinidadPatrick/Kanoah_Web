import React, { useEffect, useState } from 'react'
import UseDNS from '../../../ClientCustomHook/DNSProvider';
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

const BlockedServices = ({authenticated}) => {
    const navigate = useNavigate()
    const {getDNS} = UseDNS()
    const [DNSList, setDNSList] = useState([])
    const [openDirection, setOpenDirection] = useState("down")
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [showFilter, setShowFilter] = useState(false)
    const [loading, setLoading] = useState(true)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const BSsortOption = localStorage.getItem("BSsortOption")

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

    const finalize_list = (dnsList) => {
      return dnsList.map((dns)=>{
          const ratings = dns.service.ratings
          const totalRatings = ratings[0].count + ratings[1].count + ratings[2].count +ratings[3].count + ratings[4].count;
          const ratingAverage = (5 * ratings[0].count + 4 * ratings[1].count + 3 * ratings[2].count + 2 * ratings[3].count + 1 * ratings[4].count) / totalRatings;
          const rounded = Math.round(ratingAverage * 100) / 100;
          const average = rounded.toFixed(1)

          const currentDate = new Date();
          const thisDate = currentDate.toISOString().split('T')[0]; // Extract only the date part
          const from = new Date(dns.service.createdAt);
          const to = new Date(thisDate);
          const years = to.getFullYear() - from.getFullYear();
          const months = to.getMonth() - from.getMonth();
          const days = to.getDate() - from.getDate();
          const createdAgo =  years > 0 ? `${years} ${years === 1 ? 'year' : 'years'} ago` : months > 0 ? `${months} ${months === 1 ? 'month' : 'months'} ago` : days > 0 ? `${days} ${days === 1 ? 'day' : 'days'} ago` : 'Less than a day ago';
        return {
          key : dns._id,
          _id : dns._id,
          serviceId : dns.service._id,
          serviceProfileImage : dns.service.serviceProfileImage,
          serviceTitle : dns.service.basicInformation.ServiceTitle,
          owner : dns.service.owner.firstname + " " + dns.service.owner.lastname,
          createdAgo,
          createdAt : dns.createdAt,
          ratings : average,
          totalReviews : totalRatings
        }
      })
    }

    const getDNSFunction = async () => {
      const DNS = await getDNS()
      setDNSList(finalize_list(DNS)) 
      setLoading(false)     
    }

    const removeDNS = async (serviceId) => {
      const DNSInstance = [...DNSList]
      const index = DNSInstance.findIndex((dns) => dns.serviceId === serviceId)
      DNSInstance.splice(index, 1)
      setDNSList(DNSInstance)
      try {
        const result = await http.delete(`removeDoNotShow/${serviceId}`,{withCredentials : true})
        getDNSFunction()
      } catch (error) {
        console.log(error)
      }
    }
    
    useEffect(()=>{
        getDNSFunction()
    },[])

    const handleOpenMoreOption = (index) => {
      setSelectedIndex(index)
      index === selectedIndex && setSelectedIndex(null)
      if(index === DNSList.length - 1 && DNSList.length > 3)
      {
        setOpenDirection("up")
      }
      else{
        setOpenDirection("down")
      }
      
    }

    const sortList = (option) => {
      localStorage.setItem("BSsortOption", option)
      const DNSInstance = [...DNSList]
      const convertedDNS = DNSInstance.map((dns) => ({...dns, createdAt : new Date(dns.createdAt)}))
      switch (option)
      {
        case "newestAdded" :
        
        const newestSorted = convertedDNS.sort((a,b) => a.createdAt - b.createdAt)
        setDNSList(newestSorted)
        break

        case "oldestAdded" :
        const oldestSorted = convertedDNS.sort((a,b) => b.createdAt - a.createdAt)
        setDNSList(oldestSorted)
        break

        case "MostRated" :
        const mostRatedSorted = convertedDNS.sort((a,b) => Number(b.ratings) - Number(a.ratings))
        setDNSList(mostRatedSorted)
        break

        case "LeastRated" :
        const leastRatedSorted = convertedDNS.sort((a,b) => Number(a.ratings) - Number(b.ratings))
        setDNSList(leastRatedSorted)
        break
      }
      setShowFilter(false)
    }

    useEffect(()=>{
      if(authenticated)
      {
        getDNSFunction()
      }
      
  },[authenticated])

  useEffect(()=>{
    if(DNSList.length !== 0)
    {
      if(BSsortOption != undefined || BSsortOption != null)
      {
        sortList(BSsortOption)
      }
      else
      {
        
        sortList('newestAdded')
        localStorage.setItem("BSsortOption","newestAdded" )
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
       <h1 className='mt-5 ml-4 md:ml-0 text-2xl font-semibold text-gray-800'>Blocked Services</h1>
         <hr className='my-3'></hr>
           <nav className='px-2 py-1 flex items-center space-x-2 relative'>
             <button onClick={(e)=>{setShowFilter(!showFilter);e.stopPropagation()}}>
               <SortOutlinedIcon />
             </button>
             <span className='text-sm font-medium text-gray-600 mt-1'>Showing {DNSList.length} results</span>
               <SortDropdown sortList={sortList} showFilter={showFilter} BSsortOption={BSsortOption} setShowFilter={setShowFilter} />
           </nav>
           <div onClick={()=>{setSelectedIndex(null);setShowFilter(false)}} className='w-full h-full relative z-0 flex flex-col space-y-6 overflow-auto max-h-full'>
           {
             DNSList?.map((dns, index)=>{
               return (
               <div onMouseLeave={()=>setHoveredIndex(null)} onMouseEnter={()=>{setHoveredIndex(index)}} key={dns._id} className='serviceItem w-full relative flex items-stretch bg-white gap-2 semiSm:gap-5 hover:bg-gray-100 p-2 rounded-md cursor-pointer'>
                 <div id='imageContainer' className='flex bg-stone-300 shadow-sm rounded-md  items-center justify-center h-[70px] semiSm:h-[80px] md:h-[100px] xl:h-[120px] aspect-video'>
                   <img className='w-full h-full object-contain rounded-md ' src={dns.serviceProfileImage} />
                 </div>
                 <div onClick={()=>{navigate(`/explore/viewService/${dns.serviceId}`)}} id='infoContainer' className='flex flex-col w-full items-start justify-between'>
                   <div id='Header' className='w-full  flex flex-col'><h1 className='text-base whitespace-nowrap  semiSm:text-xl text-gray-800 font-semibold'>{dns.serviceTitle}</h1>
                     <div id='nameAndYear' className='flex items-center gap-2'>
                       <h2 className='text-semiXs semiSm:text-semiSm whitespace-nowrap text-gray-500 font-medium'>{dns.owner}</h2>
                         <span className='w-1 h-1 rounded-full bg-gray-500'></span>
                       <h2 className='text-semiXs semiSm:text-semiSm whitespace-nowrap text-gray-500 font-medium'>{dns.createdAgo}</h2>
                     </div>
                   </div>
                   <div id='rating container'>
                     <div className='flex whitespace-nowrap relative ml-0 items-center'>
                       {
                         windowWidth > 400 &&
                         <StyledRating className='relative hidden'  readOnly defaultValue={Number(dns.ratings)} precision={0.1} icon={<StarRoundedIcon fontSize={`${windowWidth <= 1000 ? "small" : "medium"}`} />  } emptyIcon={<StarRoundedIcon fontSize={`${windowWidth <= 1000 ? "small" : "medium"}`} className='text-gray-300' />} />
 
                       }
                         <div className='flex items-center space-x-2 pl-1'>
                           <p className='text-[#FFA534] text-xs semiSm:text-sm font-medium'>{dns.ratings}</p> 
                           <p className='text-gray-300'>|</p>
                           <p className='text-gray-500 text-xs semiSm:text-sm mt-0.5 font-medium'>{dns.totalReviews} Reviews</p> 
                         </div>
                     </div>
                   </div>
                 </div>
                   <div className={`w-[70px] relative top-0 right-0 h-full flex items-center justify-center`}>
                     <button onClick={(e)=>{handleOpenMoreOption(index);e.stopPropagation()}} className={`${index === hoveredIndex ? "flex" : "hidden"}  cursor-pointer p-2`}>
                     <MoreVertOutlinedIcon  className='text-gray-700 cursor-pointer hover:text-gray-500' />
                     </button>
                     <MoreOption selectedIndex={selectedIndex} removeDNS={removeDNS} serviceId={dns.serviceId} index={index} openDirection={openDirection}  />
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

const MoreOption = ({selectedIndex, index, openDirection, serviceId, removeDNS,}) => {
  return (
    <div className={`w-fit ${selectedIndex === index ? '' : 'hidden'} flex flex-col z-20 rounded-md absolute bg-white shadow-md ${openDirection === "up" ? "-left-[10rem] -top-[6rem]" : "-left-[10rem] top-[4.5rem]"}`}>
      <button className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><ContentCopyOutlinedIcon fontSize='small' className='p-0.5' />Copy link address</button>
      <button onClick={()=>removeDNS(serviceId)} className='text-sm hover:bg-gray-100 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2'><RemoveCircleOutlineOutlinedIcon fontSize='small' className='p-0.5' />Remove from Blocklist</button>
    </div>
  )
}

const SortDropdown = ({sortList, showFilter, setShowFilter, BSsortOption}) => {
  return (
    <div className={`w-fit ${showFilter ? "flex" : "hidden"} flex-col z-20 -bottom-[9rem] left-0 rounded-md absolute overflow-hidden bg-[#f9f9f9] shadow-md`}>
      <button onClick={()=>{sortList('newestAdded');setShowFilter(false)}} className={`${BSsortOption === "newestAdded" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Date added (newest)</button>
      <button onClick={()=>{sortList('oldestAdded');setShowFilter(false)}} className={`${BSsortOption === "oldestAdded" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Date added (oldest)</button>
      <button onClick={()=>{sortList('MostRated');setShowFilter(false)}}   className={` ${BSsortOption === "MostRated" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Most Rated</button>
      <button onClick={()=>{sortList('LeastRated');setShowFilter(false)}} className={` ${BSsortOption === "LeastRated" ? "bg-gray-200" : ""} text-sm hover:bg-gray-200 text-left flex items-center gap-2 whitespace-nowrap px-3 py-2`}>Least Rated</button>
    </div>
  )
}

export default BlockedServices