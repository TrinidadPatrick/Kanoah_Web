import React, { useState, useEffect } from 'react'
import useUsers from '../CustomHooks/useUsers'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import Modal from 'react-modal';
import http from '../../http';

const AdminUsersList = () => {
    Modal.setAppElement('#root');
    const {users, getUsers, loading} = useUsers()
    const [userList, setUserList] = useState(null)
    const [openViewUserModal, setOpenViewUserModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [openDisableModal, setOpenDisableModal] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedFilter, setSelectedFilter] = useState('All')
    const [disableUserObject, setDisableUserObject] = useState({
        user : {},
        reason : []
    })
    const reasons = ['Explicit Content', 'Fake Information/False Claims', 'Hate Speech/Bullying', 'Violence/Threats', 'Spam/Scams', 'Non-Compliance with Terms of Service']

    useEffect(()=>{
        setUserList(users)
    },[users])
    // console.log(users)
    
    const handleSelectReason = (value) => {
        const newData = [...disableUserObject.reason]

        // Check if the value exists
        const checkIndex = newData.findIndex((reason) => reason === value)
        if(checkIndex === -1)
        {
            newData.push(value)
            setDisableUserObject({...disableUserObject, reason : newData})
            return
        }
        newData.splice(checkIndex, 1)
        setDisableUserObject({...disableUserObject, reason : newData})
        return

    }

    const disableUser = async () => {
        try {
            const result = await http.patch(`Admin_DisableUser/${disableUserObject.user._id}`, disableUserObject, {withCredentials : true})
            getUsers()
            setDisableUserObject({
                user : {},
                reason : []
            })
            setOpenDisableModal(false)
        } catch (error) {
            console.log(error)
        }
    }

    const enableUser = async (userId) => {
        try {
            const result = await http.patch(`Admin_EnableUser/${userId}`, {}, {withCredentials : true})
            getUsers()
        } catch (error) {
            console.log(error)
        }
    }

    const handleFilter = (option) => {
        switch (option) {
            case "All":
                setUserList(users)
                break;
            case "Active":
                const activeUsers = users.filter((user)=>user.status.status === "Active")
                setUserList(activeUsers)
                break;
            case "Disabled":
                const disabledUsers = users.filter((user)=>user.status.status === "Disabled")
                setUserList(disabledUsers)
                break;
            default:
                break;
        }
    }

    const handleSearch = () => {
        if(search !== ''){
            const result = users.filter((user) => user.firstname.toLowerCase().includes(search.toLowerCase())
            || user.lastname.toLowerCase().includes(search.toLowerCase())
            || user.username.toLowerCase().includes(search.toLowerCase())
            || user.contact.includes(search)
            || user.email.toLowerCase().includes(search.toLowerCase())
            )

            switch (selectedFilter) {
                case "All":
                    setUserList(result)
                    break;
                case "Active":
                    const activeUsers = result.filter((user)=>user.status.status === "Active")
                    setUserList(activeUsers)
                    break;
                case "Disabled":
                    const disabledUsers = result.filter((user)=>user.status.status === "Disabled")
                    setUserList(disabledUsers)
                    break;
                default:
                    break;
            }

        }
    }



  return (
    <main className='w-full overflow-hidden h-full flex flex-col relative p-3'>

    {/* Disable Modal */}
    <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${openDisableModal ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
    {/* <OutsideClickHandler > */}
    <div className='flex flex-col p-3 items-center bg-white w-[100%] semiSm:w-[350px]'>
                {/* Header */}
                <div className='w-full flex gap-2 items-start'>
                <button onClick={()=>{setDisableUserObject({
                    user : {},
                    reason : []
                    });setOpenDisableModal(false)}}>
                    <ArrowBackOutlinedIcon className='text-gray-500' />
                    </button>
                    <h1 className='flex  text-lg text-red-500 font-medium overflow-hidden text-ellipsis'>You are about to disable {disableUserObject.user.firstname} {disableUserObject.user.lastname}</h1>
                </div>

                {/* Reasons */}
                <div className='w-full flex flex-col mt-5'>
                    <h2 className='text-sm whitespace-nowrap font-medium'>What's wrong with the User?</h2>
                    <div className='w-full flex gap-3 flex-wrap mt-3'>
                    {
                        reasons.map((reason, index)=>{
                            return (
                                <button key={index} onClick={()=>handleSelectReason(reason)} className={`whitespace-nowrap ${disableUserObject.reason.includes(reason) ? "bg-blue-500 text-white" : "bg-gray-200"} border rounded-md px-3 py-1 text-sm`}>{reason}</button>
                            )
                        })
                    }
                    </div>
                </div>
                <div className='w-full flex flex-col mt-5'>
                <button disabled={disableUserObject.reason.length === 0} onClick={()=>{disableUser()}} className='py-2 px-3 text-sm disabled:bg-gray-200 disabled:text-gray-400 bg-red-100 text-red-500 rounded-sm hover:bg-red-200'>Confirm</button>
                </div>
    </div>
    {/* </OutsideClickHandler> */}
    </div>

    {/* View Modal */}
    <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${openViewUserModal ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
    {/* <OutsideClickHandler onOutsideClick={()=>setOpenDisableModal(false)}> */}
    {
        selectedUser === null ? ""
        :
        <div className='w-[350px] sm:w-[500px] h-fit bg-white flex flex-col p-3'>
        <div className='flex items-center gap-1 border-b-1 pb-1'>
        <button onClick={()=>setOpenViewUserModal(false)}>
        <ArrowBackIosNewOutlinedIcon fontSize='small' className='p-0.5 text-gray-500' />
        </button>
        <h1 className='text-lg font-medium text-gray-700 '>User Details</h1>
        </div>
        
        {/* Profile Picture */}
        <div className='w-full flex justify-start gap-2 mt-3'>
                <div className='flex-none'>
                <img className='w-14 aspect-square rounded-full object-cover' src={selectedUser.profileImage} />
                </div>
                <div className='w-full h-full flex flex-col items-start justify-evenly'>
                    <p className='font-medium text-gray-600'>{selectedUser.firstname} {selectedUser.lastname}</p>
                    <p className='font-normal text-sm text-gray-500'>#{selectedUser.username}</p>
                </div>
                
        </div>

        {/* Status */}
        <div className='w-full flex flex-col mt-3'>
            <p className='text-sm font-medium text-gray-500'>Status : <span className={`${selectedUser.status.status === "Active" ? "text-green-500" : "text-red-500"} `}>{selectedUser.status.status}</span></p>
            <p className={`text-sm ${selectedUser.status.status === "Disabled" ? "" : "hidden"} font-medium text-gray-500`}>Date issued : 
            <span className='text-gray-700 ml-1'>
            {new Date(selectedUser.status.dateDisabled).toLocaleDateString('En-Us',{
            month : 'short', day : '2-digit', year : 'numeric'
            })}
            </span>
            </p>
            <p className={`text-sm ${selectedUser.status.status === "Disabled" ? "" : "hidden"} font-medium text-gray-500`}>Reasons:</p>
            <div className='w-ful flex flex-wrap gap-2'>
            {
                selectedUser.status.reasons?.map((reason)=>(
                    <p className='text-gray-700  text-sm'>{reason},</p>
                ))
            }
            </div>
        </div>
        {/* Additional Information */}
        <div className='grid grid-cols-1 sm:grid-cols-2 mt-5 gap-3'>
            {/* Email */}
            <div className='w-full flex flex-col'>
            <div className='w-full'>
                <p className='font-medium text-semiSm'>Email</p>
                <div className='p-2 border rounded-sm w-full'>
                <p className='text-sm text-gray-600'>{selectedUser.email}</p>
                </div>
            </div>
            {/* Contact */}
            <div className='w-full'>
                <p className='font-medium text-semiSm'>Contact</p>
                <div className='p-2 border rounded-sm w-full'>
                <p className='text-sm text-gray-600'>+63{selectedUser.contact}</p>
                </div>
            </div>
            </div>
            {/* Bday */}
            <div className='w-full flex flex-col '>
            <div className='w-full'>
                <p className='font-medium text-semiSm'>Birthdate</p>
                <div className='p-2 border rounded-sm w-full'>
                <p className='text-sm text-gray-600'>{selectedUser.birthDate.month} {selectedUser.birthDate.day}, {selectedUser.birthDate.year}</p>
                </div>
            </div>
            {/* Date Registerd */}
            <div className='w-full'>
                <p className='font-medium text-semiSm'>Date of registration</p>
                <div className='p-2 border rounded-sm w-full'>
                <p className='text-sm text-gray-600'>{selectedUser.createdAt}</p>
                </div>
            </div>
        </div>
        </div>
        {/* Address */}
        <div className='mt-3 w-full'>
        <p className='font-medium text-semiSm'>Address</p>
        <div className='p-2 border rounded-sm'>
        {
            selectedUser.Address === null ? 
            <p className='text-sm text-gray-600'>No Address</p>
            :
            <>
            <p className='text-sm text-gray-600'>{selectedUser.Address?.barangay.name}, {selectedUser.Address?.municipality.name.charAt(0) + selectedUser.Address?.municipality.name.slice(1).toLowerCase()}, {selectedUser.Address?.province.name.charAt(0) + selectedUser.Address?.province.name.slice(1).toLowerCase()}</p>
            <p className='text-sm text-gray-600'>{selectedUser.Address?.street}</p>
            </>
        }
        </div>
        </div>
        </div>
        }
    {/* </OutsideClickHandler> */}
    </div>
    
    <header>
        <h1 className='text-xl font-medium text-gray-700 px-5'>List of Users</h1>
    </header>
    {/* Navigation */}
    <div className='w-full flex flex-col semiSm:flex-row items-center justify-start gap-2 mt-3 sm:px-5'>
        <div className='w-full h-full flex items-center space-x-2 relative'>
            <input onKeyDown={(e)=>{if(e.key === "Enter"){}}} value={search} onChange={(e)=>setSearch(e.target.value)} className='border w-full text-sm h-full px-2 py-2 rounded-md' type='search' placeholder='Search...' />
            <button onClick={()=>handleSearch()} className='text-sm bg-themeOrange h-full px-3 text-white rounded-md'>Search</button>
        </div>
    {/* Filters */}
    <div className="w-full  lg:w-[150px] ">   
        <select onChange={(e)=>{handleFilter(e.target.value);setSelectedFilter(e.target.value)}} className="bg-gray-50 w-full semiSm:w-[80px] border border-gray-300 text-gray-900 text-semiSm md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 "
        >
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Disabled">Disabled</option>
        </select>
    </div>
    </div>

   
    
    <div className="flex flex-col w-full h-full overflow-auto overflow-x-scroll px-5 mt-5">
    <table className='w-full overflow-x-auto'>
                <thead>
                    <tr className='border-b-1'>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Username</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Name</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Email</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Contact</p></th>
                        <th className='text-sm text-gray-700 font-medium text-start'><p className='py-2'>Date Created</p></th>
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
                userList?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((user, index) => {
                    const dateCreated = user.createdAt
                    const newCreatedAt = new Date(dateCreated).toLocaleDateString('En-us', {
                            month : 'short',
                            day : '2-digit',
                            year : 'numeric'
                    })
                    return (
                        <tr key={user._id} className='border-b-1'>
                        <td className='text-start text-sm min-w-[200px] max-w-[200px] pr-3'>
                            <p className='py-5 whitespace-nowrap text-ellipsis overflow-hidden'>{user.username}</p>
                        </td>
                        <td className='text-start text-sm min-w-[170px] max-w-[170px] pr-5'>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{user.firstname} {user.lastname}</p>
                        </td>
                        <td className='text-start text-sm min-w-[170px] max-w-[200px] pr-5 '>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{user.email}</p>
                        </td>
                        <td className='text-start text-sm min-w-[170px] max-w-[170px]'>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{user.contact}</p>
                        </td>
                        <td className='text-start text-sm min-w-[120px]'>
                            <p className='py-2 whitespace-nowrap'>{newCreatedAt}</p>
                        </td>
                        <td className='text-start text-sm min-w-[100px]'>
                            <p className={`${user.status.status === "Active" ? "text-green-500" : "text-red-500"} py-5`}>{user.status.status}</p>
                        </td>
                        <td className='text-start text-sm'>
                            <div className='py-5 flex items-center space-x-2'>
                                <button onClick={()=>{setOpenViewUserModal(true);setSelectedUser({...user, createdAt : newCreatedAt})}} className='bg-blue-100 px-2 py-1 rounded-sm text-blue-500'>View</button>
                                {
                                    user.status.status === "Active" ?
                                    <button onClick={()=>{setOpenDisableModal(true);setDisableUserObject({...disableUserObject, user : user})}} className='bg-red-100 px-2 py-1 rounded-sm text-red-500'>Disable</button>
                                    :
                                    <button onClick={()=>enableUser(user._id)} className='bg-green-100 px-2 py-1 rounded-sm text-green-500'>Enable</button>
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
  )
}

export default AdminUsersList