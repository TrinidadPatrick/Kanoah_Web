import React from 'react'
import { useState, useEffect } from 'react'
import logo from '../Pages/RegisterPage/RegisterComponents/img/DarkLogo.png'
import {FaUserLarge, FaUserPlus, FaCircleUser, FaArrowTrendUp} from 'react-icons/fa6'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { useAuth } from './CustomHooks/AuthProvider';
import http from '../http';

const AdminLogin = () => {
    const {authenticated, logout, login} = useAuth()
    const navigate = useNavigate()
    const [isValidUsername, setIsValidUsername, ] = useState(undefined)
    const [isValidPassword, setIsValidPassword] = useState(undefined)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [invalidLogin, setInvalidLogin] = useState(false)
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

    const signin = async () => {
      try {
        const handleLogin = await login(userInfos)
      } catch (error) {
        console.log(error.message)
        if(error.message === "Invalid username or password")
        {
          setInvalidLogin(true)
            
        } 
        else
        {
          alert('An Error Occured')
        }
      }
        
        
        
    }


    useEffect(()=>{
      if(authenticated === true)
      {
        navigate('/admin/Dashboard')
      }
    },[authenticated])
  return (
   <main className='flex w-full h-full bg-[#f9f9f9] items-center justify-center'>
    <div className='w-fit relative rounded-md h-fit py-6 px-6  bg-white shadow-lg'>
      <button className='absolute right-2 top-2'><CloseIcon /></button>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
      <img className=' w-44 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className=' mx-auto w-fit flex'>
        <h1 className='text-xl font-semibold text-gray-900'>Admin Login</h1>
    </div>

    {/* Invalid username or password indicator */}
    <div className={`${invalidLogin ? "block" : "hidden"} w-full bg-red-200 py-2 mt-3 rounded-sm`}>
      <p className='text-center text-sm text-red-600'>Invalid username/email or password.</p>
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
    </div>
    </div>       
    </div>
    </main>
  )
}

export default AdminLogin