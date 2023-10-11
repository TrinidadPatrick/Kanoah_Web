import React from 'react'
import { useState } from 'react'
import Login from '../LoginPage/Login'
import Logo from "./Components/LogoWhite.png"
import CoverPhoto from '../MainPage/Components/business.jpg'
import CoverPhoto2 from '../MainPage/Components/business2.jpg'
import SearchIcon from '@mui/icons-material/Search';

const MainPage = () => {
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
  return (
    <div className='h-full w-full relative'>
      {/* Main Page Top Part */}
      <section className='w-full  h-screen  grid place-items-center bg-cover bg-center ' style={{backgroundImage : `url(${CoverPhoto2})`}}>
        
      
      <div className='w-4/5 md:w-1/2'>
      <h1 className='font-medium mb-4 text-3xl md:text-5xl text-center' style={{color: "#FFFFFF", textShadow: "1px 1px 5px black"}}>Search smarter find faster</h1>
      {/* Search field and search button */}
      <div className='p-1 relative flex'>
      <input type="text" placeholder='Search for service' className='text-white w-full text-md md:text-xl py-4 px-6 bg-themeBlue rounded-4xl border-2'/>
      <button className='absolute bg-white px-2.5 md:px-6 py-2.5 rounded-3xl top-[12px] md:top-[13.5px] flex space-x-2 right-3 md:right-4'><SearchIcon /> <span className='hidden md:block'>Search</span></button>
      </div>
      </div>
      
      </section>
      
{/* ************************************************************************************************ */}
      {/* Featured Categories */}
      <section className='w-full h-screen bg-white py-16 px-5 md:px-36'>
      {/* Main Container */}
  <div className='w-full '>
      {/* Header Container */}
      <div className='border-l-4 border-x-black pl-3'>
      <h1 className='text-4xl font-bold'>Featured Categories</h1>
      <p className='text-gray-500 font-medium'>Pick from our categories</p>
      </div>
      {/* Category Cards Container */}
      <div className='w-full grid grid-cols-2 lg:grid-cols-3 gap-2 h-fit border-2 px-1 py-5 mt-5'>
      <div className=" bg-black h-56">1</div>
      <div className=" bg-black h-56">1</div>
      <div className=" bg-black h-56">1</div>
      <div className=" bg-black h-56">1</div>
      <div className=" bg-black h-56">1</div>
      <div className=" bg-black h-56">1</div>
      </div>

  </div>
      </section>
    
    
    </div>
  )
}

export default MainPage