import express from 'express'
import Email from './handlers/emails'
import Login from './handlers/login'
import Signup from './handlers/signup'

const router = express.Router()


router.post('/signup',Signup)
router.post('/login',Login)
router.get('/gmails',Email)
export default router