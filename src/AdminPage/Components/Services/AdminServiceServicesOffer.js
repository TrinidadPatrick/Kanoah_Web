import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AdminServiceServicesOffer = ({serviceOffers}) => {


  return (
    <div>
    {
    serviceOffers?.map((service)=>{
        return (
        <Accordion key={service.uniqueId} disableGutters>
        <AccordionSummary
          expandIcon={service.variants.length === 0 ? <ExpandMoreIcon className='opacity-0' /> : <ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div style={{fontWeight : '500', width : '100%', display : 'flex', alignItems : 'center', justifyContent : 'space-between'}}>
            <p>{service.name}</p>
            <p className='text-gray-600 font-normal text-sm'>{service.variants && service.variants.length !== 0 ? `₱${service.variants[0]?.price} - ₱${service.variants.slice(-1)[0]?.price}` : `₱${service.origPrice}`}</p>
        </div>
        </AccordionSummary>
        {
            service?.variants.map((variant, index)=>{
                return (
                    <AccordionDetails key={index}>
                        <p className='text-sm'>{variant.type}</p>
                        <p className='text-sm'> ₱{variant.price}</p>
                    </AccordionDetails>
                )
            })
        }
      </Accordion>
        )
    })
    }
    </div>
  )
}

export default AdminServiceServicesOffer