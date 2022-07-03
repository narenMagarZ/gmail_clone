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
        console.log(file.originalname,'this is original name of the file')
        const fileName = file.originalname.toLowerCase().split(' ').join('-')
        cb(null,fileName)
    }
})

const upload = multer({storage})
router.post('/signup',handlers.Signup)
router.post('/login',handlers.Login)
router.get('/emails',handlers.Email)
router.post('/composemail',handlers.ComposeMail)
router.post('/test',(req,res,next)=>{
    console.log(req.body)
    if(req.headers['key'] === 'this is secret key'){
        next()
        // res.json({'msg':'done'})
    } else return res.json({
        msg:'not authenticated user'
    })
}
,upload.array('files'),(req,res)=>{
    console.log(req.files)
    res.json({
        'msg':'done'
    })
}
)
export default router