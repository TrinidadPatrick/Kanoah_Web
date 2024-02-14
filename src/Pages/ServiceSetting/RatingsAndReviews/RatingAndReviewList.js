import React, { useEffect, useState } from 'react'
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import UseRatings from '../../../ClientCustomHook/OwnerRatingsProvider';
import http from '../../../http';

const RatingAndReviewList = ({ratingList, dateSelected}) => {
    const [ratings, setRatings] = useState([])
    const [selectedRating, setSelectedRating] = useState([])
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
        ratingList !== null && setRatings(ratingList)
    },[ratingList])

    const handleReadMore = (id) => {
        const newData = [...selectedRating]
        newData.push(id)
        setSelectedRating(newData)
    }
    const handleReadLess = (id, index) => {
        const newData = [...selectedRating]
        newData.splice(index, 1)
        setSelectedRating(newData)
    }

    const removeRating = async (ratingId) => {
        const newRating = [...ratings]
        const index = newRating.findIndex((rating) => rating._id === ratingId)
        ratings[index].status = "Removed"
        setRatings(newRating)
        try {
            const result = await http.patch(`removeRating/${ratingId}`, "", {withCredentials : true})
        } catch (error) {
            console.error(error)
        }
    }
    const restoreRating = async (ratingId) => {
        const newRating = [...ratings]
        const index = newRating.findIndex((rating) => rating._id === ratingId)
        ratings[index].status = "Active"
        setRatings(newRating)
        try {
            const result = await http.patch(`restoreRating/${ratingId}`, "", {withCredentials : true})
        } catch (error) {
            console.error(error)
        }
    }


  return (
    <main className='xl:w-[100%] bg-gray-100 h-full p-2 gap-3 flex flex-col rounded-lg overflow-auto '>
        <div className={`w-full h-full ${ratingList?.length === 0 ? "flex" : "hidden"} items-center justify-center`}>
        <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">No Results Found</h2>
        <p className="text-gray-500">Sorry, there are no results for your search.</p>
        </div>

        </div>
        {/* Loader */}
        <div className={`${ratingList === null ? "flex" : "hidden"} flex-col gap-3`}>
            <div className='w-full flex gap-3'>
            <div className='w-[70px] h-[70px] rounded-full flex-none bg-gray-400 animate-pulse'></div>
            <div className='flex flex-col w-full justify-between'>
            <div className='w-[60%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[70%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[55%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            </div>
            </div>
            <div className='flex flex-col w-full justify-between gap-4 mt-4'>
            <div className='w-[50%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[76%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[60%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            </div>
            <div className='w-full flex gap-3'>
            <div className='w-[70px] h-[70px] rounded-full flex-none bg-gray-400 animate-pulse'></div>
            <div className='flex flex-col w-full justify-between'>
            <div className='w-[60%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[70%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[55%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            </div>
            </div>
            <div className='flex flex-col w-full justify-between gap-4 mt-4'>
            <div className='w-[50%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[76%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            <div className='w-[60%] h-[15px] rounded-full bg-gray-400 animate-pulse'></div>
            </div>
        </div>
        {
        ratings?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((rating, index) => {
                const dateObject = new Date(rating.createdAt)
                const dateCreated = dateObject.toLocaleDateString('EN-US', {
                    month : "long",
                    day : "2-digit",
                    year : "numeric"
                })
                const review =  selectedRating?.includes(rating._id) ?
                                rating.review :
                                rating.review.slice(0, 150)
                return (
                    <div key={rating._id} className={`w-full ${rating.status === "Active" ? "bg-white" : "bg-gray-50"} rounded-md flex p-2 h-fit`}>
                        <div className='w-full flex flex-col gap-3 p-2'>
                        <div className='flex gap-2 h-fit w-[450px] max-w-[450px] overflow-hidden text-ellipsis'>
                            {/* Image container */}
                            <div className=' w-12 x:lw-16 aspect-square flex-none object-cover border rounded-full overflow-hidden'>
                            <img className=' object-cover w-full h-full' src={rating.user.profileImage} />
                            </div>
                            {/* Name and other Information */}
                            <div className='flex flex-col justify-center'>
                            <h2 className={`text-lg font-semibold ${rating.status === "Active" ? "text-gray-700 " : "text-gray-500"} whitespace-nowrap text-ellipsis`}>{rating.user.firstname + " " + rating.user.lastname}
                            <span className={`${rating.status === "Removed" ? "" : "hidden"} mx-2 text-sm text-red-500 font-medium`}>Removed</span>
                            </h2>
                            <p className='text-sm font-normal text-gray-500'>{dateCreated}</p>
                            </div>
                        </div>
                        {/* Service and Rating */}
                        <div className='w-full flex flex-col gap-3'>
                            <h2 className='text-gray-500 font-normal text-sm'>Service: <span className={`${rating.status === "Active" ? "text-gray-700 " : "text-gray-500"} font-normal`}>{rating.booking?.service.selectedService}</span></h2>
                            <h2 className='text-gray-500 font-normal text-sm flex items-center'>Rating: <StyledRating className='relative'  readOnly defaultValue={rating.rating} precision={0.1} icon={<StarRoundedIcon fontSize='medium' />  } emptyIcon={<StarRoundedIcon fontSize='medium' className='text-gray-300' />} /></h2>
                            <h2 className='text-gray-500 font-normal text-sm flex items-start'>Review: 
                            <span className={`${rating.status === "Active" ? "text-gray-700 " : "text-gray-500"} text-sm flex items-start h-full font-normal ml-1`}>{review}
                            {
                                selectedRating?.includes(rating._id) ?
                                <button onClick={()=>handleReadLess(rating._id)} className="text-gray-500">...Read less</button> :
                                <button className={`${rating.review.length <= 150 ? "hidden" : ""} text-gray-500`} onClick={()=>handleReadMore(rating._id, index)} >...Read more</button>
                            }
                            </span>
                            
                            </h2>
                        </div>
                        {/* Likes dislikes and button */}
                        <div className='w-full flex items-center gap-10'>
                            <div className='border-0 w-fit flex items-center p-1 border-themeBlue rounded-full'>
                            <span className="icon-[iconamoon--like-fill] text-gray-400 text-lg"></span>
                            </div>
                            <div className='border-0 w-fit flex items-center justify-center p-1 border-red-500 rounded-full'>
                            <span className="icon-[iconamoon--like-fill] relative top-[1px] left-[1px] rotate-180 text-gray-400 text-lg"></span>
                            </div>
                            {
                                rating.status === "Active" ?
                                <button onClick={()=>{removeRating(rating._id)}} className='text-red-400 hover:text-red-500 text-sm'>Remove</button>
                                :
                                <button onClick={()=>{restoreRating(rating._id)}} className='text-gray-400 hover:text-gray-500 text-sm'>Restore</button>
                            }
                        </div>
                        </div>
                    </div>
                )
        })
        }
    </main>
  )
}

export default RatingAndReviewList