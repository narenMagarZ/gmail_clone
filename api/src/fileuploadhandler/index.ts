import {Request} from 'express'
import multer from 'multer'
import path from 'node:path'
import {v4 as uuidv4} from 'uuid'
import { reqUserInfo } from '../middleware'
import fs from 'node:fs'
const destination = function(_req:Request,_file:Express.Multer.File,cb:(err:Error|null,destination:string)=>void){
    const {user} = reqUserInfo
    if(user){
        const pathToFileUploadDirOfEachUser = path.resolve(__dirname,'../','./fileuploads','./',user)
        fs.mkdir(pathToFileUploadDirOfEachUser,()=>{
            cb(null,pathToFileUploadDirOfEachUser)
        })
    }
}

const filename = function(_req:Request,file:Express.Multer.File,cb:(err:Error|null,filename:string)=>void){
    const fileName = uuidv4()+file.originalname.toLowerCase().split(' ').join('-')
    cb(null,fileName)
}


const fileStorage = multer.diskStorage({destination,filename})

export const fileUploader = multer({storage:fileStorage})