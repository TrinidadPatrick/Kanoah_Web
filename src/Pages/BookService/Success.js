import React from 'react'

const Success = ({handleCloseModal}) => {
  return (
    <div className='w-fit h-fit'>
      <div className=" p-8 rounded-md max-w-md w-full">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="green"
            className="w-16 h-16 mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for choosing our service.</p>
          <button
          onClick={()=>{handleCloseModal()}}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Success