import React from 'react'
import { useState, createContext, useContext, useEffect} from 'react'
import ForgotPassword from '../ForgotPasswordPage/ForgotPassword'
import Login from '../LoginPage/Login'
import Register from '../RegisterPage/Register'
import Logo from "../../Utilities/Logo/Logo1.png"
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { categories } from '../MainPage/Components/Categories'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import axios from 'axios'
import http from '../../http'
import logo from "../../Utilities/Logo/Logo1.png"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
export const Context = React.createContext()



const Navbar = () => {
const [windowWidth, setWindowWdith] = useState(null)
const dispatch = useDispatch();
const userId = useSelector(selectUserId);
const [isLoggedIn, setIsLoggedIn] = useState(undefined)
 const navigate = useNavigate()
 const [accessToken, setAccessToken] = useState(null);
 const [refreshToken, setRefreshToken] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false)
    }
  } 
    const [userInfo, setUserInfo] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [showFP, setShowFP] = useState(false)
    const [showSignup, setShowSignup] = useState(false)
    // Handles the showing oh menu on small screens
    const handleMenu = () => {
        if(showMenu){
            setShowMenu(false)
        }else{
            setShowMenu(true)
        }
    }

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: showFP ? 400 : 380,
      bgcolor: 'background.paper',
      boxShadow: 0,
      padding : 0,
      borderRadius : 1,

      
    };

    // check if Logged In
    const getUserProfile = async (token) => {
      
      try {
        const response = await http.get('profile', {
          headers : {Authorization: `Bearer ${token}`},
        })
        if(response.status == 200)
        {
          setIsLoggedIn(true)
          getUser(response.data.user._id)
        }
        
        
        
      } catch (error) {
        if(error.response.status == 403 || error.response.status == 401)
        console.error('Profile Error:', error.response.status);
        setIsLoggedIn(false)
        // navigate("/")
      }
    }
    // Get userInformation
    const getUser = async (id) => {
      http.get(`getUser/${id}`).then((res)=>{
        setUserInfo(res.data)
        
        dispatch(setUserId(res.data._id));
      }).catch((err)=>{
        console.log(err)
      })
    }
    useEffect(() => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        getUserProfile(accessToken);
        // getUser()
      }else{
        dispatch(setUserId("NoId"));
        setIsLoggedIn(false)
      }
    }, [])

    const signout = () => {
      localStorage.removeItem("accessToken")
      window.location.reload()
    }

    // Function to handle window resize
function handleResize() {
  const windowWidth = window.innerWidth;

  // Update your code or perform actions based on the new size
  setWindowWdith(windowWidth)
}

// Attach the event listener to the window resize event
window.addEventListener('resize', handleResize);

// Call the function once to get the initial size
useEffect(()=>{
  handleResize();
},[])

    
  return (
    <Context.Provider value={[showSignup, setShowSignup, showLogin, setShowLogin, showFP, setShowFP, handleClose]}>
    <>
<div className='fixed h-fit p-0 top-0 left-0 bg-transparent w-full z-50'>
        {/* NAV BAR */}
<nav className=" bg-themeBlue relative w-full z-20 top-0 left-0  dark:border-gray-600">

<div className="px-3 md:px-10 flex  items-center justify-between mx-auto py-5">

<div className='flex items-center justify-evenly'>
{/* Dropdown button for mobile view  */}
<img onClick={()=>{navigate("/")}} src={Logo} className="h-9 md:h-6 lg:h-8 mr-11 hidden md:block cursor-pointer" alt="Logo"/>
<button className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden ">
{/* <span className="sr-only">Open main menu</span>
<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
</svg> */}
<input onChange={()=>{handleMenu()}} hidden className="check-icon" id="check-icon" name="check-icon" type="checkbox"/>
            <label className="icon-menu" htmlFor="check-icon">
                <div className="bar bar--1"></div>
                <div className="bar bar--2"></div>
                <div className="bar bar--3"></div>
            </label>
</button>



 {/* Components Button */}
  <div className={`items-center justify-between  w-screen transition ease-in-out hidden top-14 md:relative md:top-0  md:flex md:w-auto md:order-1" id="navbar-sticky`}>
    <ul className="navbarLink flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-themeBlue md:dark:bg-themeBlue dark:border-gray-700">
      <li>
        <Link to="explore"  className="explore block py-2 pl-3 pr-4 md:text-sm lg:text-md">Explore</Link>
      </li>
      <li>
        {/* <a href="#" className="categories block py-2 pl-3 pr-4 md:text-sm lg:text-md">Categories</a> */}
      <div className="flex items-center mt-[0.17rem]">
      <div className="group inline-block relative">
        <button className=" text-white text-sm font-normal  px-2 rounded inline-flex items-center">Categories
        <ExpandMoreIcon />
        </button>
        <ul className="categoryDropdown absolute hidden text-gray-700 py-2 text-start px-2 rounded-md bg-white h-56 overflow-y-scroll overflow-x-hidden w-fit group-hover:block">
          {
            categories.map((category, index)=>{
              return (
            <li key={index} className="">
            <button onClick={()=>{navigate(`explore?${"category="+category.category_name}`);window.location.reload()}} className="  hover:bg-gray-400 py-2 px-4 font-normal text-sm  w-full block text-start whitespace-nowrap cursor-pointer">{category.category_name}</button>
          </li>
              )
            })
          }
          
          
        </ul>
      </div>
        </div>
      </li>
      <li>
        <a href="#" className="about block py-2 pl-3 pr-4 md:text-sm lg:text-md">About Us</a>
      </li>
      <li>
        <a href="#" className="contact block py-2 pl-3 pr-4 md:text-sm lg:text-md">Contact</a>
      </li>
    </ul>
  </div>
  </div>
  
  {/* Logo */}
  <img src={Logo} className="h-5 sm:h-9 md:h-12 block md:hidden  " alt="Logo"/>
  
  <div className="flex md:order-2 ">
    {/* Condition to show login and join button if logged out and show profile if Logged in */}
    {
      userInfo != null && isLoggedIn ?
      (
        <div className='flex items-center justify-evenly space-x-2 sm:space-x-5 mr-4'>
          {/* chat */}
          <Link to="chat">
          <ForumRoundedIcon fontSize={windowWidth >= 400 ? 'medium' : 'small'} className='text-white'/>
          </Link>
          <NotificationsIcon fontSize={windowWidth >= 400 ? 'medium' : 'small'} className='text-white' />
          <div >
            {/* PROFILE IMAGE */}
          <img className='peer w-7 h-7 sm:w-8 sm:h-8 object-cover border-1 border-white  rounded-full' src={userInfo.profileImage} />
          {/* Dropdown Profile */}
          <div className="hidden absolute p-2 right-14 peer-hover:flex hover:flex w-fit rounded-md top-[3.3rem] delay-150 flex-col bg-white drop-shadow-lg overflow-hidden">
          <header className='flex border-b pb-2'>
          {/* Image container */}
          <div className=' flex items-center'>
          <img className='peer w-9 h-9 max-h-9 object-cover border-1 border-white  rounded-full' src={userInfo.profileImage} />
          </div>
          <div className='ml-1'>
          <h1 className='text-sm font-semibold'>{userInfo.username}</h1>
          <p className='text-xs text-gray-500'>{userInfo.email}</p>
          </div>
          
          </header>
          <Link to={`/myAccount/${"Profile"}`} className="px-1 py-3 hover:bg-gray-200 text-gray-700 text-sm flex items-center gap-2"><PersonIcon  />Profile Settings</Link>
          <Link to='/serviceRegistration' className="px-1 py-3 hover:bg-gray-200  text-gray-700 flex items-center gap-2 text-sm"><BusinessCenterOutlinedIcon /> Post a Service</Link>
          <Link to={`/serviceSettings/myService`} className="px-1 py-3 hover:bg-gray-200  text-gray-700 flex items-center gap-2 text-sm"><BusinessCenterOutlinedIcon /> Service Settings</Link>

          <footer className='px-1 text-red-500 border-t-1 pt-3'>
            <button onClick={()=>{signout()}} className='flex items-center gap-2'><ExitToAppOutlinedIcon />Sign out</button>
          </footer>
          </div>
          </div>
          
        </div>
      )
      :
      isLoggedIn == false ?
      (
      <div className='flex space-x-2'>
      <button onClick={()=>{setShowLogin(true);handleOpen()}} className='text-white border-2 px-4 py-1 rounded-md border-white'>Login</button>
      <button onClick={()=>{setShowSignup(true);handleOpen()}} className='text-white bg-themeOrange border-2 border-themeOrange px-6 py-1 rounded-md '>Join</button>
      </div>    
      ) 

      :
      (
        ""
      )
    }

</div>
</div>
</nav>
{/* Mobile Components Options */}
<div className={`${showMenu ? "relative" : "hidden"} h-[200px] relative md:hidden w-full pb-3 bg-transparent bg-black`}>
<ul className="navbarLink flex flex-col p-4 md:p-0 font-medium space-y-5  md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-themeBlue">
      <li>
        <Link to="/"  className="explore block py-2 pl-3 pr-4 md:text-sm lg:text-md">Home</Link>
      </li>
      
      <li>
        <Link to="explore"  className="explore block py-2 pl-3 pr-4 md:text-sm lg:text-md">Explore</Link>
      </li>
      <li>
        {/* <a href="#" className="categories block py-2 pl-3 pr-4 md:text-sm lg:text-md">Categories</a> */}
      <div className="flex items-center mt-[0.17rem]">
      <div className="group inline-block relative">
        <button className=" text-white text-md font-normal  rounded inline-flex items-center">Categories
        <ExpandMoreIcon />
        </button>
        <ul className="categoryDropdown absolute left-[6.2rem] top-1 hidden text-gray-700 py-2 text-start px-2 rounded-md bg-white h-56 overflow-y-scroll overflow-x-hidden w-fit group-hover:block">
          {
            categories.map((category, index)=>{
              return (
            <li key={index} className="">
            <button onClick={()=>{navigate(`explore?${"category="+category.category_name}`);window.location.reload()}} className="  hover:bg-gray-400 py-2 px-4 font-normal text-sm  w-full block text-start whitespace-nowrap cursor-pointer">{category.category_name}</button>
          </li>
              )
            })
          }
          
          
        </ul>
      </div>
        </div>
      </li>
      <li>
        <a href="#" className="about block py-2 pl-3 pr-4 md:text-sm lg:text-md">About Us</a>
      </li>
      <li>
        <a href="#" className="contact block py-2 pl-3 pr-4 md:text-sm lg:text-md">Contact</a>
      </li>
</ul>
</div>

<div>
    
    </div>
  
{/* Modal */}
<Modal open={open} onClose={handleClose} className='mt-20'> 
<Box sx={style} style={{height: "fitContent", width: "fitContent"}}> 
{
  showLogin ? <Login /> : showSignup ? <Register /> : showFP ? <ForgotPassword /> :""
}  
</Box>
</Modal>  
</div>
</>

</Context.Provider>

  )
}

export default Navbar