import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import http from '../../http'
import './style.css'
import { selectService, selectSchedule, selectPayment, setService } from '../../ReduxTK/BookingSlice'

const ServiceSelect = ({handleStep, serviceInfo}) => {
    const [step, setStep] = useState(1)
    const dispatch = useDispatch()
    const serviceContext = useSelector(selectService)
    const [error, setError] = useState(false)
    const [selectedService, setSelectedService] = useState('') //this has a value of unique ID
    const [selectedVariant, setSelectedVariant] = useState({}) //this has a value of unique ID
    const [duration, setDuration] = useState(null)
    const [variants, setVariants] = useState([])
    const [price, setPrice] = useState('')
    

    const handleSelectService = (service) => {
        if(service.origPrice === "" && service.variants.length !== 0)
        {   
            
            const variantList = service.variants
            setSelectedService(service.name)
            setSelectedVariant("")
            setVariants(variantList)
            return
        }
        setSelectedService(service.name)
        setPrice(service.origPrice)
        setDuration(Number(service.duration))
        return
       
    }

    const handleSelectVariant = (variant) => {
        setSelectedVariant(variant)
        setPrice(variant.price)
        setDuration(Number(variant.duration))
    }

    const submitServiceContext = () => {
        const data = {
            selectedService,
            selectedVariant,
            price,
            duration
        }
        if(selectService === "" || price === "")
        {
            setError(true)
            return
        }
        dispatch(setService(data))
        handleStep(2)
        
    }

    useEffect(()=>{
        if(serviceContext !== null)
        {   
            const variants = serviceInfo?.serviceOffers.find((service) => service.name === serviceContext.selectedService).variants
            setVariants(variants)
            setSelectedService(serviceContext.selectedService)
            setSelectedVariant(serviceContext.selectedVariant)
            setPrice(serviceContext.price)
        }
    },[])


  return (
    <section id='step1' className='w-[600px] h-fit flex flex-col space-y-4 p-3 rounded-md shadow-md bg-white'>
            {/* Title */}
            <div className='w-full h-full flex flex-col p-1 space-y-3'>
                      

            {/* Choose service */}
            <div className='flex flex-col space-y-3  p-1 mt-4 '>
            
                <p className='text-xs text-gray-500 '>Choose service to book</p>
                <p className={`${error ? "" : "hidden"} text-semiSm text-red-500`}>Please select an option first</p>
                {/* Service List */}
            <div className='booking_ServiceList  grid grid-cols-3 gap-2 max-h-[210px] overflow-y-auto'>
                    {
                        serviceInfo?.serviceOffers.map((service, index)=>{
                            return (
                                <div onClick={()=>handleSelectService(service)} key={index} className={`${service.name === selectedService ? "border-2 border-themeOrange" : ""} border rounded-md cursor-pointer h-[100px] grid place-items-center p-3`}>
                                    <p className='text-xs text-gray-700 font-semibold text-center'>{service.name}</p>
                                    {
                                        service.variants.length !== 0 ?
                                    <p className='text-xs text-gray-700 font-semibold text-center'>{service.variants[0].price + " - " + service.variants[service.variants.length - 1].price}</p>
                                    :
                                    <p className='text-xs text-gray-700 font-semibold text-center'>{service.origPrice}</p>
                                    
                                    }
                                </div>
                            )
                        })
                    }
            
            </div>
            
            </div>
            {/* Variant List */}
            <div className='w-full h-full flex gap-3 p-3 '>
                {
                    variants?.map((variant, index)=>{
                        return (
                            <button onClick={()=>handleSelectVariant(variant)} className={`${variant.type === selectedVariant.type ? "border-2 border-themeOrange" : ""} flex  h-fit px-2 py-1 text-gray-900 border rounded-sm text-semiSm`} key={index}>
                                <p>{variant.type}</p>
                            </button>
                        )
                    })
                }
            </div>
            </div>
            <div className='flex items-center justify-between gap-1'>
                <div className='flex items-center space-x-1'><p className='font-medium'>Price:</p><span className='text-sm'>{price}</span></div>

                <button onClick={()=>{submitServiceContext()}} className='bg-themeBlue text-white px-2 py-1 rounded-sm text-sm'>Next step</button>
            </div>
            
        </section>
  )
}

export default ServiceSelect