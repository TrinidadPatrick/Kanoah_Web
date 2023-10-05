import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import verified from './img/Verified.png'
import  jwtDecode  from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const navigate = useNavigate()
    const [otp, setOtp] = useState('')
    const [isverified, setIsVerified] = useState(false)
    const [validOtp, setValidOtp] = useState(undefined)
    const [user, setUser] = useState({})
    

    // Get the token from localstorage and decode it
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
        const userData = jwtDecode(token)
        setUser(userData)
        }else{
            navigate('/')
        }
    }, [])

    const submitOtp =  async () => {
        
        axios.post("http://localhost:5000/api/verifyOTP", {otp, _id : user._id}).then((res)=>{
            if(res.data.message == "Verified"){
                setIsVerified(true)
            }else{
                setIsVerified(false)
                setValidOtp(false)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

  return (
    <div>
    {
        isverified == false ? 
        (
            <div className='otp_container rounded-md p-10 flex flex-col items-center bg-gray-200 space-y-5'>
        <h1 className='font-bold text-4xl'>Verification Code</h1>
        <p>A verification code has been sent to your Email</p>
        {
            validOtp == false ?
            <div className='w-full relative'>
            <input className='p-2 rounded-md w-full border-2 border-red-500' value={otp} onChange={(e)=>{setOtp(e.target.value)}} type='text' />
            <p className={`text-xs text-start absolute text-red-500 mt-01 `}>Invalid code</p>
            </div>
            :
            <input className='p-2 rounded-md w-full' value={otp} onChange={(e)=>{setOtp(e.target.value)}} type='text' />
        }
       
        <button onClick={()=>{submitOtp()}} className='w-full bg-themeBlue text-white py-1 font-medium rounded-md'>Verify Email</button>
        </div>
        )
        :
        (
            <div className='otp_container rounded-md p-10 px-20 flex flex-col bg-gray-200 space-y-3'>  
        <img className='w-28 mx-auto' src={verified} alt="image" />
        <h1>Thank you for verifying</h1>
        <button onClick={()=>{submitOtp()}} className='w-full bg-themeBlue text-white py-1 font-medium rounded-md'>Continue</button>
    </div>
        )
    }
    </div>
    

    
  )
}

export default VerifyEmail