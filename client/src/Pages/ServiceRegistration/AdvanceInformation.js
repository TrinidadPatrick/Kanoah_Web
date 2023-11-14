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
import cash from './Utils/images/cash.png'
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
  PaymentMethod : {Gcash : {}, Cash : false},
})
const [isPhotoLoading, setIsPhotoLoading] = useState(false)

const [gcashInfo, setGcashInfo] = useState({
  QRCode : "https://via.placeholder.com/150",
  ServiceTitle : "",
  EmailForGcash : "",
  GcashNote : "",
  Enabled : false
})


// Modal Style
const socialLinkModalStyle = {
    content: {
      top: '50%',
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
    setGcashInfo({...gcashInfo, Enabled : !gcashInfo.Enabled})
}

// Handle service options select
const handleSelectServiceOption = (serviceOption) => {

    const newData = [...selectedServiceOptions]
    if(newData.includes(serviceOption))
    {
      const filtered = newData.filter(option => option != serviceOption)
      setSelectedServiceOptions(filtered)
      setAdvanceInformation({...advanceInformation, ServiceOptions  : [filtered]})
    }
    else
    {
      newData.push(serviceOption)
      setSelectedServiceOptions(newData)
      setAdvanceInformation({...advanceInformation, ServiceOptions  : [newData]})
    }
    
}

// Handle the payment method
const handleGcashCheckbox = () => {
  // Toggle the state
  setIsGcashChecked(prevState => !prevState);
  setGcashInfo({...gcashInfo, Enabled : !gcashInfo.Enabled})
  // setAdvanceInformation({...advanceInformation, {...PaymentMethod, Gcash, status : "Enabled"}})

  

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
        setGcashInfo({...gcashInfo, QRCode : res.data.secure_url})
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
    setErrors((prevErrors)=>({...prevErrors, [errorKey] : gcashInfo[input] == "" ? true : false}))
  )

  checkErrors("ServiceTitle", "GcashServiceTitleError")
  checkErrors("EmailForGcash", "GcashEmailError")
  if(gcashInfo.QRCode == "https://via.placeholder.com/150"){setErrors({...errors, GcashQRError : true})}
  if(gcashInfo.ServiceTitle != "" && gcashInfo.EmailForGcash !="" && gcashInfo.QRCode != "https://via.placeholder.com/150")
  {
  setGcashInfo({...gcashInfo, Enabled : true})
  setAdvanceInformation({...advanceInformation, PaymentMethod: {...advanceInformation.PaymentMethod, Gcash :  gcashInfo}})
  setIsGcashModalOpen(false)
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

useEffect(()=>{
  setAdvanceInformation(serviceInformation.advanceInformation)
  if(serviceInformation.advanceInformation.PaymentMethod.Gcash.Enabled == true)
  {
    setIsGcashChecked(true)
  }else if (serviceInformation.advanceInformation.PaymentMethod.Gcash.Enabled == false)
  {
    setIsGcashChecked(false)
  }
},[step])


  return (
    <div className='w-full h-full flex flex-col  p-1'>
    
  <div className="flex  flex-col space-y-3 justify-start h-full">
  {/* Phone and Fax */}
  <div className='flex space-x-3'>
    {/* Phone */}
  <div className="w-full relative">
    <label className="block text-sm text-gray-500 font-semibold mb-2" htmlFor="contact">Service Contact</label>
    <span className='absolute top-[2.303rem] text-sm lg:text-md text-gray-400 left-2'>+63</span>
    <input value={advanceInformation["ServiceContact"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceContact : e.target.value})}} type="tel" id="contact" className={`${errors.ServiceContactError ? "border-red-500 border-2" : ""} w-full ps-9 p-2 text-sm lg:text-md border rounded outline-none shadow-sm" placeholder="1234567890`} />
  </div>
{/* Fax */}
  <div className="w-full">
    <label className="block text-gray-500 text-sm lg:text-md font-semibold mb-2" htmlFor="fax">Fax Number</label>
    <input value={advanceInformation["ServiceFax"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceFax : e.target.value})}} type="tel" id="fax" className={`w-full p-2 text-sm lg:text-md border rounded`} placeholder="Enter fax number" />
  </div>
  </div>

{/* Email and Category */}
    <div className='grid grid-cols-2 m-0 items-center gap-4'>
  <div className="w-full">
    <label className="block text-gray-500 text-sm lg:text-md font-semibold mb-2" htmlFor="email">Email</label>
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
  <div >
  <p className='text-sm text-gray-500 font-semibold mb-1'>Accept Booking</p>
  <label className="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" checked={advanceInformation["AcceptBooking"]} onChange={(e)=>{setAdvanceInformation({...advanceInformation, AcceptBooking : !advanceInformation["AcceptBooking"]})}} className="sr-only peer outline-none"/>
  <div className="w-7 h-4 lg:w-[2.4rem] lg:h-[1.3rem] bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[1.1rem] after:h-[0.8rem] after:lg:w-[1.1rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
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
  <p className='text-gray-500 text-xs'>{advanceInformation.PaymentMethod.Cash ? "Enabled" : "Not set"}</p>
  <label className="relative inline-flex items-center cursor-pointer">
  <input  onClick={()=>{setAdvanceInformation({...advanceInformation, PaymentMethod : {...advanceInformation.PaymentMethod, Cash : !advanceInformation.PaymentMethod.Cash}})}} type="checkbox" value=""  className="sr-only peer outline-none"/>
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
  <Modal isOpen={isGcashModalOpen} style={socialLinkModalStyle} contentLabel="Example Modal">
  <div className='flex flex-col relative w-[300px] h-[540px]'>
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
        src={gcashInfo.QRCode}
        alt="Empty Photo"
        className="w-full h-full object-contain"
      />
  </div>
  <label htmlFor="fileInput" className={`bg-blue-500 cursor-pointer mt-1 mx-auto relative inline-block px-2 py-1 text-white text-[0.6rem] text-center rounded`}>
  {isPhotoLoading ? "Uploading..." : "Upload Qr Code"}
  <input type="file" value="" onChange={(e)=>{addQrImage(e.target.files)}}  id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
  </label>
  {/* Service Title */}
  <div className="relative mb-1 mt-3 w-[90%] mx-auto flex flex-col">
  <label htmlFor='ServiceTitle' className='text-semiXs text-gray-400'>Service Title</label>
  <input value={gcashInfo.ServiceTitle} onChange={(e)=>{setGcashInfo({...gcashInfo, ServiceTitle : e.target.value})}} type="text" name='ServiceTitle' className={`${errors.GcashServiceTitleError ? "border-red-500" : ""} text-sm outline-none border border-blue-400 rounded-sm p-0.5`} placeholder='' />
  </div>
  {/* Email */}
  <div className="relative mb-1 mt-3 w-[90%] mx-auto flex flex-col">
  <label htmlFor='Email' className='text-semiXs text-gray-400'>Email</label>
  <input value={gcashInfo.EmailForGcash} onChange={(e)=>{setGcashInfo({...gcashInfo, EmailForGcash : e.target.value})}} type="text" name='Email' className={`${errors.GcashEmailError ? "border-red-500" : ""} text-sm outline-none border border-blue-400 rounded-sm p-0.5`} placeholder='' />
  </div>
  

  {/* Note */}
  <label htmlFor='fullname' className='text-semiXs w-[90%] mx-auto text-gray-400'>Note (Optional)</label>
  <div className='w-[90%] mx-auto h-[70px] border overflow-hidden mt-1'>
  <textarea value={gcashInfo.GcashNote} onChange={(e)=>{setGcashInfo({...gcashInfo, GcashNote : e.target.value})}} rows={2} className='gcashNote p-1 w-full text-sm h-full outline-none resize-none scrol '/>
  </div>
  <button onClick={()=>{submitGcashPayment()}} className='w-[95%] mt-2 mx-auto py-0.5 bg-[#007DFE] rounded-sm text-gray-100'>Submit</button>
  </div>
</div>
    </Modal>
    </div>
  )
}

export default AdvanceInformation