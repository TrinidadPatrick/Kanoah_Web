import React, { useEffect, useContext, createContext } from 'react'
import logo from '../RegisterPage/RegisterComponents/img/DarkLogo.png'
import {FaUserLarge, FaUserPlus, FaCircleUser, FaArrowTrendUp} from 'react-icons/fa6'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import CloseIcon from '@mui/icons-material/Close';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useState } from 'react';
import { DateData } from './RegisterComponents/MMDDYY/Date';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { Context } from '../Navbar/Navbar';
import DescriptionIcon from '@mui/icons-material/Description';
import "./Register.css"
import http from '../../http'




const Register = () => {
  const [showSignup, setShowSignup, showLogin, setShowLogin, showFP, setShowFP, handleClose] = useContext(Context)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [tncIsOpen, setTncIsOpen] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState(undefined)
  const [isValidEmail, setIsValidEmail] = useState(undefined)
  const [isValidPassword, setIsValidPassword] = useState(undefined)
  const [isValidFirstname, setIsValidFirstname] = useState(undefined)
  const [isValidLastname, setIsValidLastname] = useState(undefined)
  const [isValidContact, setIsValidContact] = useState(undefined)
  const [isValidOtp, setIsValidOtp] = useState(undefined)
  const [isEmailExist, setIsEmailExist] = useState(undefined)
  const [isContactExist, setIsContactExist] = useState(undefined)
  const [isUsernameExist, setIsUsernameExist] = useState(undefined)
  const [emailSent, setEmailSent] = useState(false)
  const [registerPage, setRegisterPage] = useState(1)
  const [acceptedTNC, setAcceptedTNC] = useState(false)
  const [otp, setOtp] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [timer, setTimer] = useState(10)
  const [startTimer, setStartTimer] = useState(false)
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
    setUserInfo({...userInfos, [e.target.name]: e.target.name === "username" || e.target.name === "password" ? e.target.value.replace(/\s/g, '') : e.target.value})
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
    }if(username.length >= 5 && password.length >= 8){
      setIsLoading(true)
      await http.post("verifyUsername", {username : userInfos.username}).then((res)=>{
        if(res.data.status == "unavailable"){
          setIsUsernameExist(true)
        }else if(res.data.status == "available"){
          setIsUsernameExist(false)
          setRegisterPage(2)
        }
      }).catch((err)=>{
        console.log(err)
      }).finally(()=>{
        setIsLoading(false)
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
      
      const {email, contact} = userInfos
      await http.post("verifyEmail", {email : email, contact : contact}).then((res)=>{
        console.log(res.data.status)
        if(res.data.status == "emailSent"){
      setIsEmailExist(false)
      setTimer(10)
      // After button CLick, Disable the get otp button and add a timer
      document.getElementById("sendEmail").setAttribute("disabled", "disabled")
      document.getElementById("timer").classList.remove("hidden")
      // After a time enable the button and hide the timer
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



  // Signup User
  const signup = async () => { 
    const {username, email, password, firstname, lastname, contact, birthDate} = userInfos
    if(firstname == ""){setIsValidFirstname(false)}
    if(firstname != ""){setIsValidFirstname(true)}
    if(lastname == ""){setIsValidLastname(false)}
    if(lastname != ""){setIsValidLastname(true)}
    if(contact == ""){setIsValidContact(false)}
    if(contact != ""){setIsValidContact(true)}
    if(email == ""){setIsValidEmail(false)}
    if(email != ""){setIsValidEmail(true)}
    if(otp == ""){setIsValidOtp(false)}
    if(otp != ""){setIsValidOtp(true)}
    
    if(firstname !== "" && lastname !== "" && contact !== "" && email !== "" && otp !== ""){
      setIsLoading(true)
      http.post("verifyOTP", {otp}).then((res)=>{
        // IF OTP IS CORRECT
            if(res.data.status == 'verified'){
              
              http.post("register", {username, email, password, firstname, lastname, contact, birthDate}).then((res)=>{
                if(res.data.status == 'registered'){
                setIsValidOtp(true)
                setShowSignup(false)
                setShowLogin(true)
                }else {
                    // IF FAILED REGISTRATION
                    if(res.data.message == "Contact already Exist")
                    {
                      setIsContactExist(true)
                    }
                }
                }).catch((err)=>{
                  alert("Signup failed please try again after a few minutes.")  
                })
                }else{
                // IF OTP IS NOT CORRECT
                setIsValidOtp(false)
                }
                }).catch((err)=>{
                console.log(err)
                }).finally(()=>{
                  setIsLoading(false)
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

  const [isChecked, setChecked] = useState(false);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const openTnc = () => {
      setTncIsOpen(!tncIsOpen)
  }

  return (
    registerPage == 1 ? (
    <div className='register_container relative rounded-md h-fit py-6 px-6 bg-white'>
      <button onClick={()=>{setShowSignup(false);handleClose()}} className='absolute right-2 top-2'><CloseIcon /></button>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
    <img className=' w-44 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className='LogReg_container mx-auto w-fit flex'>
    <button className='flex items-center justify-center gap-2 px-9 rounded-sm text-sm py-1'><FaUserLarge /> Sign In </button>
    <button className='text-white flex items-center justify-center gap-2 px-4 sm:px-9 rounded-sm text-sm py-1 bg-themeBlue '><FaUserPlus/> Sign Up </button>
    </div>


    {/* Input field Container */}
    <div className='w-full mx-auto mt-7 flex flex-col space-y-4'>

    {/* Username Field */}
    <div className={`username_container w-full  relative`}>
    <AccountCircleOutlinedIcon className={`absolute w-10 h-6 top-2 left-2 text-gray-500 ${isValidUsername == false ? "text-red-500" : ""}`}/>
    <input value={userInfos.username} onChange={(e)=>{handleChange(e)}} type="text" placeholder='Enter username' name='username' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidUsername == false || isUsernameExist == true ? " border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidUsername == false ? "block" : "hidden"}`}>Please enter atleast 5 characters</p>
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isUsernameExist == true ? "block" : "hidden"}`}>Username already in use</p>
    </div>


    {/* Password Field */}
    <div className='password_container w-full  relative  '>
    <LockOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidPassword == false ? "text-red-500" : ""}`}/>
    <input value={userInfos.password} onKeyDown={(e)=>{if(e.key == "Enter"){next()}}} onChange={(e)=>handleChange(e)} id="password" type="password" placeholder='Create a password' name='password' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidPassword == false ? " border-b-red-500" : ""}`} />
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
    <button onClick={()=>{next()}} className={`${isLoading ? "bg-slate-600" : "bg-themeBlue"} w-full text-white h-[40px] rounded-sm mt-2`}>
    {
        isLoading ? (
          <div className="typing-indicator mx-auto">
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          </div>
        )
        :
        "Next"
      }
    </button>
    <p className='text-xs text-center text-gray-500 mt-2'>Already have an account? <button onClick={()=>{setShowSignup(false);setShowLogin(true)}} className='text-blue-600'>Login now</button></p>
    </div>
    </div>       
    </div>
    )

    :

    // Second Page of Register--------------------------------------------------------------------------------------------------------------------------------------------
    (
      <div className='register_container relative rounded-md h-fit py-6 px-6  bg-white'>
        
        <button onClick={()=>{setShowSignup(false);handleClose()}} className='absolute right-2 top-2'><CloseIcon /></button>
    {/* Logo Container */}
    <div className='register_Logo_container mb-6'>
      <img className=' w-44 mx-auto ' src={logo} alt='logo' />
    </div>

    {/* Login and signup button container */}
    <div className='LogReg_container mx-auto w-fit flex'>
    <button className='flex items-center justify-center gap-2 px-11 rounded-sm text-sm py-1'><FaUserLarge /> Sign In </button>
    <button className='text-white flex items-center justify-center gap-2 px-4 sm:px-11 rounded-sm text-sm py-1 bg-themeBlue '><FaUserPlus/> Sign Up </button>
    </div>

    {/* OTP sent success popup */}
    <div className={` bg-green-200 p-2 w-3/5 mx-auto mt-3 rounded-sm ${emailSent == true ? "block" : "hidden"}`}>
    <p className='text-semiXs text-center text-green-700'>We've sent a verification code to your </p>
    <p className='text-semiXs text-center text-green-700'>email {userInfos.email}</p>
    </div>

    {/* Input field Container */}
    <div className='w-full mx-auto mt-7 flex flex-col space-y-4'>
    
    <div className='fn_ln_container flex space-x-3'>
    {/* Firstname Field */}
    <div className='firstname_container   relative  '>
    <AccountCircleOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidFirstname == false ? "text-red-500" : ""}`}/>
    <input value={userInfos.firstname} onChange={(e)=>handleChange(e)} type="text" placeholder='Firstname' name='firstname' className={`border-b-1 border-gray outline-none w-full mx-auto pl-12 text-sm py-2 ${isValidFirstname == false ? " border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 ${isValidFirstname == false ? "block" : "hidden"}`}>Firstname is required</p>
    </div>

    {/* Lastname Field */}
    <div className='lastname_container relative  '>
    <AccountCircleOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidLastname == false ? "text-red-500" : ""}`}/>
    <input value={userInfos.lastname} onChange={(e)=>handleChange(e)} type="text" placeholder='Lastname' name='lastname' className={`border-b-1 border-gray outline-none w-full mx-auto text-sm pl-12 py-2 ${isValidLastname == false ? "border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 ${isValidLastname == false ? "block" : "hidden"}`}>Lastname is required</p>
    </div>
    </div>

    {/* Contact Field */}
    <div className='contact_container w-full flex items-center  relative  '>
    <CallOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidContact == false ? "text-red-500" : ""}`}/>
    <div className='absolute left-11 flex text-gray-600'>+63 <div className='bg-gray-600 ml-3 w-0.2 flex items-start justify-start'></div></div>
    <input value={userInfos.contact} onChange={(e)=>handleChange(e)} type="text" placeholder=' ' maxLength={10} name='contact' className={`text-sm border-b-1 border-gray outline-none w-full mx-auto pl-24 py-2 ${isValidLastname == false ? "border-b-red-500" : ""}`} />
    <p className={`text-xs text-start absolute text-red-500 -bottom-4 ${isValidContact == false ? "block" : "hidden"}`}>Contact is required</p>
    <p className={`text-xs text-start absolute text-red-500 -bottom-4 ${isContactExist == true ? "block" : "hidden"}`}>Contact already exist</p>
    </div>

    {/* Email Field */}
    <div className='email_container w-full  relative  '>
    <EmailOutlinedIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidEmail == false ? "text-red-500" : ""}`}/>
    <input value={userInfos.email} onChange={(e)=>handleChange(e)} type="text" placeholder='Enter your Email' name='email' className={`text-sm border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidEmail == false || isEmailExist == true ? " border-b-red-500" :  ""}`} />
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidEmail == false ? "block" : "hidden"}`}>Email is required</p>
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isEmailExist == true ? "block" : "hidden"}`}>Email already is use</p>
    </div>

    {/* Code Field */}
    <div className='code_container w-3/5  relative  '>
    <VpnKeyIcon className={`absolute w-6 h-6 top-2 left-2 text-gray-500 ${isValidOtp == false ? "text-red-500" : ""}`}/>
    <input value={otp} onChange={(e)=>setOtp(e.target.value)} type="text" placeholder='Enter OTP' name='otp' className={`text-sm border-b-1 border-gray outline-none w-full mx-auto pl-12 py-2 ${isValidOtp == false ? "text-red-500 border-b-red-500 placeholder:text-red-500" : ""}`} />
    <button id='sendEmail' onClick={()=>{verifyEmail()}} className='absolute bg-themeBlue flex gap-1 text-xs p-1 px-2 text-white top-2 right-2 rounded-sm disabled:bg-gray-300'>Get <p id="timer" className='hidden text-xs'>{timer}</p></button>
    <p className={`text-xs text-start absolute text-red-500 mt-01 ${isValidOtp == false ? "block" : "hidden"}`}>Invalid Otp</p>
    </div>

    {/* birth Field */}
    <div className='birth_container w-full '>
    <p className='text-xs text-gray-500 mt-2'>Date of birth</p>
    <div className='select_container w-full flex  space-x-5'>
    <select onChange={(e)=>handleDate(e)} name="month" className='border-1 border-gray rounded-sm text-xs'>
      {
        DateData.months.map((month, index)=>
        {
          return (<option key={index} className="text-sm" value={month}>{month}</option>)
        })
      }
    </select>
    <select onChange={(e)=>handleDate(e)} name="day" className='border-1 border-gray rounded-sm text-sm'>
      {
        DateData.days.map((day, index)=>
        {
          return (<option  key={index} value={day}>{day}</option>)
        })
      }
    </select>
    <select onChange={(e)=>handleDate(e)} name="year"  className='border-1 border-gray text-sm rounded-sm'>
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
  <div className='flex whitespace-nowrap items-center mb-3 space-x-1'>
  <input type="checkbox" onChange={()=>{checkTNC()}}/>
  <div className='text-xs flex items-center gap-1'>I accept <div onClick={()=>{openTnc()}} className='text-blue-500 decoration-solid cursor-pointer hover:underline'>terms & conditions</div></div>
  </div>

  {/* Signup Button Container */}

      <button disabled={!acceptedTNC} onClick={()=>{signup()}} className={`${isLoading ? "bg-slate-600" : "bg-themeBlue"} w-full text-white h-[40px] rounded-sm`}>
      {
        isLoading ? (
          <div className="typing-indicator mx-auto">
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          </div>
        )
        :
        "Signup"
      }
      </button>  
      <p className='text-xs text-center text-gray-500 mt-2'>Already have an account? <button onClick={()=>{setShowSignup(false);setShowLogin(true)}} className='text-blue-600'>Login now</button></p>
      </div>
    
      </div>     
      {/* TNC MODAL */}
        <div className={`${tncIsOpen ? "absolute" : "hidden"} w-[500px] flex flex-col bg-white rounded-md shadow-lg border top-[0%] left-[-15%]`} style={{height: "calc(100% + 1%)"}}>
        <header className='w-full border-b flex items-center py-3 space-x-2 px-5'>
        <DescriptionIcon />
        <h1>Terms and conditions</h1>
        </header>
        <section className='p-5 h-full max-h-full  overflow-auto'>
        {/* Paragraph 1 */}
        <p className='text-sm'>
          <strong>1. Introduction:</strong> <br></br>
          Welcome to Kanoah! Before using or registering an account, please read and understand these terms and conditions to be aware of your rights and obligations. Kanoah provides services such as the site, registered services, and all information within the system. By utilizing the Kanoah system, users acknowledge and agree to these terms and conditions.
        </p>
        <ul className='text-sm'>
          <li>1.1 All parties recognize the binding nature of these terms and conditions.</li>
          <li>1.2 Users acknowledge that these terms govern their use of the Kanoah system.</li>
          <li>1.3 Kanoah provides opportunities for service providers and seekers to offer services online. Kanoah does not accept obligations in any contract between service providers and seekers. Transactions, such as bookings, online payments, and service provision, are the sole responsibility of the parties involved. Kanoah reserves rights, including the ability to disable users and posts.</li>
        </ul>

        {/* Paragraph 2 */}
        <p className='text-sm mt-2'>
          <strong>2. Term of Use:</strong> <br></br>
          This outlines the rules and conditions that individuals must agree upon when accessing and using Kanoah. These terms typically govern the relationship between the user and the provider of the service. It specifies what users are agreeing to do and not do while using the Kanoah. It covers various aspects, such as the responsibilities of service providers and clients, acceptable and unacceptable behaviors, and the consequences for violating these terms. To establish a clear understanding of the expectations and boundaries for users engaging with the Kanoah.
        </p>
        <ul className='text-sm'>
          <li>2.1 You agree to:</li>
          <li>a. You agree that any information that you provide (about your identity) is accurate, correct, and up to date.</li>
          <li>b. You agree to use Kanoah system in a professional manner.</li>
          <li>c. By using the Kanoah system, you agree to abide by these terms and conditions, acknowledging your responsibility for your actions and compliance with the outlined rules.</li>
          <li>2.2 You agree not to:</li>
          <li>a. Upload, post, transmit or any content that is unlawful, harmful, threatening, abusive, harassing, alarming, distressing, tortuous, defamatory, vulgar, obscene, invasive of another's privacy and hateful.</li>
          <li>b. Upload Content to impersonate any person or services that are not yours.</li>
          <li>c. Use the Services or upload content in a manner that is false and misleading or deceptive.</li>
        </ul>

        {/* Paragraph 3 */}
        <p className='text-sm mt-2'>
          <strong>3. Violation of Our Terms of Service:</strong> <br></br>
          Actions taken by users that contravene the established rules, guidelines, and conditions outlined in the Terms and Conditions of Kanoah. A legally binding agreement between the service provider and users. Consequences for violating the Terms of Service can range from warnings and temporary suspensions to permanent account termination, depending on the severity and recurrence of the violation. Enforcing these terms helps maintain a safe, respectful, and secure environment for all users of the platform.
        </p>
        <ul className='text-sm'>
          <li>3.1 Violation consequences for violating the Terms and Conditions can range from warnings and temporary suspensions to permanent account termination, depending on the severity and recurrence of the violation.</li>
          <li>a. Users found in violation of the terms of use may face consequences, including:</li>
          <li>i. Warning: A notification informing the user of the violation.</li>
          <li>ii. Account Suspension: Temporary suspension of the user's account.</li>
          <li>iii. Account Termination: Permanent removal of access to Kanoah.</li>
        </ul>

        {/* Paragraph 4 */}
        <p className='text-sm mt-2'>
          <strong>4. Termination of Use:</strong> <br></br>
          Termination of use is a serious measure that is implemented to maintain the integrity, security, and proper functioning of Kanoah.
        </p>
        <ul className='text-sm'>
          <li>a. The administrator reserves the right to terminate or suspend user access to Kanoah at any time for violation of these Terms and Conditions or any other reason.</li>
          <li>b. Any violation of these terms may result in consequences outlined in the Violations of Terms section.</li>
        </ul>

          {/* Paragraph 5 */}
        <p className='text-sm mt-2'>
          <strong>5. Privacy and Data Security:</strong> <br></br>
          These are crucial concepts that focus on protecting individuals' personal information and ensuring the confidentiality, integrity, and availability of data.
        </p>
        <ul className='text-sm'>
          <li>a. All parties agree to adhere to privacy and data security standards.</li>
          <li>b. The system will implement measures to protect user information and maintain confidentiality.</li>
          <li>c. Users will be informed about the purpose of data collection, and their consent will be obtained before collecting any sensitive information.</li>
          <li>d. Personal information is collected only for specific, legitimate purposes, and any additional use requires further consent.</li>
        </ul>

        {/* Paragraph 6 */}
        <p className='text-sm mt-2'>
          <strong>6. Reporting Intellectual Property Rights Infringement:</strong> <br></br>
          6.1. As stated above, Kanoah does not allow listings that violate the intellectual property rights of services or other intellectual property rights owners. <br></br>
          6.2. Kanoah may, in appropriate circumstances, terminate the accounts of users who repeatedly infringe intellectual property rights. <br></br>
          6.3. Kanoah respects the privacy of its users. Information provided in infringement notifications and counter-notifications will be handled in accordance with Kanoah's privacy policy.
        </p>

        {/* Paragraph 7 */}
        <p className='text-sm mt-2'>
          <strong>7. Purchase and Payment:</strong> <br></br>
          7.1. Kanoah supports the following payment methods: <br></br>
          (i) Cash: Cash payments are accepted for client chosen services provided by Kanoah. Payment is due at the time of service or as otherwise agreed upon between the service provider and the customer. <br></br>
          (ii) Online Payment: Clients may pay through online payment available on Kanoah like gcash. <br></br>
          7.2. Clients may only change their preferred mode of payment.
        </p>

        {/* Paragraph 8 */}
        <p className='text-sm mt-2'>
          <strong>8. Service Provider’s Responsibilities:</strong> <br></br>
          8.1. The service provider is responsible for delivering services of the highest quality, meeting industry standards, and any specific requirements agreed upon with the client. <br></br>
          8.2. Maintaining open and effective communication with clients, keeping them informed about the progress of services, and addressing any inquiries or concerns promptly. <br></br>
          8.3. Ensuring the security and confidentiality of any client information or data involved in the service provision, in compliance with applicable privacy and data protection. <br></br>
          8.4. Prioritizing customer satisfaction and addressing any feedback or concerns promptly to enhance the overall client experience.
        </p>

        {/* Paragraph 9 */}
        <p className='text-sm mt-2'>
          <strong>9. Disclaimers:</strong> <br></br>
          9.1. These are legal statements included in the terms and conditions of a service or product to clarify specific aspects, manage expectations, and limit the liability of the provider. They aim to protect the provider from certain risks and inform users about the terms under which they are accessing or using the service. <br></br>
          9.2. Asserts the provider's right to modify or update the terms and conditions at any time. Users are encouraged to review the terms regularly to stay informed about any changes. <br></br>
          9.3. The responsibilities of users, making it clear that certain actions or decisions taken by users are their sole responsibility and that the provider is not accountable for the consequences. <br></br>
          9.4. Users are responsible for the security of their accounts, passwords, and the consequences of sharing account information. The service provider is not liable for unauthorized access resulting from user negligence. <br></br>
          9.5. Kanoah reserves the right to modify, suspend, or terminate the service or any part of it at any time. Users are responsible for reviewing and understanding any changes to the terms and conditions.
        </p>

        {/* Paragraph 10 */}
        <p className='text-sm mt-2'>
          <strong>10. Links to Third-Party Sites:</strong> <br></br>
          10.1. Kanoah does not exercise control over the content, policies, or practices of third-party sites. Users acknowledge that our terms and conditions and privacy policy do not extend to external sites. <br></br>
          10.2. Users should be aware that third-party sites may have different security and privacy practices. Kanoah is not responsible for any security risks or breaches that may result from accessing external sites.
        </p>

        {/* Paragraph 11 */}
        <p className='text-sm mt-2'>
          <strong>11. Your Contributions to the Service:</strong> <br></br>
          11.1. Any content, including text, images, or multimedia, that you contribute to the service is subject to the terms and conditions outlined herein. <br></br>
          11.2. You retain ownership and any applicable rights to the content you submit. However, you grant Kanoah the right to use and display your content in connection with the Kanoah service. <br></br>
          11.3. Your contributions must comply with applicable laws, regulations, and Kanoah's community guidelines. Content that violates these standards may be removed, and you may face consequences outlined in Kanoah's terms and conditions.
        </p>

        {/* Paragraph 12 */}
        <p className='text-sm mt-2'>
          <strong>12. Fraudulent or Suspicious Activity:</strong> <br></br>
          12.1. Any activity that is fraudulent or suspicious by Kanoah includes, the intentional submission of false information, unauthorized access to the platform, attempts to manipulate or abuse the system, and any deceptive practices aimed at gaining unfair advantages. <br></br>
          12.2. Users are strictly prohibited from engaging in any form of fraudulent or suspicious activity on the Kanoah platform. This includes creating fake accounts, providing false information, engaging in deceptive transactions, or attempting to exploit vulnerabilities in the system. <br></br>
          12.3. In cases where fraudulent or suspicious activity is suspected, Kanoah may temporarily suspend accounts, and this is done to prevent further harm or unauthorized access.
        </p>

        {/* Paragraph 13 */}
        <p className='text-sm mt-2'>
          <strong>13. General Provisions:</strong> <br></br>
          13.1. These provisions constitute the entire agreement between you and Kanoah regarding the subject matter herein all prior or contemporaneous agreements, understandings, and representations, whether oral or written. <br></br>
          13.2. Kanoah may freely assign or transfer its rights and obligations under these provisions. <br></br>
          13.3. Kanoah reserves the right to modify, amend, or update these provisions at any time. Users are responsible for regularly reviewing the provisions to stay informed of any updates.
        </p>
        </section>
        <div className='flex p-3 space-x-2 justify-end'>
        <button onClick={()=>{openTnc()}} className='bg-themeBlue text-white py-2 px-4 rounded-md'>Close</button>
        </div>
        </div>

      </div>
      
   )
  )

  

  
}

export default Register