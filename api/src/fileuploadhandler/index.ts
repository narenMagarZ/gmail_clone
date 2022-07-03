import multer from 'multer'
import path from 'node:path'
import {v4 as uuidv4} from 'uuid'
const destination = function(req:any,file:Express.Multer.File,cb:(err:Error|null,destination:string)=>void){
    // req.user = 'naren@gmail.com'
    const userName = req.user.split('@gmail.com')[0]
    const userDir = path.resolve(__dirname,'../','./useruploads',`./${userName}`)
    console.log(userDir)
    cb(null,userDir)
}

const filename = function(req:any,file:Express.Multer.File,cb:(err:Error|null,filename:string)=>void){
    const fileName = uuidv4()+file.originalname.toLowerCase().split(' ').join('-')
    cb(null,fileName)

}
export const fileUploadHandler = multer.diskStorage({destination,filename})