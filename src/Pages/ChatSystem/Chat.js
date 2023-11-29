import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import { useSearchParams } from 'react-router-dom';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ScrollToBottom from 'react-scroll-to-bottom';
import http from '../../http'

const Chat = () => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId); 
    const [allUsers, setAllUsers] = useState([])
    const [activeConversation, setActiveConversation] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();
    const convoId = searchParams.get('convoId')
    const to = searchParams.get('to')
    const service = searchParams.get('service')
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
    const result = await http.get('getUsers')
    const myId = await setUserId()
    const users = result.data
    fetchUsers(users, myId) 
    
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
        const allContacts = allChat.map((chats)=>{
           const receiver =  chats[0].participants.filter(chat => chat._id != myId)
           const conversationId = chats[0].conversationId
           const serviceInquired = chats[0].serviceInquired
           return {receiver, conversationId, serviceInquired, latestChat : chats[chats.length -1].message.content, latestChatTime : chats[chats.length -1].message.timestamp, dateSent : chats[chats.length -1].message.date}
            })
          
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
     function fetchUsers(users, myId){ 
    const allUsersInfo = users.filter(users => users._id != myId)
    const me = users.filter(users => users._id == myId)
    setSender({username : me[0].username, _id : me[0]._id})
    setAllUsers(allUsersInfo)
    return allUsersInfo
}

    // Handles the messages 
    const handleMessage = async (message) => {

    const messageData = {
        conversationId : conversationId,
        participants: [sender._id, recipient._id],
        serviceInquired : service,
        messages: 
            {
                sender: sender._id,
                receiver : recipient._id,
                content: message,
                timestamp : timeSent,
                date : thisDate
            }
        
    }

    try {
        const result = await http.post('sendChat', messageData)
        console.log(result.data)
        getUserChats()
        setTypingMessage("")
    } catch (error) {
        console.log(error)
    }
   

    }


    useEffect(()=>{
        http.get(`getServiceInfo/${service}`).then((res)=>{
            setServiceFromParam(res.data.service.basicInformation.ServiceTitle)
        }).catch((err)=>{console.log(err)})
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
                const test = res.allContacts.find(contact => contact.receiver[0].username === to)
                if(test == undefined)
                {    
                    http.get('getUsers').then((res)=>{
                        const users = res.data
                        const receiver = users.find(user => user.username == to)
                       
                        setRecipient({_id : receiver._id, username : receiver.username, profileImage : receiver.profileImage })
                        setConversationId('')
                    })
                   
                }
                else
                {
                
                setRecipient({_id : test.receiver[0]._id, username :test.receiver[0].username, profileImage :test.receiver[0].profileImage })
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
                    setRecipient({_id: filtered.receiver[0]._id, username : filtered.receiver[0].username, profileImage : filtered.receiver[0].profileImage, serviceInquired : filtered.serviceInquired})
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
                setRecipient({_id: filtered.receiver[0]._id, username : filtered.receiver[0].username, profileImage : filtered.receiver[0].profileImage, serviceInquired : filtered.serviceInquired})
            })
            setConversationId(convoId)
        }
       
       
    }
    

    },[userId])
    
    useEffect(()=>{
        if(recipient._id !== "")
        {
            setLoading(false)
        }
    }, [recipient])

    // setTimeout(()=>{
    // getUserChats()
    // },1000)
        

        

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
            <section className='w-[500px] h-screen flex flex-col p-2 pt-20'>
            
            <div className='bg-white rounded-lg shadow-md h-full'>
            {/* Search Input */}
            <div className='p-3 w-full relative'>
            <SearchOutlinedIcon className='absolute top-[1.35rem] text-gray-500 left-6' />
            <input className='rounded-full outline-none border-2 p-2 ps-10 w-full' type="text" placeholder='Search..'/>
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
            <div className={`${contact.conversationId === activeConversation ? "bg-gray-200" : ""} mt-5 p-3 flex items-center space-x-2 cursor-pointer`} onClick={()=>{setActiveConversation(contact.conversationId);setRecipient({_id : contact.receiver[0]._id, username : contact.receiver[0].username, profileImage : contact.receiver[0].profileImage, serviceInquired : contact.serviceInquired});setConversationId(contact.conversationId);setSearchParams({convoId : contact.conversationId, to : contact.receiver[0].username})}}  key={index} >
            <img className='w-11 h-11 rounded-full object-cover' src={contact.receiver[0].profileImage} alt="Profile" />
            <div className=' h-fit p-0 w-full'>
            <div className='flex w-full justify-between items-center'>
            <span className='cursor-pointer text-lg block  font-semibold'>{contact.receiver[0].username}</span>
            <span className='cursor-pointer text-xs font-medium text-gray-600'>{splitted}</span>
            </div>
            <span className='cursor-pointer text-xs font-medium text-gray-600'>{contact.latestChat}</span>
            </div>
            </div>
            )
                    
})
            }
            </div>
                
            </section>
        
            {/* Chats and message contents */}
            <section className='w-full flex flex-col pt-20 h-screen p-2'>
        
            <div className='w-full h-full bg-white justify-start flex flex-col shadow-md rounded-lg px-2'>
            <div className='w-full p-3  bg-white border-b-2 shadow-sm flex space-x-2 items-center object-contain'>
                <img className='w-10 h-10 object-cover origin-center rounded-full' src={recipient.profileImage} />
                <p className='text-themeBlue text-xl font-semibold'>{recipient.username}</p>
                <span className='w-1 h-1 rounded-full bg-themeBlue'></span>
                {
                    recipient.serviceInquired == undefined ? (<p className='text-themeBlue font-semibold'>{serviceFromParam}</p>)
                    :
                    <p className='text-themeBlue font-semibold'>{recipient.serviceInquired.basicInformation.ServiceTitle}</p>
                }
                {/* <p className='text-themeBlue font-semibold'>{recipient.serviceInquired.basicInformation.ServiceTitle}</p> */}
            </div>
            {/* Messages Content */}
            <ScrollToBottom  className='w-full flex h-full flex-col  overflow-auto '>

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
                    <div key={index}>
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
                            <div className={`${message.message.sender._id == sender._id ? "justify-end" : "justify-start"} items-center flex w-full p-1 my-2`} key={message._id}>
                    <div className={` flex items-center ${message.message.sender._id == sender._id ? "flex-row" : "flex-row-reverse"}  space-x-2`}>
                    <p className='text-semiXs mx-2'>{splitted}</p>
                    <p className={`${message.message.sender._id == sender._id ? "bg-blue-500 text-white rounded-md px-3 py-3" : "bg-gray-100 text-gray-700 rounded-md px-3 py-3"} shadow-md`}>{message.message.content}</p>
                    <img className='w-7 h-7 rounded-full object-cover' src={message.message.sender._id == sender._id ? message.message.sender.profileImage : message.message.sender.profileImage} />
                    </div>
                </div>
                           )
            })}
                        </div>
                      ))}
                    </div>
                  );
            //   chats.map((chat)=>{
                // const ampm = chat.message.timestamp.split(' ')
                //     const splitted = chat.message.timestamp.split(':').slice(0,-1).join(':') + " " + ampm[ampm.length - 1]
            //     return (
                // <div className={`${chat.message.sender._id == sender._id ? "justify-end" : "justify-start"} items-center flex w-full p-1 my-2`} key={chat._id}>
                //     <div className={` flex items-center ${chat.message.sender._id == sender._id ? "flex-row" : "flex-row-reverse"}  space-x-2`}>
                //     <p className='text-semiXs mx-2'>{splitted}</p>
                //     <p className={`${chat.message.sender._id == sender._id ? "bg-blue-500 text-white rounded-md px-3 py-3" : "bg-gray-100 text-gray-700 rounded-md px-3 py-3"} shadow-md`}>{chat.message.content}</p>
                //     <img className='w-7 h-7 rounded-full object-cover' src={chat.message.sender._id == sender._id ? chat.message.sender.profileImage : chat.message.sender.profileImage} />
                //     </div>
                // </div>
            //     )
                
                
            // })
            })
            }     
            {/* Sender Message */}
            <p>{message}</p>
            {/* </div> */}
            </ScrollToBottom>
            {/* Message input */}
            <div className='w-full p-2 flex items-center'>
            <input className='p-2 w-full outline-none border rounded-lg bg-slate-100 justify-self-end' value={typingMessage} onChange={(e)=>{setTypingMessage(e.target.value)}} onKeyDown={(e)=>{if(e.key === "Enter"){handleMessage(e.target.value)}}} type='text' placeholder='Enter message'  />
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