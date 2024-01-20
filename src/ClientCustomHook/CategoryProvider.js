import React from 'react'
import { useState, useEffect } from 'react'
import http from '../http'

const useCategory = () => {
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])

    const fetchCategories = async () => {
        try {
            const result = await http.get('getCategories')
            const categories = result.data.filter((category)=> category.type === "Category")
            const subCategories = result.data.filter((category)=> category.type === "SubCategory")
            setCategories(categories)
            setSubCategories(subCategories)
          } catch (error) {
            console.log(error)
          }
    }

    useEffect(()=>{
        fetchCategories()
    },[])

    return {
        categories, subCategories
    }
  
}

export default useCategory