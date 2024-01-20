import React, { useEffect, useState } from 'react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Modal from 'react-modal';
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import { selectService, selectSchedule, selectContactAndAddress, setService, setSchedule, setContactAndAddress } from '../../ReduxTK/BookingSlice'


const ContactAndAddress = ({handleStep, serviceInfo, userContext}) => {
  Modal.setAppElement('#root');
    const [error, setError] = useState({
      firstname : false,
      lastname : false,
      contact : false,
      email : false,
      Address : false
    })
    const dispatch = useDispatch()
    const contactAndAddress = useSelector(selectContactAndAddress)
    const schedule = useSelector(selectSchedule)
    const service = useSelector(selectService)
    const [userDetails, setUserDetails] = useState({
        firstname : "",
        lastname : "",
        email : "",
        contact : "",
        Address : {}
    })
    const [isOpen, setIsOpen] = useState(false)

    const closeAddressModal = () => {
      setIsOpen(false)
    }

    const ModalStyle = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding : "0",
        zIndex: 1001,
      },
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the color and opacity as needed
        zIndex: 1000,
      },
    };

    const submitAddressInfo = (value) => {
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        Address: value
      }));
    }
    
    useEffect(()=>{
      if(contactAndAddress === null)
      {
        setUserDetails({
          firstname : userContext.firstname,
          lastname : userContext.lastname,
          email : userContext.email,
          contact : userContext.contact,
          Address : userContext.Address
          })
      }
      else
      {
        setUserDetails({
          firstname : contactAndAddress?.firstname,
          lastname : contactAndAddress?.lastname,
          email : contactAndAddress?.email,
          contact : contactAndAddress?.contact,
          Address : contactAndAddress?.Address
          })
      }
        
    },[])

    const submitBooking = () => {
    let hasError = false
     Object.entries(userDetails).forEach(([key, value])=>{
        if(value === "")
        { 
          setError((prevError) => ({ ...prevError, [key]: true }));
          hasError = true
        }
        else if (value !== ""){
          setError((prevError) => ({ ...prevError, [key]: false }));
        }
      })

      if(!hasError)
      {
       dispatch(setContactAndAddress(userDetails))
       handleStep(4)
      }
    }


  return (
    <div className='w-[550px]'>
    <div className="w-full mx-auto px-6 py-3 bg-white rounded-md shadow-md">
      <h2 className="text-xl text-gray-800 font-semibold mb-4">Contact and Address Confirmation</h2>

      <div className='flex flex-col space-y-7'>
        {/* Full Name */}
        <div className='flex flex-col relative'>
        <input id="firstname"
         maxLength={60} 
         required 
         className={`border-1  valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-md p-2 font-normal text-[0.9rem]`} type='text'
         value={userDetails.firstname}
         onChange={(e)=>setUserDetails({...userDetails, firstname : e.target.value})}
         />  
        <div className='text-[0.9rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>First name</div>
        <p className={`${error.firstname ? "" : "hidden"} text-xs text-red-500`}>This field is required</p>
        </div>

        <div className='flex flex-col relative'>
        <input id="lastname"
         maxLength={60} 
         required 
         className={`border-1  valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-md p-2 font-normal text-[0.9rem]`} type='text'
         value={userDetails.lastname}
         onChange={(e)=>setUserDetails({...userDetails, lastname : e.target.value})}
         />  
        <div className='text-[0.9rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Last name</div>
        <p className={`${error.lastname ? "" : "hidden"} text-xs text-red-500`}>This field is required</p>
        </div>


        {/* Email */}
        <div className='flex flex-col relative'>
        <input id="email"
         maxLength={60} 
         required 
         className={`border-1  valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-md p-2 font-normal text-[0.9rem]`} type='text'
         value={userDetails.email}
         onChange={(e)=>setUserDetails({...userDetails, email : e.target.value})}
         />  
        <div className='text-[0.9rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Email</div>
        <p className={`${error.email ? "" : "hidden"} text-xs text-red-500`}>This field is required</p>
        </div>

        {/* Contact Number */}
        <div className='flex flex-col relative'>
        <input id="contact"
         maxLength={60} 
         required 
         className={`border-1  valid:border-themeBlue peer outline-[0.5px] outline-themeBlue rounded-md p-2 font-normal text-[0.9rem]`} type='text'
         value={`${userDetails.contact}`}
         onChange={(e)=>setUserDetails({...userDetails, contact : e.target.value})}
         />  
        <div className='text-[0.8rem] absolute top-2 left-1 peer-focus:-top-2 pointer-events-none peer-focus:font-bold peer-valid:font-bold peer-focus:left-2 peer-valid:left-2 peer-focus:text-xs peer-focus:text-gray-800  peer-valid:text-gray-800 peer-valid:-top-2 peer-valid:text-xs ease-in-out transition-all bg-white px-1 text-gray-500' htmlFor='serviceName'>Contact</div>
        <p className={`${error.contact ? "" : "hidden"} text-xs text-red-500`}>This field is required</p>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            Address
          </label>
          <div  className="mt-1 outline-none p-2 flex justify-between text-left w-full border rounded-md">
            <div>
            <p className='font-semibold text-gray-800'>{userDetails.Address?.barangay?.name}, {userDetails.Address?.municipality?.name}, {userDetails.Address?.province?.name}</p>
            <p className='font-normal line-clamp-2  whitespace-normal break-all text-sm  text-gray-700'>{userDetails.Address?.street}</p>
            </div>
            <button onClick={()=>{setIsOpen(true)}} className=''>
                <EditOutlinedIcon fontSize='small' />
            </button>
          </div>
        </div>

      </div>
    </div>


    <div className='w-full flex justify-end space-x-2 mt-3'>
    <button onClick={()=>{handleStep(2);dispatch(setContactAndAddress(userDetails))}} className='bg-gray-400 text-white px-2 py-1 rounded-sm text-sm'>Back</button>
    <button onClick={()=>{submitBooking()}} className='bg-themeBlue text-white px-2 py-1 rounded-sm text-sm'>Submit</button>
    </div>

    {/* Modal */}
    <Modal isOpen={isOpen} style={ModalStyle} contentLabel="Address Modal" >
        <AddressModal userContext={userContext} closeAddressModal={closeAddressModal} submitAddressInfo={submitAddressInfo} />
      </Modal>
    </div>
  )
}

export default ContactAndAddress