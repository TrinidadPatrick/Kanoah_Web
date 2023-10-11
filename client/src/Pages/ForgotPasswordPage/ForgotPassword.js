import React, { useEffect,useContext } from 'react'
import logo from '../RegisterPage/RegisterComponents/img/Logo.png'
import MailIcon from '@mui/icons-material/Mail';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from '../Navbar/Navbar';


const ForgotPassword = () => {
    const [showSignup, setShowSignup, showLogin, setShowLogin, showFP, setShowFP, handleClose] = useContext(Context)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [timer, setTimer] = useState(10)
    const [startTimer, setStartTimer] = useState(false)
    const [isValidEmail, setIsvalidEmail] = useState(undefined)
    const [passwordError, setPasswordError] = useState(undefined) //1 = no password input, 2 password dont match, 3 short password
    const [isValidOtp, setIsValidOtp] = useState(undefined)
    const [emailVerified, setEmailVerified] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    // To get verification code
    const sendCode = async () => {
        
        
        if(email == ""){
            setIsvalidEmail(false)
        }
        
        else if(email != ""){
        
            setIsvalidEmail(true)
            await axios.post("http://localhost:5000/api/forgotPassword", {email}).then((res)=>{
                if(res.data.message == 'Found'){
                setEmailVerified(true)
                setTimer(10)
                const sendCodeBtn = document.getElementById('sendCode')
                document.getElementById("timer").classList.remove("hidden")
                sendCodeBtn.setAttribute("disabled", "disabled")
                setStartTimer(true)
                setTimeout(()=>{
                sendCodeBtn.removeAttribute("disabled", "disabled")
                }, 10000)
                }else{
                    console.log(res.data)
                    setIsvalidEmail(false)
                }
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    // Submit Code for new Password
    const submitCode =  async () => {
        axios.post("http://localhost:5000/api/forgotPassword/sendOtp", {code : otp, email}).then((res)=>{
            if(res.data.status == 'verified'){
            console.log('verified')
            setIsValidOtp(true)
            setIsvalidEmail(undefined)
            document.getElementById('verifyCode').setAttribute("disabled", "disabled")
            document.getElementById('sendCode').setAttribute("disabled", "disabled")
            }else if(res.data.status == "invalid"){
            setIsValidOtp(false)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    // Submit new password
    const submitPassword = async () => {
        if(password != "" && password == confirmPassword){
            await axios.post("http://localhost:5000/api/forgotPassword/newPassword", {email, password}).then((res)=>{
            if(res.data.status == "updated"){
                navigate('/')
            }else{
                console.log("failed")
            }
            }).catch((err)=>{
            console.log(err)
            })
        }
        if(password == ""){
            setPasswordError(1)
        }if(password != confirmPassword){
            setPasswordError(2)
        }if(password.length < 9){
            setPasswordError(3)
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
        document.getElementById("timer").classList.add("hidden")
        }
    }, [timer])

    // Every Refresh verify button and input is disabled until email is verified
    useEffect(()=>{
        if(!emailVerified){document.getElementById("verifyCode").setAttribute("disabled", "disabled");document.getElementById("otpField").setAttribute("disabled", "disabled")}
        else if(emailVerified){document.getElementById("verifyCode").removeAttribute("disabled", "disabled");document.getElementById("otpField").removeAttribute("disabled", "disabled")}
    },[emailVerified])

    const checkHandler = () => {
        setIsChecked(!isChecked)
        
      }
      

    
  return (
    <>
    {
        
        <div className='bg-white flex flex-col items-center p-6 rounded-md '>
            <button onClick={()=>{setShowSignup(false);handleClose()}} className='absolute right-2 top-2'><CloseIcon /></button>
        {/* Logo */}
        <img className='w-32 mb-5' src={logo} alt="logo" />
        <h1 className='font-bold text-xl mb-3'>Reset Password</h1>
        <div className='mx-4'>
        <p className='text-xs text-center'>Enter the email associated with your account </p>
        <p className='text-xs text-center'>and we'll send you an OTP code</p>

        {/* Verification success popup */}
        <div className={` bg-green-200 p-2 mt-3 rounded-sm ${isValidOtp == true ? "block" : "hidden"}`}>
        <p className='text-center text-green-700  font-medium'>Verification Successfull</p>
        <p className='text-semiXs text-center text-green-700'>Email verification Successfull, please enter your new password. </p>
        <p className='text-semiXs text-center text-green-700'>Please keep in mind to enter a strong and secured password</p>
        <p className='text-semiXs text-center text-green-700'>Do not refresh the page</p>
        </div>

        {/* OTP sent success popup */}
        <div className={` bg-green-200 p-2 mt-3 rounded-sm ${isValidEmail == true ? "block" : "hidden"}`}>
        <p className='text-semiXs text-center text-green-700'>We've sent a verification code to your </p>
        <p className='text-semiXs text-center text-green-700'>email {email}</p>
        </div>
        </div>
        

        {/* Email Field */}
        <div className='w-full relative mt-6'>
        <input  onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder='Email' className={`w-full border-2 rounded-sm outline-blue-700 border-gray-500 p-1 pr-10 ${isValidEmail == false ? 'border-red-400 ' : ""}`} />
        <MailIcon className='absolute top-1.5 right-2 text-gray-400'/>
        <p className={`text-semiXs text-start absolute text-red-500 mt-01 ${isValidEmail == false ? "block" : "hidden"}`}>Invalid email</p>
        </div>


        {/* OTP code Field */}
        <div className='mt-5 relative w-full'>
        <input  onChange={(e)=>{setOtp(e.target.value)}} type="text" placeholder='Code' id='otpField' className={`w-full border-2 rounded-sm outline-blue-700 border-gray-500 p-1 pr-10 ${isValidOtp == true ? "border-green-500" : isValidOtp == false ? 'border-red-400 ' : ""}`} />
        <VpnKeyIcon className='absolute top-1 right-2 text-gray-400'/>
        <p className={`text-semiXs text-start absolute text-red-500 mt-01 ${isValidOtp == false ? "block" : "hidden"}`}>Invalid code</p>
        <p className={`text-semiXs text-start absolute text-green-500 mt-01 ${isValidOtp == true ? "block" : "hidden"}`}>Success</p>
        </div>
        
        {/* Verify and Send Code Button */}
        <div className='w-full mt-4 flex space-x-2'>
        <button onClick={()=>{submitCode()}} id="verifyCode" className='w-full text-white py-1 rounded-sm bg-themeBlue mt-2 text-sm disabled:bg-gray-200'>Verify Code</button>
        <button onClick={()=>{sendCode()}} id='sendCode' className='w-full flex items-center justify-center text-white py-1 rounded-sm bg-themeBlue mt-2 text-sm disabled:bg-gray-300'>Send Code <p id="timer" className='ml-2 hidden' >{timer}</p></button>
        
        </div>
        
        {/* Password Field */}
        <div className={`w-full ${isValidOtp ? " block" : "hidden"}`}>
        <div className='w-full relative mt-6'>
        <input  onChange={(e)=>{setPassword(e.target.value)}} type={isChecked ? "text" : "password"} placeholder='New Password' className={`w-full password border-2 rounded-sm outline-blue-700 border-gray-500 p-1 pr-10 ${passwordError == 1 ? 'border-red-400 ' : passwordError == 2 ? 'border-red-400 ' : passwordError == 3 ? 'border-red-400 '  : ""}`} />
        {
            passwordError == 1 ?
            <p className={`text-semiXs text-start absolute text-red-500 mt-01 `}>Password required</p>
            :
            passwordError == 2 ?
            <p className={`text-semiXs text-start absolute text-red-500 mt-01 `}>Password do not match</p>
            :
            passwordError == 3 ?
            <p className={`text-semiXs text-start absolute text-red-500 mt-01 `}>Please enter atleast 9 characters</p>
            :
            ""
        }
        <LockIcon className='absolute top-1.5 right-2 text-gray-400 w-2 h-2'/>
        </div>


        {/* Confirm Password Field */}
        <div className='w-full relative mt-3'>
        <input  onChange={(e)=>{setConfirmPassword(e.target.value)}} type={isChecked ? "text" : "password"} placeholder='Confirm New Password' className={`password w-full border-2 rounded-sm outline-blue-700 border-gray-500 p-1 pr-10 ${passwordError == 2 ? 'border-red-400 '  : ""}`} />
        <LockIcon className='absolute top-1.5 right-2 text-gray-400 w-2 h-2'/>
        </div>
        <div className='flex space-x-1 mt-1'>
        <input id='showPassword' checked={isChecked} onChange={checkHandler} type="checkbox" />
        <p className='text-xs'>Show password</p>
        </div>
        <button onClick={()=>{submitPassword()}}  className='w-full text-white py-1.5 rounded-sm bg-themeBlue mt-2 text-sm'>Reset Password</button>
        </div>
        </div>
        
       
    }
    </>
  )
}

export default ForgotPassword