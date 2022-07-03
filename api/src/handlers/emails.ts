import {NextFunction, Request,Response} from 'express'
import { redis } from '../cacheserver'
import { Emails } from '../db/schema/emailSchema'
import {helpers} from '../helpers'
import {reqUserInfo} from '../middleware'
async function Email(req:Request,res:Response,next:NextFunction){
    try{
        console.log(reqUserInfo,'this is requserinfo')
        const id = req.query
        const {user} = reqUserInfo
        if(typeof user === 'string' && typeof id === 'string'){
            if(user === id ){
               const myMails = await Emails.find({'to':user})
               console.log(myMails)
               return res.json({
                'msg':'you got your mails'
               })
        } else return next(new Error('missing info fields'))
            
        } else return next(new Error('missing info fields'))
    }
    catch(err){
        console.error(err)
    }
}
export default Email