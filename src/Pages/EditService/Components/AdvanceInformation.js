import React, { useEffect } from 'react'
import { useState } from 'react'
import Modal from 'react-modal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import YouTube from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import http from '../../../http'
import useCategory from '../../../ClientCustomHook/CategoryProvider'

const AdvanceInformation = ({serviceInformation}) => {
    Modal.setAppElement('#root');
    const [updating, setUpdating] = useState(false)
    const [openSocialLinkModal, setOpenSocialLinkModal] = useState(false);
    const {categories, subCategories} = useCategory()
    const serviceOptions = ['Home Service','Online Service','Walk-In Service', 'Pick-up and Deliver']
    const [selectedCategoryCode, setSelectedCategoryCode] = useState(0);
    const [selectedSubCategory, setSelectedSubCategory] = useState('Select Sub Category');
    const [subCategoryList, setSubCategoryList] = useState([]);
    const [errors, setErrors] = useState({ GcashServiceTitleError : false, GcashEmailError : false, GcashQRError : false, ServiceContactError : false, ServiceEmailError : false,ServiceCategoryError : false,})
    const [advanceInformation, setAdvanceInformation] = useState({ ServiceContact : "",
    ServiceFax : "",
    ServiceEmail : "",
    ServiceCategory : "",
    ServiceSubCategory : "",
    ServiceOptions : [],
    AcceptBooking : false,
    SocialLink : [{media : "Youtube",link : ""}, {media : "Facebook",link : ""}, {media : "Instagram",link : ""}],
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



    // Update the information
    const handleUpdate = async () => {
      const data = {
        ServiceContact : advanceInformation.ServiceContact,
        ServiceFax : advanceInformation.ServiceFax,
        ServiceEmail : advanceInformation.ServiceEmail,
        ServiceOptions : advanceInformation.ServiceOptions,
        SocialLink : advanceInformation.SocialLink,
        PaymentMethod : advanceInformation.PaymentMethod,
        ServiceSubCategory : selectedSubCategory === "Select Sub Category" || selectedSubCategory === undefined ? null : selectedSubCategory,
        ServiceCategory : categories.find(category => category.category_code === selectedCategoryCode)._id,
      }

      // setUpdating(true)
      try {
        const result = await http.patch(`updateService/${serviceInformation.userId}`, {advanceInformation : data},  {
          withCredentials : true
        })
        console.log(result.data)
        if(result.data.status == "Success")
        {
          window.location.reload()
        }
      } catch (error) {
        console.error(error)
      }
    }


    const handleSelectCategory = (categoryCode) => {
      setSelectedCategoryCode(categoryCode)
      const categoryId = categories.find(category => category.category_code === categoryCode)._id
      setAdvanceInformation({...advanceInformation, ServiceCategory : categoryId})
    }

    const handleSelectSubCategory = (subCategory) => {
      setSelectedSubCategory(subCategory)
    }

    useEffect(()=>{
        if(serviceInformation?.advanceInformation !== undefined)
        { 
          setAdvanceInformation(serviceInformation?.advanceInformation)
          const categoryCode = categories.find(category => category?.name === serviceInformation?.advanceInformation.ServiceCategory.name)?.category_code
          const subCategoryId = subCategories.find(subCategory => subCategory?.name === serviceInformation?.advanceInformation.ServiceSubCategory?.name)?._id
          setSelectedCategoryCode(categoryCode)
          setSelectedSubCategory(subCategoryId)
        }
    },[serviceInformation, categories])


    useEffect(()=>{
      if(subCategories.length !== 0)
      {
        const filtered = subCategories.filter((subCategory) => subCategory.parent_code === selectedCategoryCode)
        if(filtered)
        {
          setSubCategoryList(filtered)
        }
      }
    },[selectedCategoryCode, categories])
    
  return (
    <main className='sm:w-[90%] md:w-[80%] xl:w-1/2 bg-white rounded-md shadow-md flex flex-col space-y-4 h-full sm:h-[95%] overflow-auto p-3 px-5'>
    <h1 className='text-xl font-medium text-gray-700'>Advance Information</h1>
    {/* fax and Contact email anf category */}
    <div className='w-full grid grid-cols-2 lg:grid-cols-3 gap-3'>
        <div className='flex flex-col w-full relative'>
        {/* Contact */}
        <label htmlFor='contact' className='font-medium text-sm xl:text-[0.8rem] text-gray-700'>Service Contact</label>
        <span className='absolute text-sm xl:text-[0.9rem] top-[50%] xl:top-[50%] left-2 text-gray-600'>+63</span>
        <input maxLength={10} onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceContact : e.target.value.replace(/[^0-9]/g, '')})}} value={advanceInformation.ServiceContact} id='contact' className='border  text-sm xl:text-[0.9rem] py-2 ps-8 md:ps-9 outline-none rounded-md' type='text' />
        </div>
        {/* Fax */}
        <div className='flex flex-col '>   
        <label htmlFor='fax' className='font-medium text-sm xl:text-[0.8rem] text-gray-700'>Service Fax Number</label>
        <input  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceFax : e.target.value.replace(/[^0-9]/g, '')})}} value={advanceInformation.ServiceFax} id='fax' className='border p-2 text-sm xl:text-[0.9rem] md:p-2 outline-none rounded-md' type='text' />
        </div>
        {/* Email */}
        <div className='flex flex-col '>
        <label htmlFor='email' className='font-medium text-sm xl:text-[0.8rem] text-gray-700'>Service Email</label>
        <input maxLength={320}  onChange={(e)=>{setAdvanceInformation({...advanceInformation, ServiceEmail : e.target.value})}} value={advanceInformation.ServiceEmail} id='email' className='border p-2 text-sm xl:text-[0.9rem] md:p-2 outline-none rounded-md' type='text' />
        </div>
        
    </div>
    {/* Category and sub category */}
    <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
      {/* Category */}
      <div className='flex flex-col w-full'>   
        <label htmlFor='category' className='font-medium text-sm xl:text-[0.8rem] text-gray-700'>Category</label>
        <select value={selectedCategoryCode} className='border p-2 rounded-md text-sm xl:text-[0.8rem]'  onChange={(e)=>{handleSelectCategory(e.target.value)}}>
        {
        categories.map((category, index)=>(<option key={index} value={category.category_code} className='py-2 text-sm xl:text-[1rem]'>{category.name}</option>))
        }
        </select>
        </div>
        {/* Sub Category */}
      <div className='flex flex-col w-full'>   
        <label htmlFor='subCategory' className='font-medium text-sm xl:text-[0.8rem] text-gray-700'>Sub Category</label>
        <select id='subCategory' value={selectedSubCategory} className='border p-2 rounded-md text-sm xl:text-[0.8rem]'  onChange={(e)=>{handleSelectSubCategory(e.target.value)}} >
        <option >Select Sub Category</option>
        {
          
          subCategoryList.length === 0 ? "" :
        subCategoryList.map((subCategory, index)=>(<option key={index} value={subCategory._id} className='py-2 text-sm xl:text-[1rem]'>{subCategory.name}</option>))
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
    <button key={index} onClick={()=>handleSelectServiceOption(service)} className={`${advanceInformation.ServiceOptions.includes(service) ? "bg-[#0E2F41] text-white" : "bg-gray-200 text-[#4F7080]"} w-[120px] lg:w-[120px] py-1.5  relative shadow-sm  rounded-sm text-[0.65rem] lg:text-semiSm`}>
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


    {/* Social Links */}
    <div className='w-full'>
    <p className='text-sm text-gray-500 font-semibold mb-1'>Social Links</p>
    <div className='flex flex-col gap-4'>
      {/* Facebook */}
      <div className='flex items-center gap-3'>
      <FacebookIcon className='text-blue-500' fontSize='large' />
      <input value={advanceInformation.SocialLink[1].link}
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
            className="w-full border-b-2 p-2 bg-gray-100 text-semiSm outline-none"
            placeholder="https://www.facebook.com/"
      />
      </div>
      {/* Youtube */}
      <div className='flex items-center gap-3'>
      <YouTube className='text-red-500' fontSize='large' />
      <input value={advanceInformation.SocialLink[0].link}
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
            className="w-full border-b-2 p-2 bg-gray-100 text-semiSm outline-none"
            placeholder="https://www.youtube.com/"
      />
      </div>
      {/* Instagram */}
      <div className='flex items-center gap-3'>
      <InstagramIcon  fontSize='large' />
      <input value={advanceInformation.SocialLink[2].link}
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
            className="w-full border-b-2 p-2 bg-gray-100 text-semiSm outline-none"
            placeholder="https://www.instagram.com/"
      />
      </div>
      </div>
    {/* <button onClick={openSocialModal} className='bg-gray-100 border text-semiXs md:text-sm rounded-sm shadow-sm px-3 font-medium py-1 hover:bg-gray-200 text-gray-600'>Social Links</button> */}
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

    <button onClick={()=>{handleUpdate()}} className={`${updating ? "bg-orange-400" : "bg-themeOrange"} px-3 py-1 w-fit text-semiSm lg:text-semiMd text-gray-100 font-medium shadow-md rounded-sm `}>Update</button>
    </main>

    
  )
}

export default AdvanceInformation