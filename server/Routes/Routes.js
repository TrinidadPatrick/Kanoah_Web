
const {Router} = require('express')
const { getServices, addService, getService, addGalleryImage, getGalleryImages, deleteImage, deleteMultipleImages, addFeaturedImage, getFeaturedImages, deleteFeaturedImage, deleteMultipleFeaturedImages, updateProfilePicture } = require('../Controllers/ServiceController')
const authenticateToken = require('../Controllers/UserController')
const router = Router()
const {register, verifyEmail, verifyOTP, login, forgotPassword, newPassword, submitOtpForNewPassword, verifyUsername, getUsers, getUser, updateUser, verifyPassword, updatePassword, deactivateAccount, refresh, profile} = require('../Controllers/UserController')

// User Routes
router.post("/register", register)
router.get("/profile", profile)
router.post("/verifyEmail", verifyEmail)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/forgotPassword", forgotPassword)
router.post("/forgotPassword/newPassword", newPassword)
router.post("/forgotPassword/sendOtp", submitOtpForNewPassword)
router.post("/verifyUsername", verifyUsername)
router.post("/verifyPassword", verifyPassword)
router.patch("/updatePassword/", updatePassword)
router.patch("/deactivateAccount", deactivateAccount)
router.put("/updateUser/:_id", updateUser)
router.get("/getUsers", getUsers)
router.get("/getUser/:_id", getUser)

// Temp Service Route
router.get("/getServices", getServices) //Get All Temp Services
router.post("/addService", addService) //Get All Temp Services
router.get("/getService/:userId", getService) //Get All Temp Services


// Gallery Images ROute
router.patch("/addGalleryImage/:_id", addGalleryImage) //Add images to Gallery
router.get("/getGalleryImages/:userId", getGalleryImages) //Get gallery images
router.post("/deleteImage/", deleteImage) //delete single gallery images
router.post("/deleteMultipleImages/", deleteMultipleImages) //delete multiple gallery images


// Featured Images Route
router.patch("/addFeaturedImage/:_id", addFeaturedImage) //Add images to featured
router.get("/getFeaturedImages/:userId", getFeaturedImages) //get images to featured
router.post("/deleteFeaturedImage/", deleteFeaturedImage) //delete images to featured
router.post("/deleteMultipleFeaturedImages/", deleteMultipleFeaturedImages) //delete images to featured

// Profile Picture of service
router.post("/updateProfilePicture", updateProfilePicture)
module.exports = router;