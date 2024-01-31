import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GcashPay = () => {
  const navigate = useNavigate()
  const [invoiceId, setInvoiceId] = useState('');

  const createInvoice = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/payGcash', {
       email : "Ptrinidad765@gmail.com",
        amount : 1000
      });
      console.log(response.data)
      setInvoiceId(response.data.id);
      window.open( response.data.invoiceUrl, '_blank');
      // window.location.href = response.data.invoiceUrl
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
    <h2>GCash Payment</h2>
    <button className="bg-slate-500 px-2 py-1 text-black" onClick={createInvoice}>Proceed to GCash Payment</button>
  </div>
  )
}

export default GcashPay