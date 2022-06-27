import {NextFunction, Request,Response} from 'express'
import {redis} from '../cacheserver'
import {Users} from '../db/schema/userschema'
import { helpers } from '../helpers'
async function ComposeMail(req:Request,res:Response,next:NextFunction){
    try{
        console.log(req.body)
        const {mailComposer,mailReceiver,mailTitle,mailSubject,mailBody} = req.body
        const {uid,uidkey} = req.signedCookies
        const platform = req.headers['platform']
        const appId = req.headers['appid']
        const deviceId = req.headers['deviceid']
        if(mailComposer && mailReceiver && mailTitle && mailSubject && mailBody  && platform && appId && deviceId) {
            const {textContent,files} = mailBody
            console.log(textContent,files)
            // check for the existence of the composer and receiver
            let areUsersValid = false
            const isUsersValid = await new Promise((resolve)=>{
                redis.pipeline().hget('Users',mailComposer).hget('Users',mailReceiver).exec((err,result:any)=>{
                    if(err) return next(err)
                    else {
                        if(result[0][1] && result[1][1]) resolve(true) 
                        else resolve(false)
                    }
                })
            }) 
            if(isUsersValid){
                areUsersValid = true
            } else {
            const isMailComposerValid = await helpers.IsUserValid(Users,mailComposer)
            const isMailReceiverValid = await helpers.IsUserValid(Users,mailReceiver)
            if(isMailComposerValid && isMailReceiverValid){
                areUsersValid = true
            } else areUsersValid = false
            }
            if(areUsersValid) {                 
                res.json({
                    msg:'okay'
                })
            } else return next(new Error('user is not found !'))
            
        } else {
           return next(new Error('missing info fields'))
        }
    }catch(err:any){
        if(err)
        return next(new Error(err))
    }
}
export default ComposeMail