import React, { useEffect } from 'react'
import { useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Modal from 'react-modal';
import http from '../../http';

const CategoryManagement = () => {
    Modal.setAppElement('#root');
    const [category, setCategory] = useState({
        category_code : "",
        parent_code : "",
        name : "",
        image : "",
        type : ""
    })
    const [subCategory, setSubcategory] = useState('')
    const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false)
    const [editCategoryModalIsOpen, setEditCategoryModalIsOpen] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [activeSubcategories, setActiveSubcategories] = useState([])
    const [selectedData, setSelectedData] = useState('')
    const [transactionLoading, setTransactionLoading] = useState(false)

    const modalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : '0'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the color and opacity as needed
          },
    };

    const getCategories = async () => {
        try {
            const result = await http.get('getCategories')
            const categories = result.data.filter((result) => result.type === "Category")
            const subCategories = result.data.filter((result) => result.type === "SubCategory")
            setCategoryList(categories)
            setSubCategoryList(subCategories)
        } catch (error) {
            console.error(error)
        }
    }

    const generateCategoryRandomKey = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
    };
    const generateSubCategoryRandomKey = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
    };

    const clearCategory = () => {
        setCategory({
        category_code : "",
        parent_code : "",
        name : "",
        image : "",
        type : ""
        })

        setSubcategory('')
    }

    const handleAddCategory = async () => {
        if(category.name !== ""){
            setTransactionLoading(true)
        }
        const dataToAdd = []
        const categoryCode = generateCategoryRandomKey()
        const subCategoryCode = generateSubCategoryRandomKey()
        const categoryData = {
            name : category.name,
            parent_code : 'None',
            category_code : categoryCode,
            subCategory_code : 'None',
            type : "Category",
            image : ""
        }
        const newCategoryList = [...categoryList]
        newCategoryList.push(categoryData)
        setCategoryList(newCategoryList)

        dataToAdd.push(categoryData)

        const newSubCategoryList = [...subCategoryList]
        const subCategoryInArray = subCategory.split(',')
        const subCategoryDatas = subCategoryInArray.map((subCateg)=>{
            const data = {

                name : subCateg,
                parent_code : categoryCode,
                category_code : 'None',
                subCategory_code : subCategoryCode,
                type : "SubCategory",
                image : ""
            }
            newSubCategoryList.push(data)
            setSubCategoryList(newSubCategoryList)
            dataToAdd.push(data)
            

        })
        try {
            
            const result = await http.post('addCategory', dataToAdd)
            clearCategory()
            setTransactionLoading(false)
            setAddCategoryModalIsOpen(false)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        const subCategoryInArray = subCategory.split(',')
        setActiveSubcategories(subCategoryInArray.map((sub)=>{
            return (
                {
                    name : sub,
                    parent_code : "",
                    category_code : 'None',
                    subCategory_code : "",
                    type : "SubCategory",
                    image : ""
                }

            )
        }))
    },[subCategory])

    useEffect(()=>{
        getCategories()
    },[])

    const handleEdit = (categ_code) => {
        setSelectedData(categ_code)
        const selectedCategory = categoryList.find(category => category.category_code === categ_code)
        setCategory({
        category_code : selectedCategory.category_code,
        parent_code : selectedCategory.parent_code,
        name : selectedCategory.name,
        image : selectedCategory.image,
        type : selectedCategory.type
        })

        const selectedSubcategories = subCategoryList.filter((subcategory) => subcategory.parent_code === categ_code)
        setActiveSubcategories(selectedSubcategories)
        setSubcategory(selectedSubcategories.map((subCateg) => subCateg.name).join(','))
    }

    const handleUpdate = async () => {
        const categoryCode = selectedData //This has a value of the category code
        const subCategoryOriginal = subCategoryList.find(sub => sub.parent_code === selectedData)
        const subCategoryToUpdate = activeSubcategories.map((subCateg)=>{
            return (
                {
                    name : subCateg.name,
                    parent_code : selectedData,
                    subCategory_code : subCategoryOriginal.subCategory_code,
                    category_code : "None",
                    image : "",
                    type : "SubCategory"
                }
            )
        })
        const categoryToUpdate = category

        try {
            setTransactionLoading(true)
            const result = await http.put('updateCategories', {categoryToUpdate, subCategoryToUpdate})
            getCategories()
            setTransactionLoading(false)
            setEditCategoryModalIsOpen(false)
            clearCategory()
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='w-fit flex flex-col space-y-4 h-full bg-white shadow-md rounded-md p-2'>

        <div className='flex space-x-2'>
            <button onClick={()=>setAddCategoryModalIsOpen(true)} className=' bg-themeBlue w-full py-1 text-white px-2 rounded-sm'>Add Category</button>
        </div>

    {/* Lists of category */}
    <div className='w-full h-full relative max-h-full overflow-auto flex flex-col border-2 rounded-sm'>
    <h1 className='text-lg font-semibold text-gray-800 bg-white px-2 absolute -top-4 left-2'>Categories</h1>
     {
        categoryList.map((category, index)=>{
            return (
                <div key={index} className='mt-5 border-b-1 py-1 cursor-pointer mx-2 peer flex justify-between'>
                    <p>{category.name}</p>
                    <div className='hidden '>
                    <ModeEditOutlineOutlinedIcon className='text-gray-800' fontSize='small' />
                    <DeleteOutlineOutlinedIcon className='text-red-500' fontSize='small' />
                    </div>
                    <div className=' flex space-x-2'>
                    <button onClick={()=>{setEditCategoryModalIsOpen(true);handleEdit(category.category_code)}} className=' bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-sm text-semiSm'>Edit</button>
                    <button className=' bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-sm text-semiSm'>Remove</button>
                    </div>
                </div>
            )
        })
     }               
    </div>

    {/* Add category Modal */}
    <Modal isOpen={addCategoryModalIsOpen} style={modalStyle} contentLabel="Category Modal">
    <div className='flex flex-col p-2 space-y-5 w-[350px]'>
        <div className='flex items-center justify-between'>
            <h1 className='text-lg font-medium text-gray-700'>Add Category</h1>
            <CloseOutlinedIcon onClick={()=>setAddCategoryModalIsOpen(false)} className=' cursor-pointer' />
        </div>
        <div className='flex flex-col space-y-2'>
        <div>
        {/* Name */}
        <label htmlFor='category' className='text-semiSm font-medium text-gray-600' >Category</label>
        <input id='category' value={category.name} onChange={(e)=>{setCategory({...category, name : e.target.value})}} className='p-1.5 border text-sm w-full rounded-sm' type='text' />
        </div>
        <div>
        {/* Sub categories */}
        <label htmlFor='subCategory' className='text-semiSm font-medium text-gray-600' >Sub Category (seperated by comma)</label>
        <input id='subCategory' value={subCategory} onChange={(e)=>{setSubcategory(e.target.value)}} className='p-1.5 border text-sm w-full rounded-sm' type='text' />
        </div>
        </div>

        {/* Sub Category list */}
        <div className='flex gap-2 max-h-[200px] overflow-auto flex-wrap'>
        {
            activeSubcategories.map((subCategory, index)=>(
                <div key={index} className={`bg-gray-300 ${subCategory.name?.trimStart() === "" ? 'hidden' : ""} px-2 py-1 rounded-md`}>
                    <p className='text-semiSm'>{subCategory.name?.trimStart()}</p>
                </div>
                
            ))
        }
        </div>
        <button onClick={()=>handleAddCategory()} className='w-full mt-2 p-2 bg-themeOrange text-sm text-white rounded-sm'>
        {
            transactionLoading ?
            <div className="typing-indicator mx-auto">
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            </div>
            :
            "Submit"
        }
        </button>
    </div>
    </Modal>

    {/* Edit category Modal */}
    <Modal isOpen={editCategoryModalIsOpen} style={modalStyle} contentLabel="Category Modal">
    <div className='flex flex-col p-2 space-y-5 w-[350px]'>
        <div className='flex items-center justify-between'>
            <h1 className='text-lg font-medium text-gray-700'>Edit Category</h1>
            <CloseOutlinedIcon onClick={()=>{setEditCategoryModalIsOpen(false);clearCategory()}} className=' cursor-pointer' />
        </div>
        <div className='flex flex-col space-y-2'>
        <div>
        {/* Name */}
        <label htmlFor='category' className='text-semiSm font-medium text-gray-600' >Category</label>
        <input id='category' value={category.name} onChange={(e)=>{setCategory({...category, name : e.target.value})}} className='p-1.5 border text-sm w-full rounded-sm' type='text' />
        </div>
        <div>
        {/* Sub categories */}
        <label htmlFor='subCategory' className='text-semiSm font-medium text-gray-600' >Sub Category (seperated by comma)</label>
        <input id='subCategory' value={subCategory} onChange={(e)=>{setSubcategory(e.target.value)}} className='p-1.5 border text-sm w-full rounded-sm' type='text' />
        </div>
        </div>

        {/* Sub Category list */}
        <div className='flex gap-2 max-h-[200px] overflow-auto flex-wrap'>
        {
            activeSubcategories.map((subCategorys, index)=>(
                
                <div key={index} className={`bg-gray-300 ${subCategorys.name?.trimStart() === "" ? 'hidden' : ""} px-2 py-1 rounded-md`}>
                    <p className='text-semiSm'>{subCategorys.name?.trimStart()}</p>
                </div>
                
            ))
        }
        </div>
        <button onClick={()=>handleUpdate()} className='w-full mt-2 p-2 bg-themeOrange text-sm text-white rounded-sm'>
        {
            transactionLoading ?
            <div className="typing-indicator mx-auto">
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            </div>
            :
            "Update"
        }
        </button>
    </div>
    </Modal>
    </div>
  )
}

export default CategoryManagement