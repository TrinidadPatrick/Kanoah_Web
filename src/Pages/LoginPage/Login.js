import React, { useEffect, createContext, useContext } from 'react'
import logo from '../RegisterPage/RegisterComponents/img/DarkLogo.png'
import {FaUserLarge, FaUserPlus, FaCircleUser, FaArrowTrendUp} from 'react-icons/fa6'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { Context } from '../Navbar/Navbar';
import jwtDecode from 'jwt-decode';
import "./Login.css"
import http from '../../http'

const Login = () => {
  const [showSignup, setShowSignup, showLogin, setShowLogin, showFP, setShowFP, handleClose] = useContext(Context)
  const navigate = useNavigate()
  const [isValidUsername, setIsValidUsername, ] = useState(undefined)
  const [isValidPassword, setIsValidPassword] = useState(undefined)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [invalidLogin, setInvalidLogin] = useState(false)
  const [accountDisabled, setAccountDisabled] = useState({bool : false, reasons : []})
  const [loading, setLoading] = useState(false)
  

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
      setLoading(true)
      http.post("login", {UsernameOrEmail, password}, {withCredentials: true,}).then((res)=>{
      if(res.data.status == "authenticated"){
        setLoading(false)
        window.location.reload()
      }

    }).catch((err)=>{
      if(err.response.data.status === "Account Disabled")
      {
        setAccountDisabled({bool : true, reasons : err.response.data.reasons})
      }
      // Check the HTTP status code for error handling
      if (err.response.status === 401) {
        setInvalidLogin(true);
        setLoading(false)

      } else if (err.response.status === 404) {
        setInvalidLogin(true);
        setLoading(false)

      }
      
    }).finally(()=>{
      setLoading(false)
    })
    }
  }


  
  return (
    
    <div className='register_container relative rounded-md h-fit py-6 px-6  bg-white'>
      <button onClick={()=>{setShowLogin(false);handleClose()}} className='absolute right-2 top-2'><CloseIcon /></button>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
      <img className=' w-44 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className='LogReg_container mx-auto w-fit flex'>
    <button className='flex items-center justify-center gap-2 px-7 md:px-9  rounded-sm text-sm py-1 bg-themeBlue text-white'><FaUserLarge /> Sign In </button>
    <button className='text-black flex items-center justify-center  gap-2 px-9 md:px-11  rounded-sm text-sm py-1  '><FaUserPlus/> Sign Up </button>
    </div>

    {/* Invalid username or password indicator */}
    <div className={`${invalidLogin ? "block" : "hidden"} w-full bg-red-200 py-2 mt-3 rounded-sm`}>
      <p className='text-center text-sm text-red-600'>Invalid username/email or password.</p>
    </div>

    {/* Account disabled indicator */}
    <div className={`${accountDisabled.bool ? "block" : "hidden"} w-full bg-red-200 py-2 px-2 mt-3 rounded-sm`}>
      <div className='text-center text-sm text-red-600'>This account has been disabled for {
      accountDisabled.reasons.map((reason, index)=> (
        <span>{reason}<span >{accountDisabled.reasons.length === index + 1 ? "." : ", "}</span></span>
      ))
      }</div>
    </div>

    

    {/* Input field Container */}
    <div className='mx-auto mt-7 flex flex-col space-y-4'>

    {/* Username Field */}
    <div className={`username_container w-full  relative`}>
    <AccountCircleOutlinedIcon className={`absolute w-10 h-6 top-2 left-2 text-gray-500 ${isValidUsername == false ? "text-red-500" : ""}`}/>
    <input onChange={(e)=>{handleChange(e)}} type="text" placeholder='Username/Email' name='UsernameOrEmail' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidUsername == false ? "text-red-500 border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidUsername == false ? "block" : "hidden"}`}>This is a required field</p>
    </div>

    {/* Password Field */}
    <div className='password_container w-full  relative  '>
    <LockOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidPassword == false ? "text-red-500" : ""}`}/>
    <input onKeyDown={(e)=>{if(e.key == "Enter"){signin()}}} onChange={(e)=>handleChange(e)} id="password" type="password" placeholder='Password' name='password' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidPassword == false ? "text-red-500 border-b-red-500" : ""}`} />
    {
      isPasswordVisible == false 
      ?
      <RemoveRedEyeRoundedIcon onClick={()=>{togglePassword()}} className='absolute text-md text-gray-500 right-2 top-2' />
      :
      <VisibilityOffRoundedIcon onClick={()=>{togglePassword()}} className='absolute text-md text-gray-500 right-2 top-2' />
    }

    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidPassword == false ? "block" : "hidden"}`}>This is a required field</p>
    <p  className={`text-xs text-end w-full mt-1 absolute text-blue-500 mt-01`}><Link onClick={()=>{setShowLogin(false);setShowFP(true)}} >Forgot password</Link></p>
    </div>

    <div>
    <button onClick={()=>{signin()}} className={`${loading ? "bg-slate-600" : "bg-themeBlue"} w-full relative text-white py-2 rounded-sm  mt-4`}>
      {/* Login */}
      {
        loading ? (
          <div className="typing-indicator mx-auto">
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          </div>
        )
        :
        "Login"
      }
    
    </button>
    <p className='text-xs text-center text-gray-500 mt-2'>Dont have an account? <button onClick={()=>{setShowLogin(false);setShowSignup(true)}} className='text-blue-600'>Register now</button></p>
    </div>
    </div>       
    </div>
   
  )
}

export default Login