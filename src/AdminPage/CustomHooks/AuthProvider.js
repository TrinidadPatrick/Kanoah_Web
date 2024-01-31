import React, { useEffect } from 'react'
import { createContext, useContext, useState } from 'react'
import http from '../../http'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = useState(null)
  
    const checkStatus = async () => {
        try {
            const result = await http.get('checkStatus', {withCredentials : true})
            if(result.status === 200 && result.data.status === "authorized")
            {
                setAuthenticated(true)
                return ;
            }
            else if (result.status === 200 && result.data.message === "access token invalid")
            {
                setAuthenticated(false)
                refresh()
            }
        } catch (error) {
            if(error.response.status === 401)
            {
                navigate("/adminLogin")
            }
            
            else
            {
                navigate("/adminLogin")
            }
            
        }
    }  

    const refresh = async () => {
        
        try {
            const refresh = await http.get('refreshAdmin', {withCredentials : true})
            if(refresh.status === 200)
            {
                checkStatus()
                
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            navigate("/adminLogin");
        }
    }

    useEffect(()=>{
        checkStatus()
    },[])

    const logout = async () => {
        await http.get('logout', {withCredentials : true})
        .then((res)=>{
            setAuthenticated(false)
            checkStatus()
        }).catch((err)=>{throw err})
    }

    const login = async (userInfos) => {
        try {
            const result = await http.post('loginasAdmin', userInfos,{
              withCredentials : true
            }) 
            if(result.status === 200 && result.data.message === "success")
            {
                checkStatus()
                return ;
            }  
            
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw Error("Invalid username or password");
            } else {
                throw new Error("An error occurred");
            }
        }
    }

  return (
    <AuthContext.Provider value={{authenticated, logout, login, checkStatus}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    return useContext(AuthContext)
}