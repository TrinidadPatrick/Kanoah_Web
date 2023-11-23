import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserId, selectUserId } from '../../ReduxTK/userSlice';
import { useSearchParams } from 'react-router-dom';
import http from '../../http'

const Chat = () => {
    const dispatch = useDispatch();
    const userId = useSelector(selectUserId); 
    const [allUsers, setAllUsers] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    const convoId = searchParams.get('convoId')
    const to = searchParams.get('to')

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = currentDate.getDate().toString().padStart(2, '0');
    const thisDate = currentYear + "-" + currentMonth + "-" + currentDay

    const [recipient, setRecipient] = useState({})
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
        
        const allChats = await groupedData()
        //Set all contacts by setting the receiver and setting conversation id
        const allContacts = allChats.map((chats)=>{
           const receiver =  chats[0].participants.filter(chat => chat._id != myId)
           const conversationId = chats[0].conversationId
           return {receiver, conversationId}
            })
          setAllContacts(allContacts)
          setAllChats(allChats)
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
    async function fetchUsers(users, myId){ 
    const allUsers = users.filter(users => users._id != myId)
    const me = users.filter(users => users._id == myId)
    setSender({username : me[0].username, _id : me[0]._id})
    setAllUsers(allUsers)
}

    // Handles the messages 
    const handleMessage = async (message) => {

    const messageData = {
        conversationId : conversationId,
        participants: [sender._id, recipient._id],
        messages: 
            {
                sender: sender._id,
                receiver : recipient._id,
                content: message,
                timestamp : thisDate
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

    // Handles the settingup and showing conversation
    const handleSelectConversation = (data) => {
        
        // console.log(allContacts)
        const existingContact = allContacts.find(contact => contact.receiver[0].username === to)
        if(existingContact != undefined)
        {   
            setSearchParams({convoId : existingContact.conversationId})
            setConversationId(existingContact.conversationId)
            setRecipient(data)
            
        }
        else
        {   
            setSearchParams({convoId : ''})
            setConversationId('')
            setRecipient(data)
        }
        
        
    }

    //Use effect to set data to state
    useEffect(()=>{
    getUsers()
    getUserChats()
    // If convoId parameter is not specified, get the conversation id of the first conversation in the allChats
    if(convoId == '' || convoId == null)
    {
        if(to == null || to == "")
        {
            const setInitialConversationId = async () => {
                const chats = await (await getUserChats()).allChats
                setConversationId(chats[0][0].conversationId)
                setSearchParams({convoId : chats[0][0].conversationId})
                if(chats[0][0].message.receiver._id != sender._id)
                {
                    setRecipient(chats[0][0].message.receiver)
                }
                else
                {   
                    
                    setRecipient(chats[0][0].message.sender)
                }
               }
              setInitialConversationId()  
        }
        else
        {
            getUserChats().then((res)=>{
                const test = res.allContacts.find(contact => contact.receiver[0].username === to)
                setRecipient({_id : test.receiver[0]._id, username :test.receiver[0].username })
                setConversationId(test.conversationId)
                setSearchParams({convoId : test.conversationId, to})
            })
            
        }
        
    }
    else
    {   
        getUserChats().then((res)=>{
            const filtered = res.allContacts.find(contact => contact.conversationId == convoId)
            setRecipient({_id: filtered.receiver[0]._id, username : filtered.receiver[0].username})
        })
        setConversationId(convoId)
    }
    
    },[userId])
    // console.log(getUserChats())

// setTimeout(()=>{
// getUserChats()
// },1000)

  return (
    <div className='w-full h-screen flex gap-2'>
    {/* Contacts and Messages */}
    <section className='w-[500px] h-screen border-2 pt-20'>
    {
        allUsers.map((user,index)=>(
            <div key={index}>
            <p className='cursor-pointer' onClick={()=>{handleSelectConversation({_id : user._id, username : user.username});setSearchParams({to : user.username})}}>{user.username}</p>
            </div>
        ))
        }
        {
        allContacts.map((contact,index)=>(
            <div key={index} className='mt-5'>
                
                <p onClick={()=>{setRecipient({_id : contact.receiver[0]._id, username : contact.receiver[0].username});setConversationId(contact.conversationId);setSearchParams({convoId : contact.conversationId, to : contact.receiver[0].username})}} className='cursor-pointer'>{contact.receiver[0].username}</p>
            </div>
        ))
    }
    </section>

    {/* Chats and message contents */}
    <section className='w-full  h-screen border-2 p-2'>

    <div className='w-[400px] h-fit mt-20 justify-start flex flex-col border-2'>
    <div className='w-full p-1 bg-slate-500'>
        <p className='text-white'>{recipient.username}</p>
    </div>
    {/* Messages Content */}
    <div className='w-full flex h-[400px] flex-col  overflow-auto '>
    {/* Recipient Message */}
    {
    allChats
    .filter((chat) => chat[0].conversationId === conversationId)
    .map((chats, index) => (
      chats.map((chat)=>(
        <div className={`${chat.message.sender._id == sender._id ? "justify-end" : "justify-start"} items-center flex w-full p-1 my-2`} key={chat._id}>
            <div className='flex flex-col-reverse items-end'>
            <p className='text-semiXs'>{chat.message.timestamp}</p>
            <p className={`${chat.message.sender._id == sender._id ? "bg-green-500 text-white rounded-md px-2 py-1" : "bg-blue-500 text-white rounded-md px-2 py-1"}`}>{chat.message.content}</p>
            </div>
        </div>
        
      ))
    ))
}

    
    {/* Sender Message */}
    <p>{message}</p>
    </div>
    {/* Message input */}
    <input value={typingMessage} onChange={(e)=>{setTypingMessage(e.target.value)}} onKeyDown={(e)=>{if(e.key === "Enter"){handleMessage(e.target.value)}}} type='text' placeholder='Enter message' className='p-1' />
    </div>
    </section>
    </div>
  )
}

export default Chat