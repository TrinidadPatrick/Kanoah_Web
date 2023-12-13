import React, { useEffect } from 'react'
import { categories } from '../../MainPage/Components/Categories'
import { selectServiceData, setServiceData } from '../../../ReduxTK/serviceSlice'
import { selectUserId } from '../../../ReduxTK/userSlice'
import { useState } from 'react'
import Modal from 'react-modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import YouTube from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import cash from '../../ServiceRegistration/Utils/images/cash.png'
import Gcash from '../../ServiceRegistration/Utils/images/Gcash.png'
import { useSelector } from 'react-redux'
import axios from 'axios';
import cloudinaryCore from '../../../CloudinaryConfig';
import http from '../../../http'

const AdvanceInformation = () => {
    Modal.setAppElement('#root');
    const userId = useSelector(selectUserId)
    const [updating, setUpdating] = useState(false)
    const accessToken = localStorage.getItem('accessToken')
    const serviceData = useSelector(selectServiceData)
    const [openSocialLinkModal, setOpenSocialLinkModal] = useState(false);
    const serviceOptions = ['Home Service','Online Service','Walk-In Service', 'Pick-up and Deliver']
    const [isGcashChecked, setIsGcashChecked] = useState(false);
    const [isGcashModalOpen, setIsGcashModalOpen] = useState(false);
    const [isPhotoLoading, setIsPhotoLoading] = useState(false)
    const [errors, setErrors] = useState({ GcashServiceTitleError : false, GcashEmailError : false, GcashQRError : false, ServiceContactError : false, ServiceEmailError : false,ServiceCategoryError : false,})
    const [advanceInformation, setAdvanceInformation] = useState({ ServiceContact : "",
    ServiceFax : "",
    ServiceEmail : "",
    ServiceCategory : "",
    ServiceOptions : [],
    AcceptBooking : false,
    SocialLink : [{media : "Youtube",link : ""}, {media : "Facebook",link : ""}, {media : "Instagram",link : ""}],
    PaymentMethod : [{method : "Gcash", enabled: false, gcashInfo : {
    QRCode : "https://via.placeholder.com/150",
    ServiceTitle : "",
    EmailForGcash : "",
    GcashNote : "",}}, {method : "Cash", enabled : false}],})

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
        setAdvanceInformation({
            ...advanceInformation,
            PaymentMethod: advanceInformation.PaymentMethod.map((method, index) =>
              index === 0
                ? { ...method, enabled: !method.enabled }
                : method
            ),
          });
    }

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
          setAdvanceInformation((prevAdvanceInformation) => ({
            ...prevAdvanceInformation,
            PaymentMethod: prevAdvanceInformation.PaymentMethod.map((method, index) =>
              index === 0
                ? {
                    ...method,
                    gcashInfo: {
                      ...method.gcashInfo,
                      QRCode: res.data.secure_url,
                    },
                  }
                : method
            ),
          }));
        //   setAdvanceInformation({...advanceInformation, PaymentMethod: [{...advanceInformation.PaymentMethod[0].gcashInfo,QRCode : res.data.secure_url}]})
          setIsPhotoLoading(false)
        }).catch((err)=>{
            console.log(err)
            setIsPhotoLoading(false)
        })
    }
    
    }
  

    // Handle service options select
    const handleSelectServiceOption = (serviceOption) => {

    const newData = [...advanceInformation.ServiceOptions]
    if(newData.includes(serviceOption))
    {
      const filtered = newData.filter(option => option != serviceOption)
      setAdvanceInformation({...advanceInformation, ServiceOptions  : filtered})
    }
    else
    {
      newData.push(serviceOption)
      setAdvanceInformation({...advanceInformation, ServiceOptions  : newData})
    }
    
    }

    // enable the gcash if checked
    const handleGcashCheckbox = () => {
        // Toggle the state
        setIsGcashChecked(prevState => !prevState);
        setAdvanceInformation({
          ...advanceInformation,
          PaymentMethod: [
            {
              ...advanceInformation.PaymentMethod[0],
              enabled: !advanceInformation.PaymentMethod[0].enabled
            },
            ...advanceInformation.PaymentMethod.slice(1),
          ],
        });
      
        
      
        // Check the updated state value
        if (!advanceInformation.PaymentMethod[0].enabled) {
          openGcashSetupModal();
        }
    };

    //submits the gcash setup information
    const submitGcashPayment = () => {
    const checkErrors = (input, errorKey) => (
      setErrors((prevErrors)=>({...prevErrors, [errorKey] : advanceInformation.PaymentMethod[0].gcashInfo[input] == "" ? true : false}))
    )
  
    checkErrors("ServiceTitle", "GcashServiceTitleError")
    checkErrors("EmailForGcash", "GcashEmailError")
    if(advanceInformation.PaymentMethod[0].QRCode == "https://via.placeholder.com/150"){setErrors({...errors, GcashQRError : true})}
    if(advanceInformation.PaymentMethod[0].ServiceTitle != "" && advanceInformation.PaymentMethod[0].EmailForGcash !="" && advanceInformation.PaymentMethod[0].QRCode != "https://via.placeholder.com/150")
    {
    //   setAdvanceInformation({
    //     ...advanceInformation,
    //     PaymentMethod: [
    //       {
    //         ...advanceInformation.PaymentMethod[0],
    //         gcashInfo: gcashInformation
    //       },
    //       ...advanceInformation.PaymentMethod.slice(1),
    //     ],
    //   });
    // console.log(advanceInformation.PaymentMethod[0].gcashInfo)
    setIsGcashModalOpen(false)
    }
    
    }

    // Update the information
    const handleUpdate = async () => {
      setUpdating(true)
      try {
        const result = await http.patch(`updateService/${userId}`, {advanceInformation : advanceInformation},  {
          headers : {Authorization: `Bearer ${accessToken}`},
        })

        if(result.data.status == "Success")
        {
          window.location.reload()
        }
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(()=>{
        if(serviceData.advanceInformation !== undefined)
        {
            setAdvanceInformation(serviceData.advanceInformation)
        }
    },[serviceData])


  return (
    <main className='w-full flex flex-col space-y-4 h-full overflow-auto p-5'>
    
    {/* fax and Contact email anf category */}
    <div className='w-full grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <div className='flex flex-col relative'>
        {/* Contact */}
        <label htmlFor='contact' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Service Contact</label>
        <span className='absolute text-sm xl:text-[1rem] top-[50%] xl:top-[50%] left-2 text-gray-600'>+63</span>
        <input onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceContact : e.target.value})}} value={advanceInformation.ServiceContact} id='contact' className='border  text-sm xl:text-[1rem] py-2 ps-8 md:ps-9 outline-none rounded-md' type='text' />
        </div>
        {/* Fax */}
        <div className='flex flex-col '>   
        <label htmlFor='fax' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Service Fax Number</label>
        <input  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceFax : e.target.value})}} value={advanceInformation.ServiceFax} id='fax' className='border p-2 text-sm xl:text-[1rem] md:p-2 outline-none rounded-md' type='text' />
        </div>
        {/* Email */}
        <div className='flex flex-col '>
        <label htmlFor='email' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Service Email</label>
        <input  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceEmail : e.target.value})}} value={advanceInformation.ServiceEmail} id='email' className='border p-2 text-sm xl:text-[1rem] md:p-2 outline-none rounded-md' type='text' />
        </div>
        {/* Category */}
        <div className='flex flex-col '>   
        <label htmlFor='category' className='font-medium text-sm xl:text-[0.9rem] text-gray-700'>Category</label>
        <select className='border p-2 rounded-md text-sm xl:text-[1rem]'  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceCategory : e.target.value})}} defaultValue={advanceInformation.ServiceCategory}>
        {
        categories.map((category, index)=>(<option key={index} className='py-2 text-sm xl:text-[1rem]'>{category.category_name}</option>))
        }
        </select>
        </div>
    </div>
    
    {/* Service Options */}
    <div className='w-full'>
    <div className='w-full flex flex-col '>
    <p className='text-sm text-gray-500 font-semibold mb-1'>Service Options</p>
    <div className='flex justify-start flex-wrap gap-3'>
    {
    serviceOptions.map((service, index)=>(  
    <button key={index} onClick={()=>handleSelectServiceOption(service)} className={`${advanceInformation.ServiceOptions.includes(service) ? "bg-[#0E2F41] text-white" : "bg-gray-200 text-[#4F7080]"} w-[120px] lg:w-[150px] py-2  relative shadow-sm  rounded-sm text-[0.65rem] lg:text-sm`}>
    <span>{service}</span>
    <div className={`absolute -top-3 -right-2 ${advanceInformation.ServiceOptions.includes(service) ? "rotate-360 opacity-100 transition-transform duration-[0.5s] ease-out" : "opacity-0 transform -rotate-180 transition-transform duration-300 ease-in-out"}`}>
    <CheckCircleIcon fontSize='small' className={`text-blue-500 relative  bg-white rounded-full`} />
    </div>
    </button>
    ))
    }
  
  </div>
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

    {/* Social Links */}
    <div className='w-full'>
    <button onClick={openSocialModal} className='bg-gray-100 border text-semiXs md:text-sm rounded-sm shadow-sm px-3 font-medium py-1 hover:bg-gray-200 text-gray-600'>Social Links</button>
    </div>

    {/* Payment Method */}
    <div className="flex flex-col space-x-0">
    <p className='text-sm text-gray-500 font-semibold mb-1'>Payment method</p>
    <div className='flex flex-col w-full space-y-2'>
      {/* Gcash */}
    <div className='flex items-center justify-between space-x-3 rounded-sm border-1 shadow-sm p-3'>
    <img  src={Gcash} alt="paypal image" className=' w-20 h-5 cursor-pointer' />
    <div className='flex space-x-5 md:space-x-20'>
    <p className='text-gray-500 text-xs'>{advanceInformation.PaymentMethod[0].enabled ? "Enabled" : "Not set"}</p>
    <label className="relative inline-flex items-center cursor-pointer">
    <input checked={advanceInformation.PaymentMethod[0].enabled} onChange={()=>handleGcashCheckbox()} type="checkbox" value="" className="sr-only peer outline-none"/>
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
  <input   onChange={() => {
    setAdvanceInformation((prevAdvanceInformation) => ({
      ...prevAdvanceInformation,
      PaymentMethod: [
        ...prevAdvanceInformation.PaymentMethod.slice(0, 1), // Keep the first element unchanged
        {
          ...prevAdvanceInformation.PaymentMethod[1],
          enabled: !prevAdvanceInformation.PaymentMethod[1].enabled,
        },
      ],
    }));
  }} checked={advanceInformation.PaymentMethod[1].enabled} type="checkbox"   className="sr-only peer outline-none"/>
  <div className="w-[29px] h-4 lg:w-[1.85rem] lg:h-4 bg-gray-300 peer-focus:outline-none outline-none flex items-center rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:lg:left-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:lg:h-[0.8rem] after:h-[0.8rem] after:lg:w-[0.8rem] after:w-[0.8rem] after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
  </div>
  </div>
  </div>
  </div>

    {/* social Link Modal */}
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
      {
        advanceInformation.PaymentMethod[0].enabled == true
        ?
        (
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
                  src={advanceInformation.PaymentMethod[0].gcashInfo.QRCode}
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
          <input value={advanceInformation.PaymentMethod[0].gcashInfo.ServiceTitle} onChange={(e) => {
          setAdvanceInformation((prevAdvanceInformation) => ({
              ...prevAdvanceInformation,
              PaymentMethod: prevAdvanceInformation.PaymentMethod.map((method, index) =>
              index === 0
                  ? {
                      ...method,
                      gcashInfo: {
                      ...method.gcashInfo,
                      ServiceTitle: e.target.value,
                      },
                  }
                  : method
              ),
          }));
          }}
          type="text" name='ServiceTitle' className={`${errors.GcashServiceTitleError ? "border-red-500" : ""} text-sm outline-none border border-blue-400 rounded-sm p-0.5`} placeholder='' />
          </div>
          {/* Email */}
          <div className="relative mb-1 mt-3 w-[90%] mx-auto flex flex-col">
          <label htmlFor='Email' className='text-semiXs text-gray-400'>Email</label>
          <input value={advanceInformation.PaymentMethod[0].gcashInfo.EmailForGcash} onChange={(e) => {
          setAdvanceInformation((prevAdvanceInformation) => ({
              ...prevAdvanceInformation,
              PaymentMethod: prevAdvanceInformation.PaymentMethod.map((method, index) =>
              index === 0
                  ? {
                      ...method,
                      gcashInfo: {
                      ...method.gcashInfo,
                      EmailForGcash: e.target.value,
                      },
                  }
                  : method
              ),
          }));
          }} 
          type="text" name='Email' className={`${errors.GcashEmailError ? "border-red-500" : ""} text-sm outline-none border border-blue-400 rounded-sm p-0.5`} placeholder='' />
          </div>
          
      
          {/* Note */}
          <label htmlFor='fullname' className='text-semiXs w-[90%] mx-auto text-gray-400'>Note (Optional)</label>
          <div className='w-[90%] mx-auto h-[70px] border overflow-hidden mt-1'>
          <textarea value={advanceInformation.PaymentMethod[0].gcashInfo.GcashNote} 
          onChange={(e) => {
              setAdvanceInformation((prevAdvanceInformation) => ({
                ...prevAdvanceInformation,
                PaymentMethod: prevAdvanceInformation.PaymentMethod.map((method, index) =>
                  index === 0
                    ? {
                        ...method,
                        gcashInfo: {
                          ...method.gcashInfo,
                          GcashNote: e.target.value,
                        },
                      }
                    : method
                ),
              }));
            }}
          rows={2} className='gcashNote p-1 w-full text-sm h-full outline-none resize-none scrol '/>
          </div>
          <button onClick={()=>{submitGcashPayment()}} className='w-[95%] mt-2 mx-auto py-0.5 bg-[#007DFE] rounded-sm text-gray-100'>Submit</button>
          </div>
          </div>
        )
        :
        ("")
      }
   
    
    </Modal>
    <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 py-1 w-fit text-gray-100 font-medium shadow-md rounded-sm `}>Update</button>
    </main>

    
  )
}

export default AdvanceInformation