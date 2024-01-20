import React from 'react'
import { useEffect, useState } from 'react'
import { DateData } from '../../RegisterPage/RegisterComponents/MMDDYY/Date'
import http from '../../../http'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import phil from 'phil-reg-prov-mun-brgy';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import cloudinaryCore from '../../../CloudinaryConfig'
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../../ReduxTK/userSlice';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom'



const UserInformation = () => {
  
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId); 
    const [street, setStreet] = useState('')
    const [disableSaveChange, setDisableSaveChange] = useState(true)
    const [isloadingImage, setIsloadingImage] = useState(false)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [isDragging, setIsDragging] = useState(false);
    const [closeAutofill, setCloseAutofill] = useState(false)
    const [places, setPlaces] = useState([])
    const [locationFilterValue, setLocationFilterValue] = useState({
        location : '',
        longitude : '',
        latitude : ''
    })
    const [location, setLocation] = useState({
        longitude : 122.5320,
        latitude : 13.4124
      })
    const [locCodesSelected, setLocCodesSelected] = useState([
        ['', '-1'], //Region
        ['','-1'], //Province
        ['','-1'], //Municipality
        ['','-1'] //Barangay
    ])
    const [open, setOpen] = React.useState(false);
    const [openCPModal, setOpenCPModal] = React.useState(false);
    const [openNPModal, setOpenNPModal] = React.useState(false);
    const [openADModal, setOpenADModal] = React.useState(false);
    const [errors, setErrors] = useState({
        contactError : null, //0 = invalid, 1 = isDuplicate
        emailError : null, //0 = invalid, 1 = isDuplicate
        usernameError : null, //0 = invalid, 1 = isDuplicate
        passwordError : null //0 = invalid, 1 = newPassword and confirm does not mwatch 
    })
    const [userInformation, setUserInformation] = useState({username : "",
    email : "",
    password : "",
    firstname: "",
    lastname : "",
    contact : "",
    Address: {},
    birthDate : {}})
    const [birthDate, setBirthDate] = useState({
        month : "January",
        day : "1",
        year : DateData.year[0]
    })
      

    // Get userInformation
    const getUser = async () => {

          await http.get(`getUser`,{
            // headers : {Authorization: `Bearer ${accessToken}`},
            withCredentials: true,
          }).then((res)=>{
            setUserInformation(res.data)
            setLoading(false)
          }).catch((err)=>{
            navigate('/')
          })
    }

    //Get Tokens fro Local Storage
    useEffect(() => {
      if (userId !== null && userId !== 'loggedOut') {
        getUser();
      }else if(userId === 'loggedOut'){
        navigate("/")
      }
    }, [userId])

    // Clear password input fields
    const clearPasswords = () => {
        setPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    const notify = (message) => {
      toast.success(message, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
  };

    // handle the change of inputs
    const handleChange = (e) => {
        setDisableSaveChange(false)
        const {name, value} = e.target
        setUserInformation({...userInformation, [name]:value})
    }
    
    // Handles the data change
    const handleDate = (e) => {
        setBirthDate({...birthDate, [e.target.name]: e.target.value})
        setDisableSaveChange(false)
    }

    // For Modals
    const handleOpen = () => setOpen(true);
    const handleClose = (event, reason) => {
      if (reason !== 'backdropClick') {
        setOpen(false)
      }
    } 
    const handleOpenCPModal = (e) => {
    e.preventDefault()
    setOpenCPModal(true)};
    const handleCloseCPModal = (event, reason) => {
      if (reason !== 'backdropClick') {
        setOpenCPModal(false)
        clearPasswords()
      }
    } 
    const handleOpenNPModal = (e) => {
    e.preventDefault()
    setOpenNPModal(true)};
    const handleCloseNPModal = (event, reason) => {
      if (reason !== 'backdropClick') {
        setOpenNPModal(false)
        clearPasswords()
      }
    } 
    const handleOpenADModal = () => {setOpenADModal(true)};
    const handleCloseADModal = (event, reason) => {
          if (reason !== 'backdropClick') {
            setOpenADModal(false)

          }
        } 
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 0,
        padding : 0,
        borderRadius : 1,
  
        
      };

    // So that whenever birthdate is updated so is the userinfo
  useEffect(()=>{
    setUserInformation({...userInformation, birthDate : birthDate})
    },[birthDate])

    // Updates the user Information
    const updateUser = async () => {
        const result = await verifyPassword()
        if(result.status == "verified")
        {
        http.put(`updateUser/${userId}`, userInformation,{
          withCredentials: true,
        }).then((res)=>{
        // Set errors if there are any
        const status = res.data.status
        setLoadingBtn(false)
        switch (status)
        {
        case "usernameDuplicate" : setErrors({usernameError : 1}); break; 
        case "emailDuplicate" : setErrors({emailError : 1}); break;
        case "contactDuplicate" : setErrors({contactError : 1});break;
        case "updated" : window.location.reload(); break;
        }
        handleCloseCPModal()
        }).catch((err)=>{
            console.log(err)
        })
        }
        else
        {
            setErrors({passwordError : 0})
            setLoadingBtn(false)
        }
        
        
    }
    // Handles the location seleced by the user
    const handleLocationSelect = (value, index) => {
        const newData = [...locCodesSelected]
        newData.splice(index, 1, value)
        setLocCodesSelected(newData)
        
    }

    // Submits the selected address
    const submitAddress = () => {
        
        const address = {
          region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
          province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
          municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
          barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
          street : street,
          longitude : location.longitude,
          latitude : location.latitude
        }
        const newData = {...userInformation, Address : address} 
        setUserInformation(newData)
        http.put(`updateUser/${userId}`, newData,{
          withCredentials: true,
        }).then(()=>{
          handleClose()
          notify('Update successfull')
        }).catch((error)=>{
          throw error
        })
        
    }
    // Get my location
    useEffect(() => {
        // Use the Geolocation API to get the user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              
            },
            (error) => {
              // Handle any errors here
              console.error('Geolocation error:', error);
            }
          );
        } else {
          // Geolocation is not available in this browser
          console.error('Geolocation is not available.');
        }
      }, []);

    // Map Viewport
    const [viewport, setViewPort] = useState({    
        width: "100%",
        height: "100%",
        zoom : 16,
        latitude : location.latitude,
        longitude : location.longitude
      })

      // For autofill location search
      useEffect(() => {
        const accessToken = 'pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw'; // Replace with your actual Mapbox access token
        const location = locationFilterValue.location; // Replace with your desired location
      
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ydzQ2YzYwNWhvMmtyeTNwNDl3ejNvIn0.9n7wjqLZye4DtZcFneM3vw`)
          .then((res) => {
           setPlaces(res.data.features) // Logging the response data
           

          })
          .catch((err) => {
            console.log(err);
          });
      }, [locationFilterValue]);

    //   password validation for update information
    const verifyPassword = async () => {
        const data = {
          _id: userInformation._id,
          password: password,
        };
      
        if(password !== "")
        {
          setLoadingBtn(true)
          // Return the Promise here
        return http.post('verifyPassword', data)
        .then((res) => {
          console.log(res.data);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });
        }
        
      };

    // For profile picture
    const addImage = async (files) => {
        setIsloadingImage(true)
        const file = files[0];

        if(file){
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'KanoahProfileUpload');

            axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`, formData).then((res)=>{
            setUserInformation({...userInformation, profileImage : res.data.url})
            const newData = {...userInformation, profileImage : res.data.url}
            http.put(`updateUser/${userId}`, newData,{
              withCredentials: true,
            }).then(()=>{
              handleClose()
              notify('Update successfull')
            }).catch((error)=>{
              throw error
            })
            setIsloadingImage(false)
            }).catch((err)=>{
                console.log(err)
            })
        }
    }
    
    // For removing profile
    const removeProfile = () => {
        const firstname = userInformation.firstname
        const lastname = userInformation.lastname
        const url = `https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=0D8ABC&color=fff`
        setUserInformation({...userInformation, profileImage : url})
        const newData = {...userInformation, profileImage : url}
        http.put(`updateUser/${userId}`, newData,{
          withCredentials: true,
        }).then(()=>{
          handleClose()
          notify('Update successfull')
          getUser()
        }).catch((error)=>{
          throw error
        })
    }

    // FOr change password
    const changePassword = async () => {
        if(newPassword != confirmPassword){setErrors({passwordError : 1})}
        else if(newPassword == "" && confirmPassword == ""){setErrors({passwordError : 0})}
        else if(password != "" && newPassword === confirmPassword)
        {
        const id = userInformation._id
        const data = {
            _id : id,
            password : password,
            newPassword : newPassword
        }
            await http.patch('updatePassword', data).then((res)=>
            
            {
            console.log(res.data)
            if(res.data.status == "updated")
            {
                window.location.reload()
            }
            else
            {
                setErrors({passwordError : 0})
            }
            
            }).catch((err)=>console.log(err))

        }else
        {
            setErrors({passwordError : 0}) // meaning passwordfield is invalid
        }
    }

    const deactivateAccount = async () => {
        if(password != "")
        {
            const id = userInformation._id
            const data = {
                _id : id,
                password : password
            }

            http.patch('deactivateAccount', data).then((res)=>{
            if(res.data.status == "Deactivated"){handleCloseADModal();localStorage.clear();window.location.reload()
            }
            else if (res.data.status == "invalid"){setErrors({passwordError : 0})}
            }).catch((err)=>{
                console.log(err)
            })

        }
    }

    useEffect(()=>{

      if(userInformation.Address?.region !== undefined)
      {

        setLocCodesSelected(
          [
            [userInformation.Address.region.name, userInformation.Address.region.reg_code],
            [userInformation.Address.province.name, userInformation.Address.province.prov_code],
            [userInformation.Address.municipality.name, userInformation.Address.municipality.mun_code],
            [userInformation.Address.barangay.name, userInformation.Address.barangay.brgy_code]
          ]
        )
      }
      
    },[userInformation])

      return (
    
    <div className='w-full h-full '>
        {
        loading ? 
        (
          <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
            </div>
        ) :
        (
            
        /* main container */
        <div className='flex flex-col lg:flex-row'>
        {/* Left side */}
        <section className='flex bg-white h-fit lg:h-full w-full lg:w-[400px] flex-col px-10'>
        <div className='mt-5'>
        <h1 className='text-2xl font-semibold'>Profile</h1>
        </div>
        <div className='w-full flex flex-col justify-between h-full pb-10'>
        {/* Image Container */}
        <div className=' flex flex-col lg:mt-10 p-2 items-center justify-center'>
        <img className='rounded-full object-cover w-24 h-24 lg:w-32 lg:h-32 max-h-32 max-w-32' src={userInformation.profileImage} />
        <div className='flex flex-col mt-5 space-y-2 w-full '>
        {/* INput Profile Picture */}
        <label htmlFor="fileInput" className={`${isloadingImage ? "bg-orange-300" : "bg-themeOrange"} relative inline-block px-4 py-1 text-white text-center rounded cursor-pointer`}>
        {isloadingImage ? "Uploading" : "Change Picture"}
        <input type="file" onChange={(e)=>{addImage(e.target.files)}} id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </label>
        <button onClick={()=>{removeProfile()}} className='px-2 py-1 rounded-sm text-sm whitespace-nowrap border'>Remove Picture</button>
        </div>
        </div>

        {/* Account deletion Warning */}

        <p onClick={()=>handleOpenADModal()} className='text-center text-red-500 cursor-pointer'>Deactivate account</p>
        </div>
        </section>

        {/* Right side */}
        <section className=' w-full h-fit '>
        <div className=" w-full h-fit lg:h-full  p-6 lg:pt-[1.3rem] ">
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">User Profile Settings</h1>
            <form onSubmit={(e)=>{handleOpenCPModal(e)}}>
                {/* Username */}
                <div className="mb-4">
                    <label htmlFor="username" className="text-sm text-gray-600">Username</label>
                    <input onChange={handleChange} type="text" id="username" name="username" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userInformation.username}/>
                    <p className={`text-xs text-red-500 ml-1 ${errors.usernameError == 1 ? "block":"hidden"}`}>Username already exist</p>
                </div>
                {/* Full name */}
                <div className="mb-4 flex w-full space-x-3">
                    <div className='w-full'>
                    <label htmlFor="firstname" className="text-sm text-gray-600">First Name</label>
                    <input onChange={handleChange} type="text" id="firstname" name="firstname" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userInformation.firstname}/>
                    </div>
                    <div className='w-full'>
                    <label htmlFor="lastname" className="text-sm text-gray-600">Last Name</label>
                    <input onChange={handleChange} type="text" id="lastname" name="lastname" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userInformation.lastname}/>
                    </div>
                </div>
                {/* Contact */}
                <div className="mb-4 relative flex items-end space-x-3 ">
                    <div className='w-1/2'>
                    <label htmlFor="contact" className="text-sm text-gray-600">Contact</label>
                    <div className="relative flex items-center">
                    <input onChange={handleChange} type="text" id="contact" name="contact" className="w-full py-2 ps-9 border border-gray-300 rounded-md pl-8 shadow-sm" value={userInformation.contact} />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">+63</span>
                    <div className="absolute h-8 bg-gray-300 top-1/2 -translate-y-1/2 w-px"></div>
                    </div>
                    <p className={`text-xs text-red-500 ml-1 ${errors.contactError == 1 ? "block":"hidden"}`}>Contact already exist</p> 
                    </div>
                    {/* Change Password */}
                    <div className='w-1/2 flex flex-col'>
                    <label htmlFor="changePassword" className="text-sm text-gray-600">Password Settings</label>
                    <button onClick={(e)=>{handleOpenNPModal(e)}} className='bg-gray-100 py-2 px-5 w-fit text-xs md:text-sm  rounded-sm shadow-sm text-gray-700 border flex  items-center gap-1 '> Change Password</button>
                    </div>
                    
                    
                </div>
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                    <input onChange={handleChange} type="email" id="email" name="email" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userInformation.email}/>
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


                {/* Address */}
                <p className='text-sm text-gray-500 mt-4'>Address</p>
                {
                    userInformation.Address?.region === undefined ? 
                    (
                    <p onClick={()=>{handleOpen()}} className=' cursor-pointer font-normal hover:text-gray-600 border-1 underline w-fit px-2 py-1 rounded-md'>Setup your Address <EditLocationOutlinedIcon fontSize='small' className='ml-1 text-gray-500' /></p>
                    )
                    :
                    (
                        <p onClick={()=>{handleOpen()}} className=' cursor-pointer text-sm font-medium border-1 underline w-fit px-2 py-1 rounded-md'>{
                            `Brgy. ${userInformation.Address.barangay.name}, ${userInformation.Address.municipality.name}, ${userInformation.Address.province.name}`
                                
                            }</p>
                    )
                }
                
                        
                <div className="mt-2 lg:mt-4">
                {/* <button onClick={(e)=>{handleOpenCPModal(e)}} className="bg-blue-500 text-white px-2 py-1 lg:py-2 text-sm lg:text-md lg:px-4 rounded-sm lg:rounded-md hover:bg-blue-600">Save Changes</button> */}
                <button type='submit' disabled={disableSaveChange}className={` disabled:bg-orange-200 bg-orange-500 hover:bg-orange-400 text-white px-2 py-1 lg:py-2 text-sm lg:text-md lg:px-4 rounded-sm lg:rounded-sm`}>Save Changes</button>
                </div>
                </form>
        </div>
              
        </section>
        </div>
        )}
                        {/* Modal for Address */}
                <Modal open={open} onClose={handleClose}> 
                <Box sx={style} style={{height: "fitContent", width: "fitContent"}}> 
                <div className='p-4'>
                <h1 className='font-medium'>Address</h1>
                {/* Regions ***************************************/}
                <div className="mb-4">
                <label htmlFor="region" className="text-sm text-gray-600">Region</label>
                <select
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 0);console.log("Hello")}}
                id="region"
                name="region"
                value={locCodesSelected[0][0] + ',' + locCodesSelected[0][1]}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                <option className='w-fit' value=""  >Select Region</option>
                {
                phil.regions.map((regions, index)=>(
                <option key={index} value={[regions.name , regions.reg_code]}>{regions.name}</option>
                ))
                }
                </select>
                </div>


                {/* Provinces***************************************************************** */}
                <div className="mb-4">
                <label htmlFor="province" className="text-sm text-gray-600">Province</label>
                <select
                 disabled={`${locCodesSelected[0][1] == "-1" ? "disabled" : ""}`}
                 onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 1)}}
                 id="province"
                 name="province"
                 value={locCodesSelected[1][0] + ',' + locCodesSelected[1][1]}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                <option value="" disabled >Select Province</option>
                {
                phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province, index)=>(
                <option key={index} value={[province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase() , province.prov_code]}>{province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase()}</option>
                ))
                }
                </select>
                </div>


                {/* Cities ***********************************************************/}
                <div className="mb-4">
                <label htmlFor="city" className="text-sm text-gray-600">City</label>
                <select
                disabled={`${locCodesSelected[1][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),2)}}
                id="city"
                name="city"
                value={locCodesSelected[2][0] + ',' + locCodesSelected[2][1]}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                >
                <option value="" disabled >Select City</option>
                {
                phil.getCityMunByProvince(locCodesSelected[1][1]).sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
                <option key={index} onClick={()=>{console.log("Hello")}}  value={[city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase(), city.mun_code]}>
                {city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}
                </option>
                ))
                }
                </select>
                </div>


                {/* Barangays *****************************************************************8*/}
                <div className="mb-4">
                <label htmlFor="barangay" className="text-sm text-gray-600">Barangay</label>
                <select
                disabled={`${locCodesSelected[2][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),3)}}
                id="barangay"
                name="barangay"
                value={locCodesSelected[3][0] + ',' + locCodesSelected[3][1]}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"

                >
                <option value="" disabled  >Select Barangay</option>
                {
                phil.getBarangayByMun(locCodesSelected[2][1]).sort((a, b) => a.name.localeCompare(b.name)).map((barangay, index)=>(
                <option key={index} value={[barangay.name , barangay.mun_code]}>{barangay.name}</option>
                ))
                }
                </select>
                </div>
                

                {/* MAP******************************************************************* */}
            <div className='relative'>
            <ReactMapGL
            {...viewport}
            onViewportChange={(newViewport) => setViewPort(newViewport)}
            // onClick={()=>{window.open(`https://www.google.com/maps?q=${location.latitude},${location.longitude}`, '_black')}}
            draggable={true}
            onMove={evt => setViewPort(evt.viewport)}
            mapboxAccessToken="pk.eyJ1IjoicGF0cmljazAyMSIsImEiOiJjbG8ybWJhb2MwMmR4MnFyeWRjMWtuZDVwIn0.mJug0iHxD8aq8ZdT29B-fg"
            mapStyle="mapbox://styles/patrick021/clo2m5s7f006a01rf9mtv318u"
            style={{
              width: "100%",
              height: "250px",
              backgroundColor : "none",
              position: "relative",
              borderRadius: "10px",
              marginBottom: "7px",
              top: "10px", // Use top instead of marginTop
              transition: "width 0.5s, height 0.5s, top 0.5s",
            }}
            onLoad={() => {
                const newViewport = {
                  ...viewport,
                  latitude: location.latitude,
                  longitude: location.longitude,
                };
                setViewPort(newViewport);
              }}

            >
            <Marker
            latitude={location.latitude}
            longitude={location.longitude}
            draggable={true}
            onDragStart={()=>{setIsDragging(true)}}
            // onDrag={(evt) => {setLocation({longitude : evt.lngLat.lng, latitude : evt.lngLat.lat});setViewPort({longitude : evt.lngLat.lng, latitude : evt.lngLat.lng})}}
            onDrag={(evt) => {
                const sensitivityFactor = 1;
                const newLocation = {
                  longitude: evt.lngLat.lng / sensitivityFactor,
                  latitude: evt.lngLat.lat / sensitivityFactor,
                };
                setLocation(newLocation);
                setViewPort((prevViewport) => ({
                  ...prevViewport,
                  latitude: newLocation.latitude,
                  longitude: newLocation.longitude ,
                }));
              }}
            onDragEnd={()=>[setIsDragging(false)]}
            >
        
            </Marker>
            <GeolocateControl />
            
            </ReactMapGL>
            {/* Location Filter Search*/}
            <div className='flex flex-col w-1/2 space-y-1 absolute top-4 left-2'>
            <div className="w-full shadow-sm mx-auto rounded-lg overflow-hidden md:max-w-xl">
            <div className="md:flex">
            <div className="w-full">
            <div className="relative">
            <SearchOutlinedIcon fontSize='small' className="absolute text-gray-400 top-[0.69rem] left-2"/>
            <input value={locationFilterValue.location} onChange={(e)=>{setLocationFilterValue({location : e.target.value});setCloseAutofill(false)}} placeholder="Enter location" type="text" className="bg-white h-10 w-full ps-8 pe-2 text-semiXs border rounded-lg focus:outline-none hover:cursor-arrow" />
            </div> 
            </div>
            </div>
            </div>

            <div className={`${closeAutofill == true && locationFilterValue.location != "" ? "hidden" : locationFilterValue.location != "" && !closeAutofill ? "relative"  : "hidden"} bg-white h-44 overflow-auto flex flex-col shadow-sm border rounded-sm`}>
            {
            places.map((place, index) => {
                return (
                <div
                    key={index}
                    onClick={() => {
                    setLocationFilterValue({
                        location: place.place_name,
                        longitude: place.center[0],
                        latitude: place.center[1],
                    });
                    setLocation({
                        longitude: place.center[0],
                        latitude: place.center[1],
                    });

                    // Update the location first and then set the viewport
                    const newViewport = {
                        ...viewport,
                        latitude: place.center[1],  // Use the new latitude
                        longitude: place.center[0], // Use the new longitude
                    };
                    setViewPort(newViewport);
                    setCloseAutofill(true)
                    }}
                    className='m-3 flex flex-col items-start cursor-pointer '
                >
                    <h1 className=' text-sm font-semibold'>{place.text}</h1>
                    <p className=' text-[0.72rem]'>{place.place_name}</p>
                </div>
                );
            })
                }
            </div>
            </div>
            </div>
            <div className=' flex justify-end space-x-2'>
            <button onClick={()=>{submitAddress()}} className='px-3 py-1 bg-themeBlue hover:bg-slate-700 text-white rounded-sm mt-4'>Save</button>
            <button onClick={()=>{handleClose()}} className='px-3 py-1 bg-gray-200 text-black rounded-sm mt-4'>Cancel</button>
            </div>
            
            </div>
            
                </Box>
                </Modal> 

                {/* Modal for confirm Password */}
                <Modal open={openCPModal} onClose={handleCloseCPModal}> 
                <Box sx={style} style={{height: "fitContent", width: "fitContent", padding: "15px"}}>
                <div className='w-full flex justify-between'>
                <h1 className='font-medium text-gray-800'>Confirm Password</h1>
                <CloseOutlinedIcon onClick={()=>{handleCloseCPModal()}} className=' cursor-pointer ' />
                </div>
                
                <div className="mb-0">
                <label htmlFor="password" className="text-sm text-gray-600">
                    For your security, please enter password to continue.
                </label>
                <input
                value={password}
                onKeyDown={(e)=>{if(e.key === "Enter"){updateUser()}}}
                onChange={(e)=>setPassword(e.target.value)}
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                />
                <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                <button onClick={()=>{updateUser()}} className={`${loadingBtn ? "bg-slate-700" : "bg-themeBlue"}  text-sm w-full text-white px-2 py-1 rounded-sm mt-4`}>Update</button>
                </div>
                </Box>
                </Modal>

                {/* Modal for Change Password */}
                <Modal open={openNPModal} onClose={handleCloseNPModal}> 
                <Box sx={style} style={{height: "fitContent", width: "fitContent", padding: "10px"}}>
                <div className='w-full flex justify-end  '><CloseOutlinedIcon onClick={()=>{handleCloseNPModal()}} className=' cursor-pointer ' /></div>
                <div className="space-y-4">

                <div className="flex flex-col">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-600">Current Password</label>
                    <input
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                    id="password"
                    name="newPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Enter your new password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                    
                </div>


                <div className="flex flex-col">
                    <label htmlFor="newPassword" className="text-sm font-semibold text-gray-600">New Password</label>
                    <input
                    value={newPassword}
                    onChange={(e)=>{setNewPassword(e.target.value)}}
                    type="password"
                    id="newPassword"
                    name="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Enter your password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 1 ? "block":"hidden"}`}>Password do not match</p>
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                </div>


                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-600">Confirm Password</label>
                    <input
                    value={confirmPassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Confirm your password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 1 ? "block":"hidden"}`}>Password do not match</p>
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                </div>
                <button onClick={()=>{changePassword()}} className='px-2 py-1 bg-gray-200'>Update</button>
                </div>
                </Box>
                </Modal>

                {/* Modal for Account deletion */}
                <Modal open={openADModal} onClose={handleCloseADModal}> 
                <Box sx={style} style={{height: "fitContent", width: "fitContent", padding: "10px", outline : "none", width : "350px"}}>
   
                <p className="text-lg font-semibold mb-4 text-center">Confirm Account Deactivate</p>
                <p className="text-gray-600 mb-6 text-center">Are you sure you want to deactivate your account? This action is irreversible.</p>
                <div className="flex justify-center">
                
                {/* Password Input */}
                <div className='flex flex-col'>
                <div className="flex flex-col">

                    <input
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                    id="password"
                    name="newPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Enter your new password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                    
                </div>
                <div className=' w-full mt-5 flex justify-center'>
                <button onClick={()=>{deactivateAccount()}}  className="bg-red-500 text-white py-2 px-4 rounded mr-4 hover:bg-red-600" >Yes, Delete</button>
                <button onClick={()=>handleCloseADModal()} className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400" >Cancel</button>
                </div>
                </div>

                </div>
                </Box>
                </Modal>
                <ToastContainer />
        </div>
  )
}

export default UserInformation