import React from 'react'
import { useState, useEffect } from 'react'
import { services } from './Services'
import './style.css'

const BookService = () => {
    // console.log(services)
  return (
    <main className='w-full h-full bg-[#f9f9f9] flex justify-center items-center'>

        {/* Step 1 */}
        <section id='step1' className='w-[400px] h-[500px] border flex flex-col space-y-4 p-3 rounded-md shadow-md bg-white'>
            {/* Title */}
            <div className='w-full h-full flex flex-col p-1 space-y-3'>
                <div>
                <h1 className='text-2xl font-bold text-gray-800'>Book Service</h1>
                <h3 className='text-semiXs font-medium text-gray-500'>R & Next Carwash</h3>
                </div>        

            {/* Choose service */}
            <div className='flex flex-col space-y-3 border rounded-md p-3 '>
                <p className='text-xs text-gray-500'>Choose service to book</p>

                {/* Service List */}
                <div className='booking_ServiceList grid grid-cols-3 gap-2 max-h-[210px] overflow-y-auto'>
                    {
                        services.map((service, index)=>{
                            return (
                                <div className='border h-[100px] grid place-items-center p-3'>
                                    <p className='text-xs text-gray-700 font-semibold text-center'>{service.name}</p>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
            {/* Variant List */}
            <div className='w-full h-full border rounded-md'>

            </div>
            </div>

            
        </section>

    </main>
  )
}

export default BookService