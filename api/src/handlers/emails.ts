import {NextFunction, Request,Response} from 'express'
import { redis } from '../cacheserver'
import { Emails } from '../db/schema/emailSchema'
import {helpers} from '../helpers'
import {reqUserInfo} from '../middleware'
async function Email(req:Request,res:Response,next:NextFunction){
    try{
        const {id} = req.query
        const {user,newAccessToken} = reqUserInfo
        if(user && id){
            const myId = await redis.hget('users',user)
            if(myId && myId === id){
                const fetchMails = await Emails.find({'to':myId}).select({'body':1,'from':1,'to':1,'title':1,'_id':0,'createdAt':1})
                let composerId = null
                if(fetchMails.length > 1){
                    composerId = fetchMails[0].from
                }
                if(newAccessToken) res.cookie('uid',newAccessToken,helpers.SecureCookieProps)
                const composerGmailid = await redis.hget('users',composerId)
                let myMails = []
                for(let i of fetchMails){
                    console.log(i.body.content.files)
                    myMails.push({
                        'composer':composerGmailid,
                        'receiver':i.to,
                        'title':i.title,
                        'body':i.body,
                        'createdAt':i.createdAt

                    })
                }
                const myMailRes = {
                    'status':200,
                    'success':true,
                    'msg':myMails
                }
                return res.json(myMailRes)
            } else return next(new Error("invalid user"))
            
        } else return next(new Error('missing info fields'))
    }
    catch(err){
        console.error(err)
    }
}
export default Email