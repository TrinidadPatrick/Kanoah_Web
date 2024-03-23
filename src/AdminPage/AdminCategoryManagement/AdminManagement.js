import React, { useEffect } from 'react'
import { useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import cloudinaryCore from '../../CloudinaryConfig';
import Modal from 'react-modal';
import http from '../../http';
import axios from 'axios';

const AdminManagement = () => {
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
    const [origCategoryList, setOrigCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [activeSubcategories, setActiveSubcategories] = useState([])
    const [selectedData, setSelectedData] = useState('')
    const [transactionLoading, setTransactionLoading] = useState(false)
    const [showDropdownFilter, setShowDropdownFilter] = useState(false)
    const [image, setImage] = useState('https://placehold.co/400x400')
    const [search, setSearch] = useState('')

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
            setOrigCategoryList(categories)
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
            image : image,
            createdAt : new Date()
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
            
            const result = await http.post('addCategory', dataToAdd, {withCredentials : true})
            setImage('https://placehold.co/400x400')
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
        type : selectedCategory.type,
        createdAt : selectedCategory.createdAt
        })
        setImage(selectedCategory.image)

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
                    type : "SubCategory",
                }
            )
        })
        const categoryToUpdate = {...category, image : image}
        try {
            setTransactionLoading(true)
            const result = await http.put('updateCategories', {categoryToUpdate, subCategoryToUpdate}, {withCredentials : true})
            setImage('https://placehold.co/400x400')
            getCategories()
            setTransactionLoading(false)
            setEditCategoryModalIsOpen(false)
            clearCategory()
        } catch (error) {
            console.log(error)
        }
    }

    const editFeatured = async (index) => {
        const newCategoryList = [...categoryList]
        newCategoryList[index].featured = !newCategoryList[index].featured
        setCategoryList(newCategoryList)

        try {
            const result = await http.patch(`editFeatureOption/${newCategoryList[index]._id}`, {isFeatured : newCategoryList[index].featured}, {withCredentials : true})
        } catch (error) {
            console.log(error)
        }
    }

    const addCategoryImage = async (files) => {
        const file = files[0]
        const formData = new FormData();
        formData.append('file', file, 'filename.jpg');
        formData.append('upload_preset', 'Admin_CategoryImage');

        try {
            const result = await axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`, formData)
            setImage(result.data.url)
        } catch (error) {
            console.log(error)
        }

    }

    const removeCategory = async (category) => {

        try {
            setTransactionLoading(true)
            const result = await http.patch(`deleteCategory/${category._id}`, {}, {withCredentials : true})
            getCategories()
            setTransactionLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSort = (option) => {
        switch (option) {
            case "A-z":
                const sortedArray1 = categoryList.sort((a, b) => {
                    const nameA = a.name.toLowerCase(); // Convert to lowercase for case-insensitive sorting
                    const nameB = b.name.toLowerCase();
                  
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0; // Names are equal
                  });
                setCategoryList(sortedArray1)
                setShowDropdownFilter(false)
                break;
            
            case "Z-a":
                const sortedArray2 = categoryList.sort((a, b) => {
                    const nameA = a.name.toLowerCase(); // Convert to lowercase for case-insensitive sorting
                    const nameB = b.name.toLowerCase();
                      
                    if (nameA < nameB) {
                        return -1;
                     }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0; // Names are equal
                    });
                setCategoryList(sortedArray2.reverse())
                setShowDropdownFilter(false)
                break;
            
            case "Recent":
                const sortedArray3 = categoryList.sort((a,b)=>{
                    return new Date(a.createdAt) - new Date(b.createdAt)
                })
                setCategoryList(sortedArray3)
                setShowDropdownFilter(false)
                break;
                

            case "Oldest":
                const sortedArray4 = categoryList.sort((a,b)=>{
                    return new Date(b.createdAt) - new Date(a.createdAt)
                })
                setCategoryList(sortedArray4)
                setShowDropdownFilter(false)
                break;
                
        
            default:
                break;
        }
    }

    const handleSearch = (value) => {
        const result = origCategoryList.filter((category) => category.name.toLowerCase().includes(value.toLowerCase()))
        setCategoryList(result)
    }

  return (
    <div className='w-full overflow-hidden h-full flex flex-col relative p-3'>
    
        {/* Add Category */}
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${addCategoryModalIsOpen ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
    <div className='flex bg-white flex-col p-2 space-y-5 w-[350px]'>
        <div className='flex items-center justify-between'>
            <h1 className='text-lg font-medium text-gray-700'>Add Category</h1>
            <CloseOutlinedIcon onClick={()=>{setAddCategoryModalIsOpen(false);setImage('https://placehold.co/400x400')}} className=' cursor-pointer' />
        </div>
        <div className='flex flex-col space-y-2 '>
            <div className='w-full flex justify-center '>
                <img className='w-20 rounded-full' src={image} />
            </div>
        <div>
        {/* Name */}
        <label htmlFor='category' className='text-semiSm font-medium text-gray-600' >Category</label>
        <input id='category' value={category.name} onChange={(e)=>{setCategory({...category, name : e.target.value})}} className='p-1.5 border text-sm w-full rounded-sm' type='text' />
        </div>
        <div>

        {/* Image */}
        <div>
            <input onChange={(e)=>{addCategoryImage(e.target.files)}} type='file' className="text-xs" />
        </div>

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
        <button disabled={category.name === ""} onClick={()=>handleAddCategory()} className='w-full disabled:bg-orange-200 mt-2 p-2 bg-themeOrange text-sm text-white rounded-sm'>
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
        </div>

        {/* Edit Category */}
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${editCategoryModalIsOpen ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
        <div className='flex flex-col h-full md:h-fit p-2 space-y-5 w-[350px] bg-white'>
        <div className='flex items-center justify-between'>
            <h1 className='text-lg font-medium text-gray-700'>Edit Category</h1>
            <CloseOutlinedIcon onClick={()=>{setEditCategoryModalIsOpen(false);clearCategory();setImage('https://placehold.co/400x400')}} className=' cursor-pointer' />
        </div>
        <div className='flex flex-col space-y-2'>
        <div className='w-full flex flex-col items-center justify-center '>
            <img className='w-20 rounded-full' src={image} />
            <button onClick={()=>setImage('https://placehold.co/400x400')} className={`text-[0.6rem] p-1.5 ${image !== '' ? '' : 'hidden'}  text-red-500`}>Remove picture</button>
        </div>
        <div>
        {/* Name */}
        <label htmlFor='category' className='text-xs md:text-semiSm font-medium text-gray-600' >Category</label>
        <input id='category' value={category.name} onChange={(e)=>{setCategory({...category, name : e.target.value})}} className='p-1.5 border text-xs md:text-sm w-full rounded-sm' type='text' />
        </div>
        <div>

        {/* Image */}
        <div>
            <input onChange={(e)=>{addCategoryImage(e.target.files)}} type='file' className="text-xs" />  
        </div>
        

        {/* Sub categories */}
        <label htmlFor='subCategory' className='text-xs md:text-semiSm font-medium text-gray-600' >Sub Category (seperated by comma)</label>
        <input id='subCategory' value={subCategory} onChange={(e)=>{setSubcategory(e.target.value)}} className='p-1.5 border text-xs md:text-sm w-full rounded-sm' type='text' />
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
        </div>

    <h1 className='text-lg semiSmtext-2xl font-bold text-gray-800 ml-2 md:ml-5'>Categories</h1>
    <div className='w-full flex flex-col semiSm:flex-row gap-2 relative justify-between'>
            <div className='w-full semiSm:w-fit flex space-x-2'>
            <button onClick={()=>setAddCategoryModalIsOpen(true)} className=' bg-themeOrange w-full semiSm:w-fit py-1 text-white px-2 rounded-sm'>Add Category</button>
            </div>

            {/* Search */}
            <div className='flex w-full semiSm:w-fit items-stretch h-full'>
            <button onClick={()=>setShowDropdownFilter(!showDropdownFilter)} className=' bg-gray-100 w-fit mr-1 py-1 text-gray-600 px-2 rounded-sm'>
                <SortOutlinedIcon />
            </button>
            <input value={search} onChange={(e)=>{setSearch(e.target.value)}} type='text' 
            className='border text-sm w-full border-gray-200 rounded-s-sm border-e-0 px-2 h-full' placeholder='Search...' />
            <button className='px-2 h-full rounded-e-sm border-gray-200 border border-l-0 bg-themeOrange'>
            <SearchOutlinedIcon className='text-white' />
            </button>
            </div>

            {/* Dropdown */}
            <div className={`w-[200px] h-fit ${showDropdownFilter ? 'flex' : 'hidden'} flex-col space-y-3 bg-[#f9f9f9] shadow-sm rounded-sm absolute z-20 top-10 left-28`}>
                <button onClick={()=>{handleSort('A-z')}} className='py-1 text-start px-2 text-sm'>
                    Alphabetical (A-z)
                </button>
                <button onClick={()=>{handleSort('Z-a')}} className='py-1 text-start px-2 text-sm'>
                    Alphabetical (Z-a)
                </button>
                <button onClick={()=>{handleSort('Recent')}} className='py-1 text-start px-2 text-sm'>
                    Most Recent
                </button>
                <button onClick={()=>{handleSort('Oldest')}} className='py-1 text-start px-2 text-sm'>
                    Oldest
                </button>
            </div>
    </div>


    {/* Lists of category */}
    <div className='w-full h-full relative max-h-full overflow-auto flex flex-col  rounded-sm'>
    <table className='w-full'>
        <thead>
            <tr className='border-b-1'>
            <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>No.</p></th>
            <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Category</p></th>
            <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Image</p></th>
            <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Date</p></th>
            <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Featured</p></th>
            <th className='text-xs md:text-sm text-gray-700 font-medium text-center'><p className='py-2'>Action</p></th>
            </tr>
        </thead>

        <tbody>
            {
                categoryList?.map((category, index)=>{
                    const createdAt = category.createdAt
                    const date = new Date(createdAt).toLocaleDateString('EN-us', {
                        month : 'short',
                        day : '2-digit',
                        year : 'numeric'
                        
                    })
                    return (
                        <tr key={index} className='border-b-1'>
                            <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                            <p className='py-6 whitespace-nowrap text-ellipsis overflow-hidden'>{index + 1}</p>
                            </td>
                            <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[200px] max-w-[100px] pr-2 md:max-w-[200px] '>
                            <p className='py-6 whitespace-nowrap text-ellipsis overflow-hidden'>{category.name}</p>
                            </td>
                            <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[100px] max-w-[100px] pr-2 md:max-w-[100px] '>
                            <div>
                                <img className='w-14' src={category.image} />
                            </div>
                            </td>                            
                            <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[100px] max-w-[100px] pr-2 md:max-w-[100px] '>
                            <p className='py-6 whitespace-nowrap text-ellipsis overflow-hidden'>{date}</p>
                            </td>
                            <td className='text-start'>
                            <div className='w-full flex justify-start'>
                            <label className='flex cursor-pointer select-none items-center'>
                            <div className='relative'>
                            <input
                                type='checkbox'
                                checked={category.featured}
                                onChange={()=>editFeatured(index)}
                                className='sr-only'
                            />
                            <div className={` ${category.featured ? "bg-blue-500" : "bg-[#E5E7EB]"} h-[17px] w-9 flex items-center rounded-full`}>
                            <div className={`dot ${category.featured ? " translate-x-[20px]" : "translate-x-[2px]"} h-3.5  w-3.5 rounded-full bg-white transition`}></div>
                            </div>
                            </div>
                            </label>
                            </div>
                            </td>
                            <td className='text-start text-xs md:text-sm min-w-[200px] overflow-hidden md:min-w-[230px] max-w-[200px] pr-2 md:max-w-[230px] '>
                            <div className=' flex space-x-2  justify-center'>
                            <button onClick={()=>{setEditCategoryModalIsOpen(true);handleEdit(category.category_code)}} className=' bg-green-100 hover:bg-green-400 text-green-600 px-3 py-1 rounded-sm text-semiSm'>Edit</button>
                            <button onClick={()=>{removeCategory(category)}} className=' bg-red-100 hover:bg-red-400 text-red-500 px-3 py-1 rounded-sm text-semiSm'>Remove</button>
                            </div>
                            </td>
                            
                        </tr>
                    )
                })
            }
        </tbody>
    </table>
    
    </div>

    </div>
  )
}

export default AdminManagement