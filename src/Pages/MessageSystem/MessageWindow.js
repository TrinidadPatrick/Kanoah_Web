import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import axios from 'axios';
import cloudinaryCore from '../../CloudinaryConfig';
import http from '../../http'
import socketStore from '../../Stores/SocketStore';
import ScrollToBottom from 'react-scroll-to-bottom';
import chatStore from '../../Stores/AllConversationStore';
import emptyImage from '../../Utilities/emptyImage.jpg'
import { useNavigate } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

const MessageWindow = ({userDetails, contactList, conversationData, setConversationData, getAllContacts}) => {
    const navigate = useNavigate()
    const {userConversations, storeConversations} = chatStore()
    const {socket} = socketStore()
    const [params, setParams] = useSearchParams()
    const serviceParam = params.get("service") || null
    const conversationIdParam = params.get("conversationId") || null
    const [conversation, setConversation] = useState(null)
    const [messageInput, setMessageinput] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [sendingMessages, setSendingMessages] = useState([])
    const [selectedImages, setSelectedImages] = useState(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const currentDate = new Date();
    const thisDate = new Date().toLocaleDateString('en-CA');
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeSent = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
      } = useSpeechRecognition();

    const groupedMessages = conversation !== null && conversation.reduce((groups, message) => {
        const date = new Date(message.createdAt).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});
      
    // Step 2: Convert grouped messages object to array for FlatList rendering
    const groupedData = Object.keys(groupedMessages).map((date) => ({
    date,
    messages: groupedMessages[date],
    }));

    useEffect(()=>{
            if(userDetails !== null && conversationIdParam !== null && serviceParam === null)
            {
                getConversation()
            }
            if(userDetails !== null && conversationIdParam === null && serviceParam !== null)
            {
                getConversation()
            }
            if(userDetails !== null && conversationIdParam !== null && serviceParam !== null)
            {
                getConversation()
            }
            if(contactList !== null && serviceParam === null && conversationIdParam === null)
            {
                getInitialConversation()
            }
    },[conversationIdParam, userDetails, contactList])

    // Get online users and messages
    useEffect(()=>{
        if(userDetails !== null)
        {
            socket?.on('onlineUsers', (onlineUsers)=>{
                setOnlineUsers(onlineUsers)
            }) 
            socket?.on('message', (data)=>{
                getConversation()
            })
            socket?.emit('loggedUser', userDetails?._id)
            
            return () => {
                socket?.emit('disconnectUser', userDetails?._id)
            }
        }
    },[socket, userDetails])

    useEffect(()=>{
        if(!listening)
        {
            setMessageinput(prevMessage => prevMessage + " " + transcript); // Append transcript to messageInput
            resetTranscript();
        }
    },[transcript, listening])

    // Get conversation based on serviceId or convo Id
    const getConversation = async () => {
        // Only run this if the message is open via contact List or chat now
        if(conversationIdParam !== null && serviceParam !== null)
        {
            const convoFromZundax = userConversations.find((convo) => convo.conversationId === conversationIdParam)
            if(convoFromZundax)
            {
                const entity = convoFromZundax.chats[0].participants.find((participant) => participant._id !== userDetails._id) // the other participant
                const me = convoFromZundax.chats[0].participants.find((participant) => participant._id === userDetails._id) // me
                const isReceiverOwner = convoFromZundax.chats[0].virtualServiceInquired.userId === me._id
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceParam, headerTitle : isReceiverOwner ? entity.firstname + " " + entity.lastname : convoFromZundax.chats[0].virtualServiceInquired.basicInformation.ServiceTitle, headerImage : isReceiverOwner ? entity.profileImage : convoFromZundax.chats[0].virtualServiceInquired.serviceProfileImage ,conversationId : convoFromZundax.chats[0].conversationId, participants : [me._id, entity._id], serviceId : convoFromZundax.chats[0].virtualServiceInquired._id})
                setConversation(convoFromZundax.chats)
            }
        }
        try {
            const messages = await http.get(`getMessages/${conversationIdParam}/${1000}/${serviceParam}`, {withCredentials : true})
            const data = messages.data.result
            if(data.length !== 0) // Thid typically means there is an existing conversation and the conversation is open via contact list
            {
                setConversation(data)
                const entity = data[0].participants.find((participant) => participant._id !== userDetails._id) // the other participant
                const me = data[0].participants.find((participant) => participant._id === userDetails._id) // me
                const isReceiverOwner = data[0].virtualServiceInquired.userId === me._id
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceParam, headerTitle : isReceiverOwner ? entity.firstname + " " + entity.lastname : data[0].virtualServiceInquired.basicInformation.ServiceTitle, headerImage : isReceiverOwner ? entity.profileImage : data[0].virtualServiceInquired.serviceProfileImage ,conversationId : data[0].conversationId, participants : [me._id, entity._id],serviceId : data[0].virtualServiceInquired._id})
                storeMessages(data, data[0].conversationId)
            }
            else //this means this is a new conversation so the header information is always the service details
            {
                const receiver = await http.get(`getReceiver/${serviceParam}`)
                const service = await http.get(`getServiceFromChat/${serviceParam}`)
                setConversation([])
                const entity = receiver.data._id
                const me = userDetails?._id
                setConversationData({...conversationData, entity : entity, me : me, serviceInquired : serviceParam, headerTitle : service.data.basicInformation.ServiceTitle, headerImage : service.data.serviceProfileImage, 
                conversationId : null, participants : [me, entity], serviceId : service._id
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Store messages in zustand
    const storeMessages = (conversationToStore, conversationId) => {
            if(conversationId != null)
            {
                const newConversation = [...userConversations]
                const index = newConversation.findIndex((convo) => convo.conversationId === conversationId)
                if(index === -1)
                {
                    newConversation.push({conversationId : conversationId, chats : conversationToStore})
                    storeConversations(newConversation)
                }
                else
                {
                    newConversation.splice(index, 1, {conversationId : conversationId, chats : conversationToStore})
                    storeConversations(newConversation)
                }
            }
    }

    // get conversation if service and convo Id is not specified.
    const getInitialConversation = async () => {
       const initialConvo = contactList?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))[0]
       const conversationId = initialConvo.conversationId || null
       const service = initialConvo.serviceInquired || null
       setParams({conversationId, service})
    }

    const sendMessage = async (type) => {
        if(messageInput !== "")
        {
        const currentDate = new Date();
        const thisDate = new Date().toLocaleDateString('en-CA');
        let hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeSent = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        const data = {
            sendingId : Math.floor(Math.random() * 1000),
            conversationId : conversationData.conversationId,
            participants : conversationData.participants,
            readBy : userDetails?._id, // always the user who is in here first
            serviceInquired : conversationData.serviceInquired,
            createdAt : currentDate,
            messageType : type,
            messageContent : 
            {
              sender : conversationData.me._id || conversationData.me,
              receiver: conversationData.entity._id || conversationData.entity,
              content: messageInput,
              date : thisDate,
              timestamp : timeSent
            }
        }
        setSendingMessages((prevData)=> [...prevData, data])
        setConversation([...conversation, data])
        setMessageinput("")
        try {
            const result = await http.post('sendMessage', data)
            setSendingMessages([...sendingMessages.filter(message => message.sendingId !== data.sendingId)])
            socket.emit('message', {notificationMessage : 'newMessage', receiverName : conversationData.entity._id || conversationData.entity}); 
            storeMessages([...conversation, data], conversationData.conversationId) 
            getAllContacts()
        } catch (error) {
            console.log(error)
        }
        }
    }

    //Handle the sending of Image
    const pickImage = async (event) => {
            const file = event.target.files[0];
      
            const getImageDataUrl = (file) => {
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const dataURL = reader.result;
                  resolve(dataURL);
                };
                reader.onerror = (error) => {
                  reject(error);
                };
                reader.readAsDataURL(file);
              });
            };
      
            const resizeImage = (dataUrl, maxWidth, maxHeight) => {
              return new Promise((resolve) => {
                const img = new Image();
                img.src = dataUrl;
      
                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
      
                  let width = img.width;
                  let height = img.height;
      
      
                  
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
                const sendingId = Math.floor(Math.random() * 1000)

                const img = new Image()
                img.src = test
                const size = {width : img.width, height : img.height}

                // So that the image sent is shown upon sending image rather than wait for uploading in the database
                const data = {
                    sendingId : sendingId,
                    conversationId : conversationData.conversationId,
                    participants : conversationData.participants,
                    readBy : userDetails?._id, // always the user who is in here first
                    serviceInquired : conversationData.serviceInquired,
                    createdAt : currentDate,
                    messageType : "image",
                    messageContent : 
                    {
                      sender : conversationData.me._id || conversationData.me,
                      receiver: conversationData.entity._id || conversationData.entity,
                      content: resizedImageDataUrl,
                      size : size,
                      date : thisDate,
                      timestamp : timeSent
                    }
                }               
                setConversation([...conversation, data])
      
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
                  (()=>{handleImageSend(imageUrl, size, sendingId )})()
                }
              } catch (error) {
                console.error(error);
              }
            }
      
            
            
    };

    const handleImageSend = async (imageUrl, size, sendingId) => { 
        const data = {
            sendingId : sendingId,
            conversationId : conversationData.conversationId,
            participants : conversationData.participants,
            readBy : userDetails?._id, // always the user who is in here first
            serviceInquired : conversationData.serviceInquired,
            createdAt : currentDate,
            messageType : "image",
            messageContent : 
            {
              sender : conversationData.me._id || conversationData.me,
              receiver: conversationData.entity._id || conversationData.entity,
              content: imageUrl,
              size : size,
              date : thisDate,
              timestamp : timeSent
            }
        }
        try {
            const result = await http.post('sendMessage', data)
            socket.emit('message', {notificationMessage : 'newMessage', receiverName : conversationData.entity._id || conversationData.entity});
            getAllContacts()
        } catch (error) {
            console.log(error)
        }
    }

    const handleListen = () => {
        SpeechRecognition.startListening();
    };

    const storeImagesForViewer = (convoId) => {
        const images = conversation.filter((convo) => convo.messageType === "image").map((image)=> ({src : image.messageContent.content, _id : image._id}))
        const index =  images.findIndex((convo) => convo._id === convoId)
        setSelectedImageIndex(index)
        setSelectedImages(images)
    }
    

  return (
    <main className='flex-1 flex flex-col p-2 '>
    {/* Header */}
    <div className="py-2 border-b-1 shadow-sm px-2 flex flex-row items-center bg-white relative">
    {
        conversationData.me === ''
        ?
        <div className="relative flex w-64 animate-pulse gap-2 p-0.5">
              <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                <div className="flex-1">
                  <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-200 text-lg"></div>
                  <div className="h-5 w-[90%] rounded-lg bg-slate-200 text-sm"></div>
                </div>
              <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-200"></div>
          </div>
        :
        <>
        <div className="flex flex-row flex-1">
                <div className="w-12 aspect-square rounded-full overflow-hidden mx-2">
                    <img src={conversationData.headerImage || emptyImage} style={{width : "100%", height : "100%"}} className="rounded-full object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                <p  className="font-medium text-gray-800 text-base">{conversationData.headerTitle}</p>
                {onlineUsers.some((user)=> user.username === conversationData.entity._id) ? <p className="text-green-400 text-[0.8rem]">Online</p> : <p className='text-[0.8rem]'>Offline</p>}
                </div>
        </div>
        <button onClick={()=>setShowDropdown(!showDropdown)} className="w-[30] h-full flex flex-row items-center justify-center relative">
                <MoreHorizOutlinedIcon />
        </button>
        {/* More options */}
        {
        showDropdown && 
        <OutsideClickHandler onOutsideClick={()=>setShowDropdown(false)}>
        <div className=" bg-white shadow-md rounded-sm z-10 absolute top-10 right-5 flex-col">
            <button onClick={()=>{navigate(`/exploreService/viewService/${conversationData.serviceId}`)}} className="px-2 py-3 text-sm hover:text-blue-500">
                <p>View service</p>
            </button>
        </div>
        </OutsideClickHandler>
        }
        </>
    }
    </div>
    {/* Conversations */}
    <div className=' h-full  overflow-auto p-2 flex flex-col '>
    {
        conversationData.me === '' ?
        <div className=' overflow-hidden h-full  '>
        <div role="status" className=" animate-pulse w-full h-full  flex flex-col justify-evenly">
        <div className="h-5 bg-slate-200 rounded-full  w-48 mb-4"></div>
        <div className="h-5 bg-slate-200 rounded-full  max-w-[60%] "></div>
        <div className="h-5 bg-slate-200 rounded-full  max-w-[80%]"></div>
        <div className="h-5 bg-slate-200 rounded-full  max-w-[70%] "></div>
        <div className="h-5 bg-slate-200 rounded-full  max-w-[50%] "></div>
        <div className="h-5 bg-slate-200 rounded-full  max-w-[360px] "></div>
        <div className="h-5 bg-slate-200 rounded-full  max-w-[65%]"></div>
        <span className="sr-only">Loading...</span>
        </div>
        </div>

        :
        <ScrollToBottom initialScrollBehavior='smooth' scrollViewClassName='messageBox' className='h-full overflow-auto p-2 '>
    {
        groupedData?.map((item, index)=>{
            return (
                <div key={index}>
                <div className="flex flex-row items-center">
                    <div className="flex-1 border-t-[0.5px] border-gray-200"></div>
                    <p className="mx-4 text-sm text-center my-2 text-gray-300 font-medium">
                    {item.date}
                    </p>
                    <p className="flex-1 border-t-[0.5px] border-gray-200"></p>  
                </div>
                {
                item.messages?.map((item, index)=>{
                    const me = item.messageContent.sender === userDetails?._id ? item.messageContent.sender : item.messageContent.receiver
                    const entity = item.messageContent.sender === userDetails?._id ? item.messageContent.receiver : item.messageContent.sender
                    const myMessage =  me === item.messageContent.sender
                    const aspectRatio = item.messageType === "image" && item.messageContent.size.width / item.messageContent.size.height;
                    const calculatedHeight = item.messageType === "image" && 200 / aspectRatio;
                    return (
                        <div key={index} className={`w-full flex flex-col ${myMessage ? "items-end" : "items-start"} my-2`}>
                            <div className={`gap-x-1 flex max-w-[50%]  ${myMessage ? " flex-row-reverse" : "flex-row"} items-end `}>
                               {!myMessage &&  
                               <div className="w-6  h-6 rounded-full overflow-hidden">
                                   {conversationData.headerImage && <img src={conversationData.headerImage} style={{width : "100%", height : "100%"}} /> }
                                </div>
                                }
                                {
                                    item.messageType === "text" ?
                                    <p className={`${myMessage ? "text-white bg-blue-500" : "text-gray-600 bg-gray-200 "} p-2 text-sm rounded-md`}>{item.messageContent.content}</p>
                                    :
                                    <div style={{width : 200, height : calculatedHeight}} className={` p-1 `}>
                                    <button onClick={()=>storeImagesForViewer(item._id)} className=" ">
                                    <img src={item.messageContent.content}  style={{width : "100%", height : "100%", borderRadius : 10}} />
                                    </button>
                                    </div>
                                }
                            </div>
                            {
                                sendingMessages.some(message => message.messageContent.content === item?.messageContent.content) ?
                                <p className={` text-semiXs`}>Sending</p> :
                                <p className="text-[0.65rem] text-gray-500 pl-7">{item.messageContent.timestamp}</p>
                            }
                        </div>
                    )
                })
            }
                </div>
            )
        })
    }
        </ScrollToBottom>
    }
    </div>
    {/* Message Input */}
    <div className="flex flex-row items-center py-0 px-1 m-3 border bg-gray-50 border-gray-100 rounded-full">
        {/* Image send Input */}
        <div className={` text-[0.85rem] border-r-1  py-1 flex items-center relative px-1 left-1 text-white font-medium text-center cursor-pointer`}>
        <button className='cursor-pointer'>
          <ImageOutlinedIcon className='text-gray-600 cursor-pointer' />
        </button>
        <input type="file" accept="image/*" onChange={pickImage} id="fileInput" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </div>
        <textarea value={messageInput} onChange={(e)=>setMessageinput(e.target.value)} onKeyDown={(e)=>{if(e.key == "Enter" && !e.shiftKey){sendMessage("text", {width : 0, height : 0});e.preventDefault()}}} rows={1} placeholder='Message...' className="messageInput flex-1 text-base pl-3 py-3 resize-none outline-none " />
        {/* Microphone */}
        <button onClick={()=>{listening ? SpeechRecognition.stopListening() : handleListen()}} className={`mr-2 mb-0.5`}>
            <KeyboardVoiceOutlinedIcon className={`${listening ? "text-blue-500" : "text-gray-600"} cursor-pointer`} />
        </button>
        {/* Send button */}
        <button disabled={messageInput === ""} onClick={()=>{sendMessage("text", {width : 0, height : 0})}} className="bg-blue-500 cursor-pointer hover:bg-blue-600 flex flex-row rounded-full items-center px-2 py-2 justify-center">
            <SendOutlinedIcon className='text-white' />
        </button>
    </div>
    {/* Image viewer */}
    <Lightbox
        carousel={{finite : true}}
        plugins={[Download,Fullscreen]}
        open={selectedImages.length !== 0}
        close={() => setSelectedImages([])}
        index={selectedImageIndex}
        slides={selectedImages}
      />
    </main>
  )
}

export default MessageWindow