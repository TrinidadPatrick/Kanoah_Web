import React, { useEffect } from 'react'
import logo from '../Register/RegisterComponents/img/Logo.png'
import {FaUserLarge, FaUserPlus, FaCircleUser, FaArrowTrendUp} from 'react-icons/fa6'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const Login = () => {
  const navigate = useNavigate()
  // const nodemailer = nodemailer()
  const [isValidUsername, setIsValidUsername] = useState(undefined)
  const [isValidPassword, setIsValidPassword] = useState(undefined)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  // const [allFieldsComplete, setAllFieldsComplete] = useState(false)

  const [userInfos, setUserInfo] = useState({
        UsernameOrEmail : "",
        password : "",
  })

  // Handles the values of inputs
  const handleChange = (e) => {
    setUserInfo({...userInfos, [e.target.name]: e.target.value})
  }

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

  const signin = () => {
    const {UsernameOrEmail, password} = userInfos
    if(UsernameOrEmail == ""){
      setIsValidUsername(false)
    }
    if(password == ""){
      setIsValidPassword(false)
    }
    if(password != "" && UsernameOrEmail != ""){
      axios.post("http://localhost:5000/api/login", {UsernameOrEmail, password}).then((res)=>{
      console.log(res.data)
    }).catch((err)=>{
      console.log(err)
    })
    }
    
  }
  
  return (
    <div className='register_container rounded-md h-fit py-6 w-10/12 xs:w-11/12 md:w-1/2 lg:w-2/5 xl:w-3/12 bg-white'>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
      <img className=' w-1/2 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className='LogReg_container mx-auto w-fit flex'>
    <button className='flex items-center justify-center gap-2 px-11 rounded-sm text-semiXs py-1 bg-themeBlue text-white'><FaUserLarge /> Sign In </button>
    <button className='text-black flex items-center justify-center gap-2 px-4 sm:px-11 rounded-sm text-semiXs py-1  '><FaUserPlus/> Sign Up </button>
    </div>

    {/* Input field Container */}
    <div className='w-5/6 mx-auto mt-7 flex flex-col space-y-4'>

    {/* Username Field */}
    <div className={`username_container w-full  relative`}>
    <AccountCircleOutlinedIcon className={`absolute w-10 h-6 top-2 left-2 text-gray-500 ${isValidUsername == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>{handleChange(e)}} type="text" placeholder='Username/Email' name='UsernameOrEmail' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidUsername == false ? "text-red-500 border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidUsername == false ? "block" : "hidden"}`}>This is a required field</p>
    </div>

    {/* Password Field */}
    <div className='password_container w-full  relative  '>
    <LockOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidPassword == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>handleChange(e)} id="password" type="password" placeholder='Password' name='password' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidPassword == false ? "text-red-500 border-b-red-500" : ""}`} />
    {
      isPasswordVisible == false 
      ?
      <RemoveRedEyeRoundedIcon onClick={()=>{togglePassword()}} className='absolute text-md text-gray-500 right-2 top-2' />
      :
      <VisibilityOffRoundedIcon onClick={()=>{togglePassword()}} className='absolute text-md text-gray-500 right-2 top-2' />
    }

    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidPassword == false ? "block" : "hidden"}`}>This is a required field</p>
    <p className={`text-xs text-end w-full mt-1 absolute text-blue-500 mt-01`}><Link to="/forgotPassword">Forgot password</Link></p>
    </div>

    <div>
    <button onClick={()=>{signin()}} className='w-full text-white py-1 rounded-sm bg-themeBlue mt-4'>Login</button>
    <p className='text-xs text-center text-gray-500 mt-2'>Dont have an account? <Link to="/" className='text-blue-600'>Register now</Link></p>
    </div>
    </div>       
    </div>
  )
}

export default Login