import axios from "axios";

export default axios.create({
    // baseURL : "http://localhost:5000/api/",
    // baseURL : "https://kanoah.onrender.com/api/",
    baseURL : "https://kanoah-be.vercel.app/api/",
    headers : {
        "Content-Type" : "Application/json"
    }
});

