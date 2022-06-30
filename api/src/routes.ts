import express from 'express'
import { handlers } from './handlers'
const router = express.Router()
import path from 'node:path'
import multer from 'multer'

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'uploads'))
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname)
    }
})

const upload = multer({storage})
router.post('/signup',handlers.Signup)
router.post('/login',handlers.Login)
router.get('/emails',handlers.Email)
router.post('/composemail',handlers.ComposeMail)
router.post('/test',upload.array('file'),(req,res)=>{
    console.log(req.files)
    res.json({
        'msg':'done'
    })
})
export default router