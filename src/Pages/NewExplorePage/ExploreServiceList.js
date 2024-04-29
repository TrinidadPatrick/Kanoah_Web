import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import noImage from '../../Utilities/emptyImage.jpg'
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';
import ShareLocationOutlinedIcon from '@mui/icons-material/ShareLocationOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import HideSourceIcon from '@mui/icons-material/HideSource';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ReactPaginate from 'react-paginate';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';
import { useSearchParams } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import allServiceStore from '../../Stores/AllServiceStore';
import UseFavorite from '../../ClientCustomHook/FavoriteProvider';
import http from '../../http';
import axios from 'axios';
import cloudinaryCore from '../../CloudinaryConfig';
import Modal from '@mui/material/Modal';

const ExploreServiceList = () => {
  const {favorites, getFavorites} = UseFavorite()
  const {services, setServices} = allServiceStore()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const page = params.get('page') || 1
  const [currentPage, setCurrentPage] = useState(Number(page - 1));
  const servicesPerPage = 10; // Number of services to display per page
  const indexOfLastService = (currentPage + 1) * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.length >= 5 ? services.slice(indexOfFirstService, indexOfLastService) : services
  const [selectedService, setSelectedService] = useState(null)
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);

    const sortParam = params.get('sort') || 'Recent Services'
    const categoryParam = params.get('category') || ''
    const subCategoryParam = params.get('subCategory') || ''
    const ratingParam = params.get('rating') || ''
    const latitudeParam = params.get('latitude') || ''
    const longitudeParam = params.get('longitude') || ''
    const addressParam = params.get('address') || ''
    const radParam = params.get('rad') || 1
    const searchParam = params.get('search') || ''

    setParams({...params, sort : sortParam ,category : categoryParam, 
      subCategory : subCategoryParam, rating : ratingParam, latitude : latitudeParam, 
      longitude : longitudeParam, rad : radParam, address : addressParam, search : searchParam, page : data.selected + 1})
    
  };

  const handleSelectService = (serviceId) => {
    if(selectedService === serviceId)
    {
      setSelectedService(null)
      return
    }
    setSelectedService(serviceId)
  }

  const removeFavorites = async (serviceId) => {

    try {
      const result = await http.delete(`removeFavorite/${serviceId}`,{withCredentials : true})
      setSelectedService(null)
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
      setSelectedService(null)
      getFavorites()
    } catch (error) {
      console.log(error)
    }
  }

  const addToDNS = async (serviceId) => {
    const newServiceList = [...services]
    const index = newServiceList.findIndex((service) => service._id === serviceId)
    newServiceList.splice(index, 1)
    setServices(newServiceList)
    const data = {
      serviceId,
      createdAt : new Date()
    }

    try {
      const result = await http.post('addToDoNotShow', data, {withCredentials : true})
      setSelectedService(null)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <main className='w-full z-10 bg-[#f9f9f9] grid grid-cols-1 semiSm:grid-cols-2 gap-4 xl:grid-cols-1 h-fit  px-3 mt-5 mb-5'>
    {/* Report Modal */}
    <Modal open={openReportModal}>
    <div className='w-full h-full flex items-center justify-center'>
    <ReportModal setOpenReportModal={setOpenReportModal} setOpenSuccessReportModal={setOpenSuccessReportModal} serviceToReport={serviceToReport} setServiceToReport={setServiceToReport} />
    </div>
    </Modal>
    {
    currentServices?.map((service, index)=>{
        return (
          <div key={service._id} className='border relative flex cursor-pointer flex-col items-center xl:flex-row xl:space-x-6 xl:my-2 bg-white shadow-sm rounded-lg p-3'>
            {/* Image Container */}
            <Link to={`/exploreService/viewService/${service._id}`} className='flex relative w-full h-[200px] semiSm:h-[130px] semiBase:h-[170px] md:h-[250px] lg:h-[200px] object-cover xl:w-[330px] xl:min-w-[330px] xl:h-[200px]'>
                <p className='absolute bg-white px-2 py-1 text-xs md:text-sm font-semibold rounded-full top-1 left-1'>{service.advanceInformation.ServiceCategory.name}</p>
                <img className='w-full h-full  max-h-[280px] object-cover rounded-lg' src={service.serviceProfileImage === null ? noImage : service.serviceProfileImage} alt="Cover"/>
            </Link>
            {/* Infos */}
            <div className=' px-1 py-3 w-full overflow-hidden flex flex-col justify-between space-y-5'>
              {/* Title and created Ago */}
              <div className='Header_Container space-y-2 xl:space-y-0 w-full flex flex-col xl:flex-row justify-between'>
              <div className='w-full flex flex-col space-y-1  overflow-hidden  h-full'>
              <h1 onClick={()=>{navigate(`/explore/viewService/${service._id}`)}} className='font-medium text-gray-800 text-[0.9rem] sm:text-base semiBase:text-base md:text-lg lg:text-lg ps-1 w-full whitespace-nowrap text-ellipsis overflow-hidden'>{service.basicInformation.ServiceTitle}</h1>
              {/* Created Ago */}
              <div className='flex items-center space-x-2'>
                    <p className='text-xs md:text-sm text-gray-400  flex items-center gap-1 whitespace-nowrap'><Person2OutlinedIcon   />{service.owner.firstname + " " + service.owner.lastname}</p>
                    <span className='w-1 h-1 rounded-full bg-gray-500'></span>
                    <p className='text-xs md:text-sm text-gray-400 whitespace-nowrap '>{service.createdAgo}</p>
              </div>
              </div>
              {/* Ratings */}
              <div className='flex flex-col w- whitespace-nowrap relative ml-0  xl:ml-3 mr-2 space-x-1'>
              <div className='flex flex-col w-fit whitespace-nowrap relative ml-0  xl:ml-3 mr-2 space-x-1'>
              <StyledRating className='relative left-[0.1rem]'  readOnly defaultValue={Number(service.ratings)} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
              <div className='flex items-center space-x-2 pl-1'>
              <p className='text-gray-400 text-sm font-medium'>{service.ratings}</p> 
              <p className='text-gray-300'>|</p>
              <p className='text-gray-700 text-sm  font-medium'>{service.totalReviews} Reviews</p> 
              </div>
              </div>
              </div>
              </div>
              {/* Description */}
              <div className=' p-2 w-full hidden md:flex  '>
                  <p className='text-sm text-ellipsis line-clamp-2'>{service.basicInformation.Description}</p>   
              </div>
              {/* Location */}
              <div className='w-full flex items-center space-x-2 relative'>
              <ShareLocationOutlinedIcon className='text-themeGray' />
              <p className='text-themeGray text-xs md:text-base whitespace-nowrap overflow-hidden text-ellipsis'>{service.address.barangay.name + ", " + service.address.municipality.name + ", " + service.address.province.name}</p>
              {/* More option button */}
              <OutsideClickHandler onOutsideClick={()=>setSelectedService(null)}>
              <button onClick={()=>handleSelectService(service._id)} className={`absolute ${service._id === selectedService ? "text-gray-400" : ""} right-2 top-0`}>
                <MoreVertIcon />
              </button>
              <div className={`absolute ${service._id === selectedService ? "flex" : "hidden"} flex-col right-7 bottom-2 shadow-md rounded-md z-20 bg-white`}>
              {
                favorites?.some((favorite) => favorite.service?._id === service._id) ?
                <button onClick={()=>removeFavorites(service._id)} className='px-2 py-2 hover:bg-gray-100 text-start text-sm flex items-center gap-2 text-red-500'><PlaylistRemoveOutlinedIcon fontSize='small' className='p-0.5' /> Remove from favorites</button>
                :
                <button onClick={()=>addToFavorites(service._id)} className='px-2 py-2 hover:bg-gray-100 text-start text-sm flex items-center gap-2'><LibraryAddIcon fontSize='small' className='p-0.5' /> Add to favorites</button>
              }
              <button onClick={()=>addToDNS(service._id)} className='px-2 py-2 hover:bg-gray-100 text-start text-sm flex items-center gap-2'><HideSourceIcon fontSize='small' className='p-0.5' /> Do not show</button>
              <button onClick={()=>{setOpenReportModal(true);setServiceToReport({name : service.basicInformation.ServiceTitle, _id : service._id, owner : service.owner})}} className='px-2 py-2 hover:bg-gray-100 text-start text-sm flex items-center gap-2'><ReportGmailerrorredOutlinedIcon fontSize='small' className='p-0.5' /> Report</button>
              </div>
              {/* <MoreOptions serviceId={service._id} /> */}
              </OutsideClickHandler>
              </div>
            </div>
          </div>
        )
    })
    }
    <ReactPaginate
      pageCount={Math.ceil(services.length / servicesPerPage)}
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
    </main>
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
    <section className='w-[500px] h-[85vh] relative bg-white flex flex-col p-3 rounded-md overflow-auto'>
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
        
        <div className='flex gap-2'>
        <button disabled={reportObject.reasons.length === 0} onClick={()=>submitReport()} className='px-3 mt-2 hover:bg-orange-300 disabled:bg-orange-200 rounded-md py-2 text-white bg-themeOrange w-fit text-sm'>Submit report</button>
        <button onClick={()=>setOpenReportModal(false)} className='px-3 mt-2 hover:bg-gray-300 rounded-md py-2 text-gray-600 bg-gray-100 w-fit text-sm'>Cancel</button>
        </div>

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

export default ExploreServiceList