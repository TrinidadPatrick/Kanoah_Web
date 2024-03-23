import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react';
import http from '../http';




export const UseServiceHook = () => {
    const [services, setServices] = useState(null);


    const getServiceList = async () => {
        try {
            const result = await http.get("getServices", {withCredentials : true});
            setServices(result.data)
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
