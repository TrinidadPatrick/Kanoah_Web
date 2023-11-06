
const {Router} = require('express')
const router = Router()
const {register, verifyEmail, verifyOTP, login, forgotPassword, newPassword, submitOtpForNewPassword, verifyUsername, getUsers, getUser, updateUser} = require('../Controllers/UserController')

router.post("/register", register)
router.post("/verifyEmail", verifyEmail)
router.post("/verifyOTP", verifyOTP)
router.post("/login", login)
router.post("/forgotPassword", forgotPassword)
router.post("/forgotPassword/newPassword", newPassword)
router.post("/forgotPassword/sendOtp", submitOtpForNewPassword)
router.post("/verifyUsername", verifyUsername)
router.put("/updateUser/:_id", updateUser)
router.get("/getUsers", getUsers)
router.get("/getUser/:_id", getUser)

module.exports = router;