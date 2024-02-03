import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom';
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { selectNewMessage, setNewMessage, selectOnlineUsers } from '../../ReduxTK/chatSlice';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';
import cloudinaryCore from '../../CloudinaryConfig';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContactPhoneRoundedIcon from '@mui/icons-material/ContactPhoneRounded';
import './chat.css'
import UseInfo from '../../ClientCustomHook/UseInfo';
import {io} from 'socket.io-client'

  const ChatPractice = () => {
    const dispatch = useDispatch()
    const {authenticated, userInformation} = UseInfo()
    const newMessage = useSelector(selectNewMessage)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [openViewer, setOpenViewer] = useState(false)
    const convoId = searchParams.get('convoId')
    const service = searchParams.get('service')
    const [loadingHeader, setLoadingHeader] = useState(true)
    const [loadingChats, setLoadingChats] = useState(true)
    const [noChats, setNoChats] = useState(false)
    const [windowWidth, setWindowWdith] = useState(null)
    const [windowHeight, setWindowHeight] = useState(null)

    const currentDate = new Date();
    const thisDate = new Date().toLocaleDateString('en-CA');
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeSent = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    // For messages
    const [receiver, setReceiver] = useState({})
    const [receiverInformation, setReceiverInformation] = useState({})
    const [showProfileInformation, setShowProfileInformation] = useState(false)
    const [serviceInquired, setServiceInquired] = useState({})
    const [allContacts, setAllContacts] = useState([])
    const [origAllContacts, setOrigAllContacts] = useState([])
    const [currentChatsCount, setCurrentChatsCount] = useState(0)
    const [currentChats, setCurrentChats] = useState([])
    const [messageInput, setMessageInput] = useState('')
    const [returnLimit, setReturnLimit] = useState(10)
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)

    const [socket, setSocket] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [allChats, setAllChats] = useState([])
    const [sendingMessages, setSendingMessages] = useState([])
    const [loadingMore, setLoadingMore] = useState(false)
    const [openMoreOptions, setOpenMoreOptions] = useState(false)
    const [imageSelected, setImageSelected] = useState('')
    const onlineUsers = useSelector(selectOnlineUsers)
    const [chatClass, setChatClass] = useState('w-full hidden sm:flex h-full flex-col bg-white shadow-sm py-2 px-5 space-y-3')
    const [contactClass, setContactClass] = useState('w-full sm:w-[290px]  md:w-[320px] lg:w-[400px] h-full border-r-1 bg-white shadow-sm')

    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
    
      // Update your code or perform actions based on the new size
      setWindowWdith(windowWidth)
      setWindowHeight(windowHeight)
}
    // Attach the event listener to the window resize event
    window.addEventListener('resize', handleResize);
    
    // Call the function once to get the initial size
    useEffect(()=>{
      handleResize();
    },[])

  useEffect(()=>{
    if(authenticated === false)
    {
      navigate('/')
    }
  },[authenticated])

  useEffect(()=>{
    setSocket(io("https://kanoah.onrender.com"))

  },[])

  useEffect(()=>{
    if(newMessage === true)
      {
        (async () => {
          try {

            const messages = await http.get(`getMessages/${convoId}/${returnLimit}`, {
              withCredentials: true,
            });
            // console.log(messages.data)
            if (currentChats && currentChats.length > 0 && currentChats[0]?.conversationId === convoId) {
              setCurrentChats(messages.data.result);
            }          
            const contact = await getContacts()
            // Corrected the function call below
            dispatch(setNewMessage(false))
          } catch (error) {
            console.error(error);
          }  
          getAllChats()   
        })();

      }

      
  },[newMessage, userInformation, currentChats])


    useEffect(()=>{
      if(service == "")
      {
        navigate('/notFound')
      }
    },[])

    
    // load first chat upon load when there is no service or convoId
    useEffect(()=>{
      if(userInformation !== null && service == null)
      {
        (async()=>{
          try {
            
            const contacts = await http.get(`retrieveContacts/${userInformation?._id}`, {
              withCredentials: true,
            })
            const sortedContacts = contacts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            
            if(contacts.data.length == 0)
            {
              setNoChats(true)
            }
            const firstContact = sortedContacts[0]
            setSearchParams({service : firstContact.serviceInquired, convoId : firstContact.conversationId})
            setAllContacts(sortedContacts)
            setOrigAllContacts(sortedContacts)
            setReceiver(firstContact.participants.filter(receiver => receiver._id !== userInformation?._id)[0])
            setServiceInquired(firstContact.virtualServiceInquired)
            getChats(firstContact.conversationId)
            setLoadingHeader(false)
            
           } catch (error) {
            console.error(error)
           }
        })()
      
      }
      else if(service != null && convoId !== null && currentChats.length == 0)
      {
        getChats(convoId)
      }
      
    },[userInformation, allContacts])


    // Gets the information of receiver and service
    useEffect(()=>{
      if(receiver.username == undefined && serviceInquired.basicInformation == undefined && service !== null)
      {
        (async ()=>{ 
          await getReceiver()
          
        })()
        // getContacts()
      }
    },[userInformation, allContacts])

    //Get all Contacts related to current users
    const getContacts = async () => {
      if(userInformation?._id !== undefined && convoId !== undefined)
      {
        try {
          const contacts = await http.get(`retrieveContacts/${userInformation?._id}`, {
            withCredentials: true,
          })
          const sortedContacts = contacts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setAllContacts(sortedContacts)
          setOrigAllContacts(sortedContacts)
          return sortedContacts;
        } catch (error) {
          console.error(error)
        }
      }

    }

    // get the receiver when clicked chat from view service because there is no convoID
    const getReceiver = async () => {
      // If there is no conversation ID find that conversation using the service id
      let conversation_id = ''
      const contacts = await getContacts()
      if(contacts !== undefined){
        const selectedChat = contacts.find(contact => contact.serviceInquired === service)
        if(selectedChat)
        {
        conversation_id = selectedChat.conversationId
        getChats(conversation_id)
        setSearchParams({service : service, convoId : conversation_id})
        }
        
      }
      if(convoId == null)
      {
        try {
          const receiver = await http.get(`getReceiver/${service}`)
          setReceiver(receiver.data)
          } catch (error) {
          console.error(error)
          }
          try {
            const serviceInquired = await http.get(`getServiceFromChat/${service}`)
            setServiceInquired(serviceInquired.data)
            setLoadingHeader(false)
            setLoadingChats(false)
          } catch (error) {
            console.error(error)
          }  
      }
      
    }
    // Get the reciever information and service 
    const selectReceiver = async ( conversationId, receiver, serviceInqId, serviceName) => {
      setSearchParams({service : serviceInqId, convoId : conversationId})
      setReceiver(receiver)
      setServiceInquired(serviceName)
    }

    //Handle the sending of message
    const handleSendMessage = async (message, type) => {
      const data = {
        sendingId : Math.floor(Math.random() * 1000),
        conversationId : convoId,
        participants : [userInformation?._id, receiver._id],
        readBy : [userInformation?._id],
        serviceInquired : service,
        createdAt : currentDate,
        messageType : type,
        messageContent : 
        {
          sender : userInformation?._id,
          receiver: receiver._id,
          content: message,
          date : thisDate,
          timestamp : timeSent
        }
      }

      if(message !== '')
      {
      setSendingMessages((prevSendingMessages)=> [...prevSendingMessages, data])
      if(type !== 'image'){setCurrentChats((prevChats) => [...prevChats, data]);}
      
      setMessageInput('')
      const notificationMessage = 'newMessage'
      try {
        const sendMessage = await http.post('sendMessage', data)
        getAllChats()
        setSendingMessages([...sendingMessages.filter(message => message.sendingId !== data.sendingId)])
        getContacts()

        setSearchParams({service : service, convoId : sendMessage.data.result.conversationId})   
        socket.emit('message', {notificationMessage, receiverName : receiver._id});
      } catch (error) {
        console.error(error)
      }
      }
      
      
      
    }

    //Handle the sending of message
    const handleImageSend = async (message, type) => {
          const data = {
            sendingId : Math.floor(Math.random() * 1000),
            conversationId : convoId,
            participants : [userInformation._id, receiver._id],
            readBy : [userInformation._id],
            serviceInquired : service,
            createdAt : currentDate,
            messageType : type,
            messageContent : 
            {
              sender : userInformation._id,
              receiver: receiver._id,
              content: message,
              date : thisDate,
              timestamp : timeSent
            }
          }
          if(message !== '')
          {
          setSendingMessages((prevSendingMessages)=> [...prevSendingMessages, data])
          setCurrentChats((prevChats) => [...prevChats, data]);
          setMessageInput('')
          
          }
          
          
          
    }

    // Handle the pagination of chats
    const handlePagination = () => {
      setLoadingMore(true)
      setReturnLimit((...prevReturnLimit)=> Number(prevReturnLimit) + 10)
    }

    //Get chats from selected conversation
    const getChats = async (conversationId) => {
      
    if(conversationId !== "" && userInformation?._id !== undefined && fetching == false && allChats.length == 0)
    {
      setFetching(true)
      try {
        const messages = await http.get(`getMessages/${conversationId}/${returnLimit}`, {
          withCredentials: true,
        })
        const receiver = messages.data.result[0].participants.find(user => user._id !== userInformation?._id)
        setReceiver(receiver)
        setServiceInquired(messages.data.result[0].virtualServiceInquired)
        setCurrentChats(messages.data.result)
        setCurrentChatsCount(messages.data.documentCount)

     } catch (error) {
      console.error(error)
     }finally {
        setFetching(false)
        setLoadingHeader(false)
        setLoadingChats(false)
        setTimeout(()=>{
          getChatsAync()
        }, 2000)
       

     
     }
    }

    else if(conversationId !== "" && userInformation?._id !== undefined && fetching == false && allChats.length !== 0)
    {
      
      const selectedChats = allChats.find(chats => chats.result[0].conversationId === conversationId)
      setCurrentChatsCount(selectedChats.documentCount)
      setCurrentChats(selectedChats.result)
    }
    }
    // When clicked loadmore
    useEffect(()=>{
      if(returnLimit > 10)
      {
        
        (async () => {
          try {
            const messages = await http.get(`getMessages/${convoId}/${returnLimit}`, {
              withCredentials: true,
            });
            const receiver = messages.data.result[0].participants.find(user => user._id !== userInformation?._id);
            setReceiver(receiver);
            setServiceInquired(messages.data.result[0].virtualServiceInquired);
            setCurrentChats(messages.data.result);
            setCurrentChatsCount(messages.data.documentCount);
            setLoadingMore(false)
          } catch (error) {
            console.error(error);
          }
        })();
      }
      
    },[returnLimit])

    //Handle the sending of Image
    const handleFileInputChange = async (event) => {
      const file = event.target.files[0];

      const getImageDataUrl = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataURL = reader.result;
            // Now 'dataURL' contains the base64-encoded image data
            resolve(dataURL);
            // You can use 'dataURL' to upload to Cloudinary or store in your database
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      };

      // Function to resize an image using a canvas
      const resizeImage = (dataUrl, maxWidth, maxHeight) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = dataUrl;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            // Calculate new dimensions while maintaining the aspect ratio
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }

            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            const resizedDataUrl = canvas.toDataURL('image/jpeg'); // Change the format if needed (e.g., 'image/png')

            resolve(resizedDataUrl);
          };
        });
      };

      // Function to convert data URL to Blob
      const dataURLtoBlob = (dataUrl) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
      };

      if (file) {
        try {
          const test = await getImageDataUrl(file);
          const resizedImageDataUrl = await resizeImage(test, 800, 600);
          handleImageSend(resizedImageDataUrl, 'image' )

          const formData = new FormData();
          formData.append('file', dataURLtoBlob(resizedImageDataUrl));
          formData.append('upload_preset', "kanoah_chat_image");
          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`,
            formData,
          );
          const imageUrl = response.data.secure_url;
          if(response.status === 200)
          {
            (()=>{handleSendMessage(imageUrl, 'image' )})()
          }
        } catch (error) {
          console.error(error);
        }
      }

      
      
    };

    // opens and close the emoji picker
    const handleEmojiPicker = () => {
      setOpenEmojiPicker(!openEmojiPicker)
    } 

    const handleReadMessage = async (conversationId) => {
      const readMessage = await http.put('handleReadMessage', {conversationId, myId : userInformation?._id})
      await getContacts()
      
    }

    async function getChatsAync() {
      if (allContacts.length !== 0) {
        try {
          const messagesPromises = allContacts.map(async (contact) => {
            const messages = await http.get(`getMessages/${contact.conversationId}/${returnLimit}`, {
              withCredentials: true,
          });
            return messages.data;
          });
    
          const allMessages = await Promise.all(messagesPromises);
    
          // Now allMessages is an array containing the results of all the http.get calls
          setAllChats(allMessages)
          // Do something with the updated 'chats' array
        } catch (error) {
          console.error(error);
        }
      }
    }

    async function getAllChats() {

        try {
          const messagesPromises = allContacts.map(async (contact) => {
            const messages = await http.get(`getMessages/${contact.conversationId}/${returnLimit}`, {
              withCredentials: true,
            });
            return messages.data;
          });
    
          const allMessages = await Promise.all(messagesPromises);
    
          // Now allMessages is an array containing the results of all the http.get calls
          setAllChats(allMessages)
          // Do something with the updated 'chats' array
        } catch (error) {
          console.error(error);
        }
      
    }

    async function handleViewInformation(participants)
    {
     
      const profileToView = participants.find(user => user._id !== userInformation?._id)
      const profileToView2 = participants.find(user => user !== userInformation?._id)
      const profile = await http.get(`viewChatMemberProfile/${profileToView._id == undefined ? profileToView2 : profileToView._id}`)
      setReceiverInformation(profile.data)
    }

    async function handleDeleteConversation(conversationId)
    {
      try {
        const result = await http.delete(`handleDeleteConversation/${conversationId}`, {
          withCredentials: true,
        })

        setSearchParams({})
        window.location.reload()
      } catch (error) {
        console.error(error)
      }
    }

    function handleSearchMessage(searchInput){
      const newContact = [...allContacts]
      if (searchInput.trim() !== "") {
        const search = allContacts.filter(contact => contact.virtualServiceInquired.basicInformation.ServiceTitle.toLowerCase().includes(searchInput.toLowerCase()))
        setAllContacts(search);
      } else {
        setAllContacts(origAllContacts);
      }
    }

    function openVIewerContent(image){
      setOpenViewer(true)
      setImageSelected(image)
    }

    

    useEffect(()=>{
      
      if(convoId === null && service === null && windowWidth < 640)
      {
        setChatClass('w-full hidden sm:flex h-full flex-col bg-white shadow-md rounded-md py-1 px-5 space-y-3')
        setContactClass('w-full sm:w-[290px]  md:w-[320px] lg:w-[400px] h-full bg-white rounded-md shadow-md')
      }
      else
      {
        if(windowWidth < 640 && windowWidth !== null){setChatClass('w-full flex h-full flex-col bg-white shadow-md rounded-md py-1 px-5 space-y-3')}
        if(windowWidth < 640 && windowWidth !== null){setContactClass('hidden')}
      }
      
    },[windowWidth])


  return (
        <main className=' w-full bg-[#f9f9f9] h-[100dvh] overflow-hidden relative flex justify-evenly'>
          {/* Image Viewer */}
        <div  className={`${openViewer ? "" : "hidden"} w-full h-full bg-[#000000ED] absolute z-50 flex justify-center items-center`}>
          <div className='absolute top-2 right-2 flex flex-row-reverse gap-4'>
          <CloseOutlinedIcon onClick={()=>{setOpenViewer(false);setImageSelected('')}}  className='text-white cursor-pointer' fontSize='large'/>
          </div>
          
          {/* Image container */}
          <div className='h-[500px] aspect-video'>
            <img className='w-full h-full aspect-video object-contain' src={imageSelected} alt='image' />
          </div>
        </div>
        {
          noChats ? 
          (
          <div className="flex items-center w-full h-full justify-center ">
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">No Chats</p>
              <p className="text-gray-500">There are currently no chats.</p>
            </div>
          </div>
          )
          :
          (
            <>
        {/* Contacts Windowwss_________________________________________________________________________________________________________ */}
        <section className={contactClass}>
        <div className='flex w-full flex-col space-y-3 py-3'>
          <div className='p-3  w-full relative'>
            <SearchOutlinedIcon fontSize='small' className='absolute top-[1.2rem] text-gray-500 left-5' />
            <input onChange={(e)=>{handleSearchMessage(e.target.value)}} id='searchField' className='rounded-full outline-none border-2 p-1 ps-9 text-sm text-gray-600 w-full' type="text" placeholder='Search..'/>
          </div>
        {
          allContacts.map((contact)=>{
            const receiver = contact.participants.find(user => user._id !== userInformation._id)
            return (

            <div className={`${contact.conversationId === convoId ? 'bg-gray-100 border-l-4 border-l-blue-600' : 'bg-transparent'} w-full p-2 cursor-pointer flex`} key={contact._id} 
            onClick={()=>{handleReadMessage(contact.conversationId);
            if(windowWidth < 640){setChatClass('w-full flex h-full flex-col bg-white shadow-md rounded-md py-1 px-5 space-y-3')}
            if(windowWidth < 640){setContactClass('hidden')}
            setShowProfileInformation(false)
            setReturnLimit(10);
            selectReceiver(contact.conversationId, receiver, contact.serviceInquired, contact.virtualServiceInquired);
            getChats(contact.conversationId)}}>
            
            {/* Service Image */}
            <div className=' p-1 flex justify-center items-center'>
            <div style={{backgroundImage : `url(${contact.virtualServiceInquired.serviceProfileImage})`}} className='w-[40px] h-[40px]  rounded-full bg-cover bg-center bg-black'></div>
            </div>

            {/* Title and message and time */}
            <div className=' w-full flex flex-col ps-1'>
              {/* Title */}
              <div className='flex justify-start'>
            
              <p className={`${contact.readBy.includes((userInformation?._id)) ? 'text-gray-700' : 'text-blue-500'} text-[0.7rem] md:text-sm font-medium overflow-hidden max-w-[200px] sm:max-w-[130px] xl:max-w-[200px] text-ellipsis pe-2`}>{contact.virtualServiceInquired.basicInformation.ServiceTitle}</p>
              {/* <input readOnly className={`${contact.readBy.includes((userInformation?._id)) ? 'text-gray-700' : 'text-blue-500'} text-[0.7rem] md:text-sm font-medium text-ellipsis pointer-events-none bg-transparent`} type='text' value={contact.virtualServiceInquired.basicInformation.ServiceTitle} /> */}
              <div className={` ${contact.serviceInquired === userInformation?._id ? 'block' : 'hidden'} flex items-center`}>
              <StorefrontOutlinedIcon className=' text-blue-500 p-0.5' fontSize='small' />
              </div>
              </div>
                <div className=' flex justify-start items-center'>
                  {
                  contact.messageType === 'image' ?
                  <input type='text' readOnly value='Photo' className='font-light w-full pointer-events-none text-ellipsis bg-transparent text-xs text-gray-700' />
                  :
                  <input type='text' readOnly value={contact.messageContent.sender === userInformation?._id ? 'You: ' + contact.messageContent.content : contact.messageContent.content} className='font-light w-[100%]  bg-transparent pointer-events-none text-ellipsis  text-semiXs text-gray-700' />
                  }
                  <div className=' whitespace-nowrap text-[0.5rem]'>{contact.messageContent.timestamp}</div>
                </div>
            </div>     
            </div>     
            )
          })
        }
        </div>
        </section>

        {/* Messages Windowwss_________________________________________________________________________________________________________ */}
        <section className={chatClass}>
        {/* Headers */}
        <div className='w-full flex space-x-2 p-1 sticky top-[0.6rem] z-30 bg-white border-b-[1.5px] shadow-sm pb-2'>
        {
          loadingHeader ? (
          <div className="relative flex w-64 animate-pulse gap-2 p-4">
              <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                <div className="flex-1">
                  <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                  <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                </div>
              <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
          </div>
          )
          :
          (
        <div className='flex space-x-2 items-center'>  
        {/* Back Icon */}
        <button className='sm:hidden' onClick={()=>{
        setChatClass('w-full hidden sm:flex h-full flex-col bg-white shadow-md rounded-md py-1 px-5 space-y-3')
        setContactClass('w-full sm:w-[290px]  md:w-[320px] lg:w-[400px] h-full bg-white rounded-md shadow-md')
        setSearchParams({})
        }}>
        <ArrowBackOutlinedIcon />
        </button>     
        <div className='h-12 w-12 flex'>
        
        <img className='rounded-full w-full h-full object-cover max-h-16 max-w-16' src={serviceInquired.serviceProfileImage} alt='profile' />
        </div>
        <div className=' flex flex-col justify-around'>     
          <input className={`text-ellipsis text-lg font-medium text-gray-800 bg-transparent`} value={serviceInquired.basicInformation !== undefined ? serviceInquired.basicInformation.ServiceTitle : ''} type='text' disabled />
          {
            currentChats[0] == undefined ? ("") :    
            (     
            <div className='flex space-x-2'>     
            <p className='text-gray-600 text-sm'>{currentChats[0].participants.length} members</p>
            {     
              onlineUsers.some(item => item.username === currentChats[0].participants.find(par => par._id !== userInformation._id)._id) ?
              <p className='text-sm text-green-500'>2 online</p>
              :
              <p className='text-sm text-blue-500'>1 online</p>
              
            }
            </div>
            
            )
          }
        </div>
        {/* More Options button */}
        <button onClick={()=>{setOpenMoreOptions(!openMoreOptions);handleViewInformation(currentChats[0].participants)}} className='absolute right-0'>
          <MoreHorizOutlinedIcon />
        </button>
        {/* More option */}
        <div className={`w-[150px] ${openMoreOptions ? 'block' : 'hidden'} h-fit border absolute right-6 top-6 bg-white shadow-md rounded-md`}>
          <ul className='flex flex-col space-y-3'>
            <li onClick={()=>{navigate(`/explore/viewService/${currentChats[0].virtualServiceInquired._id}`)}} className='text-sm cursor-pointer p-2 hover:text-blue-500 hover:bg-gray-200'>View Service</li>
            <li onClick={()=>{setShowProfileInformation(true);setOpenMoreOptions(false)}} className='text-sm cursor-pointer p-2 hover:text-blue-500 hover:bg-gray-200'>View User</li>
            <li className='text-sm cursor-pointer p-2 hover:text-blue-500 hover:bg-gray-200'>Report</li>
            <li onClick={()=>{handleDeleteConversation(currentChats[0].conversationId)}} className='text-sm cursor-pointer p-2 text-red-500 hover:bg-gray-200'>Delete conversation</li>
          </ul>
        </div>
        </div> 
        )
        }
        </div>

        {/* Message Content_________________________________________________________________________________________________________ */}
        
        <div onClick={()=>{setOpenMoreOptions(false);setOpenEmojiPicker(false)}} id='MessageContainer' className='h-full overflow-auto w-full max-w-full rounded-md p-2 flex flex-col bg-white'>
        <ScrollToBottom  style={{ minHeight: `${windowHeight}px`, boxSizing: 'border-box' }} scrollViewClassName='messageBox' className='h-screen w-full flex flex-col bg-white overflow-auto '>
          <div className='w-full text-centerflex justify-center'>
            <button className={`${currentChatsCount < 10 ? 'hidden' : 'flex'} ${loadingMore ? 'hidden' : 'flex'} w-fit  mx-auto`} onClick={()=>{handlePagination()}}>Load more</button>
            <div className={`w-full justify-center ${loadingMore ? 'flex' : 'hidden'}`}>
            <div className="loadMoreLoder"></div>
            </div>  
          </div>
        {
        loadingChats ? 
        (
          <>
          <div role="status" className=" animate-pulse w-full h-full rotate-180 flex flex-col justify-evenly">
          <div className="h-2.5 bg-slate-400 rounded-full  w-48 mb-4"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[60%] "></div>
          <div className="h-2 bg-slate-400 rounded-full   max-w-[80%]"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[70%] "></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[50%] "></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[360px] "></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[65%]"></div>
          <span className="sr-only">Loading...</span>
          </div>
          <div role="status" className=" animate-pulse w-full h-full flex flex-col justify-evenly">
          <div className="h-2.5 bg-slate-400 rounded-full  w-48 mb-4"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[60%] mb-2.5"></div>
          <div className="h-2 bg-slate-400 rounded-full  mb-2.5 max-w-[80%]"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[70%] mb-2.5"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[50%] mb-2.5"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[360px] mb-2.5"></div>
          <div className="h-2 bg-slate-400 rounded-full  max-w-[65%]"></div>
          <span className="sr-only">Loading...</span>
          </div>
          </>
        )
        :
        currentChats.reduce((result, chats) => {
          const date = new Date(chats.createdAt).toDateString();
          const existingGroup = result.find((group) => group.date === date);
          if (existingGroup) {
            existingGroup.chats.push(chats);
          } else {
            result.push({ date, chats: [chats] });
          }     
          return result;
        }, []).map((chatGroup, index)=>(
          <div key={index}>
            <div className="flex items-center">
                <div className="flex-1 border-t border-gray-400"></div>
                <div className="mx-4 text-sm text-center my-2 text-gray-500 font-medium">
                  {chatGroup.date}
                </div>
                <div className="flex-1 border-t border-gray-400"></div>
                
              </div>
            {
              chatGroup.chats.map((chat, index)=>(
                <div key={index} className={`w-full p-1 flex flex-col ${chat.messageContent.sender === userInformation._id ? 'items-end' : 'items-start'}`}>
                {
                  chat.messageType === "image" ?
                  <div className=' w-56 max-w-[14rem] rounded-lg'>
                  <img onClick={()=>{openVIewerContent(chat.messageContent.content)}} className='rounded-lg cursor-pointer' src={chat.messageContent.content} />
                  <p className={`text-[0.55rem] ${chat.messageContent.sender === userInformation._id ? 'text-end' : 'text-start'} text-gray-500 mt-1 ml-0.5`}>{chat.messageContent.timestamp}</p>
                  </div>
                  :
                  <div className='flex items-end space-x-2'>
                  <img className={`${chat.messageContent.sender === userInformation?._id ? 'hidden' : 'block'} w-6 h-6 rounded-full mb-4`} src={chat.participants.filter(user => user._id !== userInformation?._id)[0].profileImage} />
                  <div>
                  <p className={`py-2 px-4 w-fit whitespace-pre-wrap max-w-[300px] break-words rounded-md ${chat.messageContent.sender !== userInformation ._id ? 'bg-gray-100 text-gray-700 text-sm shadow-sm rounded-es-none' : 'bg-blue-500 text-white text-sm rounded-ee-none shadow-md'}`}>  
                    {chat.messageContent.content}
                  </p>
                  <p className='text-[0.55rem] text-gray-500 mt-1 ml-0.5'>{chat.messageContent.timestamp}</p>
                  </div>
                  </div>
                }

                <p className={`${sendingMessages.some(message => message.messageContent.content === chat?.messageContent.content) ? 'block' : 'hidden'} text-semiXs`}>Sending</p>
              </div>
              ))
            }
          </div>
        ))
        }
        </ScrollToBottom>
        </div>
        

        {/* Message Input Box */}
        <div className='w-full flex items-center space-x-3 border p-1 rounded-3xl '>
          <textarea value={messageInput} onChange={(e)=>{setMessageInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter" && !e.shiftKey){handleSendMessage(e.target.value, 'text');e.preventDefault()}}} rows={1}  placeholder='Enter message' maxLength={1000} className='messageInput rounded-4xl w-full resize-none py-2 px-1 outline-none' />
        {/* <input value={messageInput} onChange={(e)=>{setMessageInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter"){handleSendMessage(e.target.value, 'text')}}} className='w-full py-2 px-1 rounded-lg outline-none' type='text' placeholder='Enter message' /> */}
        
        {/* Emoji picker */}
        {/* <div className={`${openEmojiPicker ? 'block' : 'hidden'} absolute bottom-[5.3rem] right-[10rem] shadow-md`}>
        <EmojiPicker emojiStyle='facebook' onEmojiClick={(emoji)=>{setMessageInput((prevMessageInput) => prevMessageInput + emoji.emoji)}} autoFocusSearch={false} searchDisabled={true} height={400} width={300} />
        </div> */}

        {/* Emoji Picker button */}
        {/* <button onClick={()=>{handleEmojiPicker()}} className={`${openEmojiPicker ? 'text-blue-500' : 'text-gray-600'}`}>
          <EmojiEmotionsOutlinedIcon />
        </button> */}


        {/* Image send Input */}
        <div className={`  h-full text-[0.85rem]  py-2 flex items-center relative px-2 text-white font-medium text-center rounded cursor-pointer`}>
        <button className='cursor-pointer'>
          <ImageOutlinedIcon className='text-gray-600 cursor-pointer' />
        </button>
        <input type="file" onChange={handleFileInputChange} accept="image/*" id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </div>
        
        {/* Send Button */}
        <button onClick={()=>{handleSendMessage(messageInput, 'text');setOpenEmojiPicker(false)}} className='bg-blue-500 p-2 rounded-full hover:bg-blue-700 text-white flex items-center justify-center'>
          <SendOutlinedIcon  />
        </button>
        
        </div>
        </section>
            </>
          )
        }
        {/* PROFILE INFORMATION CARD */}
        <div className={`w-[300px] ${showProfileInformation ? 'block' : 'hidden'} h-[406px] bg-white shadow-xl rounded-md absolute top-[25%]`} >
        <button onClick={()=>{setShowProfileInformation(false)}} className='absolute p-0 hover:bg-blue-100 rounded-full m-1'> <CloseRoundedIcon /></button>
       
        <h1 className='text-lg font-bold text-gray-800 text-center mt-4'>Client Information</h1>
        <div>
          {/* Profile Image */}
          <div className='w-full flex justify-center mt-3'>
            <img className='w-16 h-16 border-[3px] border-themeBlue rounded-full shadow-md relative z-10 object-cover' src={receiverInformation.profileImage} />
          </div>
          {/* Additional Information */}
          <div className='flex flex-col rounded-xl pb-3 pt-8 top-20 w-[90%] absolute bg-themeBlue space-y-3 mt-3 font-medium text-gray-700 left-1/2 transform -translate-x-1/2'>
            {/* Full Name */}
            <p className='text-center text-white'>{receiverInformation.firstname + receiverInformation.lastname}</p>
            {/* Email */}
            <div className='w-[200px] border mx-auto p-2 rounded-md flex flex-col items-center'>
            <MailOutlineRoundedIcon fontSize='small' className='text-white' />
            <p className='text-white font-light text-sm'>{receiverInformation.email}</p>
            </div>
           
            {/* contact */}
            <div className='w-[200px] border mx-auto p-2 rounded-md flex flex-col items-center'>
            <ContactPhoneRoundedIcon fontSize='small' className='text-white' />
            <p className='text-white font-light text-sm'>+63{receiverInformation.contact}</p>
            </div>

            {/* Address */}
            <div className='w-[200px] border mx-auto p-2 rounded-md flex flex-col items-center'>
            <MyLocationOutlinedIcon fontSize='small' className='text-white' />
            <p className='text-white text-center font-light text-sm'>
            {receiverInformation?.Address?.barangay.name ?? ''}{' '}
            {receiverInformation?.Address?.municipality.name ?? ''}{' '}
            {receiverInformation?.Address?.province.name ?? ''}
            </p>
            </div>
            
          </div>
        </div>
        </div>
  
        </main>
    
  
  )
}



export default ChatPractice