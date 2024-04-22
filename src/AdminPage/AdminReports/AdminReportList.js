import React, { useState } from 'react'
import { useEffect } from 'react'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import usePendingReport from '../CustomHooks/usePendingReport';
import OutsideClickHandler from 'react-outside-click-handler';
import { useNavigate } from 'react-router-dom';
import http from '../../http';

const AdminReportList = () => {
    const navigate = useNavigate()
    const {pendingReports} = usePendingReport()
    const [reportList, setReportList] = useState(null)
    const [showActionDropDown, setShowActionDropdown] = useState('')
    const [disableServiceObject, setDisableServiceObject] = useState({
        service : {},
        reason : []
    })
    const [openDisableModal, setOpenDisableModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState({})
    const reasons = ['Explicit Content', 'Fake Information/False Claims', 'Hate Speech/Bullying', 'Violence/Threats', 
                    'Spam/Scams', 'Non-Compliance with Terms of Service', 'Terrorism', 'Involves a child', 'Nudity']
    const [dateFilter, setDateFilter] = useState('')

    useEffect(()=>{
    setReportList(pendingReports)
    },[pendingReports])

    const handleShowDropDown = (id) => {
        if(showActionDropDown === id)
        {
            setShowActionDropdown('')
            return
        }
        setShowActionDropdown(id)
    }

    const handleSelectReason = (value) => {
        const newData = [...disableServiceObject.reason]

        // Check if the value exists
        const checkIndex = newData.findIndex((reason) => reason === value)
        if(checkIndex === -1)
        {
            newData.push(value)
            setDisableServiceObject({...disableServiceObject, reason : newData})
            return
        }
        newData.splice(checkIndex, 1)
        setDisableServiceObject({...disableServiceObject, reason : newData})
        return

    }

    const updateReport = async (status, reportId) => {
        try {
            const result = await http.patch(`AdminUpdateReport/${reportId}`, {status : status}, {withCredentials : true})
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }


    // Disables the service
    const disableService = async () => {
        const serviceId = disableServiceObject.service._id
        try {
            const result = await http.patch(`Admin_DisableService/${serviceId}`, disableServiceObject, {withCredentials : true})
            if(result.status == 200)
            {   
                const newData = [...reportList]
                const index = newData.findIndex((report)=>report._id === selectedReport._id)
                newData.splice(index, 1)
                setReportList(newData)
                setOpenDisableModal(false)
                setDisableServiceObject({service : {},
                    reason : []})
                updateReport("Accepted", selectedReport._id)
                notifyUserAccepted()
                setSelectedReport({})
            }
        } catch (error) {
            console.log(error)
        }
    }

    const notifyUserAccepted = async () => {
        try {
            const notify = await http.post('AdminAddNotification', {
                notification_type : "Report Update", 
                createdAt : new Date(),
                content : {
                    title : "Report Update",
                    body : `We have reviewed your report to ${disableServiceObject.service.name} for
                    ${disableServiceObject?.reason.map((reason)=> " " + reason)}
                    and found that it violates our Community Guidelines. We want to keep Kanoah safe and welcoming to everyone, thank you
                    for taking action to report this.`
                }, 
                notif_to : selectedReport?.reportedBy,
                reference_id : selectedReport?._id
            }, {withCredentials : true})

        } catch (error) {
            console.error(error)
        }
    }

    const notifyUserRejected = async (report) => {
        try {
            const notify = await http.post('AdminAddNotification', {
                notification_type : "Report Update", 
                createdAt : new Date(),
                content : {
                    title : "Report Update",
                    body : `We have reviewed your report to ${report.service.name} for
                    ${report?.reasons.map((reason)=> " " + reason)}
                    and found that it does not violates our Community Guidelines. 
                    We want to keep Kanoah safe and welcoming to everyone, Your commitment to keeping Kanoah safe and welcoming is highly appreciated. 
                    Thank you for taking the initiative to report this matter.`
                }, 
                notif_to : report?.reportedBy,
                reference_id : report?._id
            }, {withCredentials : true})

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
    if(dateFilter !== '')
    {
        const filtered = pendingReports.filter((report) =>
        new Date(report.createdAt).toLocaleDateString('EN-US', {
            month : '2-digit',
            day : '2-digit',
            year : 'numeric'
        }) === dateFilter
        )

        setReportList(filtered)
    }
    },[dateFilter])

  return (
    <>
    <main className=' flex flex-col w-full h-full overflow-hidden relative'>
    <h1 className='text-lg font-medium text-gray-600 mx-10 mt-3'>All Pending Reports</h1>
    {
    reportList === null ? 
    <div className='w-full px-10 mt-5 flex flex-col'>
    <div className="flex flex-col  w-full  h-64 animate-pulse rounded-xl p-4 gap-4"  >
    <div className="bg-neutral-400/50 w-56 h-32 animate-pulse rounded-md"></div>
    <div className="flex flex-col gap-2">
    <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
    <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
    <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
    <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
    </div>
    </div>
    <div className="flex flex-col  w-full  h-64 animate-pulse rounded-xl p-4 gap-4"  >
    <div className="bg-neutral-400/50 w-56 h-32 animate-pulse rounded-md"></div>
    <div className="flex flex-col gap-2">
    <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
    <div className="bg-neutral-400/50 w-4/5 h-4 animate-pulse rounded-md"></div>
    <div className="bg-neutral-400/50 w-full h-4 animate-pulse rounded-md"></div>
    <div className="bg-neutral-400/50 w-2/4 h-4 animate-pulse rounded-md"></div>
    </div>
    </div>
    </div>
    :
    <>
    {/* Date Filter */}
    <div className='w-full flex items-center justify-between px-10 mt-5'>
    <div className='flex items-center gap-2 relative'>
    <h2 className='text-gray-500 text-sm'>Showing {reportList?.length} results</h2>
    </div>
    <input onChange={(e)=>setDateFilter(new Date(e.target.value).toLocaleDateString('EN-US', {
        month : '2-digit',
        day : '2-digit',
        year : 'numeric'
    }))} type='date'  />
    </div>

    {/* Disable Service */}
    <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} className={`w-full z-30 h-full ${openDisableModal ? "flex" : "hidden"} items-center justify-center absolute top-0 left-0`}>
        <OutsideClickHandler onOutsideClick={()=>setOpenDisableModal(false)}>
        <div className=' flex flex-col p-3 items-center bg-white w-[95%] semiSm:w-[350px]'>
                {/* Header */}
                <div>
                    <h1 className='flex text-lg text-red-500 font-medium'>You are about to disable {disableServiceObject?.service?.basicInformation?.ServiceTitle}</h1>
                </div>

                {/* Reasons */}
                <div className='w-full flex flex-col mt-5'>
                    <h2 className='text-sm whitespace-nowrap font-medium'>What's wrong with the service?</h2>
                    <div className='w-full flex gap-3 flex-wrap mt-3'>
                    {
                        reasons.map((reason, index)=>{
                            return (
                                <button key={index} onClick={()=>handleSelectReason(reason)} className={`whitespace-nowrap ${disableServiceObject.reason.includes(reason) ? "bg-blue-500 text-white" : "bg-gray-200"} border rounded-md px-3 py-1 text-sm`}>{reason}</button>
                            )
                        })
                    }
                    </div>
                </div>
                <div className='w-full flex flex-col mt-5'>
                <button disabled={disableServiceObject.reason.length === 0} onClick={()=>disableService()} className='py-2 px-3 disabled:bg-gray-100 disabled:text-gray-300 text-sm bg-red-100 text-red-500 rounded-sm hover:bg-red-300'>Confirm</button>
                </div>
        </div>
        </OutsideClickHandler>
    </div>

    {/* Lists */}
    {
    reportList.length === 0 ?
    <div className='w-full h-full flex flex-col justify-center items-center'>
    <h1 className='text-3xl font-medium text-gray-500'>No result found</h1>
    <p className='text-base font-normal text-gray-400'>Try adjust your search or filter to find what you're looking for.</p>
    </div>
    :
    <div className='px-10 py-3 gap-3 w-full h-full flex flex-col overflow-auto '>
    {
    reportList?.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)).map((report)=>{
        const date = report.createdAt
        const createdAt = new Date(date).toLocaleDateString('EN-US', {
            month : 'long',
            day : '2-digit',
            year : 'numeric'
        })
    return (
    <div key={report._id} className='w-full max-w-full border border-[#a3a3a3] rounded-md p-2 '>
        {/* Top Part */}
        <div className='w-full flex border-b-1 pb-2 items-center justify-between'>
            <h1 className='font-medium text-red-500 px-2 py-1 bg-red-100 rounded-sm'>{report.service.name}</h1>
            {/* Buttons */}
            <div className='flex items-center relative gap-2'>
                <button onClick={()=>navigate(`/admin/Services/AdminViewService/${report.service._id}`)} className='px-2 py-1 bg-gray-100 border border-[#8f8f8f] rounded-sm text-sm'>View Service</button>
                <button onClick={()=>handleShowDropDown(report._id)} className='flex items-center'>Action <ArrowDropDownOutlinedIcon /></button>
                {/* Dropdown */}
                <div className={`${showActionDropDown === report._id ? "flex" : "hidden"} flex-col border items-start absolute bg-white shadow-md rounded-sm top-7 right-1`}>
                <button onClick={()=>{setOpenDisableModal(true);setDisableServiceObject({...disableServiceObject, service : report.service, reason : report.reasons});setSelectedReport(report)}} className='text-sm hover:bg-gray-100 w-full text-start px-2 py-1'>Disable Service</button>
                <button onClick={()=>{updateReport("Rejected", report._id);notifyUserRejected(report)}} className='text-sm hover:bg-gray-100 w-full text-start px-2 py-1'>Reject Report</button>
                </div>
            </div>
        </div>
        {/* Text Detail */}
        <div className='w-full flex flex-wrap mt-3'>
            <p className='text-sm break-all line-clamp-3 text-gray-500 '>{report.textDetails}</p>
        </div>
        {/* Reasons */}
        <div className='w-full flex items-center flex-wrap gap-2 mt-3'>
        {
        report.reasons.map((reason, index)=>(
        <div className='w-fit px-2 py-1 text-xs bg-gray-100 rounded-sm' key={index}>{reason}</div>
        ))
        }
        </div>
        {/* Photos */}
        <div className='w-full flex items-center justify-start gap-3 overflow-auto mt-3'>
        {
        report.photos?.map((photo, index) =>{
        return (
            <div className='w-20 h-20 flex-none bg-gray-100 aspect-square object-contain'>
            <img className='w-full h-full' src={photo.src} alt="image" />
            
        </div>  
        )
       
        })
        }
        </div>
        <hr className='my-3'></hr>
        <div className='w-full py-2 flex items-center justify-between'>
            {/* Date Created */}
            <div>
                <p className='text-sm text-gray-500 font-[500]'>Date Reported: <span className='font-normal'>{createdAt}</span></p>
            </div>
            {/* Reportee */}
            <div>
                <p className='text-sm text-gray-500 font-[500]'>Reporter: <span className='font-normal'>{report.reportedBy.firstname} {report.reportedBy.lastname}</span></p>
            </div>
        </div>
        
    </div>
    )
    })
    }
        </div>

    }</>
    }

    </main>
    </>
  )
}

export default AdminReportList