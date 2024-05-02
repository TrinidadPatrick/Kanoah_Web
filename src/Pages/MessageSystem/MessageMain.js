import React from 'react'
import userInformationStore from '../../Stores/UserInformationStore'
import ContactList from './ContactList'
import http from '../../http'
import { useState, useEffect } from 'react'
import MessageWindow from './MessageWindow'

const MessageMain = () => {
    const {userDetails, setUserDetails} = userInformationStore()
    const [staticContactList, setStaticContactList] = useState(null)
    const [contactList, setContactList] = useState(null)
    const [conversationData, setConversationData] = useState({
        me : '',
        entity : '',
        serviceInquired : '',
        serviceId : '',
        headerTitle : '',
        headerImage : '',
        conversationId : '',
        participants : []
    })

    // Gets all the contacts of the user
    const getAllContacts = async () => {
            try {
                const result = await http.get(`retrieveContacts/${userDetails._id}`, {withCredentials : true})
                setContactList(result.data)
                setStaticContactList(result.data)
            } catch (error) {
                console.log(error)
            }
    }

    useEffect(()=>{
        if(userDetails !== null)
        {
            getAllContacts()
        }
    },[userDetails])

  return (
    <div className='flex-1 mt-2 md:mt-0 flex overflow-auto '>
        <ContactList conversationData={conversationData} setConversationData={setConversationData} getAllContacts={getAllContacts} setContactList={setContactList} contactList={contactList} staticContactList={staticContactList} userDetails={userDetails} />
        <MessageWindow conversationData={conversationData} setConversationData={setConversationData} getAllContacts={getAllContacts} contactList={contactList} staticContactList={staticContactList} userDetails={userDetails} />
    </div>
  )
}

export default MessageMain