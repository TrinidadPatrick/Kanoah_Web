import image1 from '../img/forGallery1.jpeg'
import image2 from '../img/ForGallery2.avif'
import image3 from '../img/ForGallery3.jpeg'
import image4 from '../img/ForGallery4.avif'
import image5 from '../img/forGallery5.jpeg'
import image6 from '../img/ForGallery6.jpg'
import image7 from '../img/ForGallery7.jpg'
import image8 from '../img/ForGallery8.jpg'


const getWidth = (image)=>{
    const img = new Image()
    img.src = image
    img.onload = () =>{
    return img.width
}
}
const getHeight = (image)=>{
    const img = new Image()
    img.src = image
    img.onload = () =>{
    return img.height
}
}

getHeight(image1)

export const galleryImage = [
    {
        src : image1,
        original : image1


    }
    ,
    {
        src : image2,
        original : image2
    },
    {
        src : image3,
        original : image3
    },
    {
        src : image4,
        original : image4
    },
    {
        src : image5,
        original : image5
    },
    {
        src : image6,
        original : image6
    },
    {
        src : image7,
        original : image7
    },
    {
        src : image8,
        original : image8
    },

]