import React from 'react'
import { useEffect, useState } from 'react'
import http from '../../../http'

const SummaryDetails = ({serviceInformation, dateSelected}) => {

    const [totalBookings, setTotalBookings] = useState({
        bookings : 0,
        percentIncrease : 0
    })
    const [totalReview, setTotalReview] = useState({
        reviews : 0,
        percentIncrease : 0
    })
    const [ratingAverage, setRatingAverage] = useState({
        average : 0,
        percentIncrease : 0
    })
    const [totalSales, setTotalSales] = useState({
        sales : 0,
        percentIncrease : 0
    })

    // Count total Bookings
    useEffect(()=>{
        const countBookings = async () => {
            try {
                const result = await http.get(`countBookings?service=${serviceInformation._id}&dateFilter=${dateSelected}`, {withCredentials : true})
                setTotalBookings({
                    bookings : result.data.thisMonth,
                    percentIncrease : result.data.percentIncrease
                })
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && countBookings()
    },[serviceInformation, dateSelected])

    // Count total Reviews
    useEffect(()=>{
        const countBookings = async () => {
            try {
                const result = await http.get(`countRatings?service=${serviceInformation._id}&dateFilter=${dateSelected}`, {withCredentials : true})
                setTotalReview({
                    reviews : result.data.thisMonth,
                    percentIncrease : result.data.percentIncrease
                })
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && countBookings()
    },[serviceInformation, dateSelected])

    // Get Rating Average
    useEffect(()=>{
        const getRatingAverage = async () => {
            try {
                const result = await http.get(`getRatingAverage?service=${serviceInformation._id}&dateFilter=${dateSelected}`, {withCredentials : true})
                setRatingAverage({
                    average : result.data.averageThisMonth,
                    percentIncrease : result.data.percentIncrease
                })
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && getRatingAverage()
    },[serviceInformation, dateSelected])

    // Get Total Sales
    useEffect(()=>{
        const getTotalSales = async () => {
            try {
                const result = await http.get(`getTotalSales?service=${serviceInformation._id}&dateFilter=${dateSelected}`, {withCredentials : true})
                setTotalSales({
                    sales : result.data.sales,
                    percentIncrease : result.data.percentIncrease
                })
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && getTotalSales()
    },[serviceInformation, dateSelected])



  return (
    <>
    <div className='border rounded-es-none sm:rounded-es-md lg:rounded-es-none rounded-ss-md lg:border-b-0 border-r-0 p-2 flex flex-col justify-between'>
    <h1 className='text-[0.8rem] semiMd:text-sm font-medium text-gray-800'>Bookings</h1>
        <div className='w-full flex items-center'>
            <h2 className='text-xl lg:text-2xl font-semibold text-gray-700'>{totalBookings.bookings}</h2>
        </div>
        <div className='w-full flex items-center'>
        <h2 className='text-[0.8rem] semiMd:text-sm whitespace-nowrap text-ellipsis overflow-hidden font-medium text-gray-500'>
            <span className={`${totalBookings.percentIncrease < 0 ? "text-red-500" : "text-green-500 before:content-['+'] "} rounded-sm text-semiSm`}>{totalBookings.percentIncrease}%</span> this month</h2>
        </div>
    </div>
    <div className='border rounded-se-md sm:rounded-se-none lg:rounded-se-none lg:border-b-0 py-2 px-5 flex flex-col justify-between'>
    <h1 className='text-[0.8rem] semiMd:text-sm font-medium text-gray-800'>Total Reviews</h1>
        <div className='w-full flex items-center'>
            <h2 className='text-xl lg:text-2xl font-semibold text-gray-700'>{totalReview.reviews}</h2>
        </div>
        <div className='w-full flex items-center'>
            <h2 className='text-[0.8rem] semiMd:text-sm whitespace-nowrap text-ellipsis overflow-hidden font-medium text-gray-500'>
            <span className={`${totalReview.percentIncrease < 0 ? "text-red-500" : "text-green-500 before:content-['+'] "} rounded-sm text-semiSm`}>{totalReview.percentIncrease}% </span> 
            this month</h2>
        </div>
    </div>
    <div className='border rounded-es-md sm:rounded-es-none lg:rounded-es-md border-t-0 sm:border-t-1 border-l-1 sm:border-l-0 lg:border-l-1 border-r-0 p-2 flex flex-col justify-between'>
    <h1 className='text-[0.8rem] semiMd:text-sm font-medium text-gray-800'>Rating Average</h1>
        <div className='w-full flex items-center'>
            <h2 className='text-xl lg:text-2xl font-semibold text-gray-700'>{ratingAverage.average}</h2>
        </div>
        <div className='w-full flex items-center'>
        <h2 className='text-[0.8rem] semiMd:text-sm whitespace-nowrap text-ellipsis overflow-hidden font-medium text-gray-500'>
            <span className={`${ratingAverage.percentIncrease < 0 ? "text-red-500" : "text-green-500 before:content-['+'] "} rounded-sm text-semiSm`}>{ratingAverage.percentIncrease}%</span> this month</h2>
        </div>
    </div>
    <div className='border rounded-ee-md  rounded-se-none sm:rounded-se-md lg:rounded-se-none sm:rounded-ee-md lg:rounded-ee-none border-t-0 sm:border-t-1 p-2 flex flex-col justify-between'>
    <h1 className='text-[0.8rem] semiMd:text-sm font-medium text-gray-800'>Total Sales</h1>
        <div className='w-full flex items-center'>
            <h2 className='text-xl lg:text-2xl font-semibold text-gray-700'>{totalSales.sales}</h2>
        </div>
        <div className='w-full flex items-center'>
        <h2 className='text-[0.8rem] semiMd:text-sm whitespace-nowrap text-ellipsis overflow-hidden font-medium text-gray-500'>
            <span className={`${totalSales.percentIncrease < 0 ? "text-red-500" : "text-green-500 before:content-['+'] "} rounded-sm text-semiSm`}>{totalSales.percentIncrease}%</span> this month</h2>
        </div>
    </div>

    </>
  )
}

export default SummaryDetails