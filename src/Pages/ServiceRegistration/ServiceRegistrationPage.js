import React, { useEffect, useState } from 'react'
import AddressRegistration from './AddressRegistration'
import BusinessInformation from './BusinessInformation'
import Tags from './Tags'
import AdvanceInformation from './AdvanceInformation'
import ServiceHours from './ServiceHours'
import background1 from './Utils/images/background5.svg'
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import { useNavigate } from 'react-router-dom'
import http from '../../http'
export const pageContext = React.createContext()


const ServiceRegistrationPage = () => {
  const navigate = useNavigate()
  const userId = useSelector(selectUserId)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Holidays'] 
  
    const [step, setStep] = useState(3)
    // const [userId, setUserId] = useState(null)
    const [serviceInformation, setServiceInformation] = useState(
      {
      basicInformation : {
        ServiceTitle : "",
        OwnerEmail : "",
        OwnerContact : "",
        Description : ""
      },
      advanceInformation : {
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
      },
      address : {
             region : "",
            province :  "",
            municipality : "",
            barangay : "",
            street : "",
            longitude : 0,
            latitude : 0
      },
      serviceHour : 
        days.map((day) => ({
          day,
          isOpen: false,
          fromTime: '06:00',
          toTime: '18:00',
        }))
      ,
      tags : []
      }
     
    )
    
       // get user profile
       const getUserProfile = async (token) => {
        try {
          const response = await http.get('profile', {
            headers : {Authorization: `Bearer ${token}`},
          })
          if(response.data.status == "logged in")
          {
            // setLoading(false)
          }
          else{
            navigate("/")
          }
        } catch (error) {
          console.error('Profile Error:', error.response.data.error);
   
        }
      }
  
      // check if user is logged In
      useEffect(()=>{
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
          getUserProfile(accessToken);
        }else{
          navigate("/")
        }
      },[])


  
  return (
    <pageContext.Provider value={[step, setStep, userId, serviceInformation, setServiceInformation]} >
    {/* // Main Container */}
    <div className='w-full h-fit md:h-screen  bg-[#f9f9f9] flex items-center justify-center'>
    
    {/* Main Card */}
    <section className='w-full bg-white h-full md:w-[90%] lg:w-[850px] xl:w-[60%] md:h-[80%] mt-20 md:mt-16 relative shadow-md md:rounded-md flex flex-col md:flex-row p-1'>
    {/* Left Side */}
    <div className='h-fit md:h-full  md:w-[400px] p-3'>

    {/* left Blue Card */}
    <div className='w-full h-[100px] md:h-full py-10 border rounded-md md:space-y-8 flex items-center justify-center customBG relative md:ps-5 md:pt-5  md:flex-col  md:justify-start'>
    {/* Step 1 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
    {/* For circle */}
    <div className='w-12 p-1.5 h-full '>
    <div style={{backgroundColor: step == 1 ? "hsl(229, 24%, 87%)" : "", color: step == 1 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className='border-2 w-full h-full rounded-full grid place-items-center'>1</div>
    </div>
    {/* For Words */}
    <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
    <h2 className='text-sm text-gray-200 font-medium'>STEP 1</h2>
    <p className='text-sm text-gray-100 font-bold'>Basic Information</p>
    </div>
    </div>
    {/* Step 2 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
        {/* For circle */}
        <div className='w-12 p-1.5 h-full '>
            <div style={{backgroundColor: step == 2 ? "hsl(229, 24%, 87%)" : "", color: step == 2 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className=' w-full h-full rounded-full border-2  text-Lightgray grid place-items-center'>2</div>
        </div>
        {/* For Words */}
        <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
            <h2 className='text-sm text-gray-200 font-medium'>STEP 2</h2>
            <p className='text-sm text-gray-100 font-bold'>Advance Information</p>
        </div>
    </div>

    {/* Step 3 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
    {/* For circle */}
    <div className='w-12 p-1.5 h-full '>
    <div style={{backgroundColor: step == 3 ? "hsl(229, 24%, 87%)" : "", color: step == 3 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className=' w-full h-full rounded-full border-2  text-Lightgray grid place-items-center'>3</div>
    </div>
    {/* For Words */}
    <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
    <h2 className='text-sm text-gray-200 font-medium'>STEP 3</h2>
    <p className='text-sm text-gray-100 font-bold'>Address</p>
    </div>
    </div>
    {/* Step 4 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
    {/* For circle */}
    <div className='w-12 p-1.5 h-full '>
    <div style={{backgroundColor: step == 4 ? "hsl(229, 24%, 87%)" : "", color: step == 4 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className=' w-full h-full rounded-full border-2  text-Lightgray grid place-items-center'>4</div>
    </div>
    {/* For Words */}
    <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
    <h2 className='text-sm text-gray-200 font-medium'>STEP 4</h2>
    <p className='text-sm text-gray-100 font-bold'>Service Hours</p>
    </div>
    </div>
    {/* Step 5 */}
    <div className='flex h-12 px-2 md:px-0 md:w-full justify-center md:justify-start'>
    {/* For circle */}
    <div className='w-12 p-1.5 h-full '>
    <div style={{backgroundColor: step == 5 ? "hsl(229, 24%, 87%)" : "", color: step == 5 ? "hsl(213, 96%, 18%)" : "hsl(229, 24%, 87%)"}} className=' w-full h-full rounded-full border-2  text-Lightgray grid place-items-center'>5</div>
    </div>
    {/* For Words */}
    <div className='hidden md:flex pt-1 flex-col text-left ps-1'>
    <h2 className='text-sm text-gray-200 font-medium'>STEP 5</h2>
    <p className='text-sm text-gray-100 font-bold'>Tags</p>
    </div>
    </div>

    </div>
    </div>

    {/* Right Side */}
    {/* Container */}
    <div className='w-full h-full md:h-full flex flex-col justify-stretch bg-white p-4 '>
    {/* Card */}

    <h1 className='text-xl font-semibold block md:hidden'>{step == 1 ? "Service Information" : step == 2 ? "Contacts and Payment" : ""}</h1>
    {step == 1 ? (<BusinessInformation />) : step == 2 ? (<AdvanceInformation />) : step == 3 ? <AddressRegistration /> : step == 4 ? <ServiceHours /> : step == 5 ? <Tags /> : ""}
    
    </div>
    </section>



    

    </div>
    </pageContext.Provider>
  )
}

export default ServiceRegistrationPage