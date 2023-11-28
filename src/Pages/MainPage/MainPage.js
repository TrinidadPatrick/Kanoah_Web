import React, { useEffect } from 'react'
import { useState } from 'react'
import Login from '../LoginPage/Login'
import Logo from "./Components//UtilImage/LogoWhite.png"
import CoverPhoto from '../MainPage/Components//UtilImage/business.jpg'
import CoverPhoto2 from '../MainPage/Components/UtilImage/business2.jpg'
import SearchIcon from '@mui/icons-material/Search';
import TurnedInRoundedIcon from '@mui/icons-material/TurnedInRounded';
import { categories } from './Components/Categories'
import Tag from '../MainPage/Components/CategoryImage/Tag.png'
import TopRatedServices from './TopRatedServices'
import RecentServices from './RecentServices'
import HowItWorks from './HowItWorks'
import Footer from './Footer'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import http from '../../http'
import { services } from './Components/Services/Services'
import { useParams } from 'react-router-dom'

const MainPage = () => {

  const navigate = useNavigate()
  const [searchInput,setSearchInput] = useState('')
    const [trendingServices, setTrendingServices] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    // Handles the showing oh menu on small screens
    const handleMenu = () => {
        if(showMenu){
            setShowMenu(false)
        }else{
            setShowMenu(true)
        }
    }

    useEffect(()=>{
      http.get('getUsers').then((res)=>{
        // console.log(res.data)
      }).catch((err)=>{
        console.log(err)
      })
    },[])


  return (
    <div className='h-full w-full relative'>
      {/* Main Page Top Part */}
      <section className='w-full  h-screen  grid place-items-center bg-cover bg-center ' style={{backgroundImage : `url(${CoverPhoto2})`}}>
        
      
      <div className='w-4/5 md:w-1/2'>
      <h1 className='font-medium mb-4 text-3xl md:text-5xl text-center' style={{color: "#FFFFFF", textShadow: "1px 1px 5px black"}}>Search smarter find faster</h1>
      {/* Search field and search button */}
      <div className='p-1 relative flex'>
        {/* Search Field */}
      <input onKeyDown={(e)=>{if(e.key === "Enter"){navigate(`explore?search=${e.target.value}`)}}} type="text" placeholder='Search for service' className='text-white w-full text-md md:text-xl py-4 px-6 bg-themeBlue rounded-4xl border-2'/>
      <button className='absolute bg-white px-2.5 md:px-6 py-2.5 rounded-3xl top-[12px] md:top-[13.5px] flex space-x-2 right-3 md:right-3'><SearchIcon /> <span className='hidden md:block'>Search</span></button>
      </div>
      </div>
      
      </section>
      
{/* ************************************************************************************************ */}
      {/* FEATURED CATEGORIES */}
      <section className='w-full h-fit bg-[#f9f9f9] py-16 px-5 md:px-20 lg:px-16 xl:px-32'>
      {/* Main Container */}
  <div className='w-full '>
      {/* Header Container */}
      <div className='border-l-4 border-x-themeGray pl-3'>
      <h1 className='text-3xl md:text-4xl text-themeGray font-bold'>Featured Categories</h1>
      <p className='text-gray-500 font-medium'>Pick from our categories</p>
      </div>
      {/* Category Cards Container */}
      <div className='w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-10  h-fit  px-1 py-5 mt-5'>
      {
        categories.filter(category => category.featured == true).map((category, index)=>{
          return (
          <div onClick={()=>{navigate(`explore?${"category="+category.category_name}`)}} key={index} className="categoryContainerBox cursor-pointer origin-center w-full xl:w-full hover:shadow-2xl relative rounded-lg saturate-100 brightness-90 border-2 border-white h-80 sm:h-44 md:h-56 xl:h-64 " style={{backgroundImage : `url(${category.category_image})`,backgroundSize: "cover",boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px"}}>
          <div className='absolute top-3 w-31 py-0 h-9  -right-[1px] pl-6 pr-4 flex items-center ' style={{backgroundImage : `url(${Tag})`,backgroundSize: "100% 35.9px",backgroundRepeat : "no-repeat"}}>
          {/* <img className='w-full h-full brightness-75' src={Tag} alt="tag" /> */}
          <p className='font-medium relative -top-[0.4px] text-gray-500'>{category.category_name}</p>
          </div> 
          <div className='absolute flex items-center w-full h-full rounded-md  hover:translate-y-0 bg-black opacity-0 hover:opacity-40 hover:rounded-md ease-in duration-200'></div>
          
          </div> 
          )})}   
  </div>
  </div>
  </section>
    
    {/* TOP RATED SERVICES */}
    <section className='top_rated_service w-full h-screen bg-[#F9F9F9] py-[1rem] sm:px-0 md:px-16 lg:px-16'>
    <TopRatedServices />
    </section>

    {/* RECENT SERVICES */}
    <section className='top_rated_service w-full h-screen bg-[#F9F9F9] py-[1rem] sm:px-0 md:px-16 lg:px-16'>
    <RecentServices />
    </section>

     {/* How it works */}
     <section className='top_rated_service w-full h-fit lg:h-fit pb-20 bg-gray-100 py-[1rem] sm:px-10 md:px-16 lg:px-36' >
    <HowItWorks />
    </section>

    {/* Footer */}
    <section className='top_rated_service w-full pb-10 bg-[#071B22] py-[1rem] sm:px-10 md:px-16 lg:px-36' >
    <Footer />
    </section>

    
    
    </div>
  )
}

export default MainPage