import React, { useEffect, useState } from 'react'
import http from '../../../http'
import UseRatings from '../../../ClientCustomHook/OwnerRatingsProvider'
import ReportsAndSummary from './ReportsAndSummary'
import RatingAndReviewList from './RatingAndReviewList'
import useService from '../../../ClientCustomHook/ServiceProvider'

const RatingsAndReviews = () => {
    // const {ratingList, getUserRatings} = UseRatings()
    const {serviceInformation} = useService()
    const [ratingList, setRatingList] = useState(null)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const dateNow = `${year}-${month}`;
    const [dateSelected, setDateSelected] = useState(dateNow)

    const getRatings = async () => {
      try {
        const result = await http.get(`getServiceRatingWithFilter?service=${serviceInformation._id}&dateFilter=${dateSelected}`, {withCredentials : true})
        setRatingList(result.data)
      } catch (error) {
        console.error(error)
      }
    }

    useEffect(()=>{
      
      if(serviceInformation !== null){
        getRatings()
      }
    },[serviceInformation, dateSelected])

  return (
    <main className='flex flex-col w-full bg-white px-5 mx-auto h-full pt-0 md:pt-2 pb-2 gap-3'>
        <header>
            {/* <h1 className='text-gray-800 font-semibold text-2xl'>Reviews and Ratings</h1> */}
        </header>
        <ReportsAndSummary ratingList={ratingList} />
        <hr className='xl:w-[70%] my-2 lg:my-1'></hr>
        {/* Month and year picker */}
        <div className=' w-full'>
          <input className='border rounded-sm px-1 py-1 border-gray text-gray-500 text-sm' type='month' onChange={(e)=>{setDateSelected(e.target.value);setRatingList(null)}} value={dateSelected} />
        </div>
        <RatingAndReviewList ratingList={ratingList} dateSelected={dateSelected} />
    </main>
  )
}

export default RatingsAndReviews