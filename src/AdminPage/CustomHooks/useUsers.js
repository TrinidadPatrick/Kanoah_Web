import React, { useEffect, useState } from 'react'
import http from '../../http'

const useUsers = () => {
    const [users, setUsers] = useState(null)

    const getUsers = async () => {
        try {
            const result = await http.get(`Admin_GetUserLists`,{withCredentials : true})
            setUsers(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const getUsers = async () => {
            try {
                const result = await http.get(`Admin_GetUserLists`,{withCredentials : true})
                setUsers(result.data)
            } catch (error) {
                console.log(error)
            }
        }

        getUsers()
    },[])
  return {
    users, getUsers
  }
}

export default useUsers