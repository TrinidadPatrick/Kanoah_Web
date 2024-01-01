import React, { useContext, useEffect, useState } from 'react'
import { pageContext } from './ServiceRegistrationPage'
import YouTubeIcon from '@mui/icons-material/YouTube';
import Modal from 'react-modal';
import YouTube from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Gcash from './Utils/images/Gcash.png'
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import cash from './Utils/images/cash.png'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import  { categories } from '../MainPage/Components/Categories'
import cloudinaryCore from '../../CloudinaryConfig'
import axios from 'axios';

const AdvanceInformation = () => {
Modal.setAppElement('#root');
const [errors, setErrors] = useState({
  GcashServiceTitleError : false,
  GcashEmailError : false,
  GcashQRError : false,
  ServiceContactError : false,
  ServiceEmailError : false,
  ServiceCategoryError : false,
})
const [openSocialLinkModal, setOpenSocialLinkModal] = useState(false);
const [openBookingModal, setOpenBookingModal] = useState(false);
const [isGcashModalOpen, setIsGcashModalOpen] = useState(false);
const [isGcashChecked, setIsGcashChecked] = useState(false);
const [step, setStep, userId, serviceInformation, setServiceInformation] = useContext(pageContext)
const serviceOptions = ['Home Service','Online Service','Walk-In Service', 'Pick-up and Deliver']
const [selectedServiceOptions, setSelectedServiceOptions] = useState([])
const [advanceInformation, setAdvanceInformation] = useState({
  ServiceContact : "",
  ServiceFax : "",
  ServiceEmail : "",
  ServiceCategory : "",
  ServiceOptions : [],
  AcceptBooking : false,
  SocialLink : [{media : "Youtube",link : ""}, {media : "Facebook",link : ""}, {media : "Instagram",link : ""}],
  PaymentMethod : [{method : "Gcash", enabled: false, gcashInfo : {QRCode : "https://via.placeholder.com/150",
  ServiceTitle : "",
  EmailForGcash : "",
  GcashNote : "",}}, {method : "Cash", enabled : false}],
})
const [isEdit, setIsEdit] = useState(false)
const [serviceOfferList, setServiceOfferList] = useState([])
const [serviceOfferInfo, setServiceOfferInfo] = useState({
      id : '', 
      name : '',
      origPrice : '',
      variant : {enabled : false, variantList : []}
    })
const [isPhotoLoading, setIsPhotoLoading] = useState(false)

const [gcashInformation, setGcashInformation] = useState({
  QRCode : "https://via.placeholder.com/150",
  ServiceTitle : "",
  EmailForGcash : "",
  GcashNote : "",
})


// Modal Style
const socialLinkModalStyle = {
    content: {
      top: '55%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding : '0'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the color and transparency here
    },
  };

// handle open social modal
const openSocialModal = () => {
    setOpenSocialLinkModal(true)
}
const closeSocialModal = () => {
    setOpenSocialLinkModal(false)
}
const openGcashSetupModal = () => {
    setIsGcashModalOpen(true)
}
const closeGcashMethodModal = () => {
    setIsGcashModalOpen(false)
    setGcashInformation(advanceInformation.PaymentMethod[0].enabled = !advanceInformation.PaymentMethod[0].enabled )
}
const openBookingInfoModal = () => {
  setOpenBookingModal(true)
}
const closeBookingInfoModal = () => {
  setOpenBookingModal(false)
 
}

// Handle service options select
const handleSelectServiceOption = (serviceOption) => {

    const newData = [...selectedServiceOptions]
    if(newData.includes(serviceOption))
    {
      const filtered = newData.filter(option => option != serviceOption)
      setSelectedServiceOptions(filtered)
      setAdvanceInformation({...advanceInformation, ServiceOptions  : filtered})
    }
    else
    {
      newData.push(serviceOption)
      setSelectedServiceOptions(newData)
      setAdvanceInformation({...advanceInformation, ServiceOptions  : newData})
    }
    
}

// Handle the payment method
const handleGcashCheckbox = () => {
  // Toggle the state
  setIsGcashChecked(prevState => !prevState);
  setGcashInformation(advanceInformation.PaymentMethod[0].enabled = !advanceInformation.PaymentMethod[0].enabled )
  setAdvanceInformation({
    ...advanceInformation,
    PaymentMethod: [
      {
        ...advanceInformation.PaymentMethod[0],
        gcashInfo: {}
      },
      ...advanceInformation.PaymentMethod.slice(1),
    ],
  });

  

  // Check the updated state value
  if (!isGcashChecked) {
    openGcashSetupModal();
  }
};

// FOr QR Image
const addQrImage = async (files) => {
  setIsPhotoLoading(true)
    const file = files[0]

    if(file){
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'KanoahProfileUpload');

      axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`, formData).then((res)=>{
        console.log(res)
        setGcashInformation({...gcashInformation, QRCode : res.data.secure_url})
        setIsPhotoLoading(false)
      }).catch((err)=>{
          console.log(err)
          setIsPhotoLoading(false)
      })
  }
  
}

//submits the gcash setup information
const submitGcashPayment = () => {
  const checkErrors = (input, errorKey) => (
    setErrors((prevErrors)=>({...prevErrors, [errorKey] : gcashInformation[input] == "" || gcashInformation[input] == undefined ? true : false}))
  )

  checkErrors("ServiceTitle", "GcashServiceTitleError")
  checkErrors("EmailForGcash", "GcashEmailError")
  checkErrors("QRCode", "GcashQRError")
  // if(gcashInformation.ServiceTitle == "" || gcashInformation.ServiceTitle == undefined)
  // {
  //   console.log("ss")
  // }
  if(gcashInformation.QRCode == "https://via.placeholder.com/150"){setErrors({...errors, GcashQRError : true})}
  if((gcashInformation.ServiceTitle != undefined) && (gcashInformation.EmailForGcash != undefined) && (gcashInformation.QRCode != undefined))
  {
    setAdvanceInformation({
      ...advanceInformation,
      PaymentMethod: [
        {
          ...advanceInformation.PaymentMethod[0],
          gcashInfo: gcashInformation
        },
        ...advanceInformation.PaymentMethod.slice(1),
      ],
    });
  // console.log(advanceInformation.PaymentMethod[0].gcashInfo)
  setIsGcashModalOpen(false)
  }
  else
  {
    
  }
  
}

const submitAdvanceInformation = () => {
  const checkErrors = (input, errorKey) => (
    setErrors((prevErrors)=>({...prevErrors, [errorKey] : advanceInformation[input] == "" ? true : false}))
  )

  checkErrors("ServiceContact", "ServiceContactError")
  checkErrors("ServiceEmail", "ServiceEmailError")
  checkErrors("ServiceCategory", "ServiceCategoryError")

  if(advanceInformation.ServiceContact != "" && advanceInformation.ServiceEmail != "" && advanceInformation.ServiceCategory != "")
  {
    setServiceInformation({...serviceInformation, advanceInformation : advanceInformation})
    setStep(3)
  }
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

const handleAddServcice = () => {
  const data = {
    id : Math.floor(Math.random() * 1000 + 1),
    name : serviceOfferInfo.name,
    origPrice : serviceOfferInfo.origPrice,
    variant : serviceOfferInfo.variant
  }
  setServiceOfferList([...serviceOfferList, data])
  setServiceOfferInfo({
    id : '',
    name : '',
    origPrice : '',
    variant : {enabled : false, variantList : []}
  })
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
    id : dataToEdit.id,
    name : dataToEdit.name,
    origPrice : dataToEdit.origPrice,
    variant : dataToEdit.variant,
    isEdit : true
  }
  setServiceOfferInfo(data)
  instance.splice(index, 1, data)
  setServiceOfferList(instance)
  const checkExistingEditIndex = instance.findIndex(service => service.isEdit === true && service.id !== dataToEdit.id) // Check the array if there is an existing object with esEdit true
  if(checkExistingEditIndex !== -1 ) //If there are, make the isEdit false of that filtered
  { 
    const dataToReplace = instance[checkExistingEditIndex]
    const dataUp = {
      id : dataToReplace.id,
      name : dataToReplace.name,
      origPrice : dataToReplace.origPrice,
      variant : dataToReplace.variant,
      isEdit : false
    }
    instance.splice(checkExistingEditIndex, 1, dataUp)
    setServiceOfferList(instance)
  }
}

const updateServiceOffer = () => {
  const instance = [...serviceOfferList]
  const dataToUpdate = serviceOfferList.findIndex(service => service.isEdit === true)
  instance.splice(dataToUpdate, 1, serviceOfferInfo)
  setServiceOfferList(instance)
  setServiceOfferInfo({
    id : '', 
      name : '',
      origPrice : '',
      variant : {enabled : false, variantList : []}
    
  })
}

const deleteServiceOffer = (index) => {
  const instance = [...serviceOfferList]
  instance.splice(index, 1)
  setServiceOfferList(instance)
}

useEffect(()=>{
  setAdvanceInformation(serviceInformation.advanceInformation)
  if(serviceInformation.advanceInformation.PaymentMethod[0].Gcash == true)
  {
    setIsGcashChecked(true)
  }
  else if (serviceInformation.advanceInformation.PaymentMethod[0].Gcash == false)
  {
    setIsGcashChecked(false)
  }
},[step])

console.log(isEdit)

  return (
  <div className='w-full h-full  flex flex-col  p-1'>
    
  <div className="flex  flex-col space-y-3 justify-between h-full">
  {/* Phone and Fax */}
  <div className='flex space-x-3'>
    {/* Phone */}
  <div className="w-full relative">
    <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="contact">Service Contact</label>
    <span className='absolute top-[2.303rem] text-sm lg:text-md text-gray-400 left-2'>+63</span>
    <input maxLength={10} value={advanceInformation["ServiceContact"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceContact : e.target.value})}} type="tel" id="contact" className={`${errors.ServiceContactError ? "border-red-500 border-2" : ""} w-full ps-9 p-2 text-sm lg:text-md border rounded outline-none shadow-sm" placeholder="1234567890`} />
  </div>
{/* Fax */}
  <div className="w-full">
    <label className="block text-gray-500 text-sm lg:text-md font-semibold mb-2" htmlFor="fax">Fax Number</label>
    <input max={10} value={advanceInformation["ServiceFax"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceFax : e.target.value})}} type="tel" id="fax" className={`w-full p-2 text-sm lg:text-md border rounded`} placeholder="Enter fax number" />
  </div>
  </div>

{/* Email and Category */}
    <div className='grid grid-cols-2 m-0 items-center gap-4'>
  <div className="w-full">
    <label className="block text-gray-500 text-sm lg:text-md font-semibold mb-2" htmlFor="email">Service Email</label>
    <input value={advanceInformation["ServiceEmail"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceEmail : e.target.value})}} type="email" id="email" className={`${errors.ServiceEmailError ? "border-red-500 border-2" : ""} w-full text-sm lg:text-md p-2 border rounded`} placeholder="example@email.com" />
  </div>

  {/* Category */}
  <div>
  <label className="block text-gray-500 text-sm lg:text-md font-semibold mb-2" htmlFor="category">Category</label>
  <select value={advanceInformation["ServiceCategory"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceCategory : e.target.value})}} className={`${errors.ServiceCategoryError ? "border-red-500 border-2" : ""} border w-full p-2 rounded-md text-sm`}>
  <option >Select Category</option>
    {
      categories.map((category, index)=>(
        <option key={index}>{category.category_name}</option>
      ))
    }
  </select>
  </div>

  </div>


  {/* Service Options */}
  
  <div className='w-full flex flex-col justify-between '>
  <p className='text-sm text-gray-500 font-semibold mb-1'>Service Options</p>
  <div className='flex justify-between flex-wrap gap-2'>
  {
  serviceOptions.map((service, index)=>(
    
    <button key={index} onClick={()=>handleSelectServiceOption(service)} className={`${selectedServiceOptions.includes(service) ? "bg-[#0E2F41] text-white" : "bg-gray-200 text-[#4F7080]"} px-2 lg:px-2 py-1  relative shadow-sm  rounded-md text-[0.65rem] lg:text-sm`}>
    <span>{service}</span>
    <div className={`absolute -top-3 -right-2 ${selectedServiceOptions.includes(service) ? "rotate-360 opacity-100 transition-transform duration-[0.5s] ease-out" : "opacity-0 transform -rotate-180 transition-transform duration-300 ease-in-out"}`}>
    <CheckCircleIcon fontSize='small' className={`text-blue-500 relative  bg-white rounded-full`} />
    </div>
    </button>
  ))
  }
  
  </div>
  </div>

  {/* Accepts booking */}
  <div className=''>
  <p className='text-sm text-gray-500 font-semibold mb-1'>Accept Booking</p>
  <div className='flex items-center space-x-2'>
  <label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" checked={advanceInformation["AcceptBooking"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, AcceptBooking : !advanceInformation["AcceptBooking"]})}} className="sr-only peer outline-none"/>
  <div className="w-7 h-4 lg:w-[2.4rem] lg:h-[1.3rem] bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[1.1rem] after:h-[0.8rem] after:lg:w-[1.1rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
  <button onClick={()=>{openBookingInfoModal()}} className='bg-gray-100 border rounded-sm text-xs p-1 '>Edit booking Info</button>
  </div>
  </div>

    {/* Add Social Link Button */}
    <div className='w-full'>
    <button onClick={()=>openSocialModal()} className='bg-gray-100 border text-semiXs md:text-sm rounded-sm shadow-sm px-3 font-medium py-1 hover:bg-gray-200 text-gray-600'>{advanceInformation.SocialLink[0].link != "" ||advanceInformation.SocialLink[1].link != "" || advanceInformation.SocialLink[2].link != "" ? "View Social Link" : "Add social link"}</button>
    </div>

  {/* Payment Method */}
  
  <div className="flex flex-col space-x-0">
  <p className='text-sm text-gray-500 font-semibold mb-1'>Payment method</p>
  <div className='flex flex-col w-full space-y-2'>
    {/* Gcash */}
  <div className='flex items-center justify-between space-x-3 rounded-sm border-1 shadow-sm p-3'>
  <img  src={Gcash} alt="paypal image" className=' w-20 h-5 cursor-pointer' />
  <div className='flex space-x-5 md:space-x-20'>
  <p className='text-gray-500 text-xs'>{isGcashChecked ? "Enabled" : "Not set"}</p>
  <label className="relative inline-flex items-center cursor-pointer">
  <input checked={isGcashChecked} onChange={()=>handleGcashCheckbox()} type="checkbox" value="" className="sr-only peer outline-none"/>
  <div className="w-[29px] h-4 lg:w-[1.85rem] lg:h-4 bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[0.8rem] after:h-[0.8rem] after:lg:w-[0.8rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
  </div>
  </div>


  {/* Cash */}
  <div className='flex items-center space-x-3 rounded-sm justify-between border-1 shadow-sm p-3'>
  <div className='flex items-center space-x-2'>
  <img src={cash} alt="paypal image" className=' w-6 h-6' />
  <p className='font-semibold text-gray-600'>Cash</p>
  </div>
  <div className='flex space-x-5 md:space-x-20'>
  <p className='text-gray-500 text-xs'>{advanceInformation.PaymentMethod[1].enabled ? "Enabled" : "Not set"}</p>
  <label className="relative inline-flex items-center cursor-pointer">
  <input  onClick={() => {
    setAdvanceInformation((prevAdvanceInformation) => ({
      ...prevAdvanceInformation,
      PaymentMethod: [
        ...prevAdvanceInformation.PaymentMethod.slice(0, 1), // Keep the first element unchanged
        { ...prevAdvanceInformation.PaymentMethod[1], enabled: !advanceInformation.PaymentMethod[1].enabled },
      ],
    }));
  }} type="checkbox" value=""  className="sr-only peer outline-none"/>
  <div className="w-[29px] h-4 lg:w-[1.85rem] lg:h-4 bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[0.8rem] after:h-[0.8rem] after:lg:w-[0.8rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
  </div>
  </div>
  </div>
  </div>

  <div className='w-full flex justify-end space-x-2'>
  <button onClick={()=>{setStep(1)}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-gray-200 text-gray-500'>Back</button>
  <button onClick={()=>{submitAdvanceInformation()}} className='px-3 text-[0.75rem] md:text-sm rounded-sm py-1 bg-themeBlue text-white hover:bg-blue-900'>Next</button>
  </div>
  

  </div>

    {/* Add social Link Modal */}
    <Modal
        isOpen={openSocialLinkModal} 
        style={socialLinkModalStyle}
        contentLabel="Example Modal"
      >
        <div className='flex flex-col space-y-2 p-3'>
        {/* YOutube */}
        <div className="w-full flex items-center border-2 rounded-md border-gray-200 overflow-hidden">
  <div className='bg-gray-200 px-1'>
    <YouTube fontSize="large" className='text-red-500'  />
  </div>
  <input
    value={advanceInformation.SocialLink[0].link}
    onChange={(e) => {
      setAdvanceInformation({
        ...advanceInformation,
        SocialLink: advanceInformation.SocialLink.map((socialLink, index) =>
          index === 0 ? { ...socialLink, link: e.target.value } : socialLink
        ),
      });
    }}
    type="text"
    id="youtube"
    className="w-full p-1 text-sm outline-none"
    placeholder="https://www.youtube.com/"
  />
</div>

{/* Facebook */}
<div className="w-full flex items-center border-2 rounded-md border-gray-200 overflow-hidden">
  <div className='bg-gray-200 px-1'>
    <FacebookIcon fontSize="large" className='text-blue-500'  />
  </div>
  <input
    value={advanceInformation.SocialLink[1].link}
    onChange={(e) => {
      setAdvanceInformation({
        ...advanceInformation,
        SocialLink: advanceInformation.SocialLink.map((socialLink, index) =>
          index === 1 ? { ...socialLink, link: e.target.value } : socialLink
        ),
      });
    }}
    type="text"
    id="facebook"
    className="w-full p-1 text-sm outline-none"
    placeholder="https://www.facebook.com/"
  />
</div>

{/* Instagram */}
<div className="w-full flex items-center border-2 rounded-md border-gray-200 overflow-hidden">
  <div className='bg-gray-200 px-1'>
    <InstagramIcon fontSize="large" className='bg-gradient-to-r rounded-md text-pink-300' />
  </div>
  <input
    value={advanceInformation.SocialLink[2].link}
    onChange={(e) => {
      setAdvanceInformation({
        ...advanceInformation,
        SocialLink: advanceInformation.SocialLink.map((socialLink, index) =>
          index === 2 ? { ...socialLink, link: e.target.value } : socialLink
        ),
      });
    }}
    type="text"
    id="instagram"
    className="w-full p-1 text-sm outline-none"
    placeholder="https://www.instagram.com/"
  />
</div>

        <button className='px-3 py-0.5 bg-blue-500 border shadow-sm mt-3 text-white rounded-sm' onClick={closeSocialModal}>Save</button>
        <button className='px-3 py-0.5 bg-gray-200 border shadow-sm mt-3 text-gray-500 rounded-sm' onClick={closeSocialModal}>close</button>
        </div>
        
    </Modal>


    {/* Gcash setup modal*/}
    <Modal isOpen={isGcashModalOpen} style={socialLinkModalStyle} contentLabel="Gcash Modal">
  <div className='flex flex-col relative w-[300px] h-[500px]'>
  <ArrowBackIosNewIcon className='absolute top-2 text-gray-700 cursor-pointer' onClick={()=>{closeGcashMethodModal();setIsGcashChecked(!isGcashChecked)}} />
  <h1 className='text-center my-2 font-semibold text-gray-500'>Payment Information</h1>
  
  {/* Blue container */}
  <div className='w-full bg-[#007DFE] h-[200px] flex justify-center'>
  <img src={Gcash} alt="paypal image" className='w-24 h-6 filter brightness-0 invert mt-5' />
  </div>

  {/* Body */}
  <div className='w-[80%] flex flex-col absolute top-28 left-1/2 transform -translate-x-1/2 h-fit bg-white pb-2 shadow-md rounded-lg'>
  <h1 className='text-center my-2 font-semibold text-[#007DFE]'>Setup Gcash</h1>
  {/* Image Container */}
  <div className={`${errors.GcashQRError ? "border-red-500" : ""} flex items-center justify-center w-[100px] h-[100px] mx-auto bg-gray-200 border border-gray-300 rounded-lg overflow-hidden`}>
      <img
        src={gcashInformation.QRCode}
        alt="Empty Photo"
        className="w-full h-full object-contain"
      />
      
  </div>
  <p className={`${errors.GcashQRError ? "block" : "hidden"} text-semiXs text-center text-red-500`}>Please upload QR Code</p>
  <label htmlFor="fileInput" className={`bg-blue-500 cursor-pointer mt-1 mx-auto relative inline-block px-2 py-1 text-white text-[0.6rem] text-center rounded`}>
  {isPhotoLoading ? "Uploading..." : "Upload Qr Code"}
  <input type="file" value="" onChange={(e)=>{addQrImage(e.target.files)}}  id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
  </label>
  {/* Service Title */}
  <div className="relative mb-1 mt-3 w-[90%] mx-auto flex flex-col">
  <label htmlFor='ServiceTitle' className='text-semiXs text-gray-400'>Service Title</label>
  <input value={gcashInformation.ServiceTitle} onChange={(e)=>{setGcashInformation({...gcashInformation, ServiceTitle : e.target.value})}} type="text" name='ServiceTitle' className={`${errors.GcashServiceTitleError ? "border-red-500" : ""} text-sm outline-none border border-blue-400 rounded-sm p-0.5`} placeholder='' />
  </div>
  {/* Email */}
  <div className="relative mb-1 mt-3 w-[90%] mx-auto flex flex-col">
  <label htmlFor='Email' className='text-semiXs text-gray-400'>Email</label>
  <input value={gcashInformation.EmailForGcash} onChange={(e)=>{setGcashInformation({...gcashInformation, EmailForGcash : e.target.value})}} type="text" name='Email' className={`${errors.GcashEmailError ? "border-red-500" : ""} text-sm outline-none border border-blue-400 rounded-sm p-0.5`} placeholder='' />
  </div>
  

  {/* Note */}
  <label htmlFor='fullname' className='text-semiXs w-[90%] mx-auto text-gray-400'>Note (Optional)</label>
  <div className='w-[90%] mx-auto h-[70px] border overflow-hidden mt-1'>
  <textarea value={gcashInformation.GcashNote} onChange={(e)=>{setGcashInformation({...gcashInformation, GcashNote : e.target.value})}} rows={2} className='gcashNote p-1 w-full text-sm h-full outline-none resize-none scrol '/>
  </div>
  <button onClick={()=>{submitGcashPayment()}} className='w-[95%] mt-2 mx-auto py-0.5 bg-[#007DFE] rounded-sm text-gray-100'>Submit</button>
  </div>
</div>
    </Modal>

    {/* Service offer Modal */}
    <Modal isOpen={openBookingModal} style={socialLinkModalStyle} contentLabel="Service Modal">
    <div className="modal-content w-[700px] h-[600px] flex flex-col space-y-5">
    <div className='flex items-center space-x-2 w-full p-2'>
    <ArrowBackIosNewIcon onClick={()=>{closeBookingInfoModal()}} fontSize='small' className='mt-0.5 text-gray-500 cursor-pointer hover:text-black' /> 
    <h1 className='text-gray-800 font-medium text-2xl'>Input services for booking</h1>
    </div>
    <div className='flex flex-col space-y-5 p-5'>
        {/* Name */}
        <div className='flex flex-col'>
          <label htmlFor='serviceName'>Service Name: </label>
          <input value={serviceOfferInfo.name} onChange={(e)=>setServiceOfferInfo({...serviceOfferInfo, name : e.target.value})} className='border rounded-sm p-2 font-light' placeholder='ex. premium carwash' id='serviceName' type='text' />
        </div>
        {/* Price */}
        <div className='flex flex-col'>
          <label htmlFor='serviceName'>Service Price: </label>
          <input disabled={serviceOfferInfo.variant.variantList.length === 0 ? false : true} value={serviceOfferInfo.origPrice} onChange={(e)=>setServiceOfferInfo({...serviceOfferInfo, origPrice : e.target.value})} className='border rounded-sm p-2 font-light' placeholder='ex. 200' id='serviceName' type='number' />
        </div>

        {/* Variations */}
        <div className='flex flex-col space-y-2'>
        {serviceOfferInfo.variant.variantList.map((variation, index) => (
        <div key={index} className='flex gap-2'>
          <input onChange={(e) => {
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
            className='border rounded-sm p-1 font-light text-sm w-full'
            type='text'
            placeholder='Type'
          />

          <input onChange={(e) => {
              setServiceOfferInfo((prevServiceOfferInfo) => ({
                ...prevServiceOfferInfo,
                variant: {
                  ...prevServiceOfferInfo.variant,
                  variantList: prevServiceOfferInfo.variant.variantList.map(
                    (item, i) =>
                      i === index ? { ...item, price: e.target.value } : item
                  )
                }
              }));
            }}
            value={variation.price}
            className='border rounded-sm p-1 font-light text-sm w-full'
            type='number'
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
        

        {/* Buttons */}
        <button onClick={()=>{addVariation()}} className={`w-full ${serviceOfferInfo.variant.variantList.length === 0 ? 'block' : 'hidden'} bg-white border-dashed border-blue-500 border-2 p-2 text-blue-500 text-sm font-medium rounded-sm`}>Add Variation</button>
        <button onClick={()=>{updateServiceOffer();setIsEdit(false)}} className={`w-full ${isEdit ? 'block' : 'hidden'} p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Update</button>
        <button onClick={()=>{handleAddServcice()}} className={`w-full ${isEdit ? 'hidden' : 'block'} p-2 text-white bg-themeOrange hover:bg-orange-400 text-sm font-medium rounded-sm`}>Add Service</button>

        {/* Table */}
        <div className='overflow-y-scroll w-full'>
        <table className='border table-auto w-full text-sm'>
          <thead>
            <tr>
              <th className='border text-center p-1 sm:w-1/4 md:w-1/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4'>Name</th>
                <th className='border text-center p-1 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/6 2xl:w-1/6'>Price</th>
              <th className='border text-center p-1 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/2 2xl:w-1/2'>Variants</th>      
              <th className='border text-center p-1 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/2 2xl:w-1/2'>Action</th>      
            </tr>
          </thead>
          <tbody>
              {
                serviceOfferList.map((service, index)=>{
                  return (
                    <tr key={index}>
                    <td className='border text-center p-1 max-w-[15rem] overflow-hidden text-ellipsis'>{service.name}</td>
                    <td className='border text-center p-1 sm:w-1/4 md:w-1/3 lg:w-1/4 xl:w-1/6 2xl:w-1/6'>
                    {service.variant.variantList.length !== 0 ? `₱${service.variant.variantList[0].price} - ₱${service.variant.variantList.slice(-1)[0].price}` : `₱${service.origPrice}`}
                    </td>
                    {/* <td className='border text-center p-1 '><button className='px-2 bg-[#651579] rounded-sm text-sm text-white'>View</button></td> */}
                    <td className='border p-1 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/2 2xl:w-1/2'>
                      <div className={`${service.variant.variantList.length !== 0 ? 'flex' : 'hidden'} w-full  justify-evenly`}>
                        <div className=' w-full font-medium'>
                          Type
                        </div>
                        <div className='w-full font-medium'>
                          Price
                        </div>
                        </div>
                        <div className='flex flex-col items-start'>
                        {
                        service.variant.variantList.length !== 0 ?
                        service.variant.variantList.map((variant, index)=>(
                          
                          <ul key={index} className="flex items-center justify-evenly w-full">
                            <li className='w-full text-[0.8rem]'>{variant?.type}</li>
                            <li className='w-full text-[0.8rem]'>₱ {variant?.price}</li>
                          </ul>
                        ))
                        :
                        <p className='text-center  w-full'>No Variant</p>
                      }
                      </div>   
                    </td>
                    <td className='text-center border'>
                      <EditOutlinedIcon onClick={()=>{handleEditServiceOffer(index);setIsEdit(true)}} className='p-0.5 cursor-pointer hover:text-blue-500' fontSize='small' />
                      <ClearOutlinedIcon onClick={()=>{deleteServiceOffer(index)}} className='p-0.5 text-red-500 cursor-pointer ' fontSize='small' />
                    </td>
                    </tr>
                  )
                })
              }
              <tr>
                
              </tr>
          </tbody>
        </table>
        </div>
        </div>
    </div>
        
    </Modal>
    </div>
  )
}

export default AdvanceInformation