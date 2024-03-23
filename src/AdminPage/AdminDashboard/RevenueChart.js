import React, { useEffect } from 'react'
import Chart from 'react-apexcharts'
import { useState } from 'react'

const RevenueChart = ({bookings}) => {

    const [revenueData, setRevenueData] = useState([
        { name: 'Jan', revenue: 0, },
        { name: 'Feb', revenue: 0, },
        { name: 'Mar', revenue: 0, },
        { name: 'Apr', revenue: 0, },
        { name: 'May', revenue: 0, },
        { name: 'Jun', revenue: 0, },
        { name: 'Jul', revenue: 0, },
        { name: 'Aug', revenue: 0, },
        { name: 'Sep', revenue: 0, },
        { name: 'Oct', revenue: 0, },
        { name: 'Nov', revenue: 0, },
        { name: 'Dec', revenue: 0, },
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
            enabled: true,
            
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
           
          ],
          legend: {
            position: 'top',
            offsetY: 3, // Adjust the offset as needed
            height: 18, // Adjust the height as needed
          },
    };
    
    const chartSeries = [
        {
            name: 'Revenue',
            type: 'line',
            data: revenueData.map(entry => entry.revenue),
            yAxisIndex: 0,
          },
    ];

    useEffect(()=>{
    //    const totalRevenue = bookings.reduce((accumulator, currentValue) => accumulator + currentValue.booking_fee, 0)
    const groupedData = bookings.reduce((acc, obj) => {
        const monthYear = obj.createdAt.slice(0, 7)
        if(!acc[monthYear]){
            acc[monthYear] = []
        }
        acc[monthYear].push(obj)
        return acc;
    }, {})

    const dataArray = Object.entries(groupedData).map(([monthYear, array]) => ({
        monthYear : new Date(monthYear).toDateString().split(" ")[1],
        revenue: array.reduce((accumulator, currentValue) => accumulator + currentValue.booking_fee, 0),
      }));


      dataArray.map((x) => {
        const index = revenueData.findIndex((revenue)=>revenue.name === x.monthYear)
        setRevenueData((prevData) => [
            ...prevData.slice(0, index),
            {...prevData[index], revenue : x["revenue"] },
            ...prevData.slice(index + 1)
        ])
    })
    },[bookings])

  return (
    <div className='w-full bg-white'>
        <h1 className='w-full text-start px-5 font-medium text-gray-600 mt-1'>Total Revenue</h1>
        <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height="175" 
        width="100%"
    />
    </div>
  )
}

export default RevenueChart