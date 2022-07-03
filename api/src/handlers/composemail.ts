import {NextFunction, Request,Response} from 'express'
import mongoose from 'mongoose'
import {redis} from '../cacheserver'
import { helpers } from '../helpers'
import {reqUserInfo} from '../middleware'
import {Emails} from '../db/schema/emailSchema'
async function ComposeMail(req:Request,res:Response,next:NextFunction){
    try{
        const {mailReceiver,mailTitle,mailSubject,mailBody} = req.body   
        const {user,newAccessToken} = reqUserInfo
        if(user && mailReceiver && mailTitle && mailSubject && mailBody) {
            console.log(mailReceiver,mailTitle,mailSubject,mailBody)
            const {textContent,files} = mailBody
            const mailComposerId = await redis.hget('users',user)
            if(mailComposerId){
                const emailInfo = {
                    'mailComposer' : new mongoose.Types.ObjectId(user),
                    'from' : user,
                    'to' : mailReceiver,
                    'title': mailTitle,
                    'body':{
                        'subject' : mailTitle,
                        'content':{
                            'text' : textContent,
                            'files' : [{
                                'fileName':'test',
                                'filePath':'somewhere',
                                'fileSize':'1.2mb',
                                'fileType':'image/png'
                            }]
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