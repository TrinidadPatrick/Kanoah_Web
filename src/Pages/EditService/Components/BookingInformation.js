import React from 'react'
import { useState, useEffect, useRef } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectUserId } from '../../../ReduxTK/userSlice';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { selectServiceData } from '../../../ReduxTK/serviceSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useSelector } from 'react-redux';
import http from '../../../http';
import Modal from 'react-modal';

const BookingInformation = () => {
    const dropdownRef = useRef();
    Modal.setAppElement('#root');
    const userId = useSelector(selectUserId)
    const accessToken = localStorage.getItem('accessToken')
    const [isEdit, setIsEdit] = useState(false)
    const [acceptBooking, setAcceptBooking] = useState(false)
    const [noServices, setNoServices] = useState(false)
    const [isSelectAll, setIsSelectAll] = useState(false)
    const serviceData = useSelector(selectServiceData)
    const [serviceModalOpen, setServiceModalIsOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All services');
    const [editServiceModalOpen, setEditServiceModalIsOpen] = useState(false);
    const [viewVariantModalOpen, setViewVariantModalOpen] = useState(false);
    const [serviceOfferList, setServiceOfferList] = useState(null)
    const [selectedServices, setSelectedServices] = useState([])
    const [selectedVariantList, setSelectedVariantList] = useState([])
    const [serviceOfferInfo, setServiceOfferInfo] = useState({
      uniqueId : '', 
      name : '',
      origPrice : '',
      variant : {enabled : false, variantList : []}
    })

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

    useEffect(()=>{
       
        if(serviceData.serviceOffers !== undefined)
        {
            setServiceOfferList(serviceData.serviceOffers)
            setAcceptBooking(serviceData.acceptBooking)
        }
    }, [serviceData])

    useEffect(()=>{
        if(serviceOfferList?.length === 0)
        {
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
    }
    const closeEditServiceModal = () => {
        setEditServiceModalIsOpen(false)
        setServiceOfferInfo({
            id : '',
          name : '',
          origPrice : '',
          variant : {enabled : false, variantList : []}
        
        })
        setIsEdit(false)
    }

    const openViewVariantModal = (variants) => {
        setViewVariantModalOpen(true)
        setSelectedVariantList(variants)

    }
    const closeViewVariantModal = () => {
        setViewVariantModalOpen(false)
        
    }


    const addVariation = () => {
        setServiceOfferInfo((prevServiceOfferInfo) => ({
          ...prevServiceOfferInfo,
          variant: {
            ...prevServiceOfferInfo.variant,
            variantList: [
              ...prevServiceOfferInfo.variant.variantList,
              { type: '', price: '' }
            ]
          }
        }));
    }
  
    const handleAddServcice = async () => {
        const Instance = [...serviceOfferList]
        const tempData = {
          uniqueId : Math.floor(Math.random() * 1000 + 1),
          name : serviceOfferInfo.name,
          origPrice : serviceOfferInfo.origPrice,
          variant : serviceOfferInfo.variant,
          status : 'ACTIVE'
        }
        Instance.push(tempData)
        setServiceOfferList(Instance)
        setServiceOfferInfo({
          uniqueId : '',
          name : '',
          origPrice : '',
          variant : {enabled : false, variantList : []}
        })
        closeServiceModal()
        // Insert the data to database
        try {
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : Instance},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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
  
    const removeVariation = (index) => {
        const variantInstance = [...serviceOfferInfo.variant.variantList]
       variantInstance.splice(index, 1)
        setServiceOfferInfo({...serviceOfferInfo, variant : {...serviceOfferInfo.variant, variantList : variantInstance}})
    }
  
    const handleEditServiceOffer = (index) => {
  
        const instance = [...serviceOfferList]     
        const dataToEdit = instance[index]
        const data = {
          uniqueId : dataToEdit.uniqueId,
          name : dataToEdit.name,
          origPrice : dataToEdit.origPrice,
          variant : dataToEdit.variant,
          status : dataToEdit.status,
          isEdit : true
        }
        setServiceOfferInfo(data)
        instance.splice(index, 1, data)
        setServiceOfferList(instance)
        const checkExistingEditIndex = instance.findIndex(service => service.isEdit === true && service.uniqueId !== dataToEdit.uniqueId) // Check the array if there is an existing object with esEdit true
        if(checkExistingEditIndex !== -1 ) //If there are, make the isEdit false of that filtered
        { 
          const dataToReplace = instance[checkExistingEditIndex]
          const dataUp = {
            uniqueId : dataToReplace.uniqueId,
            name : dataToReplace.name,
            origPrice : dataToReplace.origPrice,
            variant : dataToReplace.variant,
            isEdit : false,
            status : dataToReplace.status
          }
          instance.splice(checkExistingEditIndex, 1, dataUp)
          setServiceOfferList(instance)
        }
    }
  
    const updateServiceOffer = async () => {
        const instance = [...serviceOfferList]
        const dataToUpdate = serviceOfferList.findIndex(service => service.isEdit === true)
        instance.splice(dataToUpdate, 1, serviceOfferInfo)
        setServiceOfferList(instance)
        closeEditServiceModal()
        setServiceOfferInfo({
            uniqueId : '',
          name : '',
          origPrice : '',
          variant : {enabled : false, variantList : []}
        
        })
        try {
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : instance},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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

    const handleRemoveServiceOffer = async (index) => {
        const instance = [...serviceOfferList]
        instance.splice(index, 1)
        setServiceOfferList(instance)
        try {
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : instance},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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
        const indexToUpdate = serviceOfferList.findIndex(service => service.isEdit === true)
        const data = {
            uniqueId : instance[indexToUpdate].uniqueId, 
            name : instance[indexToUpdate].name,
            origPrice : instance[indexToUpdate].origPrice,
            variant : instance[indexToUpdate].variant,
            status : "DISABLED"
        }
        instance.splice(indexToUpdate, 1, data)
        setServiceOfferList(instance)
        closeEditServiceModal()
        try {
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : instance},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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

    const enableServiceOffer = async () => {
        const instance = [...serviceOfferList]
        const indexToUpdate = serviceOfferList.findIndex(service => service.isEdit === true)
        const data = {
            uniqueId : instance[indexToUpdate].uniqueId, 
            name : instance[indexToUpdate].name,
            origPrice : instance[indexToUpdate].origPrice,
            variant : instance[indexToUpdate].variant,
            status : "ACTIVE"
        }
        instance.splice(indexToUpdate, 1, data)
        setServiceOfferList(instance)
        closeEditServiceModal()
        try {
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : instance},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : filtered},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : updatedServices},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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
        const instance = acceptBooking  
        setAcceptBooking(!instance) 
        try {
            const result = await http.patch(`updateService/${userId}`, {acceptBooking : !instance},  {
              headers : {Authorization: `Bearer ${accessToken}`},
            })
    
            if(result.data.status == "Success")
            {
                notify('Update successfull')
            }
          } catch (error) {
            console.error(error)
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
            const result = await http.patch(`updateService/${userId}`, {serviceOffers : updatedServices},  {
              headers : {Authorization: `Bearer ${accessToken}`},
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

    const handleSearch = (searchInput) => {
        const services = serviceData.serviceOffers
        const filtered = services.filter(service => service.name.toLowerCase().includes(searchInput.toLowerCase()))
        setServiceOfferList(filtered)
    }

    const handleFilter = (filter) => {
        setSelectedFilter(filter)
        const instance = [...serviceData.serviceOffers]
        if(filter === 'Allservices')
        {
            setServiceOfferList(instance)
            return ;
        }
        const filtered = instance.filter(service => service.status === filter.toUpperCase())
        setServiceOfferList(filtered)
    }


  return (
    <main className='flex justify-center items-center bg-[#f9f9f9] flex-col h-full w-full bg-na max-h-full xl:p-3 '>
    <div className="w-[100%] sm:w-[90%] md:w-[80%] xl:w-[60%] shadow-md rounded-md h-full sm:h-[90%] xl:h-[70vh] p-5 flex flex-col bg-white space-y-5">
        <div className='w-full flex items-center justify-between'>
            <h1 className='text-gray-700 font-medium text-lg md:text-2xl'>Services from business</h1>
            <div className='flex space-x-2'>
            <div className='flex space-x-2 bg-gray-50 shadow-sm p-1 rounded-[0.12rem] border'>
            <p className='text-sm text-gray-500 font-semibold mb-1'>Accept Booking</p>
            <div className='flex items-center space-x-2'>
            <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={acceptBooking} onChange={()=>{handleAcceptBooking()}} className="sr-only peer outline-none"/>
            <div className="w-7 h-4 lg:w-[2.45rem] lg:h-[1.3rem] bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[1.1rem] after:h-[0.8rem] after:lg:w-[1.1rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
            </div>
            </div>
            {/* <button onClick={()=>{openServiceModal()}} className={`w-fit flex gap-0.5 items-center px-1 py-0.5 sm:px-2 sm:py-2 text-white bg-red-500 hover:bg-red-500 text-xs sm:text-sm font-medium rounded-sm`}>Disable Booking</button> */}
            </div>
        </div>

        {/* Navigation */}
        <div className='w-full flex items-center justify-between space-x-4 p-2 bg-gray-100 relative rounded-md'>
        <div className='flex  space-x-3'>
            <button onClick={()=>{openServiceModal()}} className={`w-fit flex gap-0.5 items-center px-1 py-0.5 sm:px-2 sm:py-1 text-white bg-themeOrange hover:bg-orange-400 text-xs sm:text-[0.8rem] font-medium rounded-sm`}><AddOutlinedIcon fontSize='small' className='p-1 sm:p-0' /> Add Service</button>
            <div className=' h-[30px] w-[0.5px] bg-gray-300'></div>
            {/* Buttons */}
            <div className='flex items-center space-x-5'>
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
            <div className='h-full w-[250px] flex relative border rounded-md'>
                <div id='searchWrapper' className='w-full flex'>
                    <input onChange={(e)=>{handleSearch(e.target.value)}} className='w-full outline-none text-[0.8rem] rounded-s-md ps-2 p-1' type='search' placeholder='Search...' />
                </div>

                {/* Dropdown Button */}
                {/* <div className='relative'> */}
                <button onClick={()=>{setOpenFilter(!openFilter)}} className='whitespace-nowrap  h-full border-l-1 rounded-e-md text-[0.7rem] px-1 text-gray-700 bg-white'>{selectedFilter}<ExpandMoreIcon fontSize='small' className='p-0.5' /></button>

                {/* dropwdown content */}
                <div className={`w-[90px] ${openFilter ? '' : 'hidden'} h-fit right-0 top-9 z-10 flex flex-col items-start  bg-gray-50 shadow-md rounded-md absolute`}>
                    <button onClick={()=>{handleFilter('Allservices');setOpenFilter(!openFilter)}} className='text-[0.7rem] text-gray-700  w-full text-start px-2 p-1 hover:bg-gray-200 '>All services</button>
                    <button onClick={()=>{handleFilter('Disabled');setOpenFilter(!openFilter)}} className='text-[0.7rem] text-gray-700 w-full text-start px-2 p-1 hover:bg-gray-200 '>Disabled</button>
                    <button onClick={()=>{handleFilter('active');setOpenFilter(!openFilter)}} className='text-[0.7rem] text-gray-700 w-full text-start px-2 p-1 hover:bg-gray-200 '>Enabled</button>
                {/* </div> */}
                </div>
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
                <input id='selectChk' checked={selectedServices.some(selected => selected.uniqueId === service.uniqueId)} onChange={()=>{handleSelect(service)}} type='checkbox' />
                </div>
                </td>

                {/* Name */}
                <td className=' text-center border border-l-0  p-1 sm:w-1/4 md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-[1/5] overflow-hidden text-ellipsis '>
                <div className=' mx-2 '>
                <p className='line-clamp-2 break-words text-start'>{service.name}
                {/* dnkjdbjkashdkjasbjsajdbaskjasbdckasjssdnaskdajsdhkjasdhahjdhsadkjasdhakjshdkjashdksdjaskdjsdnjsdhkajdhajdkhsajdhajdhasdhakdhaskdjhasjdkjkash */}
                </p>
                </div>
                </td>
                
                {/* Price */}
                <td className=' text-center border border-l-0  p-1 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/6 2xl:w-1/5'>
                <div className=' m-5'>
                <p className='text-xs'>
                {service.variant.variantList.length !== 0 ? `₱${service.variant.variantList[0].price} - ₱${service.variant.variantList.slice(-1)[0].price}` : `₱${service.origPrice}`}
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
        <input maxLength={30} required value={serviceOfferInfo.name} onChange={(e)=>setServiceOfferInfo({...serviceOfferInfo, name : e.target.value})} className='border-2 valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]' placeholder={`${document.getElementById('serviceName')?.focus ? 'ex. Premium' : ''}`} id='serviceName' type='text' />
        <div className='text-[0.8rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Service name </div>
        </div>
        {/* Price */}
        <div className='flex flex-col relative'>
          <input maxLength={9} pattern="[0-9]*" required disabled={serviceOfferInfo.variant.variantList.length === 0 ? false : true} value={serviceOfferInfo.origPrice} onChange={(e)=>{const numericValue = e.target.value.replace(/\D/g, '');setServiceOfferInfo({...serviceOfferInfo, origPrice : numericValue})}} className='border-2 valid:border-themeBlue peer outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]' placeholder={`${document.getElementById('servicePrice')?.focus ? 'ex. 200' : ''}`}  id='servicePrice' type='text' />
          <p style={{userSelect: 'none'}} className='text-[0.8rem] pointer-events-none absolute top-2 left-1 peer-focus:font-bold peer-valid:font-bold user-select-none peer-focus:-top-2 peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='servicePrice'>Service price </p>
        </div>
        </div>
        {/* Variations */}
        <div className='flex flex-col space-y-2'>
        {serviceOfferInfo.variant.variantList.map((variation, index) => (
        <div key={index} className='flex gap-2'>
          <input maxLength={30} onChange={(e) => {
            
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variant: {
                  ...prevServiceOfferInfo.variant,
                  variantList: prevServiceOfferInfo.variant.variantList.map(
                    (item, i) =>
                      i === index ? { ...item, type: e.target.value } : item
                  )
                }
              }));
            }}
            value={variation.type}
            className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
            type='text'
            placeholder='Type'
          />

          <input pattern="[0-9]*" maxLength={9} onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, '');
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variant: {
                  ...prevServiceOfferInfo.variant,
                  variantList: prevServiceOfferInfo.variant.variantList.map(
                    (item, i) =>
                      i === index ? { ...item, price: numericValue } : item
                  )
                }
              }));
            }}
            value={variation.price}
            className='border rounded-sm p-1 text-[0.75rem] font-light text-sm w-full'
            type='text'
            placeholder='Price'
          />
          <button onClick={()=>{removeVariation(index)}} className='text-red-500 hover:bg-gray-100 flex items-center justify-center rounded-full px-0.5'>
            <RemoveCircleOutlineOutlinedIcon />
          </button>
        </div>
        ))
        }
        </div>
        <div className={`${serviceOfferInfo.variant.variantList.length === 0 ? 'hidden' : 'block'} w-full flex justify-start`}>
        <button onClick={()=>{addVariation()}}><AddOutlinedIcon fontSize='small' className='text-white border rounded-full bg-blue-500' /></button>
        </div>
        <button onClick={()=>{addVariation()}} className={`w-full ${serviceOfferInfo.variant.variantList.length === 0 ? 'block' : 'hidden'} bg-white border-dashed border-blue-500 border-2 p-2 text-blue-500 text-[0.8rem] font-medium rounded-sm`}>Add Variation</button>
        <button onClick={()=>{handleAddServcice()}} className={`w-full mt-3 ${isEdit ? 'hidden' : 'flex'} items-center justify-center p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Submit</button>
        <button onClick={()=>{updateServiceOffer();setIsEdit(false)}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Update</button>
      </div>
    </Modal>

    <Modal isOpen={editServiceModalOpen} onRequestClose={closeEditServiceModal} style={ModalStyle} contentLabel="Edit Service Modal">
    <div className='flex items-center justify-between p-2'>
    <h1 className='text-gray-700 font-medium text-xl '>Edit service</h1>
    <CloseOutlinedIcon className='cursor-pointer' onClick={()=>{closeEditServiceModal()}} fontSize='small' />
    </div>
    
      <div className='w-[500px] bg-white space-y-3 p-2'>
        {/* Name */}
        <div className='flex flex-col space-y-5'>
        <div className='flex flex-col relative'>
        <input maxLength={30} required value={serviceOfferInfo.name} onChange={(e)=>setServiceOfferInfo({...serviceOfferInfo, name : e.target.value})} className='border-2 valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]' placeholder={`${document.getElementById('serviceName')?.focus ? 'ex. Premium' : ''}`} id='serviceName' type='text' />
        <div className='text-[0.8rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Service name </div>
        </div>
        {/* Price */}
        <div className='flex flex-col relative'>
          <input maxLength={9} pattern="[0-9]*" required disabled={serviceOfferInfo.variant.variantList.length === 0 ? false : true} value={serviceOfferInfo.origPrice} onChange={(e)=>{const numericValue = e.target.value.replace(/\D/g, '');setServiceOfferInfo({...serviceOfferInfo, origPrice : numericValue})}} className='border-2 valid:border-themeBlue peer outline-themeBlue rounded-sm p-2 font-light text-[0.8rem]' placeholder={`${document.getElementById('servicePrice')?.focus ? 'ex. 200' : ''}`}  id='servicePrice' type='text' />
          <p style={{userSelect: 'none'}} className='text-[0.8rem] pointer-events-none absolute top-2 left-1 peer-focus:font-bold peer-valid:font-bold user-select-none peer-focus:-top-2 peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='servicePrice'>Service price </p>
        </div>
        </div>

        {/* Variations */}
        <div className='flex flex-col space-y-2'>
        {serviceOfferInfo.variant.variantList.map((variation, index) => (
        <div key={index} className='flex gap-2'>
          <input maxLength={30} onChange={(e) => {
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variant: {
                  ...prevServiceOfferInfo.variant,
                  variantList: prevServiceOfferInfo.variant.variantList.map(
                    (item, i) =>
                      i === index ? { ...item, type: e.target.value } : item
                  )
                }
              }));
            }}
            value={variation.type}
            className='border rounded-sm p-1 font-light text-[0.75rem] w-full'
            type='text'
            placeholder='Type'
          />

          <input pattern="[0-9]*" maxLength={9} onChange={(e) => {
            const numericValue = e.target.value.replace(/\D/g, '');
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variant: {
                  ...prevServiceOfferInfo.variant,
                  variantList: prevServiceOfferInfo.variant.variantList.map(
                    (item, i) =>
                      i === index ? { ...item, price: numericValue } : item
                  )
                }
              }));
            }}
            value={variation.price}
            className='border rounded-sm p-1 text-[0.75rem] font-light text-sm w-full'
            type='text'
            placeholder='Price'
          />
          <button onClick={()=>{removeVariation(index)}} className='text-red-500 hover:bg-gray-100 flex items-center justify-center rounded-full px-0.5'>
            <RemoveCircleOutlineOutlinedIcon />
          </button>
        </div>
        ))
        }
        </div>
        <div className={`${serviceOfferInfo.variant.variantList.length === 0 ? 'hidden' : 'block'} w-full flex justify-start`}>
        <button onClick={()=>{addVariation()}}><AddOutlinedIcon fontSize='small' className='text-white border rounded-full bg-blue-500' /></button>
        </div>
        <button onClick={()=>{addVariation()}} className={`w-full ${serviceOfferInfo.variant.variantList.length === 0 ? 'block' : 'hidden'} bg-white border-dashed border-blue-500 border-2 p-2 text-blue-500 text-[0.8rem] font-medium rounded-sm`}>Add Variation</button>
        <button onClick={()=>{updateServiceOffer();setIsEdit(false)}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Update</button>
        {
            serviceOfferInfo.status === 'ACTIVE'
            ?
            <button onClick={()=>{disableServiceOffer();setIsEdit(false)}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-blue-400 hover:bg-blue-500 text-sm font-medium rounded-sm`}>Mark as disabled</button>
            :
            <button onClick={()=>{enableServiceOffer();setIsEdit(false)}} className={`w-full  ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-blue-400 hover:bg-blue-500 text-sm font-medium rounded-sm`}>Mark as Active</button>

        }
      </div>
    </Modal>


    <Modal isOpen={viewVariantModalOpen} onRequestClose={closeViewVariantModal} style={ModalStyle} contentLabel="View Variant">
        <div className='rounded-xl h-[500px]'>
        <div className='p-2 border-b-1'>
        <h1 className='text-xl font-semibold'>Variants</h1>
        </div>
       
            <div className='w-[300px] bg-white  rounded-xl mx-auto p-3'>
            <div className={`${selectedVariantList.length !== 0 ? 'flex' : 'hidden'} border-b-2 w-full mb-3 pb-1 border-black space-x-10 justify-evenly`}>
            <div className='w-[65%] text-lg font-medium text-start'>Type</div>
            <div className='w-[25%] text-lg font-medium text-start'>Price</div>
            </div>
            <div className='flex flex-col items-start space-y-2'>
            {
            selectedVariantList.length !== 0 ?
            selectedVariantList.map((variant, index)=>(        
                <ul key={index} className="flex items-center space-x-10 w-full border-b-1 pb-2">
                <li className='w-[65%] text-start text-[1rem] overflow-hidden text-ellipsis'>{variant?.type}</li>
                <li className='w-[25%] text-start text-[1rem] whitespace-nowrap'>₱ {variant?.price}</li>
                </ul>
                ))
                :
                <p className='text-center  w-full'>No Variant</p>
                }
        </div>  
        </div> 
        </div>
    </Modal>
    <ToastContainer />
    </main>
  )
}

export default BookingInformation