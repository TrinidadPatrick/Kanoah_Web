import React from 'react'
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import http from "../http"
import useAdminInfo from './CustomHooks/useAdminInfo';
import { useAuth } from './CustomHooks/AuthProvider';

const AdminList = () => {
    Modal.setAppElement('#root');
    const {authenticated, checkStatus} = useAuth()
    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false)
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

    const getAdmins = async () => {
        try {
          const result = await http.get('getAdmins', {withCredentials : true})
          if(result)
          {
            setAdminList(result.data.adminList)
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
          padding : '0'
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

    

  return (
    <div className='w-full h-full flex flex-col p-3'>
        <h1 className='text-2xl font-bold text-gray-800'>Admin Users</h1>

        <div className='flex mt-5'>
            <button onClick={()=>{setIsAddAdminModalOpen(true)}} className='bg-blue-600 text-white px-3 py-2 text-sm rounded-sm'>Add admin</button>
        </div>

        {/* admin list table */}
        <div className='w-full mt-5 border rounded-sm'>
          <table className='w-full table-auto'>
              <thead>
                <tr>
                  <td className='font-medium text-gray-800'>No.</td>
                  <td className='font-medium text-gray-800'>Username</td>
                  <td className='font-medium text-gray-800'>Firstname</td>
                  <td className='font-medium text-gray-800'>Lastname</td>
                  <td className='font-medium text-gray-800'>Date Created</td>
                  <td className='font-medium text-gray-800'>Options</td>
                </tr>
              </thead>
              <tbody>
                {
                  adminList?.map((admin, index)=>{
                    return (
                      <tr className={`border last:border-b-0 border-x-0`} key={admin._id}>
                      <td>
                        <div className='py-3'>
                        {index + 1}
                        </div>
                      </td>
                      <td>
                        <div className='py-3'>
                        {admin.username}
                        </div>
                      </td>
                      <td>
                        <div className='py-3'>
                        {admin.firstname}
                        </div>
                      </td>
                      <td>
                        <div className='py-3'>
                        {admin.lastname}
                        </div>
                      </td>
                      <td>
                        <div className='py-3'>
                        {admin.createdAt}
                        </div>
                      </td>
                      <td>
                        <button>Edit</button>
                        <button>Disable</button>
                      </td>
                      </tr>
                    )
                  })
                }
              </tbody>
          </table>
        </div>

        <Modal isOpen={isAddAdminModalOpen} style={modalStyle} contentLabel="Add Admin Modal">
        <div className="flex justify-center items-center h-fit w-[400px] bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <div>
        <h2 className="text-2xl font-bold mb-4">Add admin</h2>
        </div>
        
        <div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              value={adminInfo.username}
              onChange={(e)=>{setAdminInfo({...adminInfo, username : e.target.value})}}
              type="text"
              id="username"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter username"
            />
          </div>
          
          <div className='flex gap-2'>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-600">
              Firstname
            </label>
            <input
              value={adminInfo.firstname}
              onChange={(e)=>{setAdminInfo({...adminInfo, firstname : e.target.value})}}
              type="text"
              id="firstname"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter firstname"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-600">
              Lastname
            </label>
            <input
              value={adminInfo.lastname}
              onChange={(e)=>{setAdminInfo({...adminInfo, lastname : e.target.value})}}
              type="text"
              id="lastname"
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
              id="email"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              value={adminInfo.password}
              onChange={(e)=>{setAdminInfo({...adminInfo, password : e.target.value})}}
              type="password"
              id="password"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
              Super Admin Password (For confirmation)
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 w-full border rounded-md text-sm"
              placeholder="Enter super admin password"
            />
          </div>

          <button onClick={()=>{addAdmin()}} className="bg-blue-500 text-white text-semiSm px-3 py-1.5 rounded-sm hover:bg-blue-600">Register</button>
          <button onClick={()=>{setIsAddAdminModalOpen(false)}} className="bg-gray-400 text-white text-semiSm px-3 py-1.5 rounded-sm hover:bg-gray-300 mx-2">Cancel</button>
        </div>
      </div>
    </div>
        </Modal>
    </div>
  )
}

export default AdminList