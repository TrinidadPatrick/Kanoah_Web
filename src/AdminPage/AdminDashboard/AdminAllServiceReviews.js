import React, { useEffect, useState } from 'react'

const AdminAllServiceReviews = ({reviews}) => {
  const [allreviews, setAllReviews] = useState([])

  useEffect(()=>{
    if(reviews.length !== 0)
    {
      setAllReviews(reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)))
      return
    }
    else{
        setAllReviews([])
    }
  },[reviews])


  const DataBody = () => {
    return (
        allreviews?.map((review) => {
            const dateCreated = review.createdAt
            const createdAt = new Date(dateCreated).toLocaleDateString('EN-US', {
                month : 'short',
                day : '2-digit',
                year : 'numeric'
            })
            const timeCreated = new Date(dateCreated).toLocaleTimeString('EN-US', {
               hour12 : true
            })
            const timeArray = timeCreated.split(/:| /)
            timeArray.splice(2, 1)
            const createdAtTime = timeArray.join().replace(",", ":")
            return (
                <tr key={review._id}>
                    <td>
                        <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5`}>{review.service.basicInformation.ServiceTitle}</p>
                    </td>
                    <td>
                        <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5`}>{review.booking?.service.selectedService}</p>
                    </td>
                    <td>
                        <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5`}>{review.user.firstname + " " + review.user.lastname}</p>
                    </td>
                    <td>
                        <p className={`font-medium text-yellow-500 text-xs text-center py-2 px-5`}>{review.rating}</p>
                    </td>
                    <td>
                        <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5`}>{createdAt}</p>
                    </td>
                    <td>
                        <p className={`font-medium text-gray-600 text-xs text-start py-2 px-5`}>{createdAtTime}</p>
                    </td>

                </tr>
            )
        })
    )
   
}


  return (
        <div className='w-full h-full overflow-auto flex flex-col bg-white shadow-sm border rounded-md '>
        <div className='w-full py-2'>
        <h1 className='text-base md:text-base  text-gray-700 font-semibold px-5'>Recent Reviews</h1>
        </div>
        <div className='AdminBookingTable w-full h-full overflow-auto '>
        <table className='w-full '>
            
            <thead className='border-b-1 sticky top-0 bg-gray-100 shadow-sm'>
                <tr>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Service</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Option</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Client</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Rating</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5'>Date</p>
                    </th>
                    <th>
                        <p className='font-normal text-gray-500 text-sm text-start py-2 px-5 whitespace-nowrap'>Time</p>
                    </th>
                </tr>
            </thead>
            <tbody>
                <DataBody />
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default AdminAllServiceReviews