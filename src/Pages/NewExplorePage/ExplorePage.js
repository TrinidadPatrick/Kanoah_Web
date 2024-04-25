import React, { useEffect } from 'react'
import allServiceStore from '../../Stores/AllServiceStore'
import { UseServiceHook } from '../../ClientCustomHook/AllServiceContext'
import ExploreFilter from './ExploreFilter'
import ExploreSearchBar from './ExploreSearchBar'
import ExploreServiceList from './ExploreServiceList'

const ExplorePage = () => {
  const {services, setServices} = allServiceStore()
  const {getServiceList} = UseServiceHook()

  useEffect(()=>{
    const getServices = async () => {
      const serviceList = await getServiceList()
      setServices(serviceList)
    }

    getServices()
  },[])

  return (
    <main className='flex-1 overflow-auto flex flex-row bg-[#F9F9F9]'>
      {/* Filter Section */}
      <ExploreFilter />
      {/* Right Section */}
      <div className='flex-1 py-5 flex-col overflow-auto'>
        <ExploreSearchBar />
        <ExploreServiceList services={services} />
      </div>
    </main>
  )
}

export default ExplorePage