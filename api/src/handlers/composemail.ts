import {NextFunction, Request,Response} from 'express'
import mongoose from 'mongoose'
import {redis} from '../cacheserver'
import { helpers } from '../helpers'
import {reqUserInfo} from '../middleware'
import {Emails} from '../db/schema/emailSchema'
async function ComposeMail(req:Request,res:Response,next:NextFunction){
    try{
        const reqbodyContent = JSON.parse(req.body.body)
        console.log(req.files,'these are files')
        const {mailReceiver,mailTitle,mailSubject,mailBody} = reqbodyContent 
        const {user,newAccessToken} = reqUserInfo
        if(user && mailReceiver && mailTitle && mailSubject && mailBody) {
            console.log(mailReceiver,mailTitle,mailSubject,mailBody)
            const {textContent} = mailBody
            const mailComposerId = await redis.hget('users',user)
            if(mailComposerId){
                let fileInfo : Partial<{
                    'fileName':string,
                    'filePath':string,
                    'fileSize':string,
                    'fileType':string
                }>[] = [{}]
                if(req.files instanceof Array){
                    for(let fileIndex = 0 ; fileIndex < req.files?.length ; fileIndex++){
                        console.log(req.files[fileIndex])
                        const tempFileInfo = req.files[fileIndex]
                        let fileSize = tempFileInfo.size
                        let actualFileSize = fileSize + ' ' + 'byte'
                        const fileSizeType = ['kb','mb','gb']
                        let i = 0
                        while(true){
                            fileSize = fileSize / 1024
                        if(fileSize <= 1024){
                            actualFileSize = fileSize + ' ' + fileSizeType[i]
                            break
                        }    
                        i++
                        }
                        if(fileIndex === 0) fileInfo.shift()
                        fileInfo.push({
                            'fileName' : tempFileInfo.filename,
                            'filePath': tempFileInfo.path,
                            'fileType': tempFileInfo.mimetype,
                            'fileSize' : actualFileSize
                        })
                    }
                }
                const emailInfo = {
                    'mailComposer' : new mongoose.Types.ObjectId(user),
                    'from' : user,
                    'to' : mailReceiver,
                    'title': mailTitle,
                    'body':{
                        'subject' : mailTitle,
                        'content':{
                            'text' : textContent,
                            'files' : fileInfo
                        }
                    }
    
                }
                const email = new Emails(emailInfo)
                await email.save()
                console.log(email)
                if(newAccessToken) res.cookie('uid',newAccessToken,helpers.SecureCookieProps)
                return res.json({
                    'msg':'ok '
                })
            } else return next(new Error('user not found'))
        } else return next(new Error('missing input fields'))
    }catch(err:any){
        return next(new Error(err))
    }

}
export default ComposeMail