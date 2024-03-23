import React, { useState } from 'react'
import { useEffect } from 'react'
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import UseReportHistory from '../CustomHooks/UseReportHistory';
import OutsideClickHandler from 'react-outside-click-handler';
import http from '../../http';

const AdminReportHistory = () => {
  const {reportsHistory} = UseReportHistory()
  const [allReports, setAllReports] = useState(null)
  const reasons = ['Explicit Content', 'Fake Information/False Claims', 'Hate Speech/Bullying', 'Violence/Threats', 
                    'Spam/Scams', 'Non-Compliance with Terms of Service', 'Terrorism', 'Involves a child', 'Nudity']
  const [filterOption, setFilterOption] = useState({
    status : 'All Reports',
    reason : '',
    date : ''
  })
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(()=>{
    if(reportsHistory !== null)
    {
      const sorted = reportsHistory.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
    setAllReports(sorted)
    }
  },[reportsHistory])

  // Take effect of the filter
  useEffect(()=>{
    let reportList = []

      if(filterOption.date !== '')
      {
        const dateFilter = new Date(filterOption.date).toLocaleDateString('EN-US', {
          year : 'numeric',
          month : '2-digit',
          day : '2-digit'
        })

        reportList = reportsHistory.filter((report) => new Date(report.createdAt).toLocaleDateString('EN-US', {
          year : 'numeric',
          month : '2-digit',
          day : '2-digit'
        }) === dateFilter )
      }
      else
      {
        reportList = reportsHistory
      }
    
      switch (filterOption.status) {
        case "All Reports":
          reportList = reportList
          break;
        case "Didn't Follow Community Guidelines":
            const acceptedReports = reportList.filter((report) => report.status === "Accepted")
            reportList = acceptedReports
            break; 
        case "Followed Community Guidelines":
              const rejectedReports = reportList.filter((report) => report.status === "Rejected")
              reportList = rejectedReports
              break; 
        default:
        break;
      }
      
      const filteredByReason = filterOption.reason !== '' ?  reportList.filter((report)=> report.reasons.includes(filterOption.reason)) : reportList
      setAllReports(filteredByReason)

  },[filterOption])

  const handleSort = (option) => {
    if(option === "Most Recent")
    {
      const sorted = allReports.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
      setAllReports(sorted)
      setShowSortDropdown(false)
      return
    }
    else
    {
      const sorted = allReports.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt))
      setAllReports(sorted)
      setShowSortDropdown(false)
      return
    }
   
  }


  return (
    <>
    <main className=' flex flex-col bg-[#fafafb] w-full h-full overflow-hidden relative'>
    <h1 className='text-lg font-medium text-gray-600 mx-10 mt-3'>Reports History</h1>

    {/* Navigation */}
    <div className='w-full flex justify-start gap-3 items-center px-10 mt-5'>
      {/* Status Filter */}
      <div className="w-[250px] ">
      <select onChange={(e)=>setFilterOption({...filterOption, status : e.target.value})} id="countries" className="bg-gray-50 rounded-md py-3 border  border-gray-300 text-gray-700 text-sm font-medium  block w-full px-2 ">
      <option value="All Reports" className='font-medium text-gray-600'>All Reports</option>
      <option value="Didn't Follow Community Guidelines" className='font-medium text-gray-600'>Didn't Follow Community Guidelines</option>
      <option value="Followed Community Guidelines" className='font-medium text-gray-600'>Followed Community Guidelines</option>
      </select>
      </div>
       {/* Reason Filter */}
      <div className="w-[250px] ">
      <select onChange={(e)=>setFilterOption({...filterOption, reason : e.target.value})} id="reasons" className="bg-gray-50 rounded-md py-3 border  border-gray-300 text-gray-700 text-sm font-medium  block w-full px-2 ">
      <option value="" className='font-medium text-gray-600'>Select reason</option>
      {
        reasons.map((reason, index) => (
        <option key={index} value={reason} className='font-medium text-gray-600'>{reason}</option>
        ))
      }
      </select>
      </div>
    </div>

    <div className='w-full flex items-center justify-between px-10 mt-5'>
    <div className='flex items-center gap-2 relative'>
    <button onClick={()=>setShowSortDropdown(!showSortDropdown)}>
    <SortOutlinedIcon />
    </button>
    <h2 className='text-gray-500 text-sm'>Showing {allReports?.length} results</h2>
    {/* Dropdown Option */}
    <div className={`bg-white absolute top-5 shadow-md rounded-sm ${showSortDropdown ? "flex" : "hidden"} flex-col`}>
    <button onClick={()=>handleSort("Most Recent")} className='px-3 py-1 text-start text-sm hover:bg-gray-50'>Most Recent</button>
    <button onClick={()=>handleSort("Oldest")} className='px-3 py-1 text-start text-sm hover:bg-gray-50'>Oldest</button>
    </div>
    </div>
    <input type='date' onChange={(e)=>setFilterOption({...filterOption, date : e.target.value})} />
    </div>

    {/* Lists */}
    {
      allReports?.length === 0 ?
      <div className='w-full h-full flex flex-col justify-center items-center'>
      <h1 className='text-3xl font-medium text-gray-500'>No result found</h1>
      <p className='text-base font-normal text-gray-400'>Try adjust your search or filter to find what you're looking for.</p>
      </div>
      :
      allReports === null ?
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
      <div className='px-10 w-full h-full flex flex-col gap-3 overflow-auto mt-2'>
    {
    allReports?.map((report)=>{
        const date = report.createdAt
        const createdAt = new Date(date).toLocaleDateString('EN-US', {
            month : 'long',
            day : '2-digit',
            year : 'numeric'
        })
    return (
    <div key={report._id} className='w-full max-w-full bg-white shadow-md border border-[#eaeaea] rounded-md p-2 '>
        {/* Top Part */}
        <div className='w-full flex border-b-1 pb-2 items-center justify-between'>
            <h1 className='font-medium text-red-500 px-2 py-1 bg-red-100 rounded-sm'>{report.service.name}</h1>
            {/* Buttons */}
            <div className='flex items-center relative gap-2'>
              {
                report.status === "Rejected" ?
                <button className='px-2 py-1 bg-gray-100 border border-[#8f8f8f] rounded-sm text-sm'>Follows Community Guidelines</button>
                :
                <button className='px-2 py-1 bg-red-100 border border-[#f58080] text-red-500 rounded-sm text-sm'>Didn't Follow Community Guidelines</button>

              }
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
        <div className='w-20 flex-none bg-gray-100 aspect-square object-contain'>
            <img className='w-full h-full' src={photo.src} />
        </div>  
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
    }
    </main>
    </>
  )
}

export default AdminReportHistory