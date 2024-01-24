import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import http from '../http'
import UseInfo from './UseInfo'

const UseFavorite = () => {
    const {userInformation, authenticated} = UseInfo()
    const [favorites, setFavorites] = useState(null)
    const getFavorites = async () => {
        try {
            const result = await http.get("getFavorites", {withCredentials : true})
            if(result.data)
            {
                setFavorites(result.data)
                return result.data
            }
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(()=>{
        

        if(authenticated)
        {
            getFavorites()
        }

    },[authenticated])
 return {
    favorites,
    getFavorites
 }
}

export default UseFavorite