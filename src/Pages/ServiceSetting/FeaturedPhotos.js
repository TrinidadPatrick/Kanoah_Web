import React, { useEffect } from 'react'
import { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ResponsiveGallery from 'react-responsive-gallery';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import axios from 'axios';
import { galleryImage } from '../ViewService/Components/ForGallery';
import cloudinaryCore from '../../CloudinaryConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import http from '../../http';

const FeaturedPhotos = (value) => {
  const [imagesToDelete, setImagesToDelete] = useState([])
  const [multipleSelect, setMultipleSelect] = useState(false)
  const [selectedView, setSelectedView] = useState('Grid')
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [uploadingImage, setUploadingImage] = useState(false)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = currentDate.getDate().toString().padStart(2, '0');
  const thisDate = currentYear + "-" + currentMonth + "-" + currentDay
  const [open, setOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [featuredGalleryImages, setFeaturedGalleryImages] = useState([])
    
  // Id generator
const generateId = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

// Handle what image to show in lightbox
const handleImageClick = (index) => {
  setSelectedImageIndex(index);
  setOpen(true);
};

// Handle adding of images in featured
const handleAddImage = async (files) => {
  setUploadingImage(true)
  const totalFiles = files.length;
  let totalProgress = 0;
  let imageToAdd = []

  if(files){
        // Loop through selected files
    for (const file of files) {
      try {
        // Upload each file to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', "KanoahFeaturedUpload");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.min(
                100,
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
              setUploadProgress((prevProgress) =>
                Math.round((prevProgress + progress / totalFiles) * 10) / 10
              );
            },
          }
        );
        const imageUrl = response.data.secure_url;
        const id = generateId(20)
        imageToAdd.push({imageId : id, src : imageUrl, TimeStamp : thisDate})
        // Save the imageUrl or perform further actions
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    
    // Upload images to the database
    try {
      const response = await http.patch(`addFeaturedImage/${value.value.id}`, {featuredImages : imageToAdd})
      setUploadingImage(false)
      getFeaturedImages()
    } catch (error) {
        console.log(error)
    }
}
setUploadProgress(0)
}


// get images
const getFeaturedImages = async () => {
  await http.get(`getFeaturedImages/${userId}`).then((res)=>{
    setFeaturedGalleryImages(res.data.images)
  }).catch((err)=>{
    console.log(err)
  })
}

// delete single image
const deleteImage = async (imageId) => {
  await http.post('deleteFeaturedImage', {imageId, userId}).then((res)=>{
    getFeaturedImages()
  }).catch((err)=>{
    console.log(err)
  })
}

// Const select multiple images to delete
const selectMultipleDelete = async (imageId) => {
  const newData = [...imagesToDelete]
  if(newData.includes(imageId))
  {
    const filtered = newData.filter(data => data != imageId)
    setImagesToDelete(filtered)
  }
  else
  {
    newData.push(imageId)
    setImagesToDelete(newData)
  }
 
}

// Deletes all the selected images
const deleteMultipleImages = async () => {
  await http.post('deleteMultipleFeaturedImages', {userId, imagesToDelete}).then((res)=>{
    getFeaturedImages()
    setImagesToDelete([])
  }).catch((err)=>{
    console.log(err)
  })
}

// Gets the images gallery
useEffect(()=>{
  getFeaturedImages()
}, [])

  return (
    <div className='w-full bg-white h-full  flex flex-col mt-5'>
    
    {/* Navigation */}
    <nav className='w-full h-fit'>
        <ul className='flex items-center space-x-3'>

        {/* Upload Button */}
        <li className='ml-3 cursor-all-scroll flex items-center space-x-2'>
        <label htmlFor="fileInput" className={` bg-blue-500 h-full text-[0.95rem] shadow-md py-2 flex items-center relative px-4 text-white font-medium text-center rounded cursor-pointer`}>
        {uploadingImage ? "Uploading" : "Upload Image"}
        <input onChange={(e)=>{handleAddImage(e.target.files)}} disabled={uploadingImage} type="file" multiple accept="image/*" id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </label>
        {uploadingImage &&
        ( 
          <div className={`${uploadProgress >= 100 ? "text-green-500" : ""} font-medium flex flex-row-reverse  items-center `}>
          <p className='text-sm ml-2'>{uploadProgress <= 100 ? uploadProgress : "100"}%</p>
          <div className="w-[150px] h-[10px] bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
          <div className="bg-blue-600 text-xs font-medium h-full text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width : `${uploadProgress}%`}}></div>
          </div>
          </div>
        )
        }
        </li>

        {/* Change View */}
        <li>
          <div className='bg-gray-200 rounded-md p-0.5 flex space-x-0'>
          <button onClick={()=>{setSelectedView("List")}} className={`rounded-md px-1 ${selectedView === "List" ? "bg-white" : ""}`}><TableRowsOutlinedIcon className='text-gray-700 p-1' fontSize='large' /></button>
          <button onClick={()=>{setSelectedView("Grid")}} className={`rounded-md px-1 ${selectedView === "Grid" ? "bg-white" : ""}`}><GridViewOutlinedIcon className='text-gray-700  rounded-sm p-1' fontSize='large' /></button>
          </div>
          
        </li>

        {/* Delete */}
        <li>
        <div>
        <button disabled={imagesToDelete.length == 0 ? true : false} onClick={()=>{deleteMultipleImages()}} className='bg-white disabled:bg-gray-100 border px-2 py-1.5 shadow-sm rounded-md'><DeleteIcon className={`${imagesToDelete.length == 0 ? "text-gray-300" : "hover:text-red-500 cursor-pointer text-gray-700"}  disabled:text-gray-50 `} /></button>
        </div>
        </li>

        {/* Select multiple */}
        <li>
        <div className='flex items-center space-x-1'>
        <input checked={multipleSelect} onChange={()=>{setMultipleSelect(!multipleSelect)}} id='selectMultiple' className='h-[15px] w-[15px]' type="checkbox" />
        <label htmlFor='selectMultiple' className='text-sm text-gray-700'>Multiple Select</label>
        </div>
        </li>

        </ul>
    </nav>

    {/* Grid Gallery Container */}
    <section className={`w-full ${selectedView == "Grid" ? "grid" : "hidden"} h-full mt-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 p-3 max-h-full`}>
    {/* Image Container */}
    {
      featuredGalleryImages.map((image, index)=>{
              const from = new Date(image.TimeStamp);
              const to = new Date(thisDate);
              const years = to.getFullYear() - from.getFullYear();
              const months = to.getMonth() - from.getMonth();
              const days = to.getDate() - from.getDate();
      return (
        // onClick={()=>{handleImageClick(index)}}
        <div  key={index} className="relative">
        <div className="relative group">
        <div className={`${multipleSelect ? "border-2 h-[140px] max-h-[150px] object-fill flex justify-center rounded-lg shadow-sm overflow-hidden" : "border-2 h-[140px] max-h-[150px] object-fill flex justify-center group-hover:brightness-50 group-hover:bg-blue-50 group-hover:blur-[0.9px] rounded-lg shadow-sm overflow-hidden hover:filter hover:brightness-50 hover:blur-[0.9px] hover:opacity-100 hover:bg-blue-50"} `}>
        <img src={image.src} alt="image" className="max-h-full object-cover" />
        </div>
        <button onClick={()=>{handleImageClick(index)}} className={`${multipleSelect ? "hidden" : "bg-white px-3 py-1 rounded-md text-gray-500 absolute top-[40%] group left-[30%] opacity-0 group-hover:opacity-100 transition-opacity duration-100"} `}>Preview</button>
        {/* Delete Button */}
        <button onClick={()=>{deleteImage(image.imageId)}} className={`${multipleSelect ? "hidden" : "absolute"} px-1 py-1 rounded-md text-white top-[0%] group hover:text-red-500 left-[0%] opacity-0 group-hover:opacity-100 transition-opacity duration-100`}><DeleteIcon /></button>
        {/* Checkbox */}
        <input checked={imagesToDelete.includes(image.imageId) ? true : false} onChange={()=>{selectMultipleDelete(image.imageId)}} className={`${multipleSelect ? "absolute" : "hidden"} top-1 left-1 h-5 w-5`} type="checkbox" />
        </div>
        {
        years > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{years}{years > 1 ? " years ago" : " year ago"}</p>) : months > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{months}{months > 1 ? " months ago" : " month ago"}</p>) : days > 0  ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{days} {days > 1 ? " days ago" : " day ago"}</p>) : (<p className='text-xs text-gray-400 ml-1 mt-1'>Less than a day ago</p>)
        }
        </div>
      )
      
            }        
       
      )
    }


    </section>

     {/* List Gallery Container */}
     <section className={`w-full h-full mt-5 ${selectedView == "List" ? "flex" : "hidden"} flex-col items-center gap-8 p-3 max-h-full`}>
    {/* Image Container */}
    {
      featuredGalleryImages.map((image, index)=>{
              const from = new Date(image.TimeStamp);
              const to = new Date(thisDate);
              const years = to.getFullYear() - from.getFullYear();
              const months = to.getMonth() - from.getMonth();
              const days = to.getDate() - from.getDate();
      return (
        <div  key={index} className="relative flex justify-between pr-5 shadow-sm items-center w-full">
        <div className='flex items-center space-x-2'>
          {/* Delete Multiple */}
        <input checked={imagesToDelete.includes(image.imageId) ? true : false} onChange={()=>{selectMultipleDelete(image.imageId)}} className={`${multipleSelect ? "block" : "hidden"}`} type="checkbox" />
        <div onClick={()=>{handleImageClick(index)}} className=' h-[60px] w-[60px] max-h-[150px] object-contain flex justify-center rounded-lg shadow-sm overflow-hidden'>
          <img src={image.src} alt="image" className='max-h-full object-contain cursor-pointer' />
        </div>
        </div>
        
        <div className='flex space-x-56'>
        {
        years > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{years}{years > 1 ? " years ago" : " year ago"}</p>) : months > 0 ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{months}{months > 1 ? " months ago" : " month ago"}</p>) : days > 0  ? (<p className='text-xs text-gray-400 ml-1 mt-1'>{days} {days > 1 ? " days ago" : " day ago"}</p>) : (<p className='text-xs text-gray-400 ml-1 mt-1'>Less than a day ago</p>)
        }
        <DeleteIcon onClick={()=>{deleteImage(image.imageId)}} className='text-red-500 cursor-pointer' />
        </div>
        
        </div>
        
      )   
      })
    }
     

    </section>
    <Lightbox
        plugins={[Download,Fullscreen]}
        open={open}
        close={() => setOpen(false)}
        index={selectedImageIndex}
        slides={featuredGalleryImages}
      />
    </div>
  )
}

export default FeaturedPhotos