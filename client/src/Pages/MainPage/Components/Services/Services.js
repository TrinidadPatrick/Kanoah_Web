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
    category : "Home Service",
    rating : 
        {
            "5star" : 23,
            "4star" : 15,
            "3star" : 18,
            "2star" : 7,
            "1star" : 6,
            
        }
    ,
    Address : "Barangay Trapiche 1, Tanauan City, Batangas",
    
    Tags : ['plumbing', 'pipe cleaning', 'plumb', 'pipe', 'home pipe cleaning', 'clogged pipe', 'sink repair', 'pipe repair', 
    "Plumbers", "Pipe Repair", "Drain Cleaning", "Water Heater Installation", "Emergency Plumbing", "Toilet Repair", "Faucet Repair",
    "Leak Detection", "Sewer Line Repair", "Residential Plumbing", "Commercial Plumbing", "Bathroom Plumbing", "Kitchen Plumbing",
    "Gas Line Repair", "Clogged Drains", "Sump Pump Installation", "Water Filtration", "Repiping Services", "Hydro Jetting"]
    },
    {   
        id : 2,
        title : "R & Next Carwash",
        description : "At R & Next Carwash, we make your car shine like new so you can drive with pride. Experience the difference in every wash",
        owner : "Renz Bryan Paz",
        image : carwash,
        profile : profile2,
        dateCreated : "2023-04-03",
        category : "Automotive Service",
        rating : 
            {
                "5star" : 10,
                "4star" : 29,
                "3star" : 32,
                "2star" : 11,
                "1star" : 1,
                
            }
        ,
        Address : "Poblacion 6, Tanauan City, Batangas",
        Tags :["car wash", "vacuum", "seat cleaning", "complete exterior and interior cleaning", "window cleaning", "wheel and rim cleaning", "paint correction", "wax application", "paint polishing", "headlight cleaning and restoration", "interior deodorizing", "paint protection", "hydrophobic coating", "engine cleaning", "engine degreasing", "rust stain removal", "car window tint installation"]
    },
    {   
        id : 3,
        title : "Daniel's Catering",
        description : "At Daniel's Catering, we believe that every event is an opportunity to create unforgettable moments, to tantalize taste buds, and to exceed your culinary expectations. With an unwavering passion for food and an impeccable attention to detail, we are your dedicated partners in making your special occasions truly remarkable.",
        owner : "Joshua M Bautista",
        image : catering,
        profile : profile3,
        dateCreated : "2023-07-12",
        category : "Food and Dining",
        rating : 
            {
                "5star" : 45,
                "4star" : 18,
                "3star" : 8,
                "2star" : 21,
                "1star" : 2,      
            },
        Address : "Barangay Talaga, Tanauan City, Batangas",
        Tags : ["catering", "coordinator", "event catering", "host service", "table renting", "chair renting", "table skirting", "plates and utensils renting", "staffing service", "buffet services", "venue renting", "dessert", "beverages", "cake", "themed events", "full-service catering"]
    },
    {   
        id : 4,
        title : "New Waves Salon",
        description : "Discover the art of self-care and transformation at New Waves Salon, where our expert team of stylists and beauty professionals are committed to elevating your beauty experience to new heights.",
        owner : "Mark Abil Surigao",
        image : salon,
        profile : profile4,
        dateCreated : "2023-04-25",
        category : "Beauty and Personal Care",
        rating : 
            {
                "5star" : 43,
                "4star" : 31,
                "3star" : 14,
                "2star" : 23,
                "1star" : 17,
                
            }
        ,
        Address : "Barangay Altura South, Tanauan City, Batangas",
        Tags : ["salon", "haircut", "hair bleaching", "hair color", "hair treatment", "hair extension application",  "rebond", "hair styling", "manicure", "pedicure", "nail extensions", "gel nails", "makeup", "eyelash extension", "eyelash lifting", "eyebrow shaping", "eyebrow tattoo"]
    },
    {   
        id : 5,
        title : "Dianes Beauty Shop",
        description : "Step through our doors and enter a realm where beauty knows no bounds. We offer an extensive selection of high-quality beauty products that cater to every aspect of your personal grooming and self-care needs. Whether you're in search of skincare essentials, makeup must-haves, fragrances that captivate, or luxurious haircare products, we have meticulously curated our collection to meet your desires.",
        owner : "Kenry Job Luminado",
        image : beauty_service,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-10-20",
        category : "Beauty and Personal Care",
        rating : 
            {
                "5star" : 23,
                "4star" : 31,
                "3star" : 14,
                "2star" : 11,
                "1star" : 4,
                
            }
        ,
        Address : "Barangay Sambat Tanauan City, Batangas",
        Tags : ["beauty products", "primer", "foundation", "concealer", "setting powder", "blush", "eyeshadow", "palette", "eyeliner", "mascara", "eyebrow pencil", "eyebrow trimmer", "lipbalm", "lipstick", "liptint", "lipliner", "lip gloss", "brushes", "eyelash curler", "highlighter", "setting spray,", "false eyelashes", "sunscreen", "lotion", "makeup blender", "makeup sponge", "tweezers" ]
    },
    {   
        id : 6,
        title : "Your Relaxing Spa",
        description : "Step through our doors and enter an oasis of wellness where every detail has been meticulously designed to transport you to a state of tranquility. We offer a range of transformative spa services that cater to every aspect of your holistic well-being. Whether you seek respite from stress, relief from muscular tension, radiant skin, or a meditative escape, our spa has been curated to cater to your desires.",
        owner : "Kenneth Pinlayo",
        image : spa,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-18",
        category : "Beauty and Personal Care",
        rating : 
            {
                "5star" : 78,
                "4star" : 23,
                "3star" : 7,
                "2star" : 7,
                "1star" : 2,
                
            }
        ,
        Address : "Barangay Santor Tanauan City, Batangas",
        Tags : ["massage", "spa", "body massage", "body treatment", "facial treatment", "hair spa", "foot spa", "manicure", "pedicure", "nail extension", "nail gel", "hair spa treatment", "scalp treatment", "wax services", "eyebrow shaping", "eyebrow tattoo", "eyelash extension", "eyelash lifting"]
    },
    {   
        id : 7,
        title : "Jacobs Dental Clinic",
        description : "Welcome to Jacob's Dental Clinic, where your oral health and your radiant smile are our top priorities. Nestled in the heart of [Your Location], we are more than just a dental clinic; we are your partners in achieving and maintaining optimal oral well-being. Our mission is to ensure that each patient who walks through our doors experiences world-class dental care delivered with compassion and expertise.",
        owner : "Jacob Landicoy Peraca",
        image : dental,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-01",
        category : "Health and Wellness",
        rating : 
            {
                "5star" : 54,
                "4star" : 11,
                "3star" : 45,
                "2star" : 15,
                "1star" : 10,
                
            }
        ,
        Address : "Poblacion 5 Tanauan City, Batangas",
        Tags : ["Dental cleaning", "x-ray", "dentures", "dental implants", "teeth whitening", "veneers", "braces", "tooth extraction", "wisdom teeth removal", "root canal therapy", "crowns", "bridges"]
    },
    {   
        id : 8,
        title : "Mark's TV MOTO",
        description : "Welcome to [Your TV Repair Business Name], where we specialize in restoring your television to its full glory. In the era of digital entertainment, we understand that a malfunctioning TV can disrupt your daily routine and leisure time. That's why we are not just a TV repair service; we're your dedicated partners in reviving your entertainment experience.",
        owner : "Daniel Des Santos",
        image : tv_repair,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-03-22",
        category : "Tech and Electronics",
        rating : 
            {
                "5star" : 51,
                "4star" : 35,
                "3star" : 21,
                "2star" : 19,
                "1star" : 8,
                
            }
        ,
        Address : "Barangay Sala Tanauan City, Batangas",
        Tags : ["TV", "television", "cracked screen repair", "power supply replacement", "sound and audio restoration", " speaker replacement", "video port repair", "cable repair", "satellite connection repair", "tuner repair", "signal strength enhancement", "remote control repair", "mainboard replacement", "capacitor and resistor replacement", "backlight repair", "LED and LCD replacement", "color wheel replacement", "antique TV repair", "cleaning and dust removal", "general inspection"]
    },
    {   
        id : 9,
        title : "Home Cleaning",
        description : "With a reputation built on years of dedication and trust, [Your Home Cleaning Business Name] has become a household name in the world of home cleaning. Our team of skilled and experienced cleaning professionals is committed to providing a comprehensive range of cleaning services that cater to your unique needs.",
        owner : "Benchong Chungching",
        image : home_cleaning,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-06-13",
        category : "Cleaning and Janitorials",
        rating : 
            {
                "5star" : 62,
                "4star" : 23,
                "3star" : 29,
                "2star" : 20,
                "1star" : 5,
                
            }
        ,
        Address : "Barangay Bilog-bilog Tanauan City, Batangas",
        Tags : ["home cleaning", "general cleaning", "kitchen cleaning", "bathroom cleaning", "carpet cleaning", "tile cleaning", "mattress cleaning", "appliances cleaning", "outdoor cleaning", "patio and deck cleaning", "roof and gutter cleaning", "solar panel maintenance", "air-condition cleaning", "home pipe cleaning", "drainage cleaning"]
    },
    {   
        id : 10,
        title : "G & G Printing Shop",
        description : "Our printing services cover a wide spectrum of projects, from business collateral to marketing materials, personal projects to large-scale commercial needs. Whether you require business cards, brochures, banners, posters, signage, custom stationery, or specialty promotional items, we have the expertise and technology to deliver outstanding results.",
        owner : "Alvin Flores Marvio",
        image : printing_service,
        profile : "https://i.pravatar.cc/300",
        dateCreated : "2023-04-06",
        category : "Tech and Electronics",
        rating : 
            {
                "5star" : 67,
                "4star" : 19,
                "3star" : 10,
                "2star" : 11,
                "1star" : 6,
                
            }
        ,
        Address : "Poblacion 3, Tanauan City, Batangas",
        Tags : ["printing", "Flyers printing", "brochure printing", "postcard printing", "invitation printing", "book printing", "banners printing", "signage printing", "canvas printing", "xerox", "photocopy", "laminating", "binding", "logo design", "layout design", "document scanning"]
    },
]


