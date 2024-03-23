import React, { useEffect } from 'react'
import Chart from 'react-apexcharts'
import { useState } from 'react'

const AdminSummaryGrap = ({data}) => {
    const {users, services, reportsHistory} = data

    const [usersData, setUsersData] = useState([
        { name: 'Jan', Users: 0, },
        { name: 'Feb', Users: 0, },
        { name: 'Mar', Users: 0, },
        { name: 'Apr', Users: 0, },
        { name: 'May', Users: 0, },
        { name: 'Jun', Users: 0, },
        { name: 'Jul', Users: 0, },
        { name: 'Aug', Users: 0, },
        { name: 'Sep', Users: 0, },
        { name: 'Oct', Users: 0, },
        { name: 'Nov', Users: 0, },
        { name: 'Dec', Users: 0, },
    ])
    const [serviceData, setServiceData] = useState([
        { name: 'Jan', services: 0, },
        { name: 'Feb', services: 0, },
        { name: 'Mar', services: 0, },
        { name: 'Apr', services: 0, },
        { name: 'May', services: 0, },
        { name: 'Jun', services: 0, },
        { name: 'Jul', services: 0, },
        { name: 'Aug', services: 0, },
        { name: 'Sep', services: 0, },
        { name: 'Oct', services: 0, },
        { name: 'Nov', services: 0, },
        { name: 'Dec', services: 0, },
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
            name: 'Users',
            type: 'line',
            data: usersData.map(entry => entry.Users),
            yAxisIndex: 0,
          },
          {
            name: 'Services',
            type: 'area',
            data: serviceData.map(entry => entry.services),
            yAxisIndex: 1,
          },
    ];

    // Get Monthly Users
    useEffect(()=>{
    if(users !== null)
        {
            const groupedData = users.reduce((acc, obj) => {
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

    
              dataArray.map((x) => {
                const index = usersData.findIndex((user)=>user.name === x.monthYear)
                setUsersData((prevData) => [
                    ...prevData.slice(0, index),
                    {...prevData[index], Users : x["length"] },
                    ...prevData.slice(index + 1)
                ])
            })
    }

    },[users])

    // Get Monthly Services
    useEffect(()=>{
        if(services !== null)
            {
                const groupedData = services.reduce((acc, obj) => {
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
        
                  dataArray.map((services) => {
                    const index = serviceData.findIndex((service)=>service.name === services.monthYear)
                    setServiceData((prevData) => [
                        ...prevData.slice(0, index),
                        {...prevData[index], services : services["length"] },
                        ...prevData.slice(index + 1)
                    ])
                })
        }
    
        },[services])

        // console.log(usersData)

  return (
    <div className='w-full h-full bg-white'>
        <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height="170" 
        width="100%"
    />
    </div>
  )
}

export default AdminSummaryGrap