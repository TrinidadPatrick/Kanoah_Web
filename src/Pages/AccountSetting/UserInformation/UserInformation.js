import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { DateData } from '../../RegisterPage/RegisterComponents/MMDDYY/Date'
import http from '../../../http'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from 'react-modal';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import phil from 'phil-reg-prov-mun-brgy';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import cloudinaryCore from '../../../CloudinaryConfig'
import mapboxgl from 'mapbox-gl';
import getCroppedImg from '../../ServiceSetting/ForCropping/CreateImage';
import Cropper from 'react-easy-crop'
import UseInfo from '../../../ClientCustomHook/UseInfo'
import { useNavigate } from 'react-router-dom'
import GoogleMap from './GoogleMap'



const UserInformation = () => {
  Modal.setAppElement('#root');
    const {authenticated, userInformation} = UseInfo()
    const navigate = useNavigate()
    const [street, setStreet] = useState('')
    const [disableSaveChange, setDisableSaveChange] = useState(true)
    const [isloadingImage, setIsloadingImage] = useState(false)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingBtn, setLoadingBtn] = useState(false)
    const [loadingDeac, setLoadingDeac] = useState(false)
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
    const [openCPModal, setOpenCPModal] = useState(false);
    const [openNPModal, setOpenNPModal] = useState(false);
    const [openADModal, setOpenADModal] = useState(false);
    const [openCropModal, setOpenCropModal] = useState(false);
    const [errors, setErrors] = useState({
        contactError : null, //0 = invalid, 1 = isDuplicate
        emailError : null, //0 = invalid, 1 = isDuplicate
        usernameError : null, //0 = invalid, 1 = isDuplicate
        passwordError : null //0 = invalid, 1 = newPassword and confirm does not mwatch 
    })
    const [userDetails, setUserDetails] = useState({username : "",
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
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [image, setImage] = useState('');
    const [Addresserror, setAddressError] = useState({
      region : false,
      province : false,
      municipality : false,
      barangay : false,
    })
    

    // protected route
    useEffect(() => {
      if (authenticated) {
        setUserDetails(userInformation)
        setStreet(userInformation.Address?.street)
        setLoading(false)
      }else if(authenticated === false){
        navigate("/")
      }
    }, [authenticated])

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
        setUserDetails({...userDetails, [name]:value})
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

    const ModalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : "0px"
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Change the color and opacity as needed
          zIndex: 998,
        },
    };

      const CropperModalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding : "0"
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Change the color and opacity as needed
          zIndex: 998,
        },
      };

    // So that whenever birthdate is updated so is the userinfo
  useEffect(()=>{
    setUserDetails({...userDetails, birthDate : birthDate})
    },[birthDate])

    // Updates the user Information
    const updateUser = async () => {
        const result = await verifyPassword()
        if(result.status == "verified")
        {
        http.put(`updateUser/${userInformation._id}`, userDetails,{
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
    const handleLocationSelect = (value, index, optionChanges) => {
      const newData = [...locCodesSelected]
      switch (optionChanges) {
          case 'region':
          
            setLocCodesSelected([
              [value[0], value[1]],
              ['', '-1'], // Province
              ['', '-1'], // Municipality
              ['', '-1']  // Barangay
            ]);
            break;
          
          case 'province':

              setLocCodesSelected([
                  [newData[0][0], newData[0][1]],
                  [value[0], value[1]], // Province
                  ['', '-1'], // Municipality
                  ['', '-1']  // Barangay
              ]);
              break;
          
          case 'city':

          setLocCodesSelected([
              [newData[0][0], newData[0][1]],
              [newData[1][0], newData[1][1]], // Province
              [value[0], value[1]], // Municipality
              ['', '-1']  // Barangay
          ]);
          break;

          case 'barangay':

          setLocCodesSelected([
              [newData[0][0], newData[0][1]],
              [newData[1][0], newData[1][1]], // Province
              [newData[2][0], newData[2][1]], // Municipality
              [value[0], value[1]]  // Barangay
          ]);
          break;
        }
        
    }

    // Submits the selected address
    const submitAddress = () => {
        let hasError = false
        const address = {
          region : {name : locCodesSelected[0][0], reg_code : locCodesSelected[0][1]},
          province :  {name : locCodesSelected[1][0], prov_code : locCodesSelected[1][1]},
          municipality : {name : locCodesSelected[2][0], mun_code : locCodesSelected[2][1]},
          barangay : {name : locCodesSelected[3][0], brgy_code : locCodesSelected[3][1]},
          street : street,
          longitude : location.longitude,
          latitude : location.latitude
        }

        Object.entries(address).map(([key, value])=>{
          if(typeof value === "object" && (value.name === undefined || value.name === '')){
            setAddressError((prevError) => ({...prevError, [key] : true}))
            hasError = true
          }
          else{
            // console.log(`${key} has value`)
            setAddressError((prevError) => ({...prevError, [key] : false}))
          }
        })

        if(!hasError)
        {
          const newData = {...userDetails, Address : address} 
          setUserDetails(newData)
          http.put(`updateUser/${userInformation._id}`, newData,{
            withCredentials: true,
          }).then(()=>{
            handleClose()
            notify('Update successful')
          }).catch((error)=>{
            throw error
          })
        }
       
        
    }

    // Get my location
    useEffect(() => {
        // Use the Geolocation API to get the user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if(userInformation?.Address !== null)
              {
                setLocation({ latitude : userInformation?.Address?.latitude, longitude :  userInformation?.Address?.longitude })
              }
              else
              {
                setLocation({ latitude, longitude });
              }
             
              
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
      }, [userInformation]);

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
    const addImage = async (croppedImage) => {
        setIsloadingImage(true)

        const upload = async (formData) => {

            axios.post(`https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`, formData).then((res)=>{
            setUserDetails({...userDetails, profileImage : res.data.secure_url})
            const newData = {...userInformation, profileImage : res.data.secure_url}
            http.put(`updateUser/${userInformation._id}`, newData,{
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

        if(croppedImage){
          setIsloadingImage(true)
          fetch(croppedImage)
          .then(response => response.blob())
          .then(blobData => {
            const formData = new FormData();
            formData.append('file', blobData, 'filename.jpg');
            formData.append('upload_preset', 'KanoahProfileUpload');
            upload(formData)
          })
        }
    }
    
    // For removing profile
    const removeProfile = () => {
        const firstname = userInformation.firstname
        const lastname = userInformation.lastname
        const url = `https://ui-avatars.com/api/?name=${firstname}+${lastname}&background=0D8ABC&color=fff`
        setUserDetails({...userDetails, profileImage : url})
        const newData = {...userDetails, profileImage : url}
        http.put(`updateUser/${userInformation._id}`, newData,{
          withCredentials: true,
        }).then(()=>{
          handleClose()
          notify('Update successfull')
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
      setLoadingDeac(true)
        if(password != "")
        {
            const id = userInformation._id
            const data = {
                _id : id,
                password : password
            }

            http.patch('deactivateAccount', data).then((res)=>{
              console.log(res.data)
            if(res.data.status == "Deactivated"){
              http.get('userLogout', {withCredentials : true}).then((res)=>{
                setLoadingDeac(false)
                window.location.reload()
              })
            }
            else if (res.data.status == "invalid"){setErrors({passwordError : 0})}
            }).catch((err)=>{
                console.log(err)
            })

        }
    }

    useEffect(()=>{

      if(userDetails.Address?.region !== undefined)
      {

        setLocCodesSelected(
          [
            [userDetails.Address.region.name, userDetails.Address.region.reg_code],
            [userDetails.Address.province.name, userDetails.Address.province.prov_code],
            [userDetails.Address.municipality.name, userDetails.Address.municipality.mun_code],
            [userDetails.Address.barangay.name, userDetails.Address.barangay.brgy_code]
          ]
        )

        
      }
      
    },[userDetails])

    const cropImage = (files) => {
      const file = files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = () => {
          setImage(reader.result);
          setOpenCropModal(true)
        };
  
        reader.readAsDataURL(file);
      }
    }

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    }, []);
  
    const showCroppedImage = useCallback(async () => {
      try {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels
        );
        addImage(croppedImage)
        setOpenCropModal(false)
      } catch (e) {
        console.error(e);
      }
    }, [croppedAreaPixels, image]);



      return (
    
    <div className='w-full h-full overflow-auto flex flex-col '>
        {
        loading ? 
        (
          <div className='w-full h-screen grid place-items-center'>
            <div className="spinner"></div>
            </div>
        ) :
        (
            
        /* main container */
        <div className='flex flex-col h-fit lg:flex-row'>
        {/* Left side */}
        <section className='flex bg-white h-fit lg:h-full w-full lg:w-[400px] flex-col px-10'>
        <div className='mt-5'>
        <h1 className='text-2xl font-semibold'>Profile</h1>
        </div>
        <div className='w-full flex flex-col justify-between h-full pb-10'>
        {/* Image Container */}
        <div className=' flex flex-col lg:mt-10 p-2 items-center justify-center'>
        <img className='rounded-full object-cover w-24 h-24 lg:w-32 lg:h-32 max-h-32 max-w-32' src={userDetails.profileImage} />
        <div className='flex flex-col mt-5 space-y-2 w-full '>
        {/* INput Profile Picture */}
        <label htmlFor="fileInput" className={`${isloadingImage ? "bg-orange-300" : "bg-themeOrange"} relative inline-block px-4 py-1 text-white text-center rounded cursor-pointer`}>
        {isloadingImage ? "Uploading" : "Change Picture"}
        <input type="file" onChange={(e)=>{cropImage(e.target.files)}} id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </label>
        <button onClick={()=>{removeProfile()}} className='px-2 py-1 rounded-sm text-sm whitespace-nowrap border'>Remove Picture</button>
        </div>
        </div>

        {/* Account deletion Warning */}

        <p onClick={()=>handleOpenADModal()} className='text-center text-red-500 cursor-pointer'>Deactivate account</p>
        </div>
        </section>

        {/* Right side */}
        <section className='w-full h-full bg-white '>
        <div className=" w-full h-fit lg:h-full  p-6 lg:pt-[1.3rem] ">
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">User Profile Settings</h1>
            <form onSubmit={(e)=>{handleOpenCPModal(e)}}>
                {/* Username */}
                <div className="mb-4">
                    <label htmlFor="username" className="text-sm text-gray-600">Username</label>
                    <input onChange={handleChange} type="text" id="username" name="username" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userDetails.username}/>
                    <p className={`text-xs text-red-500 ml-1 ${errors.usernameError == 1 ? "block":"hidden"}`}>Username already exist</p>
                </div>
                {/* Full name */}
                <div className="mb-4 flex w-full space-x-3">
                    <div className='w-full'>
                    <label htmlFor="firstname" className="text-sm text-gray-600">First Name</label>
                    <input onChange={handleChange} type="text" id="firstname" name="firstname" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userDetails.firstname}/>
                    </div>
                    <div className='w-full'>
                    <label htmlFor="lastname" className="text-sm text-gray-600">Last Name</label>
                    <input onChange={handleChange} type="text" id="lastname" name="lastname" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userDetails.lastname}/>
                    </div>
                </div>
                {/* Contact */}
                <div className="mb-4 relative flex items-end space-x-3 ">
                    <div className='w-1/2'>
                    <label htmlFor="contact" className="text-sm text-gray-600">Contact</label>
                    <div className="relative flex items-center">
                    <input onChange={handleChange} type="text" id="contact" name="contact" className="w-full py-2 ps-9 border border-gray-300 rounded-md pl-8 shadow-sm" value={userDetails.contact} />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600">+63</span>
                    <div className="absolute h-8 bg-gray-300 top-1/2 -translate-y-1/2 w-px"></div>
                    </div>
                    <p className={`text-xs text-red-500 ml-1 ${errors.contactError == 1 ? "block":"hidden"}`}>Contact already exist</p> 
                    </div>
                    {/* Change Password */}
                    <div className='w-1/2 flex flex-col'>
                    <label className="text-sm text-gray-600">Password Settings</label>
                    <button onClick={(e)=>{handleOpenNPModal(e)}} className='bg-gray-100 py-2 px-5 w-fit text-xs md:text-sm  rounded-sm shadow-sm text-gray-700 border flex  items-center gap-1 '> Change Password</button>
                    </div>
                    
                    
                </div>
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="text-sm text-gray-600">Email</label>
                    <input onChange={handleChange} type="email" id="email" name="email" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" value={userDetails.email}/>
                    <p className={`text-xs text-red-500 ml-1 ${errors.emailError == 1 ? "block":"hidden"}`}>Email already exist</p>
                </div>
                 {/* birth Field */}
                <div className='birth_container w-full '>
                <p className='text-xs text-gray-500 mt-2'>Date of birth</p>
                <div className='select_container w-full flex  space-x-5'>
                <select value={userDetails.birthDate.month} onChange={(e)=>handleDate(e)} name="month" className='border-1 border-gray rounded-sm text-xs'>
                {
                    DateData.months.map((month, index)=>
                    {
                    return (<option key={index} className="text-sm" value={month}>{month}</option>)
                    })
                }
                </select>
                <select value={userDetails.birthDate.day} onChange={(e)=>handleDate(e)} name="day" className='border-1 border-gray rounded-sm text-sm'>
                {
                    DateData.days.map((day, index)=>
                    {
                    return (<option  key={index} value={day}>{day}</option>)
                    })
                }
                </select>
                <select value={userDetails.birthDate.year} onChange={(e)=>handleDate(e)} name="year"  className='border-1 border-gray text-sm rounded-sm'>
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
                    userDetails.Address?.region === undefined ? 
                    (
                    <p onClick={()=>{handleOpen()}} className=' cursor-pointer font-normal hover:text-gray-600 border-1 underline w-fit px-2 py-1 rounded-md'>Setup your Address <EditLocationOutlinedIcon fontSize='small' className='ml-1 text-gray-500' /></p>
                    )
                    :
                    (
                        <p onClick={()=>{handleOpen()}} className=' cursor-pointer text-sm font-medium border-1 underline w-fit px-2 py-1 rounded-md'>{
                            `Brgy. ${userDetails.Address.barangay.name}, ${userDetails.Address.municipality.name}, ${userDetails.Address.province.name}`
                                
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
                
                
        {/* Modal for cropping */}
        <Modal isOpen={openCropModal} style={CropperModalStyle} contentLabel="Cropper Modal">
                <div className='w-[500px] h-[500px] flex flex-col relative'>
                  <div className=''>
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={4/4}
                      cropShape="round"
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className='text-center absolute py-1 bottom-0 bg-themeBlue text-white mx-2 mb-2 rounded-sm left-0 right-0'>
                    <button onClick={()=>showCroppedImage()} className='py-1 px-2'>Upload</button>
                  </div>
                </div>
                
        </Modal>
        {/* Modal for Address */}
        <Modal isOpen={open} onClose={handleClose} style={ModalStyle} > 
                <div className='p-4 w-[400px]'>
                <h1 className='font-medium'>Address</h1>
                {/* Regions ***************************************/}
                <div className="mb-4">
                <label htmlFor="region" className="text-sm text-gray-600">Region</label>
                <select
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 0, 'region');}}
                id="region"
                name="region"
                value={locCodesSelected[0][0] + ',' + locCodesSelected[0][1]}
                className={`block w-full text-sm mt-1 p-2 border ${Addresserror.region ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option className='w-fit' value=""  >Select Region</option>
                {
                phil.regions.map((regions, index)=>(
                <option key={index} value={[regions.name , regions.reg_code]}>{regions.name}</option>
                ))
                }
                </select>
                <p className={`${Addresserror.region ? "" : "hidden"} text-xs text-red-500`}>This is a required field</p>
                </div>


                {/* Provinces***************************************************************** */}
                <div className="mb-4">
                <label htmlFor="province" className="text-sm text-gray-600">Province</label>
                <select
                 disabled={`${locCodesSelected[0][1] == "-1" ? "disabled" : ""}`}
                 onChange={(e)=>{handleLocationSelect(e.target.value.split(','), 1, 'province')}}
                 id="province"
                 name="province"
                 value={locCodesSelected[1][0] + ',' + locCodesSelected[1][1]}
                 className={`block w-full text-sm mt-1 p-2 border ${Addresserror.province ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}                >
                <option value=""  >Select Province</option>
                {
                phil.getProvincesByRegion(locCodesSelected[0][1]).sort((a, b) => a.name.localeCompare(b.name)).map((province, index)=>(
                <option key={index} value={[province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase() , province.prov_code]}>{province.name.charAt(0).toUpperCase() + province.name.slice(1).toLowerCase()}</option>
                ))
                }
                </select>
                <p className={`${Addresserror.province ? "" : "hidden"} text-xs text-red-500`}>This is a required field</p>
                </div>


                {/* Cities ***********************************************************/}
                <div className='flex gap-3'>
                <div className="mb-4">
                <label htmlFor="city" className="text-sm text-gray-600">City</label>
                <select
                disabled={`${locCodesSelected[1][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),2, 'city')}}
                id="city"
                name="city"
                value={locCodesSelected[2][0] + ',' + locCodesSelected[2][1]}
                className={`block w-full text-sm mt-1 p-2 border ${Addresserror.municipality ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option value=""  >Select City</option>
                {
                phil.getCityMunByProvince(locCodesSelected[1][1]).sort((a, b) => a.name.localeCompare(b.name)).map((city, index) => (
                <option key={index} onClick={()=>{console.log("Hello")}}  value={[city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase(), city.mun_code]}>
                {city.name.charAt(0).toUpperCase() + city.name.slice(1).toLowerCase()}
                </option>
                ))
                }
                </select>
                <p className={`${Addresserror.municipality ? "" : "hidden"} text-xs text-red-500`}>This is a required field</p>
                </div>


                {/* Barangays *****************************************************************8*/}
                <div className="mb-4">
                <label htmlFor="barangay" className="text-sm text-gray-600">Barangay</label>
                <select
                disabled={`${locCodesSelected[2][1] == "-1" ? "disabled" : ""}`}
                onChange={(e)=>{handleLocationSelect(e.target.value.split(','),3, 'barangay')}}
                id="barangay"
                name="barangay"
                value={locCodesSelected[3][0] + ',' + locCodesSelected[3][1]}
                className={`block w-full text-sm mt-1 p-2 border ${Addresserror.barangay ? "border-red-500" : "border-gray-300"} rounded-md focus:ring focus:ring-indigo-200`}
                >
                <option value=""   >Select Barangay</option>
                {
                phil.getBarangayByMun(locCodesSelected[2][1]).sort((a, b) => a.name.localeCompare(b.name)).map((barangay, index)=>(
                <option key={index} value={[barangay.name , barangay.mun_code]}>{barangay.name}</option>
                ))
                }
                </select>
                <p className={`${Addresserror.barangay ? "" : "hidden"} text-xs text-red-500`}>This is a required field</p>
                </div>
                </div>

                <div className='w-full'>
                <label htmlFor="barangay" className="text-sm text-gray-600">Street</label>
                <textarea value={street} onChange={(e)=>{setStreet(e.target.value)}} className='w-full border p-1 resize-none text-sm' row={3} />
                </div>


                {/* MAP******************************************************************* */}
            <div className='relative'>
            <label htmlFor="region" className="text-xs xl:text-sm text-gray-600">Pin location</label>
              <GoogleMap location={location} setLocation={setLocation} />
            </div>
            <div className=' flex justify-end space-x-2'>
            <button onClick={()=>{submitAddress()}} className='px-3 py-1 bg-themeBlue hover:bg-slate-700 text-white rounded-sm mt-2 text-sm'>Save</button>
            <button onClick={()=>{handleClose()}} className='px-3 py-1 bg-gray-200 text-black rounded-sm mt-2 text-sm'>Cancel</button>
            </div>
            
            </div>
            
        </Modal> 

        {/* Modal for confirm Password */}
        <Modal isOpen={openCPModal} onClose={handleCloseCPModal} style={ModalStyle} > 
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
        </Modal>

        {/* Modal for Change Password */}
        <Modal isOpen={openNPModal} onClose={handleCloseNPModal} style={ModalStyle} > 
                <div className='w-[400px]'>
                <div className='w-full flex justify-between'><h1 className='text-gray-900 font-medium'>Change Password</h1><CloseOutlinedIcon onClick={()=>{handleCloseNPModal()}} className=' cursor-pointer ' /></div>
                <div className="space-y-4 mt-2">
                <div className="flex flex-col">
                    <label htmlFor="password" className="text-semiSm font-semibold text-gray-600">Current Password</label>
                    <input
                    value={password}
                    onChange={(e)=>{setPassword(e.target.value)}}
                    type="password"
                    id="password"
                    name="newPassword"
                    className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Enter your new password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                    
                </div>


                <div className="flex flex-col">
                    <label htmlFor="newPassword" className="text-semiSm font-semibold text-gray-600">New Password</label>
                    <input
                    value={newPassword}
                    onChange={(e)=>{setNewPassword(e.target.value)}}
                    type="password"
                    id="newPassword"
                    name="password"
                    className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Enter your password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 1 ? "block":"hidden"}`}>Password do not match</p>
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                </div>


                <div className="flex flex-col">
                    <label htmlFor="confirmPassword" className="text-semiSm font-semibold text-gray-600">Confirm Password</label>
                    <input
                    value={confirmPassword}
                    onChange={(e)=>{setConfirmPassword(e.target.value)}}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full text-sm px-2 py-1.5 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200"
                    placeholder="Confirm your password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 1 ? "block":"hidden"}`}>Password do not match</p>
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                </div>
                <button onClick={()=>{changePassword()}} className='px-2 py-2 w-full text-semiSm bg-themeBlue text-white'>Update</button>
                </div>
                </div>
        </Modal>

        {/* Modal for Account deletion */}
        <Modal isOpen={openADModal} onClose={handleCloseADModal} style={ModalStyle} > 
                <div className='p-3'>
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
                    placeholder="Enter your password"
                    />
                    <p className={`text-xs text-red-500 ml-1 ${errors.passwordError == 0 ? "block":"hidden"}`}>Invalid Password</p>
                    
                </div>
                <div className=' w-full mt-5 flex justify-center'>
                <button onClick={()=>{deactivateAccount()}}  className={`${loadingDeac ? "bg-red-300" : "bg-red-500"} text-white py-2 px-4 rounded mr-4 hover:bg-red-600`} >Yes, Delete</button>
                <button onClick={()=>handleCloseADModal()} className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400" >Cancel</button>
                </div>
                </div>

                </div>
                </div>
        </Modal>
        <ToastContainer />
        </div>
  )
}

export default UserInformation