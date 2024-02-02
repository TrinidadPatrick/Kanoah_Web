import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react';
import http from '../http';
import UseDNS from '../ClientCustomHook/DNSProvider';
import UseInfo from './UseInfo';



export const UseServiceHook = () => {
    const {authenticated, userInformation, getAuth} = UseInfo()
    const {getDNS} = UseDNS()
    const [services, setServices] = useState(null);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const thisDate = currentYear + "-" + currentMonth + "-" + currentDay

    const ratingAverage = async (services, dns) => {
        const processedServices = await Promise.all(
        services.map((service, index) => {
          
          const ratings = service.ratings
          const totalRatings = ratings[0].count + ratings[1].count + ratings[2].count +ratings[3].count + ratings[4].count;
          const ratingAverage = (5 * ratings[0].count + 4 * ratings[1].count + 3 * ratings[2].count + 2 * ratings[3].count + 1 * ratings[4].count) / totalRatings;
          const rounded = Math.round(ratingAverage * 100) / 100;
          const average = rounded.toFixed(1)
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
            serviceHour: service.serviceHour,
            tags: service.tags,
            owner : service.owner,
            galleryImages: service.galleryImages,
            featuredImages: service.featuredImages,
            serviceProfileImage: service.serviceProfileImage,
            ratings : average,
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
            const result = await http.get("getServices");
            const dns = await getDNS()
            const serviceList = await ratingAverage(result.data.service, dns)
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