import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react';
import http from '../http';
import UseDNS from '../ClientCustomHook/DNSProvider';
import UseInfo from './UseInfo';
import useAllRatings from './AllRatingsProvider';



export const UseServiceHook = () => {
    const {ratings, getRatings} = useAllRatings()
    const {authenticated, userInformation, getAuth} = UseInfo()
    const {getDNS} = UseDNS()
    const [services, setServices] = useState(null);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const thisDate = currentYear + "-" + currentMonth + "-" + currentDay

    const ratingAverage = async (services, dns, ratings) => {
        const processedServices = await Promise.all(
        services.map((service, index) => {
          const serviceRatings = ratings.filter((rating)=> rating.service === service._id)
          const totalRatings = serviceRatings.length
          const sumOfRatings = serviceRatings.reduce((sum, rating) => sum + rating.rating, 0);
          const average = totalRatings === 0 ? 0 : sumOfRatings / totalRatings
          const from = new Date(service.createdAt);
          const to = new Date(thisDate);
          const years = to.getFullYear() - from.getFullYear();
          const months = to.getMonth() - from.getMonth();
          const days = to.getDate() - from.getDate();
          const createdAgo = years > 0 ? years + " years ago" : months > 0 ? months + `${months <= 1 ? " month ago" : " months ago"}` : days > 0  ? days + `${days <= 1 ? " day ago" : " days ago"}` : "Less than a day ago"
          return ({
            _id : service._id,
            key : index,
            basicInformation: service.basicInformation,
            advanceInformation: service.advanceInformation,
            address: service.address,
            tags: service.tags,
            owner : service.owner,
            serviceProfileImage: service.serviceProfileImage,
            ratings : average.toFixed(1),
            ratingRounded : Math.floor(average),
            totalReviews : totalRatings,
            createdAgo : createdAgo,
            createdAt : service.createdAt
          });
        })
        )
        return authenticated ? processedServices.filter(service => (
            !dns.some(dnsService => service._id === dnsService.service._id) &&
            service.owner && userInformation &&
            service.owner._id !== userInformation._id
          )) : authenticated === false ? processedServices : ""
    };

    const getServiceList = async () => {
        try {
            const ratings = await getRatings()
            const result = await http.get("getServices");
            const dns = await getDNS()
            const serviceList = await ratingAverage(result.data.service, dns, ratings)
            setServices(serviceList)
            return serviceList
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        getServiceList()
    },[authenticated])


    return {services, getServiceList}
}
