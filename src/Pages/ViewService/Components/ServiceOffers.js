import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ServiceOffers = ({serviceOffers}) => {
  return (
    <div>
    {
    serviceOffers?.map((service)=>{
        return (
        <Accordion disableGutters>
        <AccordionSummary
          expandIcon={service.variants.length === 0 ? <ExpandMoreIcon className='opacity-0' /> : <ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography style={{fontWeight : '500', width : '100%', display : 'flex', alignItems : 'center', justifyContent : 'space-between'}}>
            <p>{service.name}</p>
            <p className='text-gray-600 font-normal text-sm'>{service.variants && service.variants.length !== 0 ? `₱${service.variants[0]?.price} - ₱${service.variants.slice(-1)[0]?.price}` : `₱${service.origPrice}`}</p>
        </Typography>
        </AccordionSummary>
        {
            service?.variants.map((variant)=>{
                return (
                    <AccordionDetails>
                    <Typography className='text-gray-600'>
                        <p className='text-sm'>{variant.type}</p>
                    </Typography>
                    <Typography className='text-gray-600'>
                    <p className='text-sm'> ₱{variant.price}</p>
                    </Typography>
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

export default ServiceOffers