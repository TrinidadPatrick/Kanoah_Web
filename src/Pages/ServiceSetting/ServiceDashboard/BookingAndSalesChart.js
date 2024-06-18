import React from 'react'
import { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Chart from 'react-apexcharts'
import http from '../../../http';


const BookingAndSalesChart = ({serviceInformation}) => {
    const [SalesData, setSalesData] = useState([
        { name: 'Jan', Sales: 0, },
        { name: 'Feb', Sales: 0, },
        { name: 'Mar', Sales: 0, },
        { name: 'Apr', Sales: 0, },
        { name: 'May', Sales: 0, },
        { name: 'Jun', Sales: 0, },
        { name: 'Jul', Sales: 0, },
        { name: 'Aug', Sales: 0, },
        { name: 'Sep', Sales: 0, },
        { name: 'Oct', Sales: 0, },
        { name: 'Nov', Sales: 0, },
        { name: 'Dec', Sales: 0, },
    ])
    const [BookingsData, setBookingsData] = useState([
        { name: 'Jan', Bookings: 0, },
        { name: 'Feb', Bookings: 0, },
        { name: 'Mar', Bookings: 0, },
        { name: 'Apr', Bookings: 0, },
        { name: 'May', Bookings: 0, },
        { name: 'Jun', Bookings: 0, },
        { name: 'Jul', Bookings: 0, },
        { name: 'Aug', Bookings: 0, },
        { name: 'Sep', Bookings: 0, },
        { name: 'Oct', Bookings: 0, },
        { name: 'Nov', Bookings: 0, },
        { name: 'Dec', Bookings: 0, },
    ])
    const chartOptions = {
        chart: {
          id: 'basic-bar',
          height: 350,
         type: 'area',
         toolbar :{
            show : true,
            tools: {
                download: true,
                selection: true,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false ,
                customIcons: []
              },
         },
         margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        
        dataLabels: {
            enabled: false,
            
          },
          markers: {
            size: 4, // Adjust the size of the circles
            strokeWidth: 0, // Set to 0 to remove the stroke around the circles
          },
          stroke: {
            curve: 'smooth'
          },
          yaxis: [
            {
              title: {
                // text: 'Bookings',
              },
            },
            {
              opposite: true,
              title: {
                // text: 'Sales',
              },
            },
          ],
          legend: {
            position: 'top',
            offsetY: 3, // Adjust the offset as needed
            height: 18, // Adjust the height as needed
          },
    };
    
    const chartSeries = [
        {
            name: 'Bookings',
            type: 'line',
            data: BookingsData.map(entry => entry.Bookings),
            yAxisIndex: 0,
          },
          {
            name: 'Sales',
            type: 'area',
            data: SalesData.map(entry => entry.Sales),
            yAxisIndex: 1,
          },
    ];


    // Get Monthly Sales
    useEffect(()=>{
        const getTotalSales = async () => {
            try {
                const result = await http.get(`getMonthlySales?service=${serviceInformation._id}`, {withCredentials : true})
                const resultData = result.data
                const groupedData = resultData.reduce((acc, obj) => {
                    const monthYear = obj.createdAt.slice(0, 7)
                    if(!acc[monthYear]){
                        acc[monthYear] = []
                    }
                    acc[monthYear].push(obj)
                    return acc;
                }, {})

                const sumPerGroup = Object.keys(groupedData).map((key) => ({
                    monthYear: new Date(key).toDateString().split(" ")[1],
                    sum: groupedData[key].reduce((total, obj) => total + Number(obj.service.price), 0),
                  }));

                sumPerGroup.map((sum) => {
                    const index = SalesData.findIndex((data)=>data.name === sum.monthYear)
                    setSalesData((prevData) => [
                        ...prevData.slice(0, index),
                        {...prevData[index], Sales : sum["sum"] },
                        ...prevData.slice(index + 1)
                    ])
                })
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && getTotalSales()
    },[serviceInformation])

    // Get Monthly Bookings Count
    useEffect(()=>{
        const getBookingCounts = async () => {
            try {
                const result = await http.get(`getMonthlyBookings?service=${serviceInformation._id}`, {withCredentials : true})
                const resultData = result.data
                const groupedData = resultData.reduce((acc, obj) => {
                    const monthYear = obj.createdAt.slice(0, 7)
                    if(!acc[monthYear]){
                        acc[monthYear] = []
                    }
                    acc[monthYear].push(obj)
                    return acc;
                }, {})

                const dataArray = Object.entries(groupedData).map(([monthYear, array]) => ({
                    monthYear : new Date(monthYear).toDateString().split(" ")[1],
                    length: array.length,
                  }));
                dataArray.map((bookings) => {
                    const index = BookingsData.findIndex((booking)=>booking.name === bookings.monthYear)
                    setBookingsData((prevData) => [
                        ...prevData.slice(0, index),
                        {...prevData[index], Bookings : bookings["length"] },
                        ...prevData.slice(index + 1)
                    ])
                })
            } catch (error) {
                console.error(error)
            }
        }

        serviceInformation !== null && getBookingCounts()
    },[serviceInformation])

  return (
    <div className='w-full h-full flex flex-col max-h-[200px] border lg:border-l-0 rounded-e-md'>
     <Chart
      options={chartOptions}
      series={chartSeries}
      type="area"
      height="190" 
      width="100%"
    />

    </div>
  )
}

export default BookingAndSalesChart