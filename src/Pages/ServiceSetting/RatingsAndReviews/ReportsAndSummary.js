import React, { useState } from 'react'
import Review_Icon from './Images/Review_Icon.png'
import Rating_Icon from './Images/Rating_Icon.png'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useEffect } from 'react'

const ReportsAndSummary = ({ratingList}) => {
    const [average, setAverage] = useState(null)
    const [ratingBreakdown, setRatingBreakDown] = useState({
        5 : {percentage : 0, count : 0},
        4 : {percentage : 0, count : 0},
        3 : {percentage : 0, count : 0},
        2 : {percentage : 0, count : 0},
        1 : {percentage : 0, count : 0},
    })

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
        if(ratingList)
        {
            const totalRatings = ratingList?.length
            const sumOfRatings = totalRatings > 0 ? ratingList.reduce((sum, rating) => sum + rating.rating, 0) : 0;
            const average = totalRatings === 0 ? 0 : sumOfRatings / totalRatings
            setAverage(average.toFixed(1))
        }
    },[ratingList])

    useEffect(()=>{
        const totalRatings = ratingList?.length

        Object.keys(ratingBreakdown).map((key) => {
            const keyAsNumber = Number(key);
            const ratingCount = ratingList?.filter((rating) => rating.rating === keyAsNumber).length;
            const percentage = ratingCount === 0 ? 0 : Number(((ratingCount / totalRatings) * 100).toFixed(1));
            setRatingBreakDown((prevRatingBreakdown) => ({
                ...prevRatingBreakdown,
                [key]: {
                    percentage: percentage,
                    count: ratingCount || 0 // Handle cases where ratingCount is falsy
                }
            }));
        });
       
    },[ratingList])

    
    
  return (
    <main className='xl:w-[70%] h-fit  grid grid-cols-1 semiSm:grid-cols-3 gap-3 bg-white'>
        {/* Total Reviews */}
        {/* <div className=' flex-col hidden semiSm:flex py-2 col-span-1 relative items-center justify-center border-r-1'>
            <h1 className='absolute top-2 text-base text-start w-full font-semibold text-gray-800 left-1'>Total Reviews</h1>
            <div className='flex relative items-center gap-7 mt-4 justify-center'>
            <div className='w-16 hidden sm:block aspect-square p-1 rounded-lg bg-gray-100 '>
                <img src={Review_Icon} alt="" />
            </div>
            <div className='flex flex-col justify-center items-center'>
                <h2 className='text-4xl font-medium text-gray-800'>{ratingList?.length}</h2>
                <h2 className='font-medium text-base'>Reviews</h2>
            </div>
            </div>
        </div> */}

        <div className='flex flex-col col-span-2 items-start gap-2 py-2 pr-4 justify-center'>
            <h1 className=' text-base w-full text-start font-semibold relative text-gray-800 left-7 md:left-1'>Average Rating</h1>
            <div className='flex w-full relative items-center gap-3 justify-center '>
            <div className='flex flex-col justify-center items-center'>
                <div className='bg-[#ffa534] px-8 py-2 rounded-sm'>
                <h2 className='text-3xl font-medium text-white'>{average}</h2>
                <p className='text-white text-sm'>out of 5</p>
                </div>
                <StyledRating className='relative'  readOnly defaultValue={Number(average)} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} />
            </div>
            <div className='w-full  h-full  flex flex-col justify-between ml-2'>
            <div className='w-full flex items-center gap-1 '>
                <p className='text-[0.8rem] hidden sm:block text-slate-400 whitespace-nowrap w-[100px]'>Excellent</p>
                <StarRoundedIcon  fontSize='small' className='text-[#ffa534]'/>
                <div className="w-full bg-gray-100 rounded-full h-[9px] dark:bg-gray-100">
                <div className={`bg-[#ffa534] h-[9px] rounded-full`} style={{width : `${ratingBreakdown["5"].percentage}%`}}></div>
                </div>
                <p className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["5"].count}</p>
            </div>
            <div className='w-full flex items-center gap-1'>
                <p className='text-[0.8rem] hidden sm:block text-slate-400 whitespace-nowrap w-[100px]'>Very Good</p>
                <StarRoundedIcon  fontSize='small' className='text-[#ffa534]'/>
                <div className="w-full bg-gray-100 rounded-full h-[9px] dark:bg-gray-100">
                <div className={`bg-[#ffa534] h-[9px] rounded-full`} style={{width : `${ratingBreakdown["4"].percentage}%`}}></div>
                </div>
                <p className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["4"].count}</p>
            </div>
            <div className='w-full flex items-center gap-1'>
                <p className='text-[0.8rem] hidden sm:block text-slate-400 whitespace-nowrap w-[100px]'>Average</p>
                <StarRoundedIcon  fontSize='small' className='text-[#ffa534]'/>
                <div className="w-full bg-gray-100 rounded-full h-[9px] dark:bg-gray-100">
                <div className={`bg-[#ffa534] h-[9px] rounded-full`} style={{width : `${ratingBreakdown["3"].percentage}%`}}></div>
                </div>
                <p className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["3"].count}</p>
            </div>
            <div className='w-full flex items-center gap-1'>
                <p className='text-[0.8rem] hidden sm:block text-slate-400 whitespace-nowrap w-[100px]'>Poor</p>
                <StarRoundedIcon  fontSize='small' className='text-[#ffa534]'/>
                <div className="w-full bg-gray-100 rounded-full h-[9px] dark:bg-gray-100">
                <div className={`bg-[#ffa534] h-[9px] rounded-full`} style={{width : `${ratingBreakdown["2"].percentage}%`}}></div>
                </div>
                <p className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["2"].count}</p>
            </div>
            <div className='w-full flex items-center gap-1'>
                <p className='text-[0.8rem] hidden sm:block text-slate-400 whitespace-nowrap w-[100px]'>Terrible</p>
                <StarRoundedIcon  fontSize='small' className='text-[#ffa534]'/>
                <div className="w-full bg-gray-100 rounded-full h-[9px] dark:bg-gray-100">
                <div className={`bg-[#ffa534] h-[9px] rounded-full`} style={{width : `${ratingBreakdown["1"].percentage}%`}}></div>
                </div>
                <p className='text-sm text-slate-400 whitespace-nowrap'>{ratingBreakdown["1"].count}</p>
            </div>
            </div>
            </div>
        </div>

    </main>
  )
}

export default ReportsAndSummary