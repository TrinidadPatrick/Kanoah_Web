import React from 'react'
import { useState, useEffect, useRef } from 'react'
import useService from '../../../ClientCustomHook/ServiceProvider'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import OutsideClickHandler from 'react-outside-click-handler';
import http from '../../../http';
import Modal from 'react-modal';

const BookingInformation = ({serviceInformation}) => {
    Modal.setAppElement('#root');
    const limits = Array.from({ length: 1000 }, (_, index) => index + 1);
    const [isEdit, setIsEdit] = useState(false)
    const [fieldError, setFieldError] = useState({name : false, origPrice : false, type : false, price : false})
    const [acceptBooking, setAcceptBooking] = useState(false)
    const [noServices, setNoServices] = useState(false)
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [serviceModalOpen, setServiceModalIsOpen] = useState(false);
    const [cancelPolicyModalOpen, setCancelPolicyModalOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [showMoreOption, setShowMoreOption] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All services');
    const [editServiceModalOpen, setEditServiceModalIsOpen] = useState(false);
    const [acceptBookingErrorModalOpen, setAcceptBookingErrorModalOpen] = useState(false);
    const [serviceOfferList, setServiceOfferList] = useState(null)
    const [selectedServices, setSelectedServices] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [variantError, setVariantError] = useState(false)
    const [serviceOfferInfo, setServiceOfferInfo] = useState({
      uniqueId : '', 
      name : '',
      origPrice : '',
      duration : 0,
      variants : []
    })
    const [booking_limit, setBooking_limit] = useState(1) 
    const [cancelTimeLimit, setCancelTimeLimit] = useState({day : 1, hour : 0, minutes : 0})
    const [cancelPolicy, setCancelPolicy] = useState('')

    const notify = (message) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const ModalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : '7px'
        },
    };

    const ErrorModal = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : '0px',
          border : '0'
        },
    };

    useEffect(()=>{
       
        if(serviceInformation?.serviceOffers !== undefined)
        {
            setServiceOfferList(serviceInformation?.serviceOffers)
            setAcceptBooking(serviceInformation?.acceptBooking)
            setBooking_limit(serviceInformation?.booking_limit)
            setCancelTimeLimit({day : serviceInformation.cancelationPolicy.cancelTimeLimit.day, hour : serviceInformation.cancelationPolicy.cancelTimeLimit.hour, minutes : serviceInformation.cancelationPolicy.cancelTimeLimit.minutes})
            setCancelPolicy(serviceInformation.cancelationPolicy.cancelPolicy)
        }
    }, [serviceInformation])

    useEffect(()=>{
        if(serviceOfferList?.length === 0)
        {   
            
            (async()=>{
                try {
                    setAcceptBooking(false) 
                    const result = await http.patch(`updateService/${serviceInformation.userId}`, {acceptBooking : false},  {
                      withCredentials : true
                    })
            
                  } catch (error) {
                    console.error(error)
                  }
            })()
            
            setNoServices(true)
        }
        else
        {
            setNoServices(false)
        }
    }, [serviceOfferList])

    const openServiceModal = () => {
        setServiceModalIsOpen(true)
    }
    const openEditServiceModal = () => {
        setEditServiceModalIsOpen(true)
    }

    const closeServiceModal = () => {
        setServiceModalIsOpen(false)
        clearFieldError()
    }
    const closeEditServiceModal = () => {
        setEditServiceModalIsOpen(false)
        setServiceOfferInfo({
            id : '',
          name : '',
          origPrice : '',
          variants : []
        
        })
        setIsEdit(false)
        clearFieldError()
    }

    const openAcceptBookingErrorModal = (variants) => {
        setAcceptBookingErrorModalOpen(true)

    }
    const closeAcceptBookingErrorModal = () => {
        setAcceptBookingErrorModalOpen(false)
        
    }


    const addVariation = () => {
      if(serviceOfferInfo?.variants.length !== 0)
      {
        if(serviceOfferInfo?.variants[serviceOfferInfo?.variants.length - 1].type === ''
        || serviceOfferInfo?.variants[serviceOfferInfo?.variants.length - 1].price === ''
        || serviceOfferInfo?.variants[serviceOfferInfo?.variants.length - 1].duration === 0)
        {
          return
        }

      }
      
        setServiceOfferInfo((prevServiceOfferInfo) => ({
          ...prevServiceOfferInfo,
          variants: [
            ...prevServiceOfferInfo.variants,
              { type: '', price: '', duration : 0 }
          ]
        }));
    }
  
    const handleAddServcice = async () => {
      if (serviceOfferInfo.name === '') {
        setFieldError(prevState => ({ ...prevState, name: true }));
      }
      if (serviceOfferInfo.origPrice === '' && serviceOfferInfo.variants.length === 0) {
        setFieldError(prevState => ({ ...prevState, origPrice: true }));
      }
      if (serviceOfferInfo.variants.length === 0 && serviceOfferInfo.duration === '' ) {
        setFieldError(prevState => ({ ...prevState, duration: true }));
      }
      else 
      {
        const Instance = [...serviceOfferList]
        const tempData = {
          uniqueId : Math.floor(1000000000 + Math.random() * 9000000000),
          name : serviceOfferInfo.name,
          origPrice : serviceOfferInfo.variants.length !== 0 ? '' : serviceOfferInfo.origPrice,
          duration : serviceOfferInfo.variants.length !== 0 ? '' : serviceOfferInfo.duration,
          variants : serviceOfferInfo.variants.filter(variant => variant.type !== '' && variant.price !== '') ,
          status : 'ACTIVE'
        }
        Instance.push(tempData)
        setServiceOfferList(Instance)
        setServiceOfferInfo({
          uniqueId : '',
          name : '',
          origPrice : '',
          duration : '',
          variants : []
        })
        closeServiceModal()
        // Insert the data to database
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : Instance},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              clearFieldError()
              return ;
            }
          } catch (error) {
            console.error(error)
          }
      }
       
    }
  
    const removeVariation = (index) => {
        const variantInstance = [...serviceOfferInfo.variants]
       variantInstance.splice(index, 1)
        setServiceOfferInfo({...serviceOfferInfo, variants : variantInstance})
    }
  
    const handleEditServiceOffer = (index) => {
        setSelectedIndex(index)
        const instance = [...serviceOfferList]     
        const dataToEdit = instance[index]
        const data = {
          uniqueId : dataToEdit.uniqueId,
          name : dataToEdit.name,
          origPrice : dataToEdit.origPrice,
          variants : dataToEdit.variants,
          duration : dataToEdit.duration,
          status : dataToEdit.status,
        }
        setServiceOfferInfo(data)
    }
  
    const updateServiceOffer = async () => {
      if (serviceOfferInfo.name === '') {
        setFieldError(prevState => ({ ...prevState, name: true }));
      }
      if (serviceOfferInfo.origPrice === '' && serviceOfferInfo.variants.length === 0) {
        setFieldError(prevState => ({ ...prevState, origPrice: true }));
      }
      else
      {
        const instance = [...serviceOfferList]
        const data = {
          uniqueId : serviceOfferInfo.uniqueId,
          // uniqueId : Math.floor(1000000000 + Math.random() * 9000000000),
          name : serviceOfferInfo.name,
          origPrice : serviceOfferInfo.variants.length !== 0 ? '' : serviceOfferInfo.origPrice,
          variants : serviceOfferInfo.variants.filter(variant => variant.type !== '' && variant.price !== '') ,
          duration : serviceOfferInfo.variants.length !== 0 ? '' : serviceOfferInfo.duration,
          status : serviceOfferInfo.status
        }
        instance.splice(selectedIndex, 1, data)
        setServiceOfferList(instance)
        closeEditServiceModal()
        setServiceOfferInfo({
            uniqueId : '',
            name : '',
            origPrice : '',
            duration : '',
            variants : []    
        })
        setSelectedIndex(null)
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : instance},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              notify('Update successfull')
              setIsEdit(false)
              clearFieldError()
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }
      }
        
    }

    const handleRemoveServiceOffer = async (index) => {
        const instance = [...serviceOfferList]
        instance.splice(index, 1)
        setServiceOfferList(instance)
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : instance},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              notify("Deleted")
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }
    }

    const disableServiceOffer = async () => {
        const instance = [...serviceOfferList]
        const indexToUpdate = serviceOfferList.findIndex(service => service.uniqueId === serviceOfferInfo.uniqueId)
        const data = {
            uniqueId : instance[indexToUpdate].uniqueId, 
            name : instance[indexToUpdate].name,
            origPrice : instance[indexToUpdate].origPrice,
            variants : instance[indexToUpdate].variants,
            status : "DISABLED"
        }

        instance.splice(indexToUpdate, 1, data)
        // console.log(instance)
        setServiceOfferList(instance)
        closeEditServiceModal()
        setIsEdit(false)
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : instance},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }
    }

    const enableServiceOffer = async () => {
        const instance = [...serviceOfferList]
        const indexToUpdate = serviceOfferList.findIndex(service => service.uniqueId === serviceOfferInfo.uniqueId)
        const data = {
            uniqueId : instance[indexToUpdate].uniqueId, 
            name : instance[indexToUpdate].name,
            origPrice : instance[indexToUpdate].origPrice,
            variants : instance[indexToUpdate].variants,
            status : "ACTIVE"
        }
        instance.splice(indexToUpdate, 1, data)
        setServiceOfferList(instance)
        closeEditServiceModal()
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : instance},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }
    }

    const handleSelect = async (service) => {
        const selected = [...selectedServices]
        const checkDuplicated = selected.findIndex(selected => selected.uniqueId === service.uniqueId)
        if(checkDuplicated === -1)
        {
        selected.push(service)
        setSelectedServices(selected)
        }
        else
        {
            selected.splice(checkDuplicated, 1)
            setSelectedServices(selected)
        }

        setIsSelectAll(false)
        
    }

    const deleteMany = async () => {
        const filtered = serviceOfferList.filter(service => !selectedServices.some(selected => selected.uniqueId == service.uniqueId))
        setServiceOfferList(filtered)

        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : filtered},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              console.log(result.data)
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }
    }

    const handleSelectAll = async () => {
        if(selectedServices.length === serviceOfferList.length)
        {
            setSelectedServices([])
            setIsSelectAll(false)
        }
        else
        {
            setSelectedServices(serviceOfferList)
            setIsSelectAll(true)
        }
    }

    const disableSelected = async () => {
        const instance = [...serviceOfferList]
        const updatedServices = instance.map((service) => {
            if (selectedServices.some(selected => selected.uniqueId === service.uniqueId)) {
              return { ...service, status: "DISABLED" };
            }
            return service;
          });

        setServiceOfferList(updatedServices)
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : updatedServices},  {
              withCredentials : true
            })
            if(result.data.status == "Success")
            {
              notify('Update successfull')
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }

    }

    const handleAcceptBooking = async () => { 
        if(serviceOfferList.length === 0)
        {
            openAcceptBookingErrorModal()
        }
        else
        {
            const instance = acceptBooking  
            setAcceptBooking(!instance) 
            try {
                const result = await http.patch(`updateService/${serviceInformation.userId}`, {acceptBooking : !instance},  {
                  withCredentials : true
                })
        
                if(result.data.status == "Success")
                {
                    notify('Update successfull')
                }
              } catch (error) {
                console.error(error)
              }
        }
        
    }

    const enableSelected = async () => {
        const instance = [...serviceOfferList]
        const updatedServices = instance.map((service) => {
            if (selectedServices.some(selected => selected.uniqueId === service.uniqueId)) {
              return { ...service, status: "ACTIVE" };
            }
            return service;
          });

        setServiceOfferList(updatedServices)
        try {
            const result = await http.patch(`updateService/${serviceInformation.userId}`, {serviceOffers : updatedServices},  {withCredentials : true})
            if(result.data.status == "Success")
            {
              notify('Update successfull')
              return ;
            }
            else{

            }
          } catch (error) {
            console.error(error)
          }

    }

    const handleSearch = (searchInput) => {
        const services = serviceInformation?.serviceOffers
        const filtered = services.filter(service => service.name.toLowerCase().includes(searchInput.toLowerCase()))
        setServiceOfferList(filtered)
    }

    const handleFilter = (filter) => {
        setSelectedFilter(filter)
        const instance = [...serviceInformation?.serviceOffers]
        if(filter === 'All services')
        {
            setServiceOfferList(instance)
            return ;
        }
        const filtered = instance.filter(service => service.status === filter.toUpperCase())
        setServiceOfferList(filtered)
    }

    const clearFieldError = () => {
      setFieldError({
        name : false, origPrice : false, type : false, price : false
      })
    }

    const handleBookingLimit = async (value) => {

      {
          const instance = acceptBooking  
          setAcceptBooking(!instance) 
          try {
              const result = await http.patch(`updateService/${serviceInformation.userId}`, {booking_limit : value},  {
                withCredentials : true
              })
      
              if(result.data.status == "Success")
              {
                  notify('Update successfull')
              }
            } catch (error) {
              console.error(error)
            }
      }
    }

    const handleChangeCancelTime = (option, value) => {      
      option === 'day' && value >= 0 && setCancelTimeLimit((prevCancelTimeLimit) => ({...prevCancelTimeLimit, [option] : Number(value)}))
      option === 'hour' && value >= 0 && value <= 24 && setCancelTimeLimit((prevCancelTimeLimit) => ({...prevCancelTimeLimit, [option] : Number(value)}))
      option === 'minutes' && value >= 0 && value <= 60 && setCancelTimeLimit((prevCancelTimeLimit) => ({...prevCancelTimeLimit, [option] : Number(value)}))
    }

    const submitBookingTimeLimit = async () => {
      const cancelationPolicy = {
        cancelTimeLimit,
        cancelPolicy
      }
      
      try {
        const result = await http.patch(`updateService/${serviceInformation.userId}`, {cancelationPolicy},  {
          withCredentials : true
        })
        if(result.data.status == "Success")
        {
          setCancelPolicyModalOpen(false)
          notify('Update succesfull')
          return ;
        }
      } catch (error) {
        console.error(error)
      }
    }


  return (
    <main className='flex justify-center items-center bg-[#f9f9f9] flex-col h-full w-full bg-na max-h-full xl:p-3 '>
    <div className="w-[100%] sm:w-[90%] md:w-[80%] xl:w-[60%] shadow-md rounded-md h-full sm:h-[90%] xl:h-[70vh] p-5 flex flex-col bg-white space-y-3">
        <div className='w-full flex items-center justify-between'>
            <h1 className='text-gray-700 font-medium text-lg md:text-2xl'>Services from business</h1>
            <div className='flex items-center space-x-2'>
            </div>
        </div>

        <div className='w-full h-8  flex items-center space-x-1'>
          {/* Cancel booking time limit */}
          <button onClick={()=>{setCancelPolicyModalOpen(true)}} className='h-full bg-gray-50 hover:bg-gray-100 rounded-sm border px-2'>
           <p className='text-[0.7rem] md:text-sm text-gray-500 font-normal '>Edit cancelation policy</p>
          </button>
          {/* Accept booking Button */}
          <div className='flex items-center gap-2 h-full'>
            <div className='flex items-center space-x-2 bg-gray-50 shadow-sm h-full px-2 rounded-[0.12rem] border'>
            <p className='text-[0.7rem] md:text-sm text-gray-500 font-normal'>Accept Booking</p>
            <div className='flex items-center space-x-2'>
            <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={acceptBooking} onChange={()=>{handleAcceptBooking()}} className="sr-only peer outline-none"/>
            <div className="w-7 h-4 lg:w-[2.45rem] lg:h-[1.3rem] bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[1.1rem] after:h-[0.8rem] after:lg:w-[1.1rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            </div>
            </div>
            {/* Booking Limit */}
            <div className='flex items-center justify-end gap-2'>
              <label className='text-sm text-gray-500'>Booking Limit</label>
              <select value={booking_limit} onChange={(e)=>{setBooking_limit(e.target.value);handleBookingLimit(e.target.value)}} className='border rounded-sm py-1.5 text-gray-600 w-[50px]'>
                {
                 limits.map((limit)=>(
                  <option key={limit} value={limit}>{limit}</option>
                 ))
                }
              </select>
            </div>
            </div>
        </div>

        {/* Navigation */}
        <div className='w-full flex items-center justify-between space-x-4 p-2 bg-gray-100 relative rounded-md'>
        <div className='flex  space-x-3 relative'>
            <button onClick={()=>{openServiceModal()}} className={`w-fit flex gap-0.5 items-center px-1 py-0.5 sm:px-2 sm:py-1 text-white bg-themeOrange hover:bg-orange-400 text-xs sm:text-[0.8rem] font-medium rounded-sm`}><AddOutlinedIcon fontSize='small' className='sm:p-0' /> <p className='hidden sm:block'>Add Service</p></button>
            <div className=' h-[30px] w-[0.5px] bg-gray-300'></div>
            {/* Buttons */}
            <OutsideClickHandler onOutsideClick={() => {setShowMoreOption(false)}}>
            <button onClick={()=>setShowMoreOption(!showMoreOption)} className='block semiSm:hidden'>
            <MoreVertOutlinedIcon className='text-gray-600 ' />
            </button>
            </OutsideClickHandler>
            {/* Dropdown Content */}
            <div className={`${showMoreOption ? '' : 'hidden'} absolute shadow-md rounded-sm bg-white top-8 left-10 flex flex-col`}>
              <button onClick={()=>{setShowMoreOption(false);enableSelected()}} className="whitespace-nowrap p-2 hover:bg-gray-200 text-start">Mark as active</button>
              <button onClick={()=>{setShowMoreOption(false);disableSelected()}} className="whitespace-nowrap p-2 hover:bg-gray-200 text-start">Mark as disabled</button>
              <button onClick={()=>{setShowMoreOption(false);deleteMany()}} className="whitespace-nowrap p-2 hover:bg-gray-200 text-start">Delete</button>
            </div>

            {/* Buttons and Icons */}
            <div className=' hidden semiSm:flex items-center space-x-5'>
            {/* Delete */}
            <button disabled={selectedServices.length === 0 ? true : false} onClick={()=>{deleteMany()}} className='flex items-center border border-[#d1d1d1] justify-center bg-gray-200 p-1 rounded-sm'>
                <DeleteIcon className={`text-gray-400 ${selectedServices.length === 0 ? 'hover:text-gray-400' : 'hover:text-red-500 cursor-pointer'}`} fontSize='small' />
            </button>
            {/* Disable */}
            <button disabled={selectedServices.length === 0 ? true : false} onClick={()=>{disableSelected()}} className='flex items-center relative justify-center bg-white border border-[#d7d7d7] p-1 rounded-sm'>
                <BlockOutlinedIcon className={`text-gray-500 peer ${selectedServices.length === 0 ? 'hover:text-gray-400' : 'hover:text-red-500'} cursor-pointer`} fontSize='small' />
                <div className='absolute bg-gray-600 opacity-80 hidden transition-all delay-1000 peer-hover:block text-white top-9 text-[0.84rem] whitespace-nowrap p-1 rounded-sm'>Mark as Disabled</div>
            </button>
            {/* Enable */}
            <button disabled={selectedServices.length === 0 ? true : false} onClick={()=>{enableSelected()}} className='flex items-center relative justify-center bg-white border border-[#d7d7d7] p-1 rounded-sm'>
                <CheckCircleOutlinedIcon className={`text-gray-500 peer ${selectedServices.length === 0 ? 'hover:text-gray-400' : 'hover:text-red-500'} cursor-pointer`} fontSize='small' />
                <div className='absolute bg-gray-600 opacity-80 hidden transition-all delay-1000 peer-hover:block text-white top-9 text-[0.84rem] whitespace-nowrap p-1 rounded-sm'>Mark as Active</div>
            </button>
            </div>
            </div>

            {/* Search and filter */}
            <div className='h-full w-[250px] flex relative  border rounded-md'>
                <div id='searchWrapper' className='w-full flex'>
                    <input onChange={(e)=>{handleSearch(e.target.value)}} className='w-full outline-none text-[0.8rem] rounded-s-md ps-2 p-1' type='search' placeholder='Search...' />
                </div>

                {/* Dropdown Button */}
                {/* <div className='relative'> */}
                
                <button onClick={()=>{setOpenFilter(!openFilter)}} className='whitespace-nowrap border-l-1 h-full  rounded-e-md text-[0.7rem] px-1 text-gray-700 bg-white'>{selectedFilter}<ExpandMoreIcon fontSize='small' className='p-0.5' /></button>
                {/* dropwdown content */}
                <OutsideClickHandler  onOutsideClick={() => {setOpenFilter(false)}}>
                <div className={`w-[90px] ${openFilter ? '' : 'hidden'} h-fit right-0 top-9 z-10 flex flex-col items-start  bg-gray-50 shadow-md rounded-md absolute`}>
                    <button onClick={()=>{handleFilter('All services');setOpenFilter(!openFilter)}} className='text-[0.7rem] text-gray-700  w-full text-start px-2 p-1 hover:bg-gray-200 '>All services</button>
                    <button onClick={()=>{handleFilter('Disabled');setOpenFilter(!openFilter)}} className='text-[0.7rem] text-gray-700 w-full text-start px-2 p-1 hover:bg-gray-200 '>Disabled</button>
                    <button onClick={()=>{handleFilter('Active');setOpenFilter(!openFilter)}} className='text-[0.7rem] text-gray-700 w-full text-start px-2 p-1 hover:bg-gray-200 '>Active</button>
                {/* </div> */}
                </div>
                </OutsideClickHandler>
            </div>
        </div>

        {/* Table */}
        <div className='w-full flex flex-col flex-1 h-full border rounded-md overflow-auto'>
        {
            noServices ? 
            (
                <div className='w-full flex h-full justify-center items-center'>
                    <p className='text-3xl text-gray-500 text-center'>No services found</p>
                </div>
            )
            :
            <table className='table-auto w-full text-sm rounded-md '>
          <thead >
            <tr >
              <th  className={` font-semibold bg-gray-100 text-gray-700 text-center p-2 px-3 w-[5%]`}>
                <input checked={isSelectAll} onChange={()=>{handleSelectAll();setIsSelectAll(!isSelectAll)}} id='selectAll' type='checkbox' />
              </th>
              {/* <th  className=' font-semibold bg-gray-100 text-gray-700 text-center p-2 px-6 w-[5%]'>#</th> */}
              <th  className=' font-semibold bg-gray-100 text-gray-700 text-start p-2 px-3 sm:w-1/4 md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-1/5'>Name</th>
              <th  className=' font-semibold bg-gray-100 text-gray-700 text-center p-2 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/6 2xl:w-1/5'>Price</th>
              <th  className=' font-semibold bg-gray-100 text-gray-700 text-center p-2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-[13%]'>Status</th>      
              <th  className=' font-semibold bg-gray-100 text-gray-700 text-center p-2 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/2 2xl:w-[15%]'>Options</th>      
            </tr>
          </thead>
          <tbody className=' w-full overflow-auto'>
            {
            serviceOfferList?.map((service, index)=>{
            return (
                <tr key={index} className='h-[60px] max-h-[50px]'>
                
                {/* Select */}
                <td className={` border border-l-0  text-center w-[5%] overflow-hidden text-ellipsis`}>
                <div className=''>
                <input checked={selectedServices.some(selected => selected.uniqueId === service.uniqueId)} onChange={()=>{handleSelect(service)}} type='checkbox' />
                </div>
                </td>

                {/* Name */}
                <td className=' text-center border border-l-0  p-1 sm:w-1/4 md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-[1/5] overflow-hidden text-ellipsis '>
                <div className=' mx-2 '>
                <p className='line-clamp-2 break-words text-start'>{service.name}
                </p>
                </div>
                </td>
                
                {/* Price */}
                <td className=' text-center border border-l-0  p-1 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/6 2xl:w-1/5'>
                <div className=' m-5'>
                <p className='text-xs whitespace-nowrap'>
                  {service.variants && service.variants.length !== 0 ? `₱${service.variants[0]?.price} - ₱${service.variants.slice(-1)[0]?.price}` : `₱${service.origPrice}`}
                </p>
                </div>
                </td>


                {/* Status */}
                <td className='text-center border border-l-0  sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-[13%]'>
                    <p className={` ${service.status === 'ACTIVE' ? 'text-green-500' : 'text-red-300'} font-medium px-2`}>{service.status}</p>
                </td>

                {/* Options */}
                <td className='text-center border border-l-0 border-r-0  relative'>
                    <div className='flex flex-col sm:flex-row justify-center space-x-2 p-2'>
                    <p onClick={()=>{handleEditServiceOffer(index);setIsEdit(true);openEditServiceModal()}} className='text-blue-500 font-[400] cursor-pointer hover:text-blue-700'>Edit</p>
                    <p onClick={()=>{handleRemoveServiceOffer(index)}} className='text-red-500 font-[400] cursor-pointer hover:text-red-700'>Delete</p> 
                    </div>
                   
                   
                </td>
                    </tr>
                  )
            })
            }
          </tbody>
            </table>
        }
        
        </div>
    </div>

    <Modal isOpen={serviceModalOpen} onRequestClose={closeServiceModal} style={ModalStyle} contentLabel="Service Modal">
    <div className='flex items-center justify-between p-2'>
    <h1 className='text-gray-700 font-medium text-xl '>Add services</h1>
    <CloseOutlinedIcon className='cursor-pointer' onClick={()=>{closeServiceModal()}} fontSize='small' />
    </div>
    
      <div className='w-[90vw] sm:w-[400px] md:w-[500px] bg-white space-y-3 p-2'>
        {/* Name */}
        <div className='flex flex-col space-y-5'>
        <div className='flex flex-col relative'>
        <input maxLength={30} required value={serviceOfferInfo.name} onChange={(e)=>setServiceOfferInfo({...serviceOfferInfo, name : e.target.value})} className={`border-2 ${fieldError.name ? 'border-red-500' : ''} valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]`} placeholder={`${document.getElementById('serviceName')?.focus ? 'ex. Premium' : ''}`} id='serviceName' type='text' />
        <div className='text-[0.8rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Service name </div>
        <p className={`${fieldError.name ? 'block' : 'hidden'} text-xs text-red-500`}>This field is required</p>
        </div>
        {/* Price */}
        <div className='flex flex-col relative'>
          <input maxLength={9} pattern="[0-9]*" required disabled={serviceOfferInfo.variants?.length === 0 ? false : true} value={serviceOfferInfo.origPrice} onChange={(e)=>{const numericValue = e.target.value.replace(/\D/g, '');setServiceOfferInfo({...serviceOfferInfo, origPrice : numericValue})}} className={`border-2 ${fieldError.origPrice ? 'border-red-500' : ''} valid:border-themeBlue peer outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]`} placeholder={`${document.getElementById('servicePrice')?.focus ? 'ex. 200' : ''}`}  id='servicePrice' type='text' />
          <p style={{userSelect: 'none'}} className='text-[0.8rem] pointer-events-none absolute top-2 left-1 peer-focus:font-bold peer-valid:font-bold user-select-none peer-focus:-top-2 peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='servicePrice'>Service price </p>
          <p className={`${fieldError.origPrice ? 'block' : 'hidden'} text-xs text-red-500`}>This field is required</p>
        </div>
        {/* Duration */}
        <div className='flex flex-col relative'>
          <input maxLength={9} pattern="[0-9]*" required disabled={serviceOfferInfo.variants?.length === 0 ? false : true} value={serviceOfferInfo.duration} onChange={(e)=>{const numericValue = e.target.value.replace(/\D/g, '');setServiceOfferInfo({...serviceOfferInfo, duration : numericValue})}} className={`border-2 ${fieldError.duration ? 'border-red-500' : ''} valid:border-themeBlue peer outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]`} placeholder={`${document.getElementById('serviceDUration')?.focus ? 'Minutes' : ''}`}  id='serviceDUration' type='text' />
          <p style={{userSelect: 'none'}} className='text-[0.8rem] pointer-events-none absolute top-2 left-1 peer-focus:font-bold peer-valid:font-bold user-select-none peer-focus:-top-2 peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='servicePrice'>Service Duration </p>
          <p className={`${fieldError.origPrice ? 'block' : 'hidden'} text-xs text-red-500`}>This field is required</p>
        </div>
        </div>
        {/* Variations */}
        <div className='flex flex-col space-y-2'>
        {serviceOfferInfo.variants?.map((variation, index) => (
        <div key={index} className='flex gap-2'>
          <input
            maxLength={30}
            onChange={(e) => {
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variants: prevServiceOfferInfo.variants.map((item, i) =>
                  i === index ? { ...item, type: e.target.value } : item
                ),
              }));
            }}
            value={variation.type}
            className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
            type='text'
            placeholder='Type'
          />

          <input
            pattern="[0-9]*"
            maxLength={9}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variants: prevServiceOfferInfo.variants.map((item, i) =>
                  i === index ? { ...item, price: numericValue } : item
                ),
              }));
            }}
            value={variation.price}
            className='border rounded-sm p-1 text-[0.75rem] font-light text-sm w-full'
            type='text'
            placeholder='Price'
          />

          <input
            pattern="[0-9]*"
            maxLength={9}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variants: prevServiceOfferInfo.variants.map((item, i) =>
                  i === index ? { ...item, duration: numericValue } : item
                ),
              }));
            }}
            value={variation.duration}
            className='border rounded-sm p-1 text-[0.75rem] font-light text-sm w-full'
            type='text'
            placeholder='Duration (mins)'
          />
          <button onClick={()=>{removeVariation(index)}} className='text-red-500 hover:bg-gray-100 flex items-center justify-center rounded-full px-0.5'>
            <RemoveCircleOutlineOutlinedIcon />
          </button>
        </div>
        ))
        }
        </div>
        <div className={`${serviceOfferInfo.variants?.length === 0 ? 'hidden' : 'block'} w-full flex justify-start`}>
        <button onClick={()=>{addVariation()}}><AddOutlinedIcon fontSize='small' className='text-white border rounded-full bg-blue-500' /></button>
        </div>
        <button onClick={()=>{addVariation()}} className={`w-full ${serviceOfferInfo.variants?.length === 0 ? 'block' : 'hidden'} bg-white border-dashed border-blue-500 border-2 p-2 text-blue-500 text-[0.8rem] font-medium rounded-sm`}>Add Variation</button>
        <button onClick={()=>{handleAddServcice()}} className={`w-full mt-3 ${isEdit ? 'hidden' : 'flex'} items-center justify-center p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Submit</button>
        <button onClick={()=>{updateServiceOffer();setIsEdit(false)}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Update</button>
      </div>
    </Modal>

    <Modal isOpen={editServiceModalOpen} onRequestClose={closeEditServiceModal} style={ModalStyle} contentLabel="Edit Service Modal">
    <div className='flex items-center justify-between p-2'>
    <h1 className='text-gray-700 font-medium text-xl '>Edit service</h1>
    <CloseOutlinedIcon className='cursor-pointer' onClick={()=>{closeEditServiceModal()}} fontSize='small' />
    </div>
    
      <div className='w-[90vw] sm:w-[400px] md:w-[500px] bg-white space-y-3 p-2'>
        {/* Name */}
        <div className='flex flex-col space-y-5'>
        <div className='flex flex-col relative'>
        <input maxLength={30} required value={serviceOfferInfo.name} onChange={(e)=>setServiceOfferInfo({...serviceOfferInfo, name : e.target.value})} className={`border-2 ${fieldError.name ? 'border-red-500' : ''} valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]`} placeholder={`${document.getElementById('serviceName')?.focus ? 'ex. Premium' : ''}`} id='serviceName' type='text' />
        <p className={`${fieldError.name ? 'block' : 'hidden'} text-xs text-red-500`}>This field is required</p>
        <div className='text-[0.8rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Service name </div>
        </div>
        {/* Price */}
        <div className='flex flex-col relative'>
          <input maxLength={9} pattern="[0-9]*" required disabled={serviceOfferInfo.variants?.length === 0 ? false : true} value={serviceOfferInfo.origPrice} onChange={(e)=>{const numericValue = e.target.value.replace(/\D/g, '');setServiceOfferInfo({...serviceOfferInfo, origPrice : numericValue})}} className={`border-2 ${fieldError.origPrice ? 'border-red-500' : ''} valid:border-themeBlue peer outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]`} placeholder={`${document.getElementById('servicePrice')?.focus ? 'ex. 200' : ''}`}  id='servicePrice' type='text' />
          <p style={{userSelect: 'none'}} className='text-[0.8rem] pointer-events-none absolute top-2 left-1 peer-focus:font-bold peer-valid:font-bold user-select-none peer-focus:-top-2 peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='servicePrice'>Service price </p>
          <p className={`${fieldError.origPrice ? 'block' : 'hidden'} text-xs text-red-500`}>This field is required</p>
        </div>
        </div>

        {/* Duration */}
        <div className='flex flex-col relative'>
          <input maxLength={9} pattern="[0-9]*" required disabled={serviceOfferInfo.variants?.length === 0 ? false : true} value={serviceOfferInfo.duration} onChange={(e)=>{const numericValue = e.target.value.replace(/\D/g, '');setServiceOfferInfo({...serviceOfferInfo, duration : numericValue})}} className={`border-2 ${fieldError.duration ? 'border-red-500' : ''} valid:border-themeBlue peer outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]`} placeholder={`${document.getElementById('serviceDUration')?.focus ? 'Duration in minutes' : ''}`}  id='serviceDUration' type='text' />
          <p style={{userSelect: 'none'}} className='text-[0.8rem] pointer-events-none absolute top-2 left-1 peer-focus:font-bold peer-valid:font-bold user-select-none peer-focus:-top-2 peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='servicePrice'>Service Duration </p>
          <p className={`${fieldError.origPrice ? 'block' : 'hidden'} text-xs text-red-500`}>This field is required</p>
        </div>

        {/* Variations */}
        <div className='flex flex-col space-y-2'>
        {serviceOfferInfo.variants?.map((variation, index) => (
        <div key={index} className='flex gap-2'>
          <input
          maxLength={30}
          onChange={(e) => {
            setServiceOfferInfo((prevServiceOfferInfo) => ({
              ...prevServiceOfferInfo,
              variants: prevServiceOfferInfo.variants.map((item, i) =>
                i === index ? { ...item, type: e.target.value } : item
              ),
            }));
          }}
          value={variation.type}
          className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
          type='text'
          placeholder='Type'
        />

          <input
            pattern="[0-9]*"
            maxLength={9}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variants: prevServiceOfferInfo.variants.map((item, i) =>
                  i === index ? { ...item, price: numericValue } : item
                ),
              }));
            }}
            value={variation.price}
            className='border rounded-sm p-1 text-[0.75rem] font-light text-sm w-full'
            type='text'
            placeholder='Price'
          />

            <input
            pattern="[0-9]*"
            maxLength={9}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variants: prevServiceOfferInfo.variants.map((item, i) =>
                  i === index ? { ...item, duration: numericValue } : item
                ),
              }));
            }}
            value={variation.duration}
            className='border rounded-sm p-1 text-[0.75rem] font-light text-sm w-full'
            type='text'
            placeholder='Duration (mins)'
          />
          <button onClick={()=>{removeVariation(index)}} className='text-red-500 hover:bg-gray-100 flex items-center justify-center rounded-full px-0.5'>
            <RemoveCircleOutlineOutlinedIcon />
          </button>
        </div>
        ))
        }
        </div>
        <div className={`${serviceOfferInfo.variants?.length === 0 ? 'hidden' : 'block'} w-full flex justify-start`}>
        <button onClick={()=>{addVariation()}}><AddOutlinedIcon fontSize='small' className='text-white border rounded-full bg-blue-500' /></button>
        </div>
        <button onClick={()=>{addVariation()}} className={`w-full ${serviceOfferInfo.variants?.length === 0 ? 'block' : 'hidden'} bg-white border-dashed border-blue-500 border-2 p-2 text-blue-500 text-[0.8rem] font-medium rounded-sm`}>Add Variation</button>
        <button onClick={()=>{updateServiceOffer()}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Update</button>
        {
            serviceOfferInfo.status === 'ACTIVE'
            ?
            <button onClick={()=>{disableServiceOffer()}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-blue-400 hover:bg-blue-500 text-sm font-medium rounded-sm`}>Mark as disabled</button>
            :
            <button onClick={()=>{enableServiceOffer();setIsEdit(false)}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-blue-400 hover:bg-blue-500 text-sm font-medium rounded-sm`}>Mark as Active</button>

        }
      </div>
    </Modal>

    <Modal isOpen={cancelPolicyModalOpen} onRequestClose={()=>setCancelPolicyModalOpen(false)} style={ModalStyle} contentLabel="Cancelation Policy">
        <div className='flex flex-col'>
          <h3 className='text-gray-800 font-medium text-lg'>Cancelation</h3>
            <p className='text-gray-600 text-[0.71rem]'>Timeframe for client cancellations after booking</p>
          <div className='flex flex-row gap-2'>
            {/* Day */}
            <div className="py-1 px-2 bg-white border border-blue-300 rounded-lg" data-hs-input-number="">
              <div className="w-full flex justify-between items-center gap-x-5">
            <div className="grow">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">
                Day
              </span>
              <input onChange={(e)=>{handleChangeCancelTime('day', e.target.value)}} className="w-20 p-0 bg-transparent border-0 text-gray-800 " type="text" value={cancelTimeLimit.day} />
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              <button onClick={()=>{handleChangeCancelTime('day', cancelTimeLimit.day - 1)}} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-input-number-decrement="">
                <svg className="flex-shrink-0 size-2.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button onClick={()=>{handleChangeCancelTime('day', cancelTimeLimit.day + 1)}} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-input-number-increment="">
                <svg className="flex-shrink-0 size-2.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
              </div>
            </div>
            {/* Hour */}
            <div className="py-1 px-2 bg-white border border-blue-300 rounded-lg" data-hs-input-number="">
              <div className="w-full flex justify-between items-center gap-x-5">
            <div className="grow">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">
                Hour
              </span>
              <input  min="0" onChange={(e)=>{handleChangeCancelTime('hour', e.target.value)}} className="w-20 p-0 bg-transparent border-0 text-gray-800 " type="text" value={cancelTimeLimit.hour} />
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              <button onClick={()=>{handleChangeCancelTime('hour', cancelTimeLimit.hour - 1)}} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-input-number-decrement="">
                <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button onClick={()=>{handleChangeCancelTime('hour', cancelTimeLimit.hour + 1)}} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-input-number-increment="">
                <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
              </div>
            </div>
            {/* Minutes */}
            <div className="py-1 px-2 bg-white border border-blue-300 rounded-lg" data-hs-input-number="">
              <div className="w-full flex justify-between items-center gap-x-5">
            <div className="grow">
              <span className="block text-xs text-gray-500 dark:text-neutral-400">
                Minutes
              </span>
              <input  min="0" onChange={(e)=>{handleChangeCancelTime('minutes', e.target.value)}} className="w-20 p-0 bg-transparent border-0 text-gray-800 " type="text" value={cancelTimeLimit.minutes} />
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              <button onClick={()=>{handleChangeCancelTime('minutes', cancelTimeLimit.minutes - 1)}} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-input-number-decrement="">
                <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button onClick={()=>{handleChangeCancelTime('minutes', cancelTimeLimit.minutes + 1)}} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-input-number-increment="">
                <svg className="flex-shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </button>
            </div>
              </div>
            </div>
          </div>
          {/* Cancelation policy */}
          <div className='flex-col gap-1 mt-2 w-full'>
            <p className='text-gray-600 text-[0.71rem]'>Cancelation policy (optional)</p>
            <textarea value={cancelPolicy} onChange={(e)=>{setCancelPolicy(e.target.value)}} rows={5} className='border border-blue-300 rounded-md resize-none w-full p-1.5 text-gray-700 text-sm' />
          </div>
          {/* Buttons */}
          <div className='w-full flex items-center justify-end space-x-2'>
            <button onClick={()=>{setCancelPolicyModalOpen(false);setCancelTimeLimit({day : serviceInformation.cancelationPolicy.cancelTimeLimit.day, hour : serviceInformation.cancelationPolicy.cancelTimeLimit.hour, minutes : serviceInformation.cancelationPolicy.cancelTimeLimit.minutes});setCancelPolicy(serviceInformation.cancelationPolicy.cancelPolicy)}} className='text-gray-600'>Cancel</button>
            <button onClick={()=>submitBookingTimeLimit()} className='bg-themeOrange hover:bg-orange-400 rounded-sm px-2 py-1 text-white text-sm'>Submit</button>
          </div>
        </div>
    </Modal>

    <Modal isOpen={acceptBookingErrorModalOpen} onRequestClose={closeAcceptBookingErrorModal} style={ErrorModal} contentLabel="Error">
    <div className="rounded-md border bg-white shadow-lg border-blue-500 p-4 max-w-md mx-auto mt-8">
      <header className="text-center">
        <p className="text-2xl font-medium text-gray-700">No Services Found</p>
      </header>
      <div className="mt-4 text-center">
        <p>
          Unable to enable booking as the service list is currently empty.
        </p>
        <p className="mt-2">
          Please add services to the list before attempting to enable booking.
        </p>
      </div>
      <button onClick={closeAcceptBookingErrorModal} className='px-2 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded-sm'>Okay</button>
    </div>
    </Modal>
    <ToastContainer />
    </main>
  )
}

export default BookingInformation