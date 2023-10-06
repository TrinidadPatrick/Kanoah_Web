import React, { useEffect, useContext, createContext } from 'react'
import logo from '../Register/RegisterComponents/img/Logo.png'
import {FaUserLarge, FaUserPlus, FaCircleUser, FaArrowTrendUp} from 'react-icons/fa6'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useState } from 'react';
import { DateData } from './RegisterComponents/MMDDYY/Date';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VerifyEmail from '../VerifyAccountPage/VerifyEmail';
// import nodemailer from 'nodemailer'




const Register = () => {
  const navigate = useNavigate()
  // const nodemailer = nodemailer()
  const [isValidUsername, setIsValidUsername] = useState(undefined)
  const [isValidEmail, setIsValidEmail] = useState(undefined)
  const [isValidPassword, setIsValidPassword] = useState(undefined)
  const [isValidFirstname, setIsValidFirstname] = useState(undefined)
  const [isValidLastname, setIsValidLastname] = useState(undefined)
  const [isValidContact, setIsValidContact] = useState(undefined)
  const [isValidOtp, setIsValidOtp] = useState(undefined)
  const [isEmailExist, setIsEmailExist] = useState(undefined)
  const [isUsernameExist, setIsUsernameExist] = useState(undefined)
  const [emailSent, setEmailSent] = useState(false)
  const [registerPage, setRegisterPage] = useState(1)
  const [acceptedTNC, setAcceptedTNC] = useState(false)
  const [otp, setOtp] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [timer, setTimer] = useState(10)
  const [startTimer, setStartTimer] = useState(false)
  // const [allFieldsComplete, setAllFieldsComplete] = useState(false)
  const [birthDate, setBirthDate] = useState({
    month : "January",
    day : "1",
    year : DateData.year[0]
  })
  const [userInfos, setUserInfo] = useState({
        username : "",
        email : "",
        password : "",
        firstname: "",
        lastname : "",
        contact : "",
        birthDate : {}

  })

  // Handles the values of inputs
  const handleChange = (e) => {
    setUserInfo({...userInfos, [e.target.name]: e.target.value})
  }

  // Handles the values of inputs
  const handleDate = (e) => {
    setBirthDate({...birthDate, [e.target.name]: e.target.value})
    
  }

  // Set value to get to next page
  const next = async ()  =>{
    
    const {username, email, password} = userInfos
    if(username.length < 5){
      setIsValidUsername(false)
    }if (username.length > 5){
      setIsValidUsername(true)
    }if(password.length < 8){
      setIsValidPassword(false)
    }if(password.length >= 8){
      setIsValidPassword(true)
    }if(username.length >= 5 && password.length > 8){
      await axios.post("http://localhost:5000/api/verifyUsername", {username : userInfos.username}).then((res)=>{
        if(res.data.status == "unavailable"){
          setIsUsernameExist(true)
        }else if(res.data.status == "available"){
          setIsUsernameExist(false)
          setRegisterPage(2)
        }
      }).catch((err)=>{
        console.log(err)
      })
      

    }
    
    
  }

  // Terms and condition function
  const checkTNC = () => {
    if(acceptedTNC == false){
      setAcceptedTNC(true)
    }else{
      setAcceptedTNC(false)
    }
  }

  // Verify email by sending otp
  const verifyEmail = async () => {
    if(userInfos.email == ""){
      setIsEmailExist(undefined)
      setIsValidEmail(false)
    }else{
      setIsValidEmail(true)
      
      const {email, username} = userInfos
      await axios.post("http://localhost:5000/api/verifyEmail", {email : email}).then((res)=>{
        console.log(res.data.status)
        if(res.data.status == "emailSent"){
      setIsEmailExist(false)
      setTimer(10)
      document.getElementById("sendEmail").setAttribute("disabled", "disabled")
      document.getElementById("timer").classList.remove("hidden")
      setTimeout(()=>{
        document.getElementById("sendEmail").removeAttribute("disabled", "disabled")
        document.getElementById("timer").classList.add("hidden")
        }, 10000)
          setStartTimer(true)
          setEmailSent(true)
          
   
        }
        else if(res.data.status = 'EmailExist'){
          setIsEmailExist(true)
        } 
      }).catch((err)=>{
        console.log(err)  
      })
    }
   
  }

  // FOr 10 seconds Countdown
  useEffect(()=>{
    if(startTimer == true){
        const countdown = setInterval(()=>{  
        setTimer(timer - 1)
        if(timer < 2){clearInterval(countdown)}
        }, 1000)
        return ()=>{clearInterval(countdown)}      
    }        
}, [startTimer, timer])
useEffect(()=>{
    if(timer <1){
    setStartTimer(false)
    }
}, [timer])

  // console.log(emailSent)

  // Signup User
  const signup = async () => { 
    const {username, email, password, firstname, lastname, contact, birthDate} = userInfos
    if(firstname == ""){
      setIsValidFirstname(false)
    }
    if(firstname != ""){
      setIsValidFirstname(true)
    }
    if(lastname == ""){
      setIsValidLastname(false)
    }
    if(lastname != ""){
      setIsValidLastname(true)
    }
    if(contact == ""){
      setIsValidContact(false)
    }
    if(contact != ""){
      setIsValidContact(true)
    }if(email == ""){
      setIsValidEmail(false)
    }
    if(email != ""){
      setIsValidEmail(true)
    }
    
    if(firstname != "" && lastname != "" & contact != "" && email != ""){

      axios.post("http://localhost:5000/api/verifyOTP", {otp}).then((res)=>{
        // IF OTP IS CORRECT
            if(res.data == 'verified'){
              axios.post("http://localhost:5000/api/register", {username, email, password, firstname, lastname, contact, birthDate}).then((res)=>{
                if(res.data.status == 'registered'){
                localStorage.setItem("token", res.data.userToken)
                console.log(res.data)
                setIsValidOtp(true)
                // navigate('/verify')
                }else {
                    console.log(res.data)
                }
                
              }).catch((err)=>{
                console.log(err)  
              })
            }else{
              // IF OTP IS NOT CORRECT
              setIsValidOtp(false)
            }
        }).catch((err)=>{
            console.log(err)
        })
    
    }
 
  }
 

  // So that whenever birthdate is updated so is the userinfo
  useEffect(()=>{
    setUserInfo({...userInfos, birthDate : birthDate})
  },[birthDate])

  
  // Toggle Password Visibility
  const togglePassword = () => {
    const passwordField = document.getElementById('password')
    if(passwordField.type == "password"){
      passwordField.setAttribute("type", "text")
      setIsPasswordVisible(FaArrowTrendUp)
    }else if(passwordField.type == "text"){
      passwordField.setAttribute("type", "password")
      setIsPasswordVisible(false)
    }
  }


  return (
    registerPage == 1 ? (
    <div className='register_container rounded-md h-fit py-6 w-10/12 xs:w-11/12 md:w-1/2 lg:w-2/5 xl:w-3/12 bg-white'>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
      <img className=' w-1/2 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className='LogReg_container mx-auto w-fit flex'>
    <button className='flex items-center justify-center gap-2 px-11 rounded-sm text-semiXs py-1'><FaUserLarge /> Sign In </button>
    <button className='text-white flex items-center justify-center gap-2 px-4 sm:px-11 rounded-sm text-semiXs py-1 bg-themeBlue '><FaUserPlus/> Sign Up </button>
    </div>


    {/* Input field Container */}
    <div className='w-5/6 mx-auto mt-7 flex flex-col space-y-4'>

    {/* Username Field */}
    <div className={`username_container w-full  relative`}>
    <AccountCircleOutlinedIcon className={`absolute w-10 h-6 top-2 left-2 text-gray-500 ${isValidUsername == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>{handleChange(e)}} type="text" placeholder='Enter username' name='username' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidUsername == false || isUsernameExist == true ? " border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidUsername == false ? "block" : "hidden"}`}>Please enter atleast 5 characters</p>
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isUsernameExist == true ? "block" : "hidden"}`}>Username already in use</p>
    </div>


    {/* Password Field */}
    <div className='password_container w-full  relative  '>
    <LockOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidPassword == false ? "text-red-500" : ""}`}/>
    <input onKeyDown={(e)=>{if(e.key == "Enter"){next()}}} onChange={(e)=>handleChange(e)} id="password" type="password" placeholder='Create a password' name='password' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidPassword == false ? " border-b-red-500" : ""}`} />
    {
      isPasswordVisible == false 
      ?
      <RemoveRedEyeRoundedIcon onClick={()=>{togglePassword()}} className='absolute text-md text-gray-500 right-2 top-2' />
      :
      <VisibilityOffRoundedIcon onClick={()=>{togglePassword()}} className='absolute text-md text-gray-500 right-2 top-2' />
    }
    
    
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidPassword == false ? "block" : "hidden"}`}>Please enter atleast 9 characters</p>
    </div>

    <div>
    <button onClick={()=>{next()}} className='w-full text-white py-1 rounded-sm bg-themeBlue mt-2'>Next</button>
    <p className='text-xs text-center text-gray-500 mt-2'>Already have an account? <Link to="/login" className='text-blue-600'>Login now</Link></p>
    </div>
    </div>       
    </div>
    )

    :

    // Second Page of Register--------------------------------------------------------------------------------------------------------------------------------------------
    (
      <div className='register_container rounded-md h-fit py-6 w-10/12 xs:w-11/12 md:w-1/2 lg:w-2/5 xl:w-3/12 bg-white'>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
      <img className=' w-1/2 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className='LogReg_container mx-auto w-fit flex'>
    <button className='flex items-center justify-center gap-2 px-11 rounded-sm text-semiXs py-1'><FaUserLarge /> Sign In </button>
    <button className='text-white flex items-center justify-center gap-2 px-4 sm:px-11 rounded-sm text-semiXs py-1 bg-themeBlue '><FaUserPlus/> Sign Up </button>
    </div>

    {/* OTP sent success popup */}
    <div className={` bg-green-200 p-2 w-3/5 mx-auto mt-3 rounded-sm ${emailSent == true ? "block" : "hidden"}`}>
    <p className='text-semiXs text-center text-green-700'>We've sent a verification code to your </p>
    <p className='text-semiXs text-center text-green-700'>email {userInfos.email}</p>
    </div>

    {/* Input field Container */}
    <div className='w-5/6 mx-auto mt-7 flex flex-col space-y-4'>
    
    <div className='fn_ln_container flex space-x-3'>
    {/* Firstname Field */}
    <div className='firstname_container   relative  '>
    <AccountCircleOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidFirstname == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder='Firstname' name='firstname' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidFirstname == false ? " border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 ${isValidFirstname == false ? "block" : "hidden"}`}>Firstname is required</p>
    </div>

    {/* Lastname Field */}
    <div className='lastname_container relative  '>
    <AccountCircleOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidLastname == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder='Lastname' name='lastname' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidLastname == false ? "border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 ${isValidLastname == false ? "block" : "hidden"}`}>Lastname is required</p>
    </div>
    </div>

    {/* Contact Field */}
    <div className='contact_container w-full flex items-center  relative  '>
    <CallOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidContact == false ? "text-red-500" : ""}`}/>
    <div className='absolute left-11 flex text-gray-600'>+63 <div className='bg-gray-600 ml-3 w-0.2 flex items-start justify-start'></div></div>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder=' ' name='contact' className={`border-b-1 border-gray outline-none w-full mx-auto pl-24 py-2 ${isValidLastname == false ? "border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 -bottom-4 ${isValidContact == false ? "block" : "hidden"}`}>Contact is required</p>
    </div>

    {/* Email Field */}
    <div className='email_container w-full  relative  '>
    <EmailOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidEmail == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder='Enter your Email' name='email' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidEmail == false || isEmailExist == true ? " border-b-red-500" :  ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidEmail == false ? "block" : "hidden"}`}>Email is required</p>
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isEmailExist == true ? "block" : "hidden"}`}>Email already is use</p>
    </div>

    {/* Code Field */}
    <div className='code_container w-1/2  relative  '>
    <VpnKeyIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidOtp == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>setOtp(e.target.value)} type="text" placeholder='Enter OTP' name='otp' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidOtp == false ? "text-red-500 border-b-red-500" : ""}`} />
    <button id='sendEmail' onClick={()=>{verifyEmail()}} className='absolute bg-themeBlue flex gap-1 text-sm p-1 px-1 text-white top-2 right-2 rounded-sm disabled:bg-gray-300'>Get <p id="timer" className='hidden'>{timer}</p></button>
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidOtp == false ? "block" : "hidden"}`}>Invalid Otp</p>
    </div>

    {/* birth Field */}
    <div className='birth_container w-full '>
    <p className='text-xs text-gray-500 mt-2'>Date of birth</p>
    <div className='select_container w-full flex  space-x-5'>
    <select onChange={(e)=>handleDate(e)} name="month" className='border-1 border-gray rounded-sm'>
      {
        DateData.months.map((month, index)=>
        {
          return (<option key={index} value={month}>{month}</option>)
        })
      }
    </select>
    <select onChange={(e)=>handleDate(e)} name="day" className='border-1 border-gray rounded-sm'>
      {
        DateData.days.map((day, index)=>
        {
          return (<option  key={index} value={day}>{day}</option>)
        })
      }
    </select>
    <select onChange={(e)=>handleDate(e)} name="year"  className='border-1 border-gray rounded-sm'>
      {
        DateData.year.map((year, index)=>
        {
          return (<option key={index} value={year}>{year}</option>)
        })
      }
    </select>
    </div>
    </div>

    <div>
  {/* Terms and condition container */}
  <div className='flex items-center mb-3 space-x-1'>
  <input type="checkbox" onChange={()=>{checkTNC()}}/>
  <p className='text-xs'>I accept <Link to='/tnc' className='text-blue-500 decoration-solid'><u>terms & conditions</u></Link></p>
  </div>

  {/* Signup Button Container */}
    {
      acceptedTNC ? 
      <button onClick={()=>{signup()}} className='w-full text-white py-1 rounded-sm bg-themeBlue'>Signup</button>
      :
      <button disabled onClick={()=>{signup()}} className='w-full text-white py-1 rounded-sm bg-themeBlue disabled:bg-slate-600'>Signup</button>
    }   
    <p className='text-xs text-center text-gray-500 mt-2'>Already have an account? <Link to="/login" className='text-blue-600'>Login now</Link></p>
    </div>
    
    </div>       
    </div>
   )


    
  )

  
}

export default Register