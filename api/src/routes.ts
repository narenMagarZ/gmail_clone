import express from 'express'
import { handlers } from './handlers'
const router = express.Router()
import { fileUploader } from './fileuploadhandler'

router.post('/signup',handlers.Signup)
router.post('/login',handlers.Login)
router.get('/emails',handlers.Email)
router.post('/composemail',fileUploader.array('files'),handlers.ComposeMail)

export default router