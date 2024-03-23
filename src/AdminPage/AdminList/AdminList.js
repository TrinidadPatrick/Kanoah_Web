import React from 'react'
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import http from "../../http"
import useAdminInfo from '../CustomHooks/useAdminInfo';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useAuth } from '../CustomHooks/AuthProvider';

const AdminList = () => {
    Modal.setAppElement('#root');
    const {authenticated, checkStatus} = useAuth()
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
    const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false)
    const [mainAdminList, setMainAdminList] = useState([])
    const [adminList, setAdminList] = useState([])
    const currentDate = new Date();
    const dateCreated = currentDate.getMonth() + 1 + "-" + currentDate.getDate() + "-" + currentDate.getFullYear();
    const [adminInfo, setAdminInfo] = useState({
        username : "",
        firstname : "",
        lastname : "",
        email : "",
        password : "",
        createdAt : dateCreated
    })
    const [showDropdownFilter, setShowDropdownFilter] = useState(false)
    const [superAdminPassword, setSuperAdminPassword] = useState('')
    const [passwordShort, setPasswordShort] = useState(false)
    const [invalidAdminPassword, setInvalidAdminPassword] = useState(false)
    const [search, setSearch] = useState('')
    const [filterOption, setFilterOption] = useState('All')

    const getAdmins = async () => {
        try {
          const result = await http.get('getAdmins', {withCredentials : true})
          if(result)
          {
            setAdminList(result.data.adminList)
            setMainAdminList(result.data.adminList)
          }
        } catch (error) {
          console.error(error)

        }
      
      
    }

    const modalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : '0',
          width : 'fit-content'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Change the color and opacity as needed
          },
    };

    const addAdmin = async () => {
        try {
            const result = await http.post('addAdmin', adminInfo, {withCredentials : true})
            setAdminInfo({
                username : "",
                firstname : "",
                lastname : "",
                email : "",
                password : "",
                createdAt : dateCreated
            })
            setIsAddAdminModalOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
      if(authenticated === true)
      {
        getAdmins()
      }
    },[authenticated])

    useEffect(() =>{
        checkStatus()
    },[authenticated])

    const handleEdit = (admin) => {
      setAdminInfo({
        _id : admin._id,
        username : admin.username,
        firstname : admin.firstname,
        lastname : admin.lastname,
        email : admin.email,
        password : '',
        createdAt : admin.createdAt
      })

      setIsEditAdminModalOpen(true)
    }

    const handleUpateAdmin = async () => {
      if(adminInfo.password.length !== 0 && adminInfo.password.length < 9)
      {
        setPasswordShort(true)
        return
      }
      try {
        setPasswordShort(false)
        const result = await http.patch(`UpdateAdmin/${adminInfo._id}`, {adminInfo, superAdminPassword}, {withCredentials : true})
        if(result.data)
        {
          setAdminInfo({ 
          username : "",
          firstname : "",
          lastname : "",
          email : "",
          password : "",
          createdAt : dateCreated})
          setIsEditAdminModalOpen(false)
          setSuperAdminPassword('')
        }
      } catch (error) {
        if(error.response.data.message === "Incorrect Password")
        {
          setInvalidAdminPassword(true)
        }
      }
    }

    const disableAdmin = async (adminId) => {
      if(adminId)
      {
        try {
          const result = await http.patch(`DisableAdmin/${adminId}`, {}, {withCredentials : true})
          getAdmins()
        } catch (error) {
          console.log(error)
        }
      }
    }
    const enableAdmin = async (adminId) => {
      if(adminId)
      {
        try {
          const result = await http.patch(`EnableAdmin/${adminId}`, {}, {withCredentials : true})
          getAdmins()
        } catch (error) {
          console.log(error)
        }
      }
    }
    
    const handleFilter = async (option) => {
      let result = []
      switch (option) {
        case "All":
          result = [...mainAdminList]
          break;
        case "Active":
            result = mainAdminList.filter((admin) => admin.status === "Active")
            break;
        case "Disabled":
              result = mainAdminList.filter((admin) => admin.status === "Disabled")
              break;  
        default:
          break;
      }


      if(search !== "")
      {
        result = result.filter((admin) => admin.username.toLowerCase().includes(search.toLowerCase())
        || admin.firstname.toLowerCase().includes(search.toLowerCase())
        || admin.lastname.toLowerCase().includes(search.toLowerCase())
        || admin.email.toLowerCase().includes(search.toLowerCase())
        )

        setAdminList(result)
        return
      }
      setAdminList(result)
    }



  return (
    <div className='w-full overflow-hidden h-full flex flex-col relative p-3'>
        <h1 className='text-2xl font-bold text-gray-800 ml-2 md:ml-5'>Admins</h1>

        {/* Add Admin Modal */}
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${isAddAdminModalOpen ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
        <div className="flex justify-center items-center h-full sm:h-fit w-full relative z-50 sm:w-[400px] rounded-sm bg-gray-100">
          <div className="bg-white w-full h-full p-3 sm:p-8 rounded shadow-md">
            <div>
            <h2 className="text-2xl font-bold mb-4">Add admin</h2>
            </div>
            
            <div>
              <div className="mb-4">
                <label htmlFor="username" className="block text-xs md:text-sm font-medium text-gray-600">
                  Username
                </label>
                <input
                  value={adminInfo.username}
                  onChange={(e)=>{setAdminInfo({...adminInfo, username : e.target.value})}}
                  type="text"
                  id="username"
                  className="mt-1 p-2 w-full border rounded-md text-xs md:text-sm"
                  placeholder="Enter username"
                />
              </div>
              
              <div className='flex gap-2 w-full'>
              <div className="mb-4 w-full">
                <label htmlFor="firstname" className="block text-xs md:text-sm font-medium text-gray-600">
                  Firstname
                </label>
                <input
                  value={adminInfo.firstname}
                  onChange={(e)=>{setAdminInfo({...adminInfo, firstname : e.target.value})}}
                  type="text"
                  id="firstname"
                  className="mt-1 p-2 w-full border rounded-md text-xs md:text-sm"
                  placeholder="Enter firstname"
                />
              </div>
              <div className="mb-4 w-full">
                <label htmlFor="lastname" className="block text-xs md:text-sm font-medium text-gray-600">
                  Lastname
                </label>
                <input
                  value={adminInfo.lastname}
                  onChange={(e)=>{setAdminInfo({...adminInfo, lastname : e.target.value})}}
                  type="text"
                  id="lastname"
                  className="mt-1 p-2 w-full border rounded-md text-xs md:text-sm"
                  placeholder="Enter lastname"
                />
              </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  value={adminInfo.email}
                  onChange={(e)=>{setAdminInfo({...adminInfo, email : e.target.value})}}
                  type="email"
                  id="email"
                  className="mt-1 p-2 w-full border rounded-md text-xs md:text-sm"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  value={adminInfo.password}
                  onChange={(e)=>{setAdminInfo({...adminInfo, password : e.target.value})}}
                  type="password"
                  id="password"
                  className="mt-1 p-2 w-full border rounded-md text-xs md:text-sm"
                  placeholder="Enter password"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-600">
                  Super Admin Password (For confirmation)
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 p-2 w-full border rounded-md text-xs md:text-sm"
                  placeholder="Enter super admin password"
                />
              </div>

              <button onClick={()=>{addAdmin()}} className="bg-blue-500 text-white text-semiSm px-3 py-1.5 rounded-sm hover:bg-blue-600">Register</button>
              <button onClick={()=>{setIsAddAdminModalOpen(false)}} className="bg-gray-400 text-white text-semiSm px-3 py-1.5 rounded-sm hover:bg-gray-300 mx-2">Cancel</button>
            </div>
          </div>
        </div>
        </div>

        {/* Edit Admin Modal */}
        <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${isEditAdminModalOpen ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
        <div className="flex justify-center items-center h-full sm:h-fit w-full relative z-50 sm:w-[400px] rounded-sm bg-gray-100">
        <div className="bg-white w-full h-full p-8 rounded shadow-md">
        <div>
        <h2 className="text-2xl font-bold mb-4">Edit admin</h2>
        </div>
        
        <div className='w-full'>
          <div className="mb-4 w-full">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              value={adminInfo.username}
              onChange={(e)=>{setAdminInfo({...adminInfo, username : e.target.value})}}
              type="text"
              id="Editusername"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter username"
            />
          </div>
          
          <div className='flex gap-2 w-full'>
          <div className="mb-4 w-full">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-600">
              Firstname
            </label>
            <input
              value={adminInfo.firstname}
              onChange={(e)=>{setAdminInfo({...adminInfo, firstname : e.target.value})}}
              type="text"
              id="Editfirstname"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter firstname"
            />
          </div>
          <div className="mb-4 w-full">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-600">
              Lastname
            </label>
            <input
              value={adminInfo.lastname}
              onChange={(e)=>{setAdminInfo({...adminInfo, lastname : e.target.value})}}
              type="text"
              id="Editlastname"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter lastname"
            />
          </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              value={adminInfo.email}
              onChange={(e)=>{setAdminInfo({...adminInfo, email : e.target.value})}}
              type="email"
              id="Editemail"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                Password <span className='text-xs text-gray-600'>(Leave blank if you're not changing it)</span>
              </label>
            <input
              value={adminInfo.password}
              onChange={(e)=>{setAdminInfo({...adminInfo, password : e.target.value})}}
              type="password"
              id="Editpassword"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter password"
            />
            <span className={`text-red-500 ${passwordShort ? "" : "hidden"} text-xs`}>Password must be greater than 8 characters</span>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Super Admin Password (For confirmation)
            </label>
            <input
            value={superAdminPassword}
            onChange={(e)=>setSuperAdminPassword(e.target.value)}
              type="password"
              id="EditconfirmPassword"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter super admin password"
            />
            <span className={`text-red-500 ${invalidAdminPassword ? "" : "hidden"} text-xs`}>Invalid Password</span>
          </div>

          <button onClick={()=>{handleUpateAdmin()}} className="bg-blue-500 text-white text-semiSm px-3 py-1.5 rounded-sm hover:bg-blue-600">Update</button>
          <button onClick={()=>{setIsEditAdminModalOpen(false)}} className="bg-gray-400 text-white text-semiSm px-3 py-1.5 rounded-sm hover:bg-gray-300 mx-2">Cancel</button>
        </div>
      </div>
        </div>
        </div>

        {/* Table */}
        <div className="flex flex-col w-full h-full px-2 md:px-5 mt-5">
        {/* Filters Sort and Search */}
        <div className='flex flex-col  semiSm:flex-row w-full  justify-between semiSm:pr-5 gap-2 items-center relative'>
            {/* Add button */}
            <button onClick={()=>{setIsAddAdminModalOpen(true)}} className='bg-blue-600 hover:bg-blue-400 w-full semiSm:w-fit flex-none flex items-center justify-center text-white px-1.5 py-1 text-sm rounded-sm'>
              <AddOutlinedIcon color='white' fontSize='small' />
              <span className='semiSm:hidden'>Add admin</span>
            </button>
            {/* Search Input */}
            <div className='flex w-full flex-col semiSm:flex-row items-center relative gap-2 h-full'>
            <div className='flex w-full semiSm:w-fit items-stretch h-full'>
            <input value={search} onKeyDown={(e)=>{if(e.key === "Enter"){handleFilter(filterOption)}}} onChange={(e)=>{setSearch(e.target.value)}} type='text' 
            className='border text-sm w-full border-gray-200 rounded-s-sm border-e-0 px-2 h-full' placeholder='Search...' />
            <button onClick={()=>handleFilter(filterOption)} className='px-2 h-full rounded-e-sm border-gray-200 border border-l-0 bg-themeOrange'>
            <SearchOutlinedIcon className='text-white' />
            </button>
            </div>
            {/* Filter button */}
            <div className="w-full semiSm:w-fit ">   
            <select onChange={(e)=>{handleFilter(e.target.value);setFilterOption(e.target.value)}} className="bg-gray-50 w-full lg:w-[95px] border border-gray-300 text-gray-900 text-semiSm md:text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-2 ">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            </select>
            </div>
            </div>
        </div>
        <div className='w-full flex overflow-auto'>
        <table className='w-full overflow-x-auto mt-5'>
          <thead>
            <tr className='border-b-1'>
              <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Username</p></th>
              <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Fullname</p></th>
              <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Email</p></th>
              <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Date Created</p></th>
              <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Status</p></th>
              <th className='text-xs md:text-sm text-gray-700 font-medium text-start'><p className='py-2'>Action</p></th>
            </tr>
          </thead>
          <tbody>
                {
                adminList?.map((admin, index) => {
                  const dateCreated = admin.createdAt
                  const newCreatedAt = new Date(dateCreated).toLocaleDateString('En-us', {
                          month : 'short',
                          day : '2-digit',
                          year : 'numeric'
                  })
                    return (
                        <tr key={admin._id} className='border-b-1'>
                       
                        <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[200px] max-w-[100px] pr-2 md:max-w-[200px] '>
                            <p className='py-6 whitespace-nowrap text-ellipsis overflow-hidden'>{admin.username}</p>
                        </td>
                        <td className='text-start text-xs md:text-sm min-w-[120px] overflow-hidden md:min-w-[170px] max-w-[100px] pr-2 md:max-w-[200px]'>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{admin.firstname} {admin.lastname}</p>
                        </td>
                        <td className='text-start text-xs md:text-sm min-w-[120px] overflow-hidden md:min-w-[170px] max-w-[100px] pr-2 md:max-w-[200px]'>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{admin.email}</p>
                        </td>
                        <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[170px] max-w-[100px] pr-2 md:max-w-[200px]'>
                            <p className='py-2 whitespace-nowrap text-ellipsis overflow-hidden'>{newCreatedAt}</p>
                        </td>
                        <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[170px] max-w-[100px] pr-2 md:max-w-[200px]'>
                            <p className={`py-2 ${admin.status === "Active" ? "text-green-500" : "text-red-500"} whitespace-nowrap text-ellipsis overflow-hidden`}>{admin.status}</p>
                        </td>
                        <td className='text-start text-xs md:text-sm min-w-[100px] overflow-hidden md:min-w-[170px] max-w-[170px]'>
                          <div className='flex items-center gap-2'>
                          <button onClick={()=>{handleEdit(admin)}} className='bg-green-100 hover:bg-green-200 px-2 py-1 rounded-sm text-green-500'>Edit</button>
                          {
                            admin.status === "Active" ? 
                            <button onClick={()=>disableAdmin(admin._id)} className='bg-red-100 hover:bg-red-200 px-2 py-1 rounded-sm text-red-500'>Disable</button>
                            :
                            <button onClick={()=>enableAdmin(admin._id)} className='bg-green-100 hover:bg-green-200 px-2 py-1 rounded-sm text-green-500'>Enable</button>
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
        </div>

    </div>
  )
}

export default AdminList