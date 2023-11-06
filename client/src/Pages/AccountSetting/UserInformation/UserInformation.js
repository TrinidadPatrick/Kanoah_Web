import React from 'react'
import { useEffect, useState } from 'react'
import { DateData } from '../../RegisterPage/RegisterComponents/MMDDYY/Date'
import http from '../../../http'
import jwtDecode from 'jwt-decode'

const UserInformation = () => {
    const [errors, setErrors] = useState({
        contactError : null, //0 = invalid, 1 = isDuplicate
        emailError : null, //0 = invalid, 1 = isDuplicate
        usernameError : null //0 = invalid, 1 = isDuplicate
    })
    const [userInformation, setUserInformation] = useState({username : "",
    email : "",
    password : "",
    firstname: "",
    lastname : "",
    contact : "",
    birthDate : {}})
    const [birthDate, setBirthDate] = useState({
        month : "January",
        day : "1",
        year : DateData.year[0]
    })
    
    // Get the userID
    const getUserId = () => {
    return new Promise((resolve, reject)=>{
        const jwtToken = localStorage.getItem('token')
        if(jwtToken == null){
            reject('Not a valid User')
        }else{
            const id = jwtDecode(jwtToken)._id
            resolve(id)
        }
        
    })
    }

    // Get user
    const getUserInfo = async () => {
        try {
        const userId = await getUserId()
        const response = await http.get(`getUser/${userId}`)
        setUserInformation(response.data)
        } catch (error) {
        console.log(error)
        }
        
        
    }

    useEffect(()=>{
    getUserInfo()
    },[])

    // handle the change of inputs
    const handleChange = (e) => {
        const {name, value} = e.target
        setUserInformation({...userInformation, [name]:value})
    }
    
    // Handles the data change
    const handleDate = (e) => {
        setBirthDate({...birthDate, [e.target.name]: e.target.value})
    }

    // So that whenever birthdate is updated so is the userinfo
  useEffect(()=>{
    setUserInformation({...userInformation, birthDate : birthDate})
    },[birthDate])

    const updateUser = () => {
        const id = userInformation._id
        http.put(`updateUser/${id}`, userInformation).then((res)=>{
        // Set errors if there are any
        
        const status = res.data.status
        switch (status)
        {
        case "usernameDuplicate" : setErrors({usernameError : 1}); break; 
        case "emailDuplicate" : setErrors({emailError : 1}); break;
        case "contactDuplicate" : setErrors({contactError : 1});break;
        case "updated" : window.location.reload(); break;
        }
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    
  return (
    
    <div className='w-full h-full '>
        {
        userInformation == null ? "" :
        (
            
        /* main container */
        <div className='flex'>
        {/* Left side */}
        <section className='flex bg-gray-100 h-screen w-[400px] flex-col px-10'>
        <div className='mt-24'>
        <h1 className='text-2xl font-semibold'>Profile</h1>
        </div>
        {/* Image Container */}
        <div className=' flex flex-col mt-10 p-2 items-center justify-center'>
            <img className='rounded-full w-32' src={userInformation.profileImage} />
            <p className='mt-2 text-sm text-blue-500 underline'>Change profile picture</p>
        </div>

        {/* Account deletion container */}
        <div className='mt-10 bg-gray-200 flex flex-col p-2 rounded-md'>
        <h1 className='font-semibold text-lg text-red-500'>Delete Account</h1>
        <p className='text-sm'>Deleting your account will remove all the datas associated with it.</p>
        <button className='bg-red-500 text-white px-2 py-1 w-fit self-end mt-2 rounded-sm relative '>I understand, delete</button>
        </div>
        </section>

        {/* Right side */}
        <section className=' w-full h-fit '>
        <div className=" w-full h-screen  p-6 pt-[6rem] ">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">User Profile Settings</h1>
            <div>
                {/* Username */}
                <div className="mb-4">
                    <label htmlFor="username" className="text-sm text-gray-600">Username</label>
                    <input onChange={handleChange} type="text" id="username" name="username" className="w-full p-2 border border-gray-300 rounded-md" value={userInformation.username}/>
                    <p className={`text-xs text-red-500 ml-1 ${errors.usernameError == 1 ? "block":"hidden"}`}>Username already exist</p>
                </div>
                {/* Full name */}
                <div className="mb-4 flex w-full space-x-3">
                    <div className='w-full'>
                    <label htmlFor="firstname" className="text-sm text-gray-600">First Name</label>
                    <input onChange={handleChange} type="text" id="firstname" name="firstname" className="w-full p-2 border border-gray-300 rounded-md" value={userInformation.firstname}/>
                    </div>
                    <div className='w-full'>
                    <label htmlFor="lastname" className="text-sm text-gray-600">Last Name</label>
                    <input onChange={handleChange} type="text" id="lastname" name="lastname" className="w-full p-2 border border-gray-300 rounded-md" value={userInformation.lastname}/>
                    </div>
                </div>
                {/* Contact */}
                <div className="mb-4 relative">
                    <label htmlFor="contact" className="text-sm text-gray-600">Contact</label>
                    <div className="relative flex items-center">
                    <input onChange={handleChange} type="text" id="contact" name="contact" className="w-full py-2 ps-9 border border-gray-300 rounded-md pl-8" value={userInformation.contact} />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">+63</span>
                    <div className="absolute h-8 bg-gray-300 top-1/2 -translate-y-1/2 w-px"></div>
                    </div>
                    <p className={`text-xs text-red-500 ml-1 ${errors.contactError == 1 ? "block":"hidden"}`}>Contact already exist</p>
                </div>
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                    <input onChange={handleChange} type="email" id="email" name="email" className="w-full p-2 border border-gray-300 rounded-md" value={userInformation.email}/>
                    <p className={`text-xs text-red-500 ml-1 ${errors.emailError == 1 ? "block":"hidden"}`}>Email already exist</p>
                </div>
                 {/* birth Field */}
                <div className='birth_container w-full '>
                <p className='text-xs text-gray-500 mt-2'>Date of birth</p>
                <div className='select_container w-full flex  space-x-5'>
                <select value={userInformation.birthDate.month} onChange={(e)=>handleDate(e)} name="month" className='border-1 border-gray rounded-sm text-xs'>
                {
                    DateData.months.map((month, index)=>
                    {
                    return (<option key={index} className="text-sm" value={month}>{month}</option>)
                    })
                }
                </select>
                <select value={userInformation.birthDate.day} onChange={(e)=>handleDate(e)} name="day" className='border-1 border-gray rounded-sm text-sm'>
                {
                    DateData.days.map((day, index)=>
                    {
                    return (<option  key={index} value={day}>{day}</option>)
                    })
                }
                </select>
                <select value={userInformation.birthDate.year} onChange={(e)=>handleDate(e)} name="year"  className='border-1 border-gray text-sm rounded-sm'>
                {
                    DateData.year.map((year, index)=>
                    {
                    return (<option key={index} value={year}>{year}</option>)
                    })
                }
                </select>
                </div>
                </div>
                            <div className="mt-4">
                             <button onClick={()=>{updateUser()}} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Save Changes</button>
                            </div>
                        </div>
                    </div>
                    </section>
                </div>
                        )
                    }
                
                
                </div>
  )
}

export default UserInformation