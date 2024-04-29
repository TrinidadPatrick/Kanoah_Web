import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react';
import http from '../http';
import allServiceStore from '../Stores/AllServiceStore';




export const UseServiceHook = () => {
    const {staticServices, setStaticServices} = allServiceStore()
    const [services, setServices] = useState(null);


    const getServiceList = async () => {
        try {
            const result = await http.get("getServices", {withCredentials : true});
            setServices(result.data)
            // setStaticServices(result.data)
            return result.data
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        getServiceList()
    },[])

    
    return {services, getServiceList}
}
