import React, { useEffect, useState } from 'react'
import useAdminServices from '../CustomHooks/useAdminServices'
import useAdminCategories from '../CustomHooks/useAdminCategories';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import OutsideClickHandler from 'react-outside-click-handler';
import http from '../../http';

const AdminServices = () => {
    Modal.setAppElement('#root');
    const navigate = useNavigate()
    const {services, getServices, loading} = useAdminServices()
    const {categories, subCategories} = useAdminCategories()
    const [serviceList, setServiceList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSubCategory, setSelectedSubCategory] = useState('')
    const [selectedFilter, setSelectedFilter] = useState('All')
    const [search, setSearch] = useState('')
    const [openDisableModal, setOpenDisableModal] = useState(false)
    const [disableServiceObject, setDisableServiceObject] = useState({
        service : {},
        reason : []
    })
    const reasons = ['Explicit Content', 'Fake Information/False Claims', 'Hate Speech/Bullying', 'Violence/Threats', 
                    'Spam/Scams', 'Non-Compliance with Terms of Service', 'Terrorism', 'Involves a child', 'Nudity']

    useEffect(()=>{
        setServiceList(services)
    },[services])

    const submitFilter = () => {
        let filtered = [...services]
        if(selectedCategory !== '')
        {
            filtered = services.filter((service) => service.advanceInformation.ServiceCategory === selectedCategory.categoryId)
        }
        if(selectedSubCategory !== '')
        {
            filtered = services.filter((service) => service.advanceInformation.ServiceSubCategory === selectedSubCategory)
        }
        if(selectedFilter === "All")
        {
            filtered = filtered
        }
        if(selectedFilter === "Active")
        {
            filtered = filtered.filter((service) => service.status.status === "Active")
        }
        if(selectedFilter === "Disabled")
        {
            filtered = filtered.filter((service) => service.status.status === "Disabled")
        }
        if(search !== '')
        {
            filtered = filtered.filter((service) => service.basicInformation.ServiceTitle.toLowerCase().includes(search.toLowerCase()))
        }

        setServiceList(filtered)
        
    }

    const handleSelectReason = (value) => {
        const newData = [...disableServiceObject.reason]

        // Check if the value exists
        const checkIndex = newData.findIndex((reason) => reason === value)
        if(checkIndex === -1)
        {
            newData.push(value)
            setDisableServiceObject({...disableServiceObject, reason : newData})
            return
        }
        newData.splice(checkIndex, 1)
        setDisableServiceObject({...disableServiceObject, reason : newData})
        return

    }

    const disableService = async () => {
        const serviceId = disableServiceObject.service._id
        const newData = [...serviceList]
        const index = newData.findIndex((service)=>service._id === serviceId)
        newData[index].status.status = "Disabled"
        newData[index].status.reasons = disableServiceObject.reason
        newData[index].status.dateDisabled = new Date()
        setServiceList(newData)
        setOpenDisableModal(false)
        try {
            const result = await http.patch(`Admin_DisableService/${serviceId}`, disableServiceObject, {withCredentials : true})
            if(result.status == 200)
            {
                setDisableServiceObject({service : {},
                    reason : []})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const enableService = async (serviceId) => {
        try {
            const newData = [...serviceList]
            const index = newData.findIndex((service)=>service._id === serviceId)
            newData[index].status.status = "Active"
            newData[index].status.reasons = []
            newData[index].status.dateDisabled = new Date()
            setServiceList(newData)
            const result = await http.patch(`Admin_EnableService/${serviceId}`, {}, {withCredentials : true})
        } catch (error) {
            console.log(error)
        }
    }

    // console.lof(selectedFilter)

  return (
    <main className='w-full overflow-hidden h-full flex flex-col relative p-3'>
        <header>
            <h1 className='text-xl font-medium text-gray-700 px-5'>Services</h1>
        </header>

        {/* Disable Service */}
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${openDisableModal ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
        <OutsideClickHandler onOutsideClick={()=>setOpenDisableModal(false)}>
        <div className=' flex flex-col p-3 items-center bg-white w-[95%] semiSm:w-[350px]'>
                {/* Header */}
                <div className='flex flex-row gap-2 items-start'>
                    <button onClick={()=>{setDisableServiceObject({
                    service : {},
                    reason : []
                    });setOpenDisableModal(false)}}>
                    <ArrowBackOutlinedIcon className='text-gray-500' />
                    </button>
                    <h1 className='flex text-lg text-red-500 font-medium'>You are about to disable {disableServiceObject?.service?.basicInformation?.ServiceTitle}</h1>
                </div>

                {/* Reasons */}
                <div className='w-full flex flex-col mt-5'>
                    <h2 className='text-sm whitespace-nowrap font-medium'>What's wrong with the service?</h2>
                    <div className='w-full flex gap-3 flex-wrap mt-3'>
                    {
                        reasons.map((reason, index)=>{
                            return (
                                <button key={index} onClick={()=>handleSelectReason(reason)} className={`whitespace-nowrap ${disableServiceObject.reason.includes(reason) ? "bg-blue-500 text-white" : "bg-gray-200"} border rounded-md px-3 py-1 text-sm`}>{reason}</button>
                            )
                        })
                    }
                    </div>
                </div>
                <div className='w-full flex flex-col mt-5'>
                <button disabled={disableServiceObject.reason.length === 0} onClick={()=>disableService()} className='py-2 px-3 disabled:bg-gray-100 disabled:text-gray-300 text-sm bg-red-100 text-red-500 rounded-sm hover:bg-red-300'>Confirm</button>
                </div>
        </div>
        </OutsideClickHandler>
        </div>

        {/* Navigation */}
        <div className='w-full flex items-center justify-between space-x-2 mt-3 px-5'>
            <div className='w-fit h-full flex items-center space-x-2 relative'>
                <input onKeyDown={(e)=>{if(e.key === "Enter"){submitFilter()}}} value={search} onChange={(e)=>setSearch(e.target.value)} className='border text-sm h-full px-2 py-2 rounded-md' type='search' placeholder='Search...' />
                <button onClick={()=>submitFilter()} className='text-sm bg-themeOrange h-full px-3 text-white rounded-md'>Search</button>
            </div>
        </div>

        {/* Filters */}
        <div className="w-full lg:w-fit grid grid-cols-2 lg:grid-cols-4 gap-2 px-5 mt-5">   
        <select className="bg-gray-50 w-full lg:w-[170px] border border-gray-300 text-gray-900 text-semiSm md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 "
        onChange={(e)=>{
        const value = e.target.value
        const valueInArray = value.split(",")
        const objValue = {category_code : valueInArray[0], categoryId : valueInArray[1]}
        setSelectedCategory(objValue)
        }} 
        id="categories" 
        >
        <option value="">Select Category</option>
        {
        categories?.map((category)=>{
            return (
                    <option key={category._id} value={`${category.category_code},${category._id}`}>{category.name}</option>
            )
        })
        }
        </select>
        <select onChange={(e)=>{setSelectedSubCategory(e.target.value)}} id="subcategories" className="bg-gray-50 w-full lg:w-[170px] border border-gray-300 text-gray-900  text-semiSm md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 ">
            <option value='' >Select Subcategory</option>
            {
            subCategories.filter((subcategory) => subcategory.parent_code === selectedCategory.category_code)?.map((subCateg)=>{
                return (
                    <option key={subCateg._id} value={subCateg._id}>{subCateg.name}</option>
                )
            })
            }
        </select>
        <select value={selectedFilter} onChange={(e)=>{setSelectedFilter(e.target.value)}} id="filter" className="bg-gray-50 h-fit w-full lg:w-[170px] border border-gray-300 text-gray-900  text-semiSm md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 ">
            <option value="All">Show All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
        </select>
        <button onClick={()=>submitFilter()} className='h-fit py-2  text-semiSm md:text-sm w-full lg:w-[170px] bg-themeBlue text-white rounded-md'>
            Submit
        </button>
        </div>

        {/* Table */}
        <div className="flex flex-col w-full h-full overflow-auto overflow-x-scroll px-5 mt-5">
            <table className='w-full overflow-x-auto'>
                <thead>
                    <tr className='border-b-1'>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Service</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Owner</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Created</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Status</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Action</p></th>
                    </tr>
                </thead>

                <tbody>
                {
                loading ? 
                <>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                <tr  className='border-b-1'>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[90%] h-3 bg-gray-200 animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                    <td className='text-start text-xs md:text-sm min-w-[50px] overflow-hidden md:min-w-[50px] max-w-[50px] pr-2 md:max-w-[50px] '>
                    <div className='py-6 whitespace-nowrap text-ellipsis overflow-hidden w-full h-full '>
                        <div className='w-[80%] h-3 bg-gray-200 rounded-md animate-pulse'></div>
                    </div>
                    </td>
                </tr>
                </>
                :
                serviceList?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((service, index) => {
                    const dateCreated = service.createdAt
                    const createdAt = new Date(dateCreated).toLocaleDateString('En-us', {
                            month : 'short',
                            day : '2-digit',
                            year : 'numeric'
                    })
                    return (
                        <tr key={service._id} className='border-b-1'>
                        <td className='text-start text-sm min-w-[200px] max-w-[200px] pr-3'>
                            <p className='py-5 whitespace-nowrap text-ellipsis overflow-hidden'>{service.basicInformation.ServiceTitle}</p>
                        </td>
                        <td className='text-start text-sm min-w-[170px] max-w-[170px]'>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{service.owner.firstname} {service.owner.lastname}</p>
                        </td>
                        <td className='text-start text-sm min-w-[120px]'>
                            <p className='py-2 whitespace-nowrap'>{createdAt}</p>
                        </td>
                        <td className='text-start text-sm min-w-[100px]'>
                            <p className={`${service.status.status === "Active" ? "text-green-500" : "text-red-500"} py-5`}>{service.status.status}</p>
                        </td>
                        <td className='text-start text-sm'>
                            <div className='py-5 flex items-center space-x-2'>
                                <button onClick={()=>navigate(`/admin/Services/AdminViewService/${service._id}`)} className='bg-blue-100 px-2 py-1 rounded-sm text-blue-500'>View</button>
                                {
                                    service.status.status === "Active" ?
                                    <button onClick={()=>{setOpenDisableModal(true);setDisableServiceObject({...disableServiceObject, service : service})}} className='bg-red-100 px-2 py-1 rounded-sm text-red-500'>Disable</button>
                                    :
                                    <button onClick={()=>{enableService(service._id)}} className='bg-green-100 px-2 py-1 rounded-sm text-green-500'>Enable</button>
                                }
                            </div>
                        </td>
                        </tr>
                        )
                })
                }
                </tbody>
            </table>
        </div>

    </main>

  )}

export default AdminServices