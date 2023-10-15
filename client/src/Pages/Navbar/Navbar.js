import React from 'react'
import { useState, createContext, useContext, useEffect} from 'react'
import ForgotPassword from '../ForgotPasswordPage/ForgotPassword'
import Login from '../LoginPage/Login'
import Register from '../RegisterPage/Register'
import Logo from "./Utlis/LogoWhite.png"
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import jwtDecode from 'jwt-decode'
export const Context = React.createContext()

const Navbar = () => {
 

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

    // Get and decode JWT
    useEffect(() => {
      const token = localStorage.getItem("token")
      if(token){
        setUserInfo(jwtDecode(token))
      }else{
        console.log("Not Logged IN")
      }
    }, [])
    

    

  return (
    <Context.Provider value={[showSignup, setShowSignup, showLogin, setShowLogin, showFP, setShowFP, handleClose]}>
    <>
<div className='relative'>
        {/* NAV BAR */}
<nav className=" bg-themeBlue fixed w-full z-20 top-0 left-0  dark:border-gray-600">
<div className="px-1 md:px-10 flex  items-center justify-between mx-auto py-2">

<div className='flex items-center justify-evenly'>
    {/* Dropdown button for mobile view  */}
    <img src={Logo} className="h-9 md:h-12 mr-11 hidden md:block brightness-0 invert" alt="Logo"/>
<button  onClick={()=>{handleMenu()}} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 ">
<span className="sr-only">Open main menu</span>
<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
</svg>
</button>




  </div>

  <img src={Logo} className="h-9 md:h-12 block md:hidden  brightness-0 invert" alt="Logo"/>
  {/* Profile */}
  <div className="flex md:order-2 ">
    {/* Condition to show login and join button if logged out and show profile if Logged in */}
    {
      userInfo != null ?
      (
        <div className='flex items-center justify-evenly space-x-2 md:space-x-5 mr-4'>
          <ForumRoundedIcon fontSize='small' className='text-white'/>
          <NotificationsIcon fontSize='small' className='text-white' />
          <img className=' md:w-8 w-7  border-1 border-white  rounded-full' src={userInfo.profileImage} />
        </div>
      )
      :
      (
      <div className='flex space-x-2'>
      <button onClick={()=>{setShowLogin(true);handleOpen()}} className='text-white border-2 px-4 py-1 rounded-md border-white'>Login</button>
      <button onClick={()=>{setShowSignup(true);handleOpen()}} className='text-white bg-themeOrange border-2 border-themeOrange px-6 py-1 rounded-md '>Join</button>
      </div>    
      ) 
    }

</div>
</div>
 {/* Components Button */}
 <div className={`components_menu items-center justify-between  w-[95vw] transition ease-in-out  ${showMenu ? "absolute" : "hidden"} top-11 left-3.5 md:relative md:top-0  md:flex md:w-auto md:order-1" id="navbar-sticky `}>
    <ul className="navbarLink flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-themeBlue md:dark:bg-themeBlue dark:border-gray-700">
      <li>
        <a href="#" className="explore block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Explore</a>
      </li>
      <li>
        <a href="#" className="categories block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Categories</a>
      </li>
      <li>
        <a href="#" className="about block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About Us</a>
      </li>
      <li>
        <a href="#" className="contact block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div>
</nav>
  
{/* Modal */}
<Modal open={open} onClose={handleClose}> 
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