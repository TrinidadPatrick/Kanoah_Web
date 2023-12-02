import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import { Link, useSearchParams } from 'react-router-dom';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useNavigate } from 'react-router-dom';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import http from '../../http'


const Chat = () => {
  const navigate = useNavigate()
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId);
    const [windowWidth, setWindowWdith] = useState(null)
    const [sendingMessage, setSendingMessage] = useState(false) 
    const [allUsers, setAllUsers] = useState([])
    const [activeConversation, setActiveConversation] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();
    const convoId = searchParams.get('convoId')
    const to = searchParams.get('to')
    const service = searchParams.get('service')
    const openChat = searchParams.get('t')
    const [serviceFromParam, setServiceFromParam] = useState('')

    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const thisDate = currentYear + "-" + currentMonth + "-" + currentDay
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    // Convert hours to 12-hour format
    hours = hours % 12 || 12;
    const timeSent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${ampm}`;
    const [recipient, setRecipient] = useState({
        _id : "",
        username : "",
        profileImage : ""
    })
    const [sender, setSender] = useState('')
    const [typingMessage, setTypingMessage] = useState('')
    const [message, setMessage] = useState('')
    const [allChats, setAllChats] = useState([])
    // All contacts that the user have communicated with
    const [allContacts, setAllContacts] = useState([])
    const [conversationId, setConversationId] = useState('')
    const [messageContentBoxClass, setMessageContentBoxClass] = useState('w-full overflow-hidden hidden absolute sm:relative sm:flex flex-col h-screen  sm:px-2 pt-20 pb-2');

   // Get the userId asynchronously
   const setUserId = ()=>{
  return new Promise((resolve, reject)=>{
        if(userId != null){
                resolve(userId)
            
        }
    })
   }  

  //Gets all users
  const getUsers = async () => {
    const myId = await setUserId()
    fetchUsers(myId) 
    
  }

    // Get user Chats
    async function getUserChats(){

        const myId = await setUserId()
        const result = await http.get(`getUserChats/${myId}`)
        
        const groupedData = () =>{
            return new Promise((resolve, reject)=>{
                const groupedData = result.data.reduce((result, obj) => {
                    const existingGroup = result.find(group => group[0]?.conversationId === obj.conversationId);            
                    if (existingGroup) {
                      existingGroup.push(obj);
                    } else {
                      result.push([obj]);
                    }            
                    return result;
                  }, []);
               resolve(groupedData)           
            })
            
        }
        
        const allChat = await groupedData()
        //Set all contacts by setting the receiver and setting conversation id
        const allContacts = allChat.map((chats) => {
          if (!chats || !chats[0] || !chats[0].participants || !chats[chats.length - 1]) {
            // Handle cases where essential properties are undefined
            return null;
          }
        
          const receiver = chats[0].participants.filter((chat) => chat._id != myId);
          const sentBy = chats[chats.length - 1].message.sender;
          const conversationId = chats[0].conversationId;
          const serviceInquired = chats[0].serviceInquired;
          const latestChat = chats[chats.length - 1].message.content;
          const latestChatTime = chats[chats.length - 1].message.timestamp;
          const dateSent = chats[chats.length - 1].message.date;
          const readBy = chats[chats.length - 1].readBy;
        
          // Ensure that essential properties are not undefined before returning the object
          if (receiver && sentBy && conversationId && serviceInquired && latestChat && latestChatTime && dateSent && readBy) {
            return {
              receiver,
              sentBy,
              conversationId,
              serviceInquired,
              latestChat,
              latestChatTime,
              dateSent,
              readBy,
            };
          }
        
          return null; // Handle cases where essential properties are undefined
        });
        
        // Filter out null values from the array (resulting from cases where essential properties are undefined)
        const filteredContacts = allContacts.filter((contact) => contact !== null);
        
        // Now, 'filteredContacts' contains only valid contact objects without undefined properties
        
           
          setAllContacts(allContacts)
          setAllChats(allChat)
          //So if the conversation is a first chat, automatically retreive that message
          if(conversationId === "")
          {
            const find = allContacts.find(contact => contact.receiver[0]._id == recipient._id)
            if(find != undefined || find != null)
            {
            setConversationId(find.conversationId)
            }
            
          }

          return {allChats, allContacts}
    }
    
  //Sets the users except the active user, set my username
    async function fetchUsers(myId){ 
    const token = localStorage.getItem('accessToken')
    if(!token)
    {
      navigate('/')
    }
    else{
      try {
        const myInfo = await http.get(`getUser/${myId}`,{
          headers : {Authorization: `Bearer ${token}`},
        })
      const me = myInfo.data
      setSender({username : me.username, _id : me._id, profileImage : me.profileImage})
      } catch (error) {
        navigate('/')
      }
    }
    
}


    // Handles the messages send
    const handleMessage = async (message) => {

    const messageData = {
        conversationId : conversationId,
        participants: [sender._id, recipient._id],
        serviceInquired : service,
        readBy : [sender._id],
        message: 
            {
                sender: {_id : sender._id, profileImage : sender.profileImage},
              receiver : {_id : recipient._id},
                content: message,
                timestamp : timeSent,
                date : thisDate
            } 
    }

      
    if(typingMessage != "")
    {
      setTypingMessage("")
      setSendingMessage(true)
      const test = allChats.findIndex(chats => chats[0].conversationId == activeConversation); 
      if(test != -1)
      {
      
      const updatedChats = [...allChats];
      updatedChats[test].push(messageData);
      setAllChats(updatedChats);
      }
      await http.post('sendChat', messageData).then((res)=>{
      }).catch((err)=>console.log(err)).finally(()=>{setSendingMessage(false)})
      
    }

    }

    // Handle the reading of message
    const handleReadMessage = async (conversationIdParam) => {
          let updatedReadBy = []
          const convo = allChats.find(chats => chats[0].conversationId == conversationIdParam)
          const unReadMessages = convo.filter(chat => !chat.readBy.includes(sender._id))

          unReadMessages.forEach((message)=>{
              const newMessage = [...unReadMessages]
              message.readBy.push(sender._id)
              updatedReadBy = newMessage[0].readBy
          })

          if(updatedReadBy.length !== 0)
          {
              await http.post('readChat', {updatedReadBy, conversationIdParam}).then((res)=>console.log(res.data)).catch((err)=>console.error(err))
          }
  
  
}

    useEffect(()=>{
      const token = localStorage.getItem('accessToken')
        http.get(`getServiceInfo/${service}`).then((res)=>{
            setServiceFromParam(res.data.service.basicInformation.ServiceTitle)
        }).catch((err)=>{console.log(err)})

        setActiveConversation(convoId)
    },[])


    // Go back page
    const goBack = () => {
        window.history.back();
      };

    //Use effect to set data to state
    useEffect(()=>{
    getUsers()
    getUserChats()
    // If convoId parameter is not specified, get the conversation id of the first conversation in the allChats
    if(convoId == '' || convoId == null)
    {
        // if to is not specified in parameter
        if(to == null || to == "")
        {
            
            const setInitialConversationId = async () => {
                const contacts =  await (await getUserChats()).allContacts
                setConversationId(contacts[0].conversationId)
                setSearchParams({convoId : contacts[0].conversationId, to : contacts[0].receiver[0].username, service : contacts[0].serviceInquired._id})
                if(contacts[0].receiver[0]._id != sender._id)
                {
                    setRecipient({_id : contacts[0].receiver[0]._id, username : contacts[0].receiver[0].username, profileImage : contacts[0].receiver[0].profileImage, serviceInquired : contacts[0].serviceInquired})
                }
                else
                {   
                    
                    setRecipient({_id : contacts[0].sender[0]._id, username : contacts[0].sender[0].username, profileImage : contacts[0].sender[0].profileImage, serviceInquired : contacts[0].serviceInquired})
                }
               }
              setInitialConversationId()  
        
            }
        else
        {   
            
            // If there is no convoId in url but there is a "To"
            getUserChats().then((res)=>{ 
                const token = localStorage.getItem('accessToken')
                const test = res.allContacts.find(contact => contact.receiver[0].username === to)
                if(test == undefined)
                {    
                    http.get('getUsers',{
                      headers : {Authorization: `Bearer ${token}`},
                    }).then((res)=>{
                        const users = res.data
                        const receiver = users.find(user => user.username == to)
                       
                        setRecipient({_id : receiver._id, username : receiver.username, profileImage : receiver.profileImage, fullname : receiver.firstname + ' ' + receiver.lastname })
                        setConversationId('')
                    })
                   
                }
                else
                {
                
                setRecipient({_id : test.receiver[0]._id, username :test.receiver[0].username, profileImage :test.receiver[0].profileImage, fullname : test.receiver[0].firstname + ' ' + test.receiver[0].lastname })
                setConversationId(test.conversationId)
                setSearchParams({convoId : test.conversationId, to, service : service})
                }
                
            })
            
        }
        
    }
    else
    {   
         //if there is a convoId and to
        if((convoId !== "" && convoId !== null) && (to !== "" && to !== null))
        {
            getUserChats().then((res)=>{
                const filtered = res.allContacts.find(contact => contact.conversationId == convoId)
                // If there is not result
                if(filtered == undefined)
                {
                    setLoading(false)
                    setServerError(true)
                }
                else{
                    setServerError(false)
                    setSearchParams({convoId : filtered.conversationId, to : filtered.receiver[0].username, service : filtered.serviceInquired._id})
                    setRecipient({_id: filtered.receiver[0]._id, username : filtered.receiver[0].username, profileImage : filtered.receiver[0].profileImage, serviceInquired : filtered.serviceInquired, fullname : filtered.receiver[0].firstname + ' ' + filtered.receiver[0].lastname})
                }
                
            })
            setConversationId(convoId)
        }
        // If there is a convoId but no to
        else if((convoId !== "" && convoId !== null) && (to === "" || to === null))
        {
            getUserChats().then((res)=>{
                const filtered = res.allContacts.find(contact => contact.conversationId == convoId)
                
                setSearchParams({convoId : convoId, to : filtered.receiver[0].username, service : service})
                setRecipient({_id: filtered.receiver[0]._id, username : filtered.receiver[0].username, profileImage : filtered.receiver[0].profileImage, serviceInquired : filtered.serviceInquired, fullname : filtered.receiver[0].firstname + ' ' + filtered.receiver[0].lastname})
            })
            setConversationId(convoId)
        }
       
       
    }
    

    },[userId])
    

    useEffect(()=>{
        if(recipient._id !== "")
        {
            setLoading(false)
            setActiveConversation(convoId)
        }
    }, [recipient])

    const fetchUserChats = () => {
      if(sendingMessage)
        {
        }else{
          getUserChats()
         
        }
    };

    // Run the getuser every 6 seconds
    useEffect(() => {
      // Function to be executed every 4 seconds
      const myFunction = () => {
        
        fetchUserChats()
      };
  
      // Set up the interval
      const intervalId = setInterval(myFunction, 3000);
  
      // Clean up the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, []);

        // Function to handle window resize
    const handleResize = () => {
          const windowWidth = window.innerWidth;
        
          // Update your code or perform actions based on the new size
          setWindowWdith(windowWidth)
    }
        
    // Attach the event listener to the window resize event
    window.addEventListener('resize', handleResize);
        
    // Call the function once to get the initial size
    useEffect(()=>{
          handleResize();
    },[])

    // For mobile view, if the converstaion is new, automatically open that conversation
    useEffect(()=>{
      if (allContacts.length !== 0) {
        const checkChat = allContacts.find(contact => contact.conversationId === convoId);
        if (checkChat) {
        } else {
          if (windowWidth <= 639) {
            setMessageContentBoxClass('-translate-x-[50%] left-[50%] -full overflow-hidden w-full absolute sm:relative sm:flex flex-col h-screen sm:px-2 pt-20 pb-2 transition duration-500 ease-out');
            console.log('Not found');
          }
        }
      }
      
    },[allContacts])

    
  return (
    <div className='w-full h-screen grid place-items-center'>
    {
        loading ? (<div className="lds-dual-ring w-full mt-20 h-screen"></div>) :

        serverError ?
        (
            <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
              <p className="text-2xl font-semibold mb-4">Internal Server Error</p>
              <p className="text-gray-700 mb-8">
                Oops! Something went wrong on our end. We are working to fix it.
              </p>
              <div className="flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-4"
                  onClick={goBack}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )
        :
        (
            <div className='w-full h-screen flex gap-4 bg-[#f9f9f9]'>
    
             {/* Contacts and Messages */}
            <section className='w-full h-screen sm:w-[400px] sm:max-w-[400px] overflow-hidden md:w-[350px] relative lg:w-[500px] lg:max-w-[400px] flex flex-col sm:p-2  '>
            
            <div className='w-full mt-[73px] bg-white sm:rounded-lg shadow-md h-full'>
            {/* Search Input */}
            <div className='p-3 w-full relative'>
            <SearchOutlinedIcon className='absolute top-[1.35rem] text-gray-500 left-6' />
            <input id='searchField' className='rounded-full outline-none border-2 p-2 ps-10 w-full' type="text" placeholder='Search..'/>
            </div>
            {
            allContacts.sort((a,b)=>{
            const timeA = new Date(`${a.dateSent} ${a.latestChatTime}`);
            const timeB = new Date(`${b.dateSent} ${b.latestChatTime}`);
            return timeB - timeA
            }).map((contact,index)=>{
            const ampm = contact.latestChatTime.split(' ')
            const splitted = contact.latestChatTime.split(':').slice(0,-1).join(':') + " " + ampm[ampm.length - 1]
            return (
            <div className={`${contact.conversationId === activeConversation ? "bg-gray-200" : ""} mt-5 p-3 w-full overflow-hidden flex items-center space-x-2 cursor-pointer`} onClick={()=>{setActiveConversation(contact.conversationId)
            setRecipient({_id : contact.receiver[0]._id, username : contact.receiver[0].username, profileImage : contact.receiver[0].profileImage, serviceInquired : contact.serviceInquired, fullname : contact.receiver[0].firstname + " " + contact.receiver[0].lastname})
            setConversationId(contact.conversationId);setSearchParams({convoId : contact.conversationId, to : contact.receiver[0].username, service : contact.serviceInquired._id})
            handleReadMessage(contact.conversationId)
            if(windowWidth <= 639){document.getElementById('messageContentBox').className = "-translate-x-[50%] left-[50%] -full overflow-hidden w-full absolute sm:relative sm:flex flex-col h-screen  sm:px-2 pt-20 pb-2 transition duration-500 ease-out"}}}  key={index} >
            
            <div className='w-full max-w-full flex items-center p-1 h-fit  overflow-hidden'>
            {/* Profile Image */}
            <div className='w[40px] min-w-[40px] mr-1 lg:w-[60px] lg:min-w-[60px] h-full flex justify-center items-center'>
            <img className='w-8 h-8 md:w-9 md:h-9 lg:w-11 lg:h-11 min-w-11 rounded-full object-cover' src={contact.receiver[0].profileImage} alt="Profile" />
            </div>
            {/* Name and time */}
            <div className='flex flex-col w-full overflow-hidden  justify-center  space-y-1 md:pb-0'>
            <div className='flex justify-between h-fit  w-full items-center'>
            <span className={`${!contact.readBy.includes(sender._id) ? "font-semibold text-blue-600" : "font-normal"}  cursor-pointer text-xs md:text-md whitespace-nowrap lg:text-[0.97rem] block  `}>{contact.receiver[0].firstname + " " + contact.receiver[0].lastname}</span>
            <span className='cursor-pointer text-semiXs md:text-xs font-medium text-gray-600'>{splitted}</span>
            </div>
            {/* Message content */}
            <div className='flex'>
            <div className='flex justify-start w-[200px] semiXs:w-full semiXs:max-w-[340px] md:w-[400px] overflow-clip items-center '>
            <span className={`${!contact.readBy.includes(sender._id) ? "font-semibold " : "font-normal text-gray-600"} cursor-pointer text-semiXs md:text-xs `}>{contact.sentBy._id == sender._id ? "You: " : ""}</span>
            <span className={` text-ellipsis ${!contact.readBy.includes(sender._id) ? "font-semibold " : "font-normal text-gray-600"} cursor-pointer overflow-hidden ml-1 text-semiXs md:text-xs whitespace-nowrap `}>{contact.latestChat}</span>
            </div>
            </div>
            </div>
            </div>
            </div>
            )               
            })
            }
            </div>    
            </section>
        
            {/* Chats and message contents */}
            <section id='messageContentBox' className={messageContentBoxClass}>
            {/* <section id='messageContentBox' className='w-full  -translate-x-[100%] sm:translate-x-[0%] absolute sm:relative sm:flex flex-col h-screen sm:px-2 pt-20 pb-2'> */}
            <div className='w-full h-full bg-white justify-start flex flex-col shadow-md sm:rounded-lg px-2'>
            <div className='w-full py-3  bg-white relative border-b-2 shadow-sm flex space-x-2 items-center object-contain'>
              <button className='sm:hidden' onClick={()=>{document.getElementById('messageContentBox').className = "w-full  -translate-x-[100%] absolute sm:relative sm:flex flex-col pt-20 h-screen p-2 transition duration-500 ease-out"}}><ArrowBackOutlinedIcon /></button>
                <img className='w-10 h-10 object-cover origin-center rounded-full' src={recipient.profileImage} />
                
                <div className='flex flex-col lg:flex-row lg:space-x-3 items-start '>
                {/* Name */}
                <p className='text-themeBlue text-ellipsis whitespace-nowrap max-w-[200px] md:max-w-[300px] lg:max-w-[230px] xl:max-w-[400px] overflow-hidden text-sm md:text-[0.975rem] font-semibold'>{recipient.fullname}</p>
                <span className='w-1 h-1 hidden lg:block rounded-full bg-themeBlue self-center'></span>
                {
                    recipient.serviceInquired == undefined ? (<p className='text-themeBlue font-semibold'>{serviceFromParam}</p>)
                    :
                    <p className='text-gray-500 text-sm md:text-[0.975rem] text-ellipsis font-semibold max-w-[200px] md:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] overflow-hidden whitespace-nowrap '>{recipient.serviceInquired.basicInformation.ServiceTitle}</p>
                }
                </div>
                <Link to={`/explore/viewService/${service}`} className=' absolute right-0 text-semiXs md:text-sm bg-themeBlue text-gray-50 px-3 py-1 rounded-sm'>View Service</Link>
            </div>
            {/* Messages Content */}
            <ScrollToBottom  className='w-full flex h-full flex-col bg-[#f9f9f9] overflow-auto '>

            {/* Recipient Message */}
              {
              allChats
              .filter((chat) => chat[0].conversationId === conversationId)
              .map((chats, index) => {
              const formatDate = (dateString) => {
              const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
              const date = new Date(dateString);
              return date.toLocaleDateString(undefined, options);
              };

              // Group messages by date
              const groupedMessages = chats.reduce((acc, message) => {
              const dateKey = message.message.date.split('T')[0]; // Use date part as key
              acc[dateKey] = acc[dateKey] || [];
              acc[dateKey].push(message);
              return acc;
              }, {});
             
              return (
              <div key={chats[0].conversationId}>
              {/* <h2>Chat with {serviceProviderName}</h2> */}
              {/* Display messages grouped by date */}
              {Object.keys(groupedMessages).map((dateKey) => (
              <div key={dateKey}>
              <div className="flex items-center">
              <div className="flex-1 border-t border-gray-400"></div>
              <div className="mx-4 text-sm text-center my-2 text-gray-400">{formatDate(dateKey)}</div>
              <div className="flex-1 border-t border-gray-400"></div>
              </div>

              {groupedMessages[dateKey].map((message, index) => {
              const ampm = message.message.timestamp.split(' ')
              const splitted = message.message.timestamp.split(':').slice(0,-1).join(':') + " " + ampm[ampm.length - 1]
              return (
              <div className={`${message.message.sender._id == sender._id ? "justify-end" : "justify-start"} items-center flex w-full p-1 my-2`} key={index}>
              <div className={` flex items-end ${message.message.sender._id == sender._id ? "flex-row" : "flex-row-reverse"}  space-x-2`}>
              <p className='text-semiXs mx-2 self-center'>{splitted}</p>
              <div className='flex items-end'>
              <div className={`max-w-[150px] md:max-w-[200px] lg:max-w-[300px] text-xs lg:text-sm break-words ${message.message.sender._id == sender._id ? "bg-blue-500 text-white rounded-md rounded-ee-sm px-3 py-3" : "bg-gray-100 text-gray-700 relative rounded-md rounded-se-sm px-3 py-3"} shadow-md`}>
              {message.message.content}
              </div>
              {sendingMessage && message._id == undefined ? (<div className="Sendingloader ml-1"></div>) : ""}
              </div>
              {/* Profile Image */}
              <img className='w-7 h-7 rounded-full object-cover' src={message.message.sender._id == sender._id ? message.message.sender.profileImage : message.message.sender.profileImage} />
              </div>
              </div>
              )
              })}
              </div>
              ))}
              </div>
              );
              })
              }     

            </ScrollToBottom>
            {/* Message input */}
            <div className='w-full p-2 flex items-center justify-between'>
            <input id='textField' className='p-2 w-full outline-none border rounded-lg bg-slate-100 ' value={typingMessage} onChange={(e)=>{setTypingMessage(e.target.value)}} onKeyDown={(e)=>{if(e.key === "Enter"){handleMessage(e.target.value)}}} type='text' placeholder='Enter message'  />
            <button className='p-2 px-4'>
            <SendOutlinedIcon onClick={()=>{handleMessage(typingMessage)}} />
            </button>   
            </div>     
            </div>
            </section>
            </div>
        )
    }
    </div>
  )
  
}

export default Chat