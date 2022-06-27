import express from 'express'
import { handlers } from './handlers'
const router = express.Router()


router.post('/signup',handlers.Signup)
router.post('/login',handlers.Login)
router.get('/emails',handlers.Email)
router.post('/composemail',handlers.ComposeMail)
export default router