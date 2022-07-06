import {NextFunction, Request,Response} from 'express'
import { redis } from '../cacheserver'
import { Emails } from '../db/schema/emailSchema'
import {helpers} from '../helpers'
import {reqUserInfo} from '../middleware'
async function Email(req:Request,res:Response,next:NextFunction){
    try{
        console.log(reqUserInfo,'this is requserinfo')
        const {id} = req.query
        const {user,newAccessToken} = reqUserInfo
        if(user && id){
            const myId = await redis.hget('users',user)
            console.log(myId,id)
            if(myId && myId === id){
                const myMails = await Emails.find({'to':myId})
                   console.log(myMails)
                   if(newAccessToken) res.cookie('uid',newAccessToken,helpers.SecureCookieProps)
                return res.json({
                    'msg':'you got your mails'
                })
            } else return next(new Error("invalid user"))
            
        } else return next(new Error('missing info fields'))
    }
    catch(err){
        console.error(err)
    }
}
export default Email