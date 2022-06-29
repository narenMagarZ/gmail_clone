import {NextFunction, Request,Response} from 'express'
import {redis} from '../cacheserver'
import {Users} from '../db/schema/userschema'
import { helpers } from '../helpers'
async function ComposeMail(req:Request,res:Response,next:NextFunction){
    try{
        const {mailReceiver,mailTitle,mailSubject,mailBody} = req.body   
        const {uid,uidkey} = req.signedCookies
        const platform = req.headers['platform']
        const appId = req.headers['appid']
        const deviceId = req.headers['deviceid']
        if(mailReceiver && mailTitle && mailSubject && mailBody && uid && uidkey && platform && appId && deviceId){
            const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET || ''
            const secretKey = process.env.TOKEN_KEY_SECRET || ''
            const tokenVerification = await Promise.all([helpers.VerifyTheToken(uid,accessTokenSecretKey),helpers.VerifyTheToken(uidkey,secretKey)])
            let tokenInfoAfterVerification             
            if(tokenVerification[1][0]){
                tokenInfoAfterVerification = {
                    'isError' : true,
                    'tokenInfo' : null
                }
            } else if(tokenVerification[0][0]){
                if(tokenVerification[0][1] === 'jwt expired' && !tokenVerification[1][0]){
                    tokenInfoAfterVerification = {
                        'isError' : false ,
                        'tokenInfo' : {
                            'accesstoken' : null,
                            'tokenkey' : tokenVerification[1][1]
                        }
                    }
                }
                else {
                    tokenInfoAfterVerification = {
                        'isError' : true,
                        'tokenInfo' : null
                    }
                }

            } else {
                tokenInfoAfterVerification = {
                    'isError' : false ,
                    'tokenInfo' : {
                        'accesstoken' : tokenVerification[0][1],
                        'tokenkey' : tokenVerification[1][1]
                    }
                }
            }
            if(tokenInfoAfterVerification.isError){
                return next(new Error('no authenticated user'))
            } else {
                console.log(tokenInfoAfterVerification)
                let hasWriteAccessToDB = false
                const {tokenInfo} = tokenInfoAfterVerification
                const idInKey = tokenInfo?.tokenkey.id
                const platformInKey = tokenInfo?.tokenkey.platform
                const appIdInKey = tokenInfo?.tokenkey.appId
                if(tokenInfo?.accesstoken){
                    const {id} = tokenInfo.accesstoken
                    if((id === idInKey) && (platform === platformInKey) && (appId === appIdInKey)){
                       const refreshToken = await redis.hget('RefreshTokens',id)
                       if(refreshToken){
                            const refreshTokenVerificationInfo = await helpers.VerifyTheToken(refreshToken,process.env.REFRESH_TOKEN_SECRET||'')
                            if(refreshTokenVerificationInfo[0]) return next(new Error('refresh token is not verified'))
                                else {
                                const userId =  refreshTokenVerificationInfo[1].id.trim()
                                if(userId === id){
                                    const isUserExistInCache = await helpers.IsUserExistInCache(redis,mailReceiver.trim())
                                    if(isUserExistInCache) hasWriteAccessToDB = true
                                    else {
                                        const isUserExistInDB = await helpers.IsUserExistInDB(Users,mailReceiver.trim())
                                        if(isUserExistInDB) hasWriteAccessToDB = true
                                        else return next(new Error('receiver is not found in db'))
                                    }
                                } else return next(new Error('no authenticated user'))
                                }
                       } else return next(new Error('your session is already expired'))
                    } else return next(new Error('no authenticated user'))
                } else {
                    const refreshToken = await redis.hget('RefreshTokens',idInKey) || ''
                    const refreshTokenVerificationInfo = await helpers.VerifyTheToken(refreshToken,process.env.REFRESH_TOKEN_SECRET||'')
                    if(refreshTokenVerificationInfo[0]) return next(new Error('refresh token is already expired'))
                    else {
                        const userId = refreshTokenVerificationInfo[1].id.trim()
                        if((userId === idInKey) && (platformInKey === platform) && (appIdInKey === appId)){
                            const newAccessToken = helpers.GenerateAccessToken({'id':userId})
                            res.cookie('uid',newAccessToken,{signed:true,httpOnly:true,sameSite:'strict',secure:true})
                            const isUserExistInCache = await helpers.IsUserExistInCache(redis,mailReceiver.trim())
                            if(isUserExistInCache) hasWriteAccessToDB = true
                            else {
                                const isUserExistInDB = await helpers.IsUserExistInDB(Users,mailReceiver.trim())
                                if(isUserExistInDB) hasWriteAccessToDB = true
                                else return next(new Error("receiver is not found in db"))
                           }
                        } else return next(new Error('no authenticated user'))
                    }

                }
                if(hasWriteAccessToDB){
                    // then write to the db
                    return res.json({
                        'msg':'you can write msg to DB'
                    })
                } else return next(new Error('you cannot write msg to db'))
            }
        } else return next(new Error('missing info fields'))
    }catch(err:any){
        return next(new Error(err))
    }

}
export default ComposeMail