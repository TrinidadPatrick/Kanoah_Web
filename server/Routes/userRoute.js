
const {Router} = require('express')
const router = Router()
const {register, verifyEmail, verifyOTP} = require('../Controllers/UserController')

router.post("/register", register)
router.post("/verifyEmail", verifyEmail)
router.post("/verifyOTP", verifyOTP)

module.exports = router;