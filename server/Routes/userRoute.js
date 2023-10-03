
const {Router} = require('express')
const router = Router()
const {register} = require('../Controllers/UserController')

router.post("/register", register)

module.exports = router;