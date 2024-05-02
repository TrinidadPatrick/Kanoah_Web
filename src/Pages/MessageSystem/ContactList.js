import React, { useEffect } from 'react'
import http from '../../http'
import { useState } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { useSearchParams } from 'react-router-dom';
import socketStore from '../../Stores/SocketStore';
import emptyImage from '../../Utilities/emptyImage.jpg'

const ContactList = ({userDetails, contactList,setContactList,conversationData, setConversationData, staticContactList, getAllContacts}) => {
    const {socket} = socketStore()
    const [params, setParams] = useSearchParams()
    const serviceParam = params.get("service") || null
    const conversationIdParam = params.get("conversationId") || null

    useEffect(()=>{
        if(userDetails !== null)
        {
            socket?.on('message', (data)=>{
                getAllContacts()
            })
        }
    },[socket, userDetails])

    const handleReadMessage = async (conversationId) => {
        const newData = [...contactList]
        newData.map((contact)=> contact.readBy.push(userDetails._id))
        const readMessage = await http.put('handleReadMessage', {conversationId, myId : userDetails?._id})
    }

    const clearConversationData = () => {
        setConversationData({
            me : '',
            entity : '',
            serviceInquired : '',
            serviceId : '',
            headerTitle : '',
            headerImage : '',
            conversationId : '',
            participants : []
        })
    }

    function handleSearchMessage(searchInput){
        if(searchInput === "")
        {
            setContactList(staticContactList)
            return
        }
        else
        {
          const searchResults = staticContactList.filter((contacts) =>
          contacts.participants.some((participant) =>
          participant.firstname.trim().toLowerCase().includes(searchInput.trim().toLowerCase()) ||
          participant.lastname.trim().toLowerCase().includes(searchInput.trim().toLowerCase())
          ) ||
          contacts.virtualServiceInquired.basicInformation.ServiceTitle.toLowerCase().includes(searchInput.trim().toLowerCase())) ;
          setContactList(searchResults)
        }
    }


  return (
    <main className='w-[330px] bg-white border-r-1 flex flex-col'>
        <h1 className='font-bold text-gray-900 text-2xl p-0 px-2 pt-2'>Chats</h1>
        {/* Search */}
        <div className='p-3  w-full relative'>
            <SearchOutlinedIcon fontSize='small' className='absolute top-[1.2rem] text-gray-500 left-5' />
            <input onChange={(e)=>handleSearchMessage(e.target.value)} id='searchField' className='rounded-full outline-none bg-gray-100 p-2 ps-9 text-sm text-gray-600 w-full' type="text" placeholder='Search..'/>
        </div>
        {/* Contact List */}
        <div className='flex-1 mt-2 overflow-auto flex flex-col space-y-3'>
        {
            contactList?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))?.map((contact, index)=>{
                const sender = contact.participants.find((participant) => participant._id !== userDetails._id)
                const receiver = contact.participants.find((participant) => participant._id === userDetails._id)
                const isReceiverOwner = contact.virtualServiceInquired.userId === receiver._id //Check if the conversation is between the reciever owner
                const dateNow = new Date().toLocaleDateString("EN-US", {month : 'short', day : '2-digit', year : 'numeric'})
                const messageDate = new Date(contact.createdAt).toLocaleDateString("EN-US", {month : 'short', day : '2-digit', year : 'numeric'})
                return (
                    <div key={contact._id} onClick={()=>{clearConversationData();handleReadMessage(contact.conversationId);setParams({service : contact.virtualServiceInquired.userId, conversationId : contact.conversationId})}} 
                    className={` ${conversationIdParam === contact.conversationId ? "bg-gray-100 border-r-4 border-blue-500" : "bg-white"}  overflow-hidden flex flex-row p-2 space-x-3 cursor-pointer`}>
                        <div className="image-container flex-none w-10 rounded-full overflow-hidden aspect-square ">
                        {
                            isReceiverOwner ? <img className='w-full h-full origin-center object-cover' src={sender.profileImage} />
                            :
                            <img className='w-full h-full object-cover' src={contact.virtualServiceInquired.serviceProfileImage || emptyImage} />
                        }
                        </div>
                        {/* title and initial message */}
                        <div className="flex flex-col flex-1 justify-evenly w-44">
                            <div className="chat-title flex-1 flex flex-row space-x-1 items-center overflow-hidden ">
                                <p className={` ${contact.readBy.includes(userDetails._id) ? "font-medium" : "font-bold text-blue-500"}  text-sm overflow-hidden whitespace-nowrap text-ellipsis`}>
                                    {isReceiverOwner ? sender.firstname + " " + sender.lastname : contact.virtualServiceInquired.basicInformation.ServiceTitle}
                                </p>
                                {
                                    isReceiverOwner && <StorefrontOutlinedIcon fontSize='small' className={`${contact.readBy.includes(userDetails._id) ? "text-gray-700" : "text-blue-500"} p-0.5`} />
                                }
                            </div>
                            <div className="chat-message flex flex-row">
                                {
                                    contact.messageType === "text" ? <p className={`${contact.readBy.includes(userDetails._id) ? "font-normal" : "font-bold"} whitespace-nowrap w-44 text-ellipsis overflow-hidden text-gray-600 text-xs`}>{receiver._id === contact.messageContent.sender ? "You: " + contact.messageContent.content : contact.messageContent.content }</p>
                                    :
                                    <p className={`${contact.readBy.includes(userDetails._id) ? "font-normal" : "font-bold"} text-gray-600 text-xs`}>{receiver._id === contact.messageContent.sender ? "You: Photo" : "Photo" }</p>
                                }
                            </div>
                        </div>
                        {/* Date and time */}
                        <div className="px-0.5 flex flex-col justify-start items-end pt-1  w-16 ">
                        {
                            dateNow === messageDate ? 
                            <p className={` ${contact.readBy.includes(userDetails._id) ? "font-normal text-gray-500" : "font-bold"} text-[0.65rem] whitespace-nowrap`}>{contact.messageContent.timestamp}</p>
                            :
                            <p className={` ${contact.readBy.includes(userDetails._id) ? "font-normal text-gray-500" : "font-bold"} text-[0.65rem] whitespace-nowrap`}>{messageDate}</p>
                        }         
                        </div>
                    </div>
                )
            })
        }
        </div>
    </main>
  )
}

export default ContactList