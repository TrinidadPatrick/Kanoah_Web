import plumbing from "./Img/Plumbing.jpg"
import carwash from "./Img/carwash.jpg"
import catering from "./Img/catering.jpg"
import salon from "./Img/salon.jpg"
import cpRepair from "./Img/cp_repair.jpg"
import interiorDesigner from "./Img/interior_designer.jpg"
import beauty_service from "./Img/beauty_service.jpg"
import dental from "./Img/dental.jpg"
import home_cleaning from "./Img/home_cleaning.jpg"
import printing_service from "./Img/printing_service.jpg"
import spa from "./Img/spa.jpg"
import tv_repair from "./Img/tv_repair.jpeg"
import landscape from "./Img/landscape.jpg"
import profile1 from "./Img/Profile1.jpg"
import profile2 from "./Img/Profile2.jpg"
import profile3 from "./Img/Profile3.jpg"
import profile4 from "./Img/Profile4.jpg"
import profile5 from "./Img/Profile5.jpg"

export const services = [
    {
    id : 1,
    title : "Giyuu's Plumbing",
    description : "Giyuu's Plumbing - your trusted plumbing experts. We're here to solve your plumbing problems promptly and professionally. Your plumbing is our priority. We take every job seriously, from small repairs to major projects, to deliver the best results.",
    owner : "John Patrick Trinidad",
    image : plumbing,
    profile : profile1,
    dateCreated : "2023-04-03",
    rating : 
        {
            "5star" : 9,
            "4star" : 5,
            "3star" : 8,
            "2star" : 7,
            "1star" : 2,
            
        }
    ,
    Address : "Barangay Trapiche 1, Tanauan City, Batangas"
    },
    {   
        id : 2,
        title : "R & Next Carwash",
        description : "At R & Next Carwash, we make your car shine like new so you can drive with pride. Experience the difference in every wash",
        owner : "Renz Bryan Paz",
        image : carwash,
        profile : profile2,
        dateCreated : "2023-04-03",
        
        rating : 
            {
                "5star" : 10,
                "4star" : 29,
                "3star" : 32,
                "2star" : 11,
                "1star" : 1,
                
            }
        ,
        Address : "Poblacion 6, Tanauan City, Batangas"
    },
    {   
        id : 3,
        title : "Daniels Catering",
        description : "At [Your Catering Company Name], we believe that every event is an opportunity to create unforgettable moments, to tantalize taste buds, and to exceed your culinary expectations. With an unwavering passion for food and an impeccable attention to detail, we are your dedicated partners in making your special occasions truly remarkable.",
        owner : "Joshua M Bautista",
        image : catering,
        profile : profile3,
        dateCreated : "2023-07-12",

        rating : 
            {
                "5star" : 45,
                "4star" : 18,
                "3star" : 8,
                "2star" : 21,
                "1star" : 2,
                
            }
        ,
        Address : "Barangay Talaga, Tanauan City, Batangas"
    },
    {   
        id : 4,
        title : "New Waves Salon",
        description : "Discover the art of self-care and transformation at New Waves Salon, where our expert team of stylists and beauty professionals are committed to elevating your beauty experience to new heights.",
        owner : "Mark Abil Surigao",
        image : salon,
        profile : profile4,
        dateCreated : "2023-04-25",
        rating : 
            {
                "5star" : 43,
                "4star" : 31,
                "3star" : 14,
                "2star" : 23,
                "1star" : 17,
                
            }
        ,
        Address : "Barangay Altura South, Tanauan City, Batangas"
    },
    {   
        id : 5,
        title : "Dianes Beauty Shop",
        description : "Step through our doors and enter a realm where beauty knows no bounds. We offer an extensive selection of high-quality beauty products that cater to every aspect of your personal grooming and self-care needs. Whether you're in search of skincare essentials, makeup must-haves, fragrances that captivate, or luxurious haircare products, we have meticulously curated our collection to meet your desires.",
        owner : "Kenry Job Luminado",
        image : beauty_service,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-10-20",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Barangay Sambat Tanauan City, Batangas"
    },
    {   
        id : 6,
        title : "Your Relaxing Spa",
        description : "Step through our doors and enter an oasis of wellness where every detail has been meticulously designed to transport you to a state of tranquility. We offer a range of transformative spa services that cater to every aspect of your holistic well-being. Whether you seek respite from stress, relief from muscular tension, radiant skin, or a meditative escape, our spa has been curated to cater to your desires.",
        owner : "Kenneth Pinlayo",
        image : spa,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-18",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Barangay Santor Tanauan City, Batangas"
    },
    {   
        id : 7,
        title : "Jacobs Dental Clinic",
        description : "Welcome to [Your Dental Clinic Name], where your oral health and your radiant smile are our top priorities. Nestled in the heart of [Your Location], we are more than just a dental clinic; we are your partners in achieving and maintaining optimal oral well-being. Our mission is to ensure that each patient who walks through our doors experiences world-class dental care delivered with compassion and expertise.",
        owner : "Jacob Landicoy Peraca",
        image : dental,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-01",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Poblacion 5 Tanauan City, Batangas"
    },
    {   
        id : 8,
        title : "Mark's TV MOTO",
        description : "Welcome to [Your TV Repair Business Name], where we specialize in restoring your television to its full glory. In the era of digital entertainment, we understand that a malfunctioning TV can disrupt your daily routine and leisure time. That's why we are not just a TV repair service; we're your dedicated partners in reviving your entertainment experience.",
        owner : "Daniel Des Santos",
        image : tv_repair,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-23",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Barangay Sala Tanauan City, Batangas"
    },
    {   
        id : 9,
        title : "Home Cleaning",
        description : "With a reputation built on years of dedication and trust, [Your Home Cleaning Business Name] has become a household name in the world of home cleaning. Our team of skilled and experienced cleaning professionals is committed to providing a comprehensive range of cleaning services that cater to your unique needs.",
        owner : "Benchong Chungching",
        image : home_cleaning,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-13",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Barangay Bilog-bilog Tanauan City, Batangas"
    },
    {   
        id : 10,
        title : "G & G Printing Shop",
        description : "Our printing services cover a wide spectrum of projects, from business collateral to marketing materials, personal projects to large-scale commercial needs. Whether you require business cards, brochures, banners, posters, signage, custom stationery, or specialty promotional items, we have the expertise and technology to deliver outstanding results.",
        owner : "Alvin Flores Marvio",
        image : printing_service,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-06",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Poblacion 3, Tanauan City, Batangas"
    },
]

export const recentServices = [
    {
        id : 5,
    title : "Landscape Paradise",
    image : landscape,
    profile : profile5,
    rating : 
        {
            "5star" : 9,
            "4star" : 5,
            "3star" : 8,
            "2star" : 7,
            "1star" : 2,
            
        }
    ,
    Address : "Barangay Darasa Tanauan City, Batangas"
    },
    {   id : 6,
        title : "Tom's Repair Shop",
        image : cpRepair,
        profile : profile2,
        rating : 
            {
                "5star" : 10,
                "4star" : 29,
                "3star" : 3,
                "2star" : 11,
                "1star" : 1,
                
            }
        ,
        Address : "Barangay Cale Tanauan City, Batangas"
    },
    {   
        id : 7,
        title : "Denya Interior Designer",
        image : interiorDesigner,
        profile : profile1,
        rating : 
            {
                "5star" : 45,
                "4star" : 18,
                "3star" : 8,
                "2star" : 4,
                "1star" : 2,
                
            }
        ,
        Address : "Poblacion 1 Tanauan City, Batangas"
    }
]