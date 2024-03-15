import React, { useEffect, useState } from 'react'
import http from '../../http'

const useAdminCategories = () => {
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])

    useEffect(()=>{
        const getCategories = async () => {
            try {
                const result = await http.get('getCategories')
                const categories = result.data.filter((result) => result.type === "Category")
                const subCategories = result.data.filter((result) => result.type === "SubCategory")
                setCategories(categories)
                setSubCategories(subCategories)
            } catch (error) {
                console.error(error)
            }
        }

        getCategories()
    },[])

  return {
    categories, subCategories
  }
}

export default useAdminCategories