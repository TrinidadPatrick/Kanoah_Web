
const {Router} = require('express')
const { getServices, addService } = require('../Controllers/ServiceController')
const router = Router()
const {register, verifyEmail, verifyOTP, login, forgotPassword, newPassword, submitOtpForNewPassword, verifyUsername, getUsers, getUser, updateUser, verifyPassword, updatePassword, deactivateAccount} = require('../Controllers/UserController')

// User Routes
router.post("/register", register)
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



module.exports = router;