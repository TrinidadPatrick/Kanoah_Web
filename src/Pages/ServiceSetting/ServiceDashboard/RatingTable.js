import React from 'react'
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import http from '../../../http';

const RatingTable = ({serviceInformation, dateSelected}) => {
    const [serviceOffers, setServiceOffers] = useState([])
    const chartOptions = {
        labels: serviceOffers.map((service)=> service.service),
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#FF1560'],
        legend: {
          show: true,
          
        },
      };
    
    const chartData = serviceOffers.map((service) => service.bookingsCount);
    

    useEffect(()=>{
        const getServiceOffers = async () => {
            try {
                const result = await http.get(`getDBServiceOffers?service=${serviceInformation._id}&dateFilter=${dateSelected}`, {withCredentials : true})
                const serviceOffer = result.data.serviceOffers.serviceOffers
                const bookings = result.data.bookingResult.map((service) => service.service)

                const groupedData = bookings.reduce((result, serviceObj) => {
                    const matchingGroup = result.find(groupObj => groupObj.uniqueId == serviceObj.selectedServiceId)
                    if (matchingGroup) {
                        matchingGroup.services.push(serviceObj);
                      } else {
                        const newGroup = {
                          uniqueId: serviceObj.selectedServiceId,
                          groupInfo: serviceOffer.find(group => group.uniqueId == serviceObj.selectedServiceId),
                          services: [serviceObj],
                        };
                        if(newGroup.uniqueId !== undefined && newGroup.groupInfo !== undefined && newGroup.services !== undefined)
                        {
                          result.push(newGroup);
                        }
                      }
                    
                      return result;

                }, [])

                const final = groupedData.sort((a,b)=> b.services.length - a.services.length).map((service) => {
                    return {
                        service : service.groupInfo.name,
                        bookingsCount : service.services.length
                    }  
                })

                setServiceOffers(final)

            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && getServiceOffers()
    },[serviceInformation, dateSelected])


  return (
    <div className='w-full h-full flex flex-col items-center justify-start'>
    <nav className='w-full flex items-center px-3 py-3 justify-between border-b-1'>
            <h1 className='text-lg  text-gray-700 font-semibold'>Top Booked Services</h1>
        </nav>
        <div className='w-full overflow-hidden h-full flex justify-center items-center'>
      <Chart
        options={chartOptions}
        series={chartData}
        type="pie"
        width="130%"
      />
      </div>
    </div>
  )
}

export default RatingTable