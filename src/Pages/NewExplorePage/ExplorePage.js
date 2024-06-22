import React, { useEffect, useState } from 'react'
import allServiceStore from '../../Stores/AllServiceStore'
import { UseServiceHook } from '../../ClientCustomHook/AllServiceContext'
import ExploreFilter from './ExploreFilter'
import ExploreSearchBar from './ExploreSearchBar'
import ExploreServiceList from './ExploreServiceList'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ExploreMobileFilter from './ExploreMobileFilter'

const ExplorePage = () => {
  const {services, setServices, staticServices, setStaticServices} = allServiceStore()
  const [searchValue, setSearchValue] = useState('')
  const {getServiceList} = UseServiceHook()
  const [loading, setLoading] = useState(true)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  useEffect(()=>{
    const getServices = async () => {
      const serviceList = await getServiceList()
      setServices(serviceList || [])
      setStaticServices(serviceList || [])
    }

    getServices()
  },[])

  useEffect(()=>{
    if(services !== null && services?.length !== 0)
    {
      setTimeout(()=>{
        setLoading(false)
      }, 200)
    }
  },[services])


  return (
    <main className='flex-1 overflow-auto flex flex-row bg-[#F9F9F9] relative'>
      {/* Mobile Filter backdrop */}
      <div onClick={()=>{setShowMobileFilter(false)}} style={{backgroundColor : 'rgba(0,0,0,0.6)'}} className={`w-full ${showMobileFilter ? '' : 'hidden'} h-full absolute  z-20`}>
        
      </div>
      {/* Filter Section */}
      <button onClick={()=>setShowMobileFilter(true)} className='absolute lg:hidden z-20 p-1 shadow-md bg-white rounded-md top-7 left-4'>
        <MenuOutlinedIcon fontSize='large' />
      </button>
      <div className={`absolute h-full z-20 ${showMobileFilter ? 'translate-x-[0%]' : '-translate-x-[100%]'} transition-all overflow-auto`}>
      <ExploreMobileFilter setShowMobileFilter={setShowMobileFilter} searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <ExploreFilter searchValue={searchValue} setSearchValue={setSearchValue} /> 
      {/* Right Section */}
      <div className='w-[100%] flex flex-col h-full overflow-auto pt-5 ps-2 xl:pe-20 pb-5 bg-[#f9f9f9]'>
        <ExploreSearchBar searchValue={searchValue} setSearchValue={setSearchValue}  />
        {
          loading ?
          <div className='w-full h-full flex flex-col items-start p-10 gap-5 justify-between animate-pulse'>
          <div className='flex w-full space-x-3'>
          <div className='w-[90px] h-[80px] semiSm:w-[150px] semiSm:h-[120px] md:w-[200px] md:h-[150px] rounded-md bg-gray-300'></div>
          <div className='w-full h-[80px] semiSm:h-[120px] md:h-[150px] justify-between flex flex-col'>
          <div className='w-[100%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[70%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[85%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[80%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          </div>
          </div>
          <div className='flex w-full space-x-3'>
          <div className='w-[90px] h-[80px] semiSm:w-[150px] semiSm:h-[120px] md:w-[200px] md:h-[150px] rounded-md bg-gray-300'></div>
          <div className='w-full h-[80px] semiSm:h-[120px] md:h-[150px] justify-between flex flex-col'>
          <div className='w-[100%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[70%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[85%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[80%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          </div>
          </div>
          <div className='flex w-full space-x-3'>
          <div className='w-[90px] h-[80px] semiSm:w-[150px] semiSm:h-[120px] md:w-[200px] md:h-[150px] rounded-md bg-gray-300'></div>
          <div className='w-full h-[80px] semiSm:h-[120px] md:h-[150px] justify-between flex flex-col'>
          <div className='w-[100%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[70%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[85%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          <div className='w-[80%] h-[10px] semiSm:h-[20px] rounded-full bg-gray-300'></div>
          </div>
          </div>
          
          </div>
          :
          services.length === 0 ?
          <div className='flex-1 flex justify-center items-center'>
            <h1 className='text-3xl text-gray-500'>No result</h1>
          </div>
          :
          <ExploreServiceList services={services} />
        }
      </div>
    </main>
  )
}

export default ExplorePage