import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom';
import http from '../../http';
import { selectUserId } from '../../ReduxTK/userSlice'
import { useNavigate } from 'react-router-dom';
import { selectNewMessage, setNewMessage, selectOnlineUsers } from '../../ReduxTK/chatSlice';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ScrollToBottom from 'react-scroll-to-bottom';
import axios from 'axios';
import cloudinaryCore from '../../CloudinaryConfig';
import {io} from 'socket.io-client'

  const ChatPractice = () => {
    const dispatch = useDispatch()
    const newMessage = useSelector(selectNewMessage)
    const navigate = useNavigate()
    const accessToken = localStorage.getItem("accessToken")
    const [userInformation, setUserInformation] = useState({})
    const userId = useSelector(selectUserId)
    const [searchParams, setSearchParams] = useSearchParams();
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
    const [serviceInquired, setServiceInquired] = useState({})
    const [allContacts, setAllContacts] = useState([])
    const [currentChatsCount, setCurrentChatsCount] = useState(0)
    const [currentChats, setCurrentChats] = useState([])
    const [messageInput, setMessageInput] = useState('')
    const [returnLimit, setReturnLimit] = useState(4)
    const [imageToSend, setImageToSend] = useState('')

    const [socket, setSocket] = useState(null)
    const onlineUsers = useSelector(selectOnlineUsers)

  useEffect(()=>{
    setSocket(io("https://kanoah.onrender.com"))

    // setSocket(io("http://localhost:10000"))
  },[])

  useEffect(()=>{
    if(newMessage === true)
      {
        
        (async () => {
          try {

            const messages = await http.get(`getMessages/${convoId}/${returnLimit}`);
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
        })();

      }

      
  },[newMessage, userInformation, currentChats])

   
    const getUser = async () => {
      try {
        const response = await http.get(`getUser`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data; // Explicitly return the data
      } catch (err) {
        console.error(err);
        throw err; // Re-throw the error to be caught in the calling code
      }
    };

    useEffect(()=>{
      if(service == "")
      {
        navigate('/notFound')
      }
    },[])
    
    // Get Current User
    useEffect(() => {
      // Gets the current user information
      (async () => {
        try {
          const result = await getUser();
          setUserInformation(result)
        } catch (error) {
          // Handle the error if needed
          console.error('Error fetching user:', error);
        }
      })();

    }, []);

    // load first chat upon load when there is no service or convoId
    useEffect(()=>{
      if(userId !== null && service == null )
      {
        (async()=>{
          try {
            const contacts = await http.get(`retrieveContacts/${userId}`)
            const sortedContacts = contacts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            if(contacts.data.length == 0)
            {
              setNoChats(true)
            }
            const firstContact = sortedContacts[0]
            setSearchParams({service : firstContact.serviceInquired, convoId : firstContact.conversationId})
            setAllContacts(sortedContacts)
            setReceiver(firstContact.participants.filter(receiver => receiver._id !== userId)[0])
            setServiceInquired(firstContact.virtualServiceInquired)
            getChats(firstContact.conversationId)
            setLoadingHeader(false)
           } catch (error) {
            console.error(error)
           }
        })()
      
      }
      else if(service != null && convoId !== null)
      {
        getChats(convoId)
      }
    },[userId, allContacts])


    // Gets the information of receiver and service
    useEffect(()=>{
      if(receiver.username == undefined && serviceInquired.basicInformation == undefined && service !== null)
      {
        (async ()=>{ 
          await getReceiver()
          
        })()
        getContacts()
      }
    },[userInformation, allContacts])

    //Get all Contacts related to current users
    const getContacts = async () => {
      if(userInformation._id !== undefined && convoId !== undefined)
      {
        try {
          const contacts = await http.get(`retrieveContacts/${userInformation._id}`)
          const sortedContacts = contacts.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setAllContacts(sortedContacts)
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
      // const Iparticipants = currentChats[0] == undefined ? [receiver._id, userInformation._id] : currentChats[0].participants
      // const Ireceiver = currentChats[0] == undefined ? receiver._id : currentChats[0].participants.find(user => user._id !== userInformation._id)
      const data = {
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

      const notificationMessage = 'newMessage'
      try {
        const sendMessage = await http.post('sendMessage', data)
        setCurrentChats([...currentChats, data])
        // getChats(sendMessage.data.result.conversationId)
        getContacts()
        setSearchParams({service : service, convoId : sendMessage.data.result.conversationId})
        setMessageInput('')
        socket.emit('message', {notificationMessage, receiverName : receiver._id});
      } catch (error) {
        console.error(error)
      }
      
    }

    const handlePagination = () => {
      setReturnLimit(returnLimit + 4)
    }

    //Get chats from selected conversation
    const getChats = async (conversationId) => {
    
    if(conversationId !== "" && userInformation._id !== undefined)
    {
      try {
        const messages = await http.get(`getMessages/${conversationId}/${returnLimit}`)
        const receiver = messages.data.result[0].participants.find(user => user._id !== userInformation._id)
        setReceiver(receiver)
        setServiceInquired(messages.data.result[0].virtualServiceInquired)
        setCurrentChats(messages.data.result)
        setCurrentChatsCount(messages.data.documentCount)

     } catch (error) {
      console.error(error)
     }finally {
      setTimeout(()=>{
        setLoadingHeader(false)
        setLoadingChats(false)
      }, 300)
     
     }
    }
    }

    useEffect(()=>{
      if(returnLimit > 4)
      {
        getChats(convoId)
      }
      
    },[returnLimit])

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

    //Handle the sending of Image
    const handleFileInputChange = async (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', "KanoahGalleryUpload");
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCore.config().cloud_name}/image/upload`,
        formData,
      );
      const imageUrl = response.data.secure_url;
      (()=>{handleSendMessage(imageUrl, 'image')})()
    };
    

  return (
        <main className=' w-full bg-[#f9f9f9] h-screen flex justify-evenly space-x-5 pb-3 px-3 pt-[5.2rem]'>
        
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
        <section className='w-[400px] h-full bg-white rounded-md shadow-md'>
        <div className='flex flex-col space-y-3 p-3'>
        {
          allContacts.map((contact)=>{
            const receiver = contact.participants.find(user => user._id !== userInformation._id)
            return (
              <div  className='flex items-center space-x-2 cursor-pointer ' key={contact._id} onClick={()=>{setReturnLimit(4);selectReceiver(contact.conversationId, receiver, contact.serviceInquired, contact.virtualServiceInquired);getChats(contact.conversationId)}}>
              {/* Service Image */}
              <div className='max-w-10 w-[40px] h-[40px] min-w-[40px] min-h-[40px] max-h-10 flex'>
                <img className='w-10 h-10 rounded-full object-cover' src={contact.virtualServiceInquired.serviceProfileImage} alt={`profile of ${contact.virtualServiceInquired.basicInformation.ServiceTitle}`} />
              </div>
              
              <div className=' cursor-pointer'  onClick={()=>{setReturnLimit(4);selectReceiver(contact.conversationId, receiver, contact.serviceInquired, contact.virtualServiceInquired);getChats(contact.conversationId)}}>
              {/* Service Title */}
              <input readOnly className=' font-medium text-gray-700 text-ellipsis pointer-events-none bg-transparent' type='text' value={contact.virtualServiceInquired.basicInformation.ServiceTitle} />
              {/* Service Message popup */}
              <div className='flex'>
              <input type='text' readOnly value={contact.messageContent.content} className='font-light pointer-events-none text-ellipsis bg-transparent text-sm text-gray-700' />
              <p className=' whitespace-nowrap text-semiXs'>{contact.messageContent.timestamp}</p>
              </div>
              
              </div>
            </div>
            )
          })
        }
        </div>
        </section>

        {/* Messages Windowwss_________________________________________________________________________________________________________ */}
        <section className='w-full h-full flex flex-col bg-white shadow-md rounded-md p-5 space-y-3'>
        {/* Headers */}
        <div className='w-full flex space-x-2 p-1 border-b-1 pb-2'>
        {
          loadingHeader ? 
          (
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
        <>        
        <div className='h-16 w-16 flex'>
        <img className='rounded-full w-full h-full object-cover max-h-16 max-w-16' src={serviceInquired.serviceProfileImage} alt='profile' />
        </div>
        <div className=' flex flex-col justify-around'>     
          <input className={`text-ellipsis text-lg font-medium text-gray-800 bg-transparent tracking-wider`} value={serviceInquired.basicInformation !== undefined ? serviceInquired.basicInformation.ServiceTitle : ''} type='text' disabled />
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
        </> 
        )
        }
        </div>

        {/* Message Content_________________________________________________________________________________________________________ */}
        
        <div id='MessageContainer' className='h-full overflow-auto w-full max-w-full rounded-md p-2 flex flex-col bg-[#f9f9f9]'>
        <ScrollToBottom
            style={{ minHeight: `${windowHeight}px`, boxSizing: 'border-box' }}
            scrollViewClassName='messageBox'
            className='h-screen w-full flex flex-col bg-[#f9f9f9] overflow-auto '>
          <div className='w-full text-centerflex justify-center'>
            <button className={`${currentChatsCount < 5 ? 'hidden' : 'flex'} w-fit  mx-auto`} onClick={()=>{handlePagination()}}>Load more</button>
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
        currentChats.map((chat)=>
        {

          return (
            <div key={chat._id} className={`w-full p-1 flex flex-col ${chat.messageContent.sender === userInformation._id ? 'items-end' : 'items-start'}`}>
            {
              chat.messageType === "image"
              ?
              <div className=' w-56 max-w-[14rem] rounded-lg'>
              <img className='rounded-lg' src={chat.messageContent.content} />
              </div>
              :
              <p className={`py-2 px-4 w-fit whitespace-pre-wrap max-w-[300px] break-words rounded-sm ${chat.messageContent.sender !== userInformation ._id ? 'bg-white text-black shadow-md' : 'bg-blue-500 text-white shadow-md'}`}>{chat.messageContent.content}</p>

            }
            <p className='text-[0.55rem] text-gray-500 mt-1'>{chat.messageContent.timestamp}</p>
          </div>
          )
          
        })
        }
        </ScrollToBottom>
        </div>
        

        {/* Message Input Box */}
        <div className='w-full flex items-center space-x-3 border p-1 rounded-3xl'>
        <input value={messageInput} onChange={(e)=>{setMessageInput(e.target.value)}} onKeyDown={(e)=>{if(e.key == "Enter"){handleSendMessage(e.target.value, 'text')}}} className='w-full py-2 px-1 rounded-lg outline-none' type='text' placeholder='Enter message' />
        <label htmlFor="fileInput" className={`  h-full text-[0.85rem]  py-2 flex items-center relative px-2 text-white font-medium text-center rounded cursor-pointer`}>
        <button>
          <ImageOutlinedIcon className='text-gray-600' />
        </button>
        <input type="file" onChange={handleFileInputChange} accept="image/*" id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </label>
        
        <button onClick={()=>{handleSendMessage(messageInput, 'text')}} className='bg-blue-500 p-2 rounded-full text-white flex items-center justify-center'>
          <SendOutlinedIcon  />
        </button>
        
        </div>
        </section>
            </>
          )
        }

          
        </main>
    
  
  )
}



export default ChatPractice