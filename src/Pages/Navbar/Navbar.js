import React from 'react'
import { useState, useEffect,} from 'react'
import ForgotPassword from '../ForgotPasswordPage/ForgotPassword'
import Login from '../LoginPage/Login'
import Register from '../RegisterPage/Register'
import Logo from "../../Utilities/Logo/Logo1.png"
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { useNavigate } from 'react-router-dom'
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import { categories } from '../MainPage/Components/Categories'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OutsideClickHandler from 'react-outside-click-handler';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import http from '../../http'
import { useDispatch, useSelector } from 'react-redux';
import {selectShowLoginModal, setShowLoginModal } from '../../ReduxTK/userSlice';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import UseInfo from '../../ClientCustomHook/UseInfo'
import {io} from 'socket.io-client'
import { selectNewMessage} from '../../ReduxTK/chatSlice'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import ChatProvider from '../../ClientCustomHook/ChatProvider'
import UseNotif from '../../ClientCustomHook/NotificationProvider'
import Book_Icon from '../MainPage/Components/UtilImage/Book_Icon4.png'
import Flag from '../MainPage/Components/UtilImage/Flag.png'
import Rating_Icon from '../MainPage/Components/UtilImage/Rating_Icon.png'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
export const Context = React.createContext()



const Navbar = ({ onAboutUsClick }) => {
  const [newNotification, setnewNotification] = useState(false)
  const {authenticated, userInformation} = UseInfo()
  const [windowWidth, setWindowWdith] = useState(null)
  const dispatch = useDispatch();
  const newMessage = useSelector(selectNewMessage);
  const showLoginModal = useSelector(selectShowLoginModal);
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const [hasRegisteredService, setHasRegisteredService] = useState(null);
  const [showMenu, setShowMenu] = useState(false)
  const [showDropdownProfile, setShowDropDownProfile] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showFP, setShowFP] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [socket, setSocket] = useState(null)
  const [openNotif, setOpenNotif] = useState(false)
  const [notifCount, setNotifCount] = useState(null)

  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
  if (reason !== 'backdropClick') {
    setOpen(false)
        dispatch(setShowLoginModal(false))
      }
    } 

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

    const signout = () => {
      http.get('userLogout', {withCredentials : true}).then((res)=>{
        console.log(res.data)
        if(res.status === 200)
        {
          window.location.reload()
        }
      }).catch((error)=>{
        alert(error)
      })
     
    }

    // Function to handle window resize
    function handleResize() {
  const windowWidth = window.innerWidth;

  // Update your code or perform actions based on the new size
  setWindowWdith(windowWidth)
    }

    // Check if the user has a service registered
    const checkUserService = async () => {
      try {
        const result = await http.get(`getService/${userInformation._id}`,{
          withCredentials : true
        })
        if(result.data.result === null)
        {
          setHasRegisteredService(false)
        }
        else
        {
          setHasRegisteredService(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    // Attach the event listener to the window resize event
    window.addEventListener('resize', handleResize);

    // Call the function once to get the initial size
    useEffect(()=>{
    handleResize();
    },[])

    useEffect(()=>{
      if(showLoginModal)
      {
        setShowLogin(true)
        setOpen(true)
      }
    },[showLoginModal])

    // initiate socket
    useEffect(()=>{
      // setSocket(io("http://localhost:5000"))
      setSocket(io("https://kanoah.onrender.com"))
      
    },[])

    useEffect(()=>{
      if(authenticated)
      {
        checkUserService()
      }
    },[authenticated])

    // console.log(notifications)

  return (
    <Context.Provider value={[showSignup, setShowSignup, showLogin, setShowLogin, showFP, setShowFP, handleClose]}>
    <>
  <div className='fixed h-fit p-0 top-0 left-0 bg-transparent w-full z-50'>
          {/* NAV BAR */}
  <ChatProvider setnewNotification={setnewNotification} socket={socket} />
  <nav className=" bg-themeBlue relative w-full z-20 top-0 left-0  dark:border-gray-600">
  <div className="px-3 md:px-10 flex  items-center justify-between mx-auto py-5">
  <div className='flex items-center justify-evenly'>
  {/* Dropdown button for mobile view  */}
  <img onClick={()=>{navigate("/")}} src={Logo} className="h-9 md:h-6 lg:h-8 mr-11 hidden md:block cursor-pointer" alt="Logo"/>
  <button className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden ">
  <input onChange={()=>{handleMenu()}} hidden className="check-icon" id="check-icon" name="check-icon" type="checkbox"/>
        <label className="icon-menu" htmlFor="check-icon">
        <div className="bar bar--1"></div>
        <div className="bar bar--2"></div>
        <div className="bar bar--3"></div>
        </label>
  </button>



  {/* Components like home, category Button */}
  <div className="items-center justify-between w-screen transition ease-in-out hidden top-14 md:relative md:top-0 md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="navbarLink flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-themeBlue dark:bg-themeBlue md:dark:bg-themeBlue dark:border-gray-700">
      <li>
        <Link to="explore" className="explore block py-2 pl-3 pr-4 md:text-[0.8rem] lg:text-md">Explore</Link>
      </li>
      <li>
        {/* <a href="#" className="categories block py-2 pl-3 pr-4 md:text-sm lg:text-md">Categories</a> */}
        <div className="flex items-center mt-[0.05rem]">
          <div className="group inline-block relative">
            <button className="text-white md:text-[0.8rem] lg:text-md font-normal px-2 rounded inline-flex items-center">
              Categories
              <ExpandMoreIcon fontSize='small' />
            </button>
            <ul className="categoryDropdown absolute hidden text-gray-700 py-2 text-start px-2 rounded-md bg-white h-56 overflow-y-scroll overflow-x-hidden w-fit group-hover:block">
              {categories.map((category, index) => (
                <li key={index} className="">
                  <button onClick={() => {navigate(`explore?${"category=" + category.category_name}&page=1`); window.location.reload() }} className="hover:bg-gray-400 py-2 px-4 font-normal text-sm w-full block text-start whitespace-nowrap cursor-pointer">{category.category_name}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </li>
      <li>
        <a onClick={()=>{onAboutUsClick();navigate("/")}} className="about block py-2 pl-3 pr-4 md:text-[0.8rem] lg:text-md cursor-pointer">About Us</a>
      </li>
      <li>
        <a href="#" className="contact block py-2 pl-3 pr-4 md:text-[0.8rem] lg:text-md lg:text-md">Contact</a>
      </li>
    </ul>
  </div>


  </div>
  
  {/* Logo */}
  <img src={Logo} className="h-5 sm:h-9 md:h-12 block md:hidden  " alt="Logo"/>
  {/* Profile dropdown Menu**************************************************************************************************** */}
  <div className="flex md:order-2">
  {/* Condition to show login and join button if logged out and show profile if Logged in */}
  {
  authenticated ? (
    <div className='flex items-center justify-evenly space-x-2 sm:space-x-5 mr-4'>
      {/* Chat */}
      <Link to="chat">
        <div className='relative flex items-center justify-center aspect-square p-0.5 w-7 h-7 md:w-8 md:h-8 bg-[#e2e1e15f] rounded-full'>
          <div className={`w-3.5 h-3.5 ${newMessage ? 'block' : 'hidden'} rounded-full flex items-center justify-center bg-red-500 -top-1 absolute -right-1`}>
          <PriorityHighOutlinedIcon fontSize='small' className='p-1 text-white' />
          </div>
          {/* <span className="icon-[ic--baseline-wechat] text-white text-2xl lg:text-3xl"></span> */}
          <span className="icon-[f7--chat-bubble-fill] text-white text-lg md:text-xl"></span>
        </div>
        
      </Link>
      {/* Notification */}
      <div className='relative flex items-center justify-center aspect-square p-0.5 w-7 h-7 md:w-8 md:h-8 bg-[#e2e1e15f] rounded-full'>
        <OutsideClickHandler onOutsideClick={()=>setOpenNotif(false)}>
        <NotificationsIcon onClick={()=>setOpenNotif(!openNotif)} fontSize={windowWidth >= 400 ? 'medium' : 'medium'} className={`${openNotif ? 'text-blue-400' : 'text-gray-50'} bottom-[1px] relative p-0.5 lg:p-0 cursor-pointer`} />
        {/* Notification Count */}
        <div className={`w-3 h-3 ${notifCount >= 1 ? 'block' : 'hidden'} rounded-full bg-red-500 -top-1 flex items-center justify-center absolute p-2 -right-1`}>
        <span className='text-white text-xs'>{notifCount}</span>
        </div>
        <NotificationContent setNotifCount={setNotifCount} openNotif={openNotif} setOpenNotif={setOpenNotif} newNotification={newNotification} />
        </OutsideClickHandler>
      </div>
      <div className='relative'>
        {/* PROFILE IMAGE */}
        <OutsideClickHandler onOutsideClick={() => {setShowDropDownProfile(false)}}>
        <div onClick={()=>{setShowDropDownProfile(!showDropdownProfile)}} className='flex items-center cursor-pointer'>
        <img  className=' w-7 h-7 sm:w-8 sm:h-8 object-cover border-1 border-white rounded-full' src={userInformation?.profileImage} alt="User Profile" />
        <ArrowDropDownOutlinedIcon fontSize='small' className='text-white bottom-0 right-0' />
        </div>
        </OutsideClickHandler>
        {/* Dropdown Profile */}
        <div className={`${showDropdownProfile ? "block" : "hidden"} bg-white absolute p-2 right-4 delay-100 w-fit rounded-md top-[2.2rem] flex-col drop-shadow-lg overflow-hidden`}>
          <header className='flex border-b space-x-2 pb-2'>

            <div className='ml-1'>
              <h1 className='text-sm text-gray-700 font-medium'>{userInformation?.username}</h1>
              <p className='text-xs text-gray-500'>{userInformation?.email}</p>
            </div>
          </header>
          
          <Link onClick={()=>{setShowDropDownProfile(false)}} to={`/myAccount/Profile`} className="px-1 py-3 whitespace-nowrap hover:bg-gray-200 text-gray-700 text-sm font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M247.846-260.615q51-36.693 108.231-58.039Q413.308-340 480-340q66.692 0 123.923 21.346 57.231 21.346 108.231 58.039 39.615-41 63.731-96.847Q800-413.308 800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 66.692 24.115 122.538 24.116 55.847 63.731 96.847ZM480.023-460q-50.562 0-85.292-34.707Q360-529.415 360-579.977t34.707-85.292Q429.415-700 479.977-700t85.292 34.708Q600-630.585 600-580.023q0 50.562-34.708 85.292Q530.585-460 480.023-460ZM480-120q-75.308 0-141-28.038-65.692-28.039-114.308-76.654Q176.077-273.308 148.038-339 120-404.692 120-480t28.038-141q28.039-65.692 76.654-114.308Q273.308-783.923 339-811.962 404.692-840 480-840t141 28.038q65.692 28.039 114.308 76.654Q783.923-686.692 811.962-621 840-555.308 840-480t-28.038 141q-28.039 65.692-76.654 114.308Q686.692-176.077 621-148.038 555.308-120 480-120Zm0-40q55.308 0 108.846-19.346 53.539-19.346 92.539-52.962-39-31.307-90.231-49.5Q539.923-300 480-300q-59.923 0-111.538 17.808-51.616 17.807-89.847 49.884 39 33.616 92.539 52.962Q424.692-160 480-160Zm0-340q33.692 0 56.846-23.154Q560-546.308 560-580q0-33.692-23.154-56.846Q513.692-660 480-660q-33.692 0-56.846 23.154Q400-613.692 400-580q0 33.692 23.154 56.846Q446.308-500 480-500Zm0-80Zm0 350Z"/>
          </svg>
          My Profile
          </Link>
          {
            hasRegisteredService ?
            (
              <Link onClick={()=>{setShowDropDownProfile(false)}} to={`/serviceSettings/Dashboard`} className="px-1 py-3  whitespace-nowrap hover:bg-gray-200 text-gray-700 font-medium flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M176.923-740v-40h606.154v40H176.923ZM180-180v-240h-49.231v-40l46.154-200h606.154l46.154 200v40H780v240h-40v-240H540v240H180Zm40-40h280v-200H220v200Zm-48.769-240h617.538-617.538Zm0 0h617.538l-37.077-160H208.308l-37.077 160Z" />
              </svg>
              Service Settings
              </Link>
            )
            :
            (
              <Link onClick={()=>{setShowDropDownProfile(!showDropdownProfile)}} to='/serviceRegistration' className="px-1 py-3  whitespace-nowrap hover:bg-gray-200 font-medium text-gray-700 flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path d="M720-80v-120H600v-40h120v-120h40v120h120v40H760v120h-40ZM129.23-180v-240H80v-40l46.154-200h547.692L720-460v40h-49.231v130.769h-40V-420H449.231v240H129.23Zm40.001-40H409.23v-200H169.231v200Zm-48.769-240h559.076-559.076Zm5.692-280v-40h547.692v40H126.154Zm-5.692 280h559.076l-37.077-160H157.538l-37.076 160Z"/>
              </svg>
              Post a Service
              </Link>
            )
          }
          
          
          <footer className='px-1 text-red-500 border-t-1 pt-3'>
          {/* <FontAwesomeIcon icon="fa-light fa-user" /> */}
            <button onClick={() => { signout() }} className='flex items-center gap-2 text-sm'><ExitToAppOutlinedIcon fontSize='small' />Sign out</button>
          </footer>
        </div>
      </div>
    </div>
    ) 
    : 
    authenticated === false ? 
    (
    <div className='flex space-x-2'>
      <button onClick={() => { setShowLogin(true); handleOpen() }} className='text-white border-2 w-[60px]  lg:w-[80px] text-sm lg:text-[1.1rem] py-1 lg:py-1.5 rounded-md border-white'>Login</button>
      <button onClick={() => { setShowSignup(true); handleOpen() }} className='text-white bg-themeOrange border-2 border-themeOrange  w-[60px] text-sm lg:text-[1.1rem]  lg:w-[80px] py-1 lg:py-1.5 rounded-md'>Join</button>
    </div>
    ) : ("")}
  </div>

  </div>
  </nav>
  {/* Mobile Components Options */}
  <div className={`${showMenu ? "relative" : "hidden"} h-[200px] relative md:hidden w-full pb-3 bg-transparent bg-black`}>
  <ul className="navbarLink flex flex-col p-4 md:p-0 font-medium space-y-5  md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-themeBlue">
        <li>
          <Link onClick={()=>{handleMenu();document.getElementById('check-icon').checked = false}} to="/"  className="explore block py-2 pl-3 pr-4 md:text-sm lg:text-md">Home</Link>
        </li>
        
        <li>
          <Link onClick={()=>{handleMenu();document.getElementById('check-icon').checked = false}} to="explore"  className="explore block py-2 pl-3 pr-4 md:text-sm lg:text-md">Explore</Link>
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
          <a onClick={()=>{handleMenu();document.getElementById('check-icon').checked = false}} href="#" className="about block py-2 pl-3 pr-4 md:text-sm lg:text-md">About Us</a>
        </li>
        <li>
          <a onClick={()=>{handleMenu();document.getElementById('check-icon').checked = false}} href="#" className="contact block py-2 pl-3 pr-4 md:text-sm lg:text-md">Contact</a>
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

  const NotificationContent = ({openNotif, setOpenNotif, newNotification, setNotifCount}) => {
  const {authenticated} = UseInfo()
  const navigate = useNavigate()
  const {notifications, getNotifications, countUnreadNotifs} = UseNotif()
  const [openMoreOption, setOpenMoreOption] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [notificationList, setNotificationList] = useState(null)
  const [page, setPage] = useState(1);

  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ffa534',
      fontSize: "medium"
    },
    '& .MuiRating-iconHover': {
      color: '#ffa534',
      
    },
    '& .MuiRating-iconEmpty': {
      color: '#ffa534',
      fontSize: "large"
      
    },

  });

  useEffect(()=>{
    if(notifications !== null)
    {
      setNotificationList(notifications)
    }
  },[notifications])

  useEffect(()=>{
    if(newNotification)
    {
      getNotifications()
    }
  },[newNotification])

  useEffect(()=>{
    if(authenticated)
    {
      countNotifs()
    }
  },[newNotification, authenticated])
  
  const countNotifs = async () => {
    try {
      const counts = await countUnreadNotifs()
      setNotifCount(counts)
    } catch (error) {
      console.error(error)
    }
  }

  const markAsRead = async (notification_id, notif_to, notification_type) => {
    const newNotifications = [...notificationList]
    const index = newNotifications.findIndex((notif) => notif._id === notification_id)
    newNotifications[index].isRead = true
    setNotificationList(newNotifications)

    setOpenMoreOption(false)
    setSelectedIndex(null)
    setOpenNotif(false)
    navigate(notification_type === "New_Booking" ? "/serviceSettings/Bookings" : notification_type === "New_Rating" ? "/serviceSettings/Reviews" : "")
    try {
      const result = await http.patch('markAsRead',{notification_id, notif_to}, {withCredentials : true})
    } catch (error) {
      console.error(error)
    }
  }
  
  const MoreOptions = ({index}) => {
    return (
      <div className={`w-fit ${openMoreOption && index === selectedIndex ? "" : "hidden"} absolute z-20 h-fit flex flex-col justify-start bg-white right-6 shadow-md border rounded-md`}>
        <button className='px-2 py-1 text-sm'>Mark as read</button>
        <button className='px-2 py-1 text-sm'>Delete</button>
      </div>
    )
  }

  const markAllAsRead = async () => {
   const instance = [...notificationList]
    instance.map((notifs) => {
      notifs.isRead = true
    })
    setNotificationList(instance)

    try {
      const result = await http.patch('markAllAsRead',"",  {withCredentials : true})
      countNotifs()
    } catch (error) {
      console.error(error)
    }
  }

  const seeMore = async () => {
    const nextPage = page + 1

    try {
      const response = await http.get(`getNotifications?page=${nextPage}`, {withCredentials : true});
      setNotificationList([...notificationList, ...response.data]);
      setPage(nextPage);
    } catch (error) {
      console.error('Error loading more notifications:', error);
    }
  }



  return (
    <>
    {
      openNotif ? 
        <div onClick={()=>{setOpenMoreOption(false);setSelectedIndex(null)}} className='w-[350px] h-[500px] flex flex-col justify-between -translate-x-80 top-7 px-1 bg-white rounded-md border shadow-md absolute'>
        <div className='flex justify-between py-1 border-b-1'>
        <h1 className='font-bold text-base px-1 text-gray-800 '>Notifications</h1>
        <button onClick={()=>{markAllAsRead()}} className='text-xs text-gray-700 font-medium hover:text-gray-500'>Mark all as read</button>
        </div>
        <div className='h-full flex flex-col overflow-auto'>
        {
          notificationList?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((notification, index)=>{
            const date = new Date(notification.createdAt)
            const formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
          })
            return (

              <div key={notification._id} onClick={()=>{markAsRead(notification._id, notification.notif_to, notification.notification_type);}} className={`grid ${notification.isRead ? "" : "bg-[#dce4f951]"} cursor-pointer py-2  grid-cols-12 rounded-md my-1`}>
                <MoreOptions index={index} />
                {
                  notification.notification_type === "New_Rating" ? 
                  (
                    <>
                    <div className='row-span-3 col-span-2 flex justify-center items-start'>
                    <div className='w-[70%] aspect-square border-2 border-orange-500 bg-orange-100 flex justify-center items-center rounded-full p-1'>
                    <img className='object-cover' src={Rating_Icon} />
                    </div>
                    </div> 
                    <div className=' row-span-1 col-span-9 flex items-center justify-start gap-3 h-fit  font-medium text-gray-700'>
                    <p className='text-sm whitespace-nowrap'>{notification.content.subject}</p>
                    <span className={`w-2 h-2 ${notification.isRead ? "hidden" : ""} bg-blue-600 rounded-full`}></span>
                    </div>
                    <div onClick={(e)=>{e.stopPropagation();setOpenMoreOption(selectedIndex === index ? false : true);setSelectedIndex(selectedIndex === index ? null : index)}} className='relative cursor-pointer row-span-2 col-span-1 flex items-center justify-center '>
                        <MoreVertOutlinedIcon className={`${index === selectedIndex ? "text-gray-400" : "text-gray-700"} cursor-pointer hover:bg-gray-300 rounded-full`} />
                    </div>
                    <div className=' row-span-1 col-span-9 flex items-center '>
                      <p className='text-xs text-gray-500 whitespace-nowrap'>{formattedDate.replace('at', '|')}</p>
                    </div>
                    {/* Content */}
                    <div className='col-span-10 h-[100px] border border-[#dadada] rounded-md flex flex-col justify-between mr-1 mt-1 p-1'>
                      <div className='w-full flex items-center'>
                        <p className='text-[0.8rem] font-medium text-orange-500'>Service: </p>
                        <p className='px-1 text-gray-600 text-[0.8rem] font-medium'> {notification.content.service}</p>
                      </div>
                      <div className='w-full flex items-center'>
                        <p className='text-[0.8rem] font-medium text-orange-500'>Rating:</p>
                        <StyledRating readOnly className='relative left-[0.1rem]' defaultValue={notification.content.rating} precision={1} icon={<StarRoundedIcon fontSize='small' />  } emptyIcon={<StarRoundedIcon fontSize='small' className='text-gray-300' />} />
                      </div>
                      <div className='w-full flex items-start '>
                        <p className='text-[0.8rem] font-medium text-orange-500'>Review: </p>
                        <p className='px-1 line-clamp-2 text-gray-600 text-[0.8rem] font-medium'>{notification.content.review}</p>
                      </div>
                    </div>
                    </>
                  )
                  :
                  notification.notification_type === "New_Booking" ? 
                  <>
                  <div className='row-span-2 col-span-2 flex justify-center items-center'>
                  <div className='w-[70%] aspect-square border-2 border-[#2344bc] bg-sky-200 flex justify-center items-center rounded-full p-2'>
                    <img className='object-cover' src={Book_Icon} />
                  </div>
                </div> 
                
                <div className=' row-span-1 col-span-9 flex items-center justify-start gap-2  font-medium text-gray-700'>
                  <p className='text-sm whitespace-nowrap'>{notification.content}</p>
                  <span className={`w-2 h-2 ${notification.isRead ? "hidden" : ""} bg-red-600 rounded-full`}></span>
                </div>
                      <div onClick={(e)=>{e.stopPropagation();setOpenMoreOption(selectedIndex === index ? false : true);setSelectedIndex(selectedIndex === index ? null : index)}} className='relative cursor-pointer row-span-2 col-span-1 flex items-center justify-center '>
                        <MoreVertOutlinedIcon className={`${index === selectedIndex ? "text-gray-400" : "text-gray-700"} cursor-pointer hover:bg-gray-300 rounded-full`} />
                      </div>
                    <div className=' row-span-1 col-span-9 flex items-center '>
                  <p className='text-xs text-gray-500 whitespace-nowrap'>{formattedDate.replace('at', '|')}</p>
                </div>
                </>
                :
                 <>
                  <div className='row-span-2 col-span-2 flex justify-center items-start'>
                  <div className='w-[70%] aspect-square border-2  border-[#4c4c4c] bg-gray-100 flex justify-center items-center rounded-full p-2'>
                    <img className='object-contain w-full aspect-square brightness-50' src={Flag} />
                  </div>
                </div> 
                
                <div className=' row-span-1 col-span-9 flex flex-col items-center justify-start gap-2  font-medium text-gray-700'>
                  <p className='text-sm flex items-center gap-2 whitespace-nowrap text-start w-full'>{notification.content.title}
                  <span className={`w-2 h-2 ${notification.isRead ? "hidden" : ""} bg-red-600 rounded-full`}></span>
                  </p>
                  <p className='text-xs font-normal '>{notification.content.body}</p>
                </div>
                      <div onClick={(e)=>{e.stopPropagation();setOpenMoreOption(selectedIndex === index ? false : true);setSelectedIndex(selectedIndex === index ? null : index)}} className='relative cursor-pointer row-span-2 col-span-1 flex items-center justify-center '>
                        <MoreVertOutlinedIcon className={`${index === selectedIndex ? "text-gray-400" : "text-gray-700"} cursor-pointer hover:bg-gray-300 rounded-full`} />
                      </div>
                    <div className=' row-span-1 col-span-9 flex items-center '>
                  <p className='text-xs text-gray-500 whitespace-nowrap'>{formattedDate.replace('at', '|')}</p>
                </div>
                </>
                }
                
              </div>
            )
          })
        }
        </div>
        <div className=' border-t-1 w-full flex justify-center '>
        <button onClick={()=>seeMore()} className='  text-sm text-gray-600 py-1'>See More</button>
        </div>
      </div>
      :
      ""
    }
    </>
  )

}

export default Navbar