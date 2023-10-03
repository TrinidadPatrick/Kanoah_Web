import React, { useEffect } from 'react'
import logo from '../Register/RegisterComponents/img/Logo.png'
import {FaUserLarge, FaUserPlus, FaCircleUser} from 'react-icons/fa6'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { useState } from 'react';
import { DateData } from './RegisterComponents/MMDDYY/Date';
import { Link } from 'react-router-dom';
import axios from 'axios'



const Register = () => {
  const [isValidUsername, setIsValidUsername] = useState(undefined)
  const [isValidEmail, setIsValidEmail] = useState(undefined)
  const [isValidPassword, setIsValidPassword] = useState(undefined)
  const [registerPage, setRegisterPage] = useState(1)
  const [acceptedTNC, setAcceptedTNC] = useState(false)
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
  const next = () =>{
    
    const {username, email, password} = userInfos
    if(username.length < 5){
      setIsValidUsername(false)
    }if (username.length > 5){
      setIsValidUsername(true)
    }if(email === ""){
      setIsValidEmail(false)
    }if(email != ""){
      setIsValidEmail(true)
    }if(password.length < 8){
      setIsValidPassword(false)
    }if(password.length > 8){
      setIsValidPassword(true)
    }if(username.length > 5 && email != "" && password.length > 8){
      setRegisterPage(2)
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



  // Signup User
  const signup = async () => {
    // verifyInput((message)=>{
    //   console.log(message)
    // })
    // const {username, email, password, firstname, lastname, contact, birthDates} = userInfos
    // await axios.post("http://localhost:5000/api/register", {username, email, password, firstname, lastname, contact, birthDates}).then((res)=>{
    //   console.log(res.data)
    // }).catch((err)=>{
    //   console.log(err)  
    // })
  }

  // So that whenever birthdate is updated so is the userinfo
  useEffect(()=>{
    setUserInfo({...userInfos, birthDate : birthDate})
  },[birthDate])

  // console.log(userInfos)
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
    <AccountCircleOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidUsername == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>{handleChange(e)}} type="text" placeholder='Enter username' name='username' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidUsername == false ? "text-red-500 border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidUsername == false ? "block" : "hidden"}`}>Please enter atleast 5 characters</p>
    </div>

    {/* Email Field */}
    <div className='email_container w-full  relative  '>
    <EmailOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidEmail == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder='Enter your Email' name='email' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidEmail == false ? "text-red-500 border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidEmail == false ? "block" : "hidden"}`}>Email is required</p>
    </div>

    {/* Password Field */}
    <div className='password_container w-full  relative  '>
    <LockOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidPassword == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>handleChange(e)} type="password" placeholder='Create a password' name='password' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidPassword == false ? "text-red-500 border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidPassword == false ? "block" : "hidden"}`}>Please enter atleast 9 characters</p>
    </div>

    {/* code Field */}
    <div className='username_container w-full sm:w-4/6  relative bg-red-300  '>
    <LockOutlinedIcon className='absolute w-6 h-6 top-2 left-2 text-gray-500'/>
    <input type="text" placeholder='Enter code' className=' border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2' />
    <button  className='bg-blue-400 text-white px-3 absolute top-2 rounded-sm right-2'>Get</button>
    </div>

    <div>
    <button onClick={()=>{next()}} className='w-full text-white py-1 rounded-sm bg-themeBlue'>Next</button>
    <p className='text-xs text-center text-gray-500 mt-2'>Already have an account? <span className='text-blue-600'>Login now</span></p>
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

    {/* Input field Container */}
    <div className='w-5/6 mx-auto mt-7 flex flex-col space-y-4'>
    
    <div className='fn_ln_container flex space-x-3'>
    {/* Firstname Field */}
    <div className='firstname_container   relative  '>
    <AccountCircleOutlinedIcon className='absolute w-6 h-6 top-2 left-2 text-gray-500'/>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder='Firstname' name='firstname' className=' border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2' />
    </div>

    {/* Lastname Field */}
    <div className='lastname_container relative  '>
    <AccountCircleOutlinedIcon className='absolute w-6 h-6 top-2 left-2 text-gray-500'/>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder='Lastname' name='lastname' className=' border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2' />
    </div>
    </div>

    {/* Contact Field */}
    <div className='contact_container w-full flex items-center  relative  '>
    <CallOutlinedIcon className='absolute w-6 h-6 top-2 left-2 text-gray-500'/>
    <div className='absolute left-11 flex text-gray-400'>+63 <div className=' border-e-2 border-e-gray  w-2 flex items-start justify-start'></div></div>
    <input onChange={(e)=>handleChange(e)} type="text" placeholder=' ' name='contact' className=' border-b-1 border-gray outline-none w-full mx-auto pl-[5.5rem] py-2' />
    </div>

    {/* birth Field */}
    <div className='birth_container w-full   '>
    <p className='text-xs text-gray-500'>Date of birth</p>
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
    <p className='text-xs text-center text-gray-500 mt-2'>Already have an account? <span className='text-blue-600'>Login now</span></p>
    </div>
    
    </div>
            
    </div>
    )
  )
}

export default Register