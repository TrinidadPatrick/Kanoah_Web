import React, { useEffect, useState } from 'react'
import http from '../../http'

const useUsers = () => {
    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(true)

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
            setLoading(true)
            try {
                const result = await http.get(`Admin_GetUserLists`,{withCredentials : true})
                setUsers(result.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        getUsers()
    },[])
  return {
    users, getUsers, loading
  }
}

export default useUsers